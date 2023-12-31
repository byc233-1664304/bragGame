import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";

import { storage } from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { socket } from "../../services/socket";

export default function User() {
    const navigate = useNavigate();

    const [profileURL, setProfileURL] = useState("");
    const [username, setUsername] = useState("");

    const { currentUser, logout, setError } = useAuth();

    const generateRoomId = () => {
        let S4 = () => {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
    
        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() +S4();
      }

    useEffect(() => {
        socket.connect();
    }, []);

    useEffect(() => {        
        if(currentUser) {
            const uid = currentUser.uid;
            const profilePicRef = ref(storage, 'profilePic/' + uid + '.jpg');

            getDownloadURL(profilePicRef).then((url) => {
                setProfileURL(url);
            }).catch((e) => {
                console.log(e.message);
            });

            if(currentUser.displayName) {
                setUsername(currentUser.displayName);
            }
        }
    }, [currentUser, setError]);

    const handleSignOut = async () => {
        try{
            setError("");
            await logout();
            socket.disconnect();
            navigate("/login");
        }catch(e) {
            setError(e.message);
        }
    }

    const createRoom = () => {
        const userId = currentUser.uid;
        const roomId = generateRoomId();
        const isHost = true;

        if(userId !== "" && roomId !== "") {
            socket.emit("joinRoom", { userId, roomId, username, isHost });
            navigate("/room/" + roomId);
        }else if(userId === "") {
            setError("User is null");
            window.location.reload();
        }else {
            setError("roomId is null");
            window.location.reload();
        }
    }

    return (
        <div>
            <button className="logoutbutton" onClick={handleSignOut}>Sign Out</button>

            <div id="userbox">
                <Link to="/profile">
                    {profileURL? <img src={profileURL} alt="profilepic" className="profilepic" /> : <img src={process.env.PUBLIC_URL + '/images/default-profile.jpeg'} alt="profilepic" className="profilepic" />}
                </Link>
                <button className="mainButton" onClick={createRoom}>Create Room</button>
                <Link to="/join">
                    <button className="mainButton">Join Room</button>
                </Link>
            </div>
        </div>
    );
}