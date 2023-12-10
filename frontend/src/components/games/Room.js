import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import { ClipboardCopyIcon } from "@heroicons/react/outline";

import { process } from "../../services/store/action";
import { to_Decrypt, to_Encrypt } from "../../utils/aes";
import { useAuth } from "../../contexts/AuthContext";
import { useAutoScroll } from "../../utils/autoScroll";
import { storage } from "../../config/firebase";
import { GameArea } from "./GameArea";
import { socket } from "../../services/socket";

export default function Room() {
    const navigate = useNavigate();

    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [userpics, setUserpics] = useState({});
    const [hostId, setHostId] = useState("");
    const [inGame, setInGame] = useState();

    const { roomId } = useParams();
    const { setError } = useAuth();
    const dispatch = useDispatch();
    const userRef = useAutoScroll(userpics);
    const chatRef = useAutoScroll(messages);

    useEffect(() => {
        socket.connect();

        const handleRoomData = async (roomData) => {
            console.log("roomData", roomData);
            setHostId(roomData.hostId);
            setInGame(roomData.inGame);
        
            let tempPics = new Map();
            let tempUsers = [];
            await Promise.all(
              roomData.users.map(async (user) => {
                const picRef = ref(storage, 'profilePic/' + user.userId + '.jpg');
                try {
                  const url = await getDownloadURL(picRef);
                  tempPics.set(user.userId, url);
                  tempUsers.push(user);
                } catch (e) {
                  console.log(e.message);
                }
              })
            );
            setUserpics(tempPics);
            setUsers(tempUsers);
          };

          socket.on("roomData", handleRoomData);

          return () => {
            socket.off("roomData", handleRoomData);
          };
    }, []);

    useEffect(() => {
        const dispatchProcess = (encrypt, msg, cipher) => {
          dispatch(process(encrypt, msg, cipher));
        };
      
        const handleMessage = (msgdata) => {
          const ans = to_Decrypt(msgdata.text, msgdata.isCipher);
          dispatchProcess(false, ans, msgdata.text);
      
          setMessages((prevMessages) => [
            ...prevMessages,
            { username: msgdata.username, text: ans },
          ]);
        };
      
        socket.on("message", handleMessage);
      
        return () => {
          socket.off("message", handleMessage);
        };
      }, [dispatch]);      

    const sendData = () => {
        if(text !== "") {
            // encrypt the message
            const ans = to_Encrypt(text);
            socket.emit("chat", ans);
            setText("");
        }
    };

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
    }

    const leaveRoom = () => {
        if(inGame) {
            setError("Game in process, please do not leave.");
        }else {
            socket.emit("leave");
            navigate("/");
        }
    }

    const userIds = users.map(user => user.userId);

    return(
        <div>
            <div id="roomIdDisplay">Room ID: {roomId}
                <button onClick={copyRoomId}><ClipboardCopyIcon id="copyIcon" /></button>
            </div>

            <button className="logoutbutton" onClick={leaveRoom}>Leave</button>

            <div id="roomUsers" ref={userRef}>
                <div id="usersContent">
                    {userIds.map((userId, index) => {
                        const url = userpics.get(userId);
                        return (
                            <div key={index}>
                                <img src={url} alt="profilepic" className="roomProfilepic" />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <GameArea roomId={roomId} users={users} host={hostId} />
            </div>

            <div id="chatBox">
                <div id="chatHistory" ref={chatRef}>
                    <div id="chatContent">
                        {messages.map((i, index) => {
                            return (
                                <div key={index} className="message">
                                    <p>{i.username}: {i.text}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div id="sendInput">
                    <input
                        id="msgInput"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyPress={(e) => {
                            if(e.key === "Enter") {
                                sendData();
                            }
                        }}
                    />
                    <button onClick={sendData}>Send</button>
                </div>
            </div>
        </div>
    );
}