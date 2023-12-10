import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { socket } from "../../services/socket";

function JoinRoom() {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState("");
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");

    const { currentUser, setError } = useAuth();

    const handleBack = () => {
        navigate("/");
    }

    const handleJoinRoom = async () => {
        if(userId === ""){
            setError("You must be logged in to join a room");
            return;
        }

        if(roomId === "") {
            setError("Please enter a room ID");
            return;
        }

        const isHost = false;
        socket.emit("joinRoom", { userId, roomId, username, isHost });

        try{
            const roomData = await new Promise(resolve => {
                socket.on("roomData", (data) => {
                    resolve(data);
                });
            });

            if(roomData.inGame) {
                setError("Game as already started in this room.")
            }else {
                navigate("/room/" + roomId);
            }
        } catch(e) {
            setError(e);
        }
    }

    useEffect(() => {
        socket.connect();
    }, []);

    useEffect(() => {
        if(currentUser) {
            setUserId(currentUser.uid);
            setUsername(currentUser.displayName);
        }

        return () => {
            socket.off("roomData");
        }
    }, [currentUser, setError]);

    return (
        <div>
            <button className="backbutton" onClick={handleBack}>Back</button>
            <div className="authbox">
                <h2>Brag Game</h2>
                <div id="joinRoomBox">
                    <h3>Please enter room id: </h3>
                    <input
                        id="roomIdInput"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        required
                    />
                    <button id="joinbutton" onClick={handleJoinRoom}>Join Room</button>
                </div>
            </div>
        </div>
    );
}

export default JoinRoom;