import { useState, useEffect } from "react";

import { useAuth } from "../../contexts/AuthContext";
import { Game } from "./Game";

export const GameArea = ({ socket, roomId, users, host }) => {
    const [inGame, setInGame] = useState(false);

    const { currentUser, setError } = useAuth();

    useEffect(() => {
        socket.on("roomData", (roomData) => {
            setInGame(roomData.inGame);
        });
    });

    const getRandomUser = () => {
        const userNum = users.length;
        const index = Math.floor(Math.random() * userNum);
        return users[index].userId;
    }

    const handleStartGame = () => {
        if(users.length === 1) {
            setError("It needs at least 2 players to start the game");
        }else {
            // set game state to ongoing game
            setInGame(true);

            // emit an event to the backend to update inGame to true
            // set the starting user as host
            const starter = getRandomUser();
            socket.emit("startGame", roomId, starter);
        }
    }

    if(!inGame) {
        if(currentUser.uid === host) {
            return (
                <button
                    className="mainButton"
                    id="startButton"
                    onClick={handleStartGame}
                >Start Game</button>
            );
        }else {
            return (<p className="waitingMsg">Waiting for the host to<br/>start the game...</p>);
        }
    }else {
        return (
            <div><Game socket={socket} users={users} roomId={roomId} host={host} /></div>
        );
    }
}