import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { storage } from "../../config/firebase";
import auth from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function Profile({ socket }) {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const [username, setUsername] = useState("");
  const [profileURL, setProfileURL] = useState();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { logout, updateUserProfile, setError } = useAuth();

  useEffect(() => {
    if(currentUser) {
      const profilePicRef = ref(storage, 'profilePic/' + currentUser.uid + '.jpg')

      getDownloadURL(profilePicRef).then((url) => {
          setProfileURL(url);
      }).catch((e) => {
          console.log(e.message);
      });

      if(currentUser.displayName) {
        setUsername(currentUser.displayName);
      }
    }
  }, [currentUser]);

  const upload = async () => {
    const path = 'profilePic/' + currentUser.uid + '.jpg';
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setProfileURL(url);
    setFile(null);
  }

  const handleSignOut = async () => {
    try{
        setError("");
        await logout();
        navigate("/login");
    }catch(e) {
        setError(e.message);
    }
  }

  const handleBack = () => {
    navigate("/");
  }

  const handleFileChange = (e) => {
    if(e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const user = currentUser;
      const profile = {};

      if(file) {
        await upload();
      }

      if(username !== currentUser.displayName) {
        profile.displayName = username;
        
      }

      if(profileURL) {
        profile.photoURL = profileURL;
      }

      const token = await user.getIdToken();

      const response = await fetch('https://braggame-api.onrender.com/update-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if(response.ok) {
        socket.emit("changeName", username);
        await updateUserProfile(user, profile);
        navigate("/");
      }else {
        setError(response.statusText);
      }
    } catch (e) {
      console.log(e);
      setError(e.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <button className="logoutbutton" onClick={handleSignOut}>Sign Out</button>
      <button className="backbutton" onClick={handleBack}>Back</button>
      <div className="profileContent">
        <div className="uploadProfile">
          {profileURL? <img src={profileURL} alt="profilepic" className="profilepic" /> : <img src={process.env.PUBLIC_URL + '/images/default-profile.jpeg'} alt="profilepic" className="profilepic" />}
          <input type="file" onChange={handleFileChange} />
        </div>

        <div>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            name="username"
            defaultValue={currentUser.displayName ? currentUser.displayName : "user" + currentUser.uid}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit" id="saveProfile" onClick={handleFormSubmit} disabled={loading}>Save</button>
      </div>
    </div>
  );
}