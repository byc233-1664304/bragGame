import { useState, useEffect } from 'react';

import { useAuth } from "../../contexts/AuthContext";
import { Dice } from "../layouts/Dice";

export const Game = ({ socket, users, roomId, host }) => {
    const [inTurn, setInTurn] = useState("");
    const [resultsForAll, setResultsForAll] = useState(new Map());
    const [resultsForAllArr, setResultsForAllArr] = useState([]);
    const [myResult, setMyResult] = useState([]);
    const [lastCallNum, setLastCallNum] = useState(0);
    const [lastCallRes, setLastCallRes] = useState(1);
    const [curCallNum, setCurCallNum] = useState(1);
    const [curCallRes, setCurCallRes] = useState(0);
    const [selects, setSelects] = useState([]);
    const [opened, setOpened] = useState("");
    const [lastLose, setLastLose] = useState("");
    const [winner, setWinner] = useState("");
    const [lastUsername, setLastUsername] = useState("");
    const [opener, setOpener] = useState("");

    const { currentUser } = useAuth();
    const userIds = users.map(user => user.userId);

    useEffect(() => {
        socket.on("game", (game) => {
            console.log("game", game);
            let tempRes = new Map();
            let tempArr = [];
            game.resultsForAll.forEach((res) => {
                const userId = res[0];
                const diceRes = res[1];

                const tempDiceRes = [];
                res[1].forEach((dr) => {tempDiceRes.push(dr)});

                tempRes.set(userId, tempDiceRes);
                tempArr.push([userId, tempDiceRes]);

                if(userId === currentUser.uid) {
                    setMyResult(diceRes);
                }
            });
            setResultsForAll(tempRes);
            setResultsForAllArr(tempArr);
            setInTurn(game.inTurn);
            setOpened(game.opened);
            setWinner(game.winner);
            setLastLose(game.lastLose);
            setLastCallNum(game.lastCall[0]);
            setLastCallRes(game.lastCall[1]);
            setOpener(game.opener)
        });

        socket.on("called", (name) => {
            setLastUsername(name);
        });

        let tempSelects = new Array(5).fill(false);
        setSelects(tempSelects);

        return () => {
            socket.off("game");
            socket.off("calle");
        };
    }, [currentUser.uid, socket]);

    const handleResCalling = (res) => {
        setCurCallRes(res);
    }

    useEffect(() => {
        let tempSelects = new Array(5).fill(false);
        if(curCallRes > 0) {
            tempSelects[curCallRes - 1] = true;
        }
        setSelects(tempSelects);
    }, [curCallRes]);

    const getIndex = (id) => {
        for(let i = 0; i < userIds.length; i++) {
            if(userIds[i] === id) {
                return i;
            }
        }

        return -1;
    }

    const handleCalling = () => {
        // reset selects
        setCurCallRes(0);

        // update game data and lastUsername to server
        const curIndex = getIndex(currentUser.uid);
        const nextIndex = curIndex + 1 < userIds.length ? curIndex + 1 : 0;
        const nextTurn = userIds[nextIndex];
        const curCall = [curCallNum, curCallRes];
        const name = getUsername(currentUser.uid);

        setLastUsername(name);
        socket.emit("called", name);

        setInTurn(nextTurn);
        const gameInNextTurn = {
            resultsForAll: resultsForAllArr,
            inTurn: nextTurn,
            lastCall: curCall,
            LastLose: lastLose,
            opened: opened,
            winner: winner,
            opener: opener
        };

        socket.emit("game", gameInNextTurn);
    }

    // return winner
    const handleOpening = () => {
        const tempIndex = getIndex(currentUser.uid);
        const lastIndex = tempIndex === 0 ? userIds.length - 1 : tempIndex - 1;
        let tempOpened = userIds[lastIndex];

        // count result of all dices
        let count = new Array(6).fill(0);
        for(const val of resultsForAll.values()){
            for(let i = 0; i < 5; i++) {
                const oneRes = val[i];
                count[oneRes - 1] = count[oneRes - 1] + 1;
            }
        };

        // judge win and lose
        let win = "";
        let lose = "";
        if(lastCallRes === 1) {
            if(lastCallNum <= count[0]) {
                win = tempOpened;
                lose = currentUser.uid;
            }else {
                win = currentUser.uid;
                lose = tempOpened;
            }
        }else{
            if(lastCallNum <= count[0] + count[lastCallRes - 1]) {
                win = tempOpened;
                lose = currentUser.uid;
            }else {
                win = currentUser.uid;
                lose = tempOpened;
            }
        }

        // update game data
        const endTurn = "";
        const curCall = [curCallNum, curCallRes];
        const tempOpener = currentUser.uid;
        const endedGame = {
            resultsForAll: resultsForAllArr,
            inTurn: endTurn,
            lastCall: curCall,
            lastLose: lose,
            opened: tempOpened,
            winner: win,
            opener: tempOpener
        }
        console.log("ended", endedGame);
        socket.emit("game", endedGame);
    }

    const showOpenButton = () => {
        const noOpen = opened !== "";
        if(inTurn === currentUser.uid) {
            return (<button id="openbutton" onClick={handleOpening} disabled={noOpen}>Open</button>);
        }else {
            return (<div></div>);
        }
    }

    const showLastCall = (lastUserId) => {
        return (
            <div id="lastCallWithButton">
                <div>
                    <h2>{lastUsername} called:</h2>
                    <div id="lastCallRes">
                        <h2 id="lastCallNum">{lastCallNum}</h2>
                        <Dice value={lastCallRes} selected={false} />
                        <h2 id="lastCallS">'s</h2>
                    </div>
                </div>
                {showOpenButton(lastUserId)}
            </div>
        );
    }

    const showCallChoice = () => {
        let choices = new Array(6).fill(true);

        if (curCallNum <= lastCallNum) {
            for (let i = 0; i < lastCallRes; i++) {
                choices[i] = false;
            }
        }

        return (
            <div>
                <div id="callBox">
                    <h2>Please make a call:</h2>
                    <input
                        type="number"
                        min="1"
                        max="15"
                        value={curCallNum}
                        onChange={(e) => setCurCallNum(parseInt(e.target.value))}
                    />
                </div>
                <div id="choiceBox">
                    {choices.map((choice, index) => {
                        return (
                            <button
                                key={index}
                                className={choice? "opacity-100" : "opacity-40"}
                                disabled={!choice}
                                onClick={() => handleResCalling(index + 1)}
                            >
                                <Dice value={index + 1} selected={selects[index]} />
                            </button>
                        );
                    })}
                </div>
                <button id="callButton" onClick={handleCalling}>Yup! Call!</button>
            </div>
        );
    }

    const waitingTurn = (lastUserId) => {
        if(lastCallNum === 0) {
            return (<div id="waitingCall">Waiting for other users to call...</div>);
        }else {
            return (
                <div id="lastCallBox">{showLastCall(lastUserId)}</div>
            );
        }
    }

    const takeTurn = () => {
        if(inTurn === currentUser.uid && lastCallNum === 0) {
            return (
                <div id="manipulate">{showCallChoice()}</div>
            );
        }else{
            const curIndex = getIndex(inTurn);
            const lastIndex = curIndex === 0 ? userIds.length - 1 : curIndex - 1;
            const lastUserId = userIds[lastIndex];

            if(inTurn === currentUser.uid && lastCallNum !== 0) {
                return (
                    <div id="lastCallAndChoice">
                        {showLastCall()}
                        <br />
                        {showCallChoice(lastUserId)}
                    </div>
                );
            }else {
                return waitingTurn(lastUserId);
            }
        }
    }

    const getUsername = (userId) => {
        for(let i = 0; i < users.length; i++) {
            if(users[i].userId === userId) {
                return users[i].username;
            }
        }
        return "";
    }

    const decideToshow = (userId, index) => {
        if(userId === currentUser.uid) {
            return (<div key={index}></div>);
        }else {
            return (
                <div id="otherRes" key={index}>
                    <h2 id="otherNames">{getUsername(userId)}: </h2>
                    <div id="resBox">
                        {resultsForAll.get(userId).map((dice, innerIndex) => {
                            return(
                                <div key={innerIndex}>
                                    <Dice value={dice} selected={false} />
                                </div>);
                        })}
                    </div>
                </div>
            );
        }
    }

    // Helper function to generate a random dice value
    function rollOneDice() {
        // Generate a random number between 1 and 6
        return Math.floor(Math.random() * 6) + 1;
    };

    function rollDiceForAll(ids) {
        const diceResultsForAll = [];
        ids.forEach((id) => {
            const resForOne = [id, Array.from({ length: 5 }, rollOneDice)];
            diceResultsForAll.push(resForOne);
        });
        return diceResultsForAll;
    }

    const toNextRount = () => {
        // update game data to a new game with new results and new lastLose set
        const generateNewResults = rollDiceForAll(userIds);
        const newInTurn = lastLose;
        const newCall = [0, 1];
        const newOpened = "";
        const newWinner = "";
        const nextRoundGame = {
            resultsForAll: generateNewResults,
            inTurn: newInTurn,
            lastCall: newCall,
            lastLose: lastLose,
            opened: newOpened,
            winner: newWinner
        };
        socket.emit("game", nextRoundGame);
    }

    const endGame = () => {
        socket.emit("endGame", roomId);
    }

    const showManagement = () => {
        if(currentUser.uid === host) {
            return (
                <div>
                    <button id="nextRound" onClick={toNextRount}>Next Round</button>
                    <button id="endGame" onClick={endGame}>End Game</button>
                </div>
            );
        }else {
            return (<div></div>);
        }
    }

    const showRes = () => {
        const loser = winner === opened ? currentUser.uid : opened;
        const loserName = getUsername(loser);
        const winnerName = getUsername(winner);
        const openerName = getUsername(opener);

        return (
            <div>
                <h2 id="openCall">{openerName} called open!</h2>
                <div id="resContent">
                    <h2>Results for others:</h2>
                    <div id="resBox">
                        {userIds.map((userId, outterIndex) => {
                            return decideToshow(userId, outterIndex);
                        })}
                    </div>
                </div>

                <div id="endGameChoices">
                    <h2 className="winRes">Winner:<br/>{winnerName}</h2>
                    <h3>{loserName}: I will come back for you!</h3>
                    {showManagement()}
                </div>
            </div>
        );
    }

    return (
        <div>
            {opened !== "" ? showRes() : takeTurn()}
            <h2 id="resultTitle">My Result: </h2>
            <div id="diceBox">
                {myResult.map((dice, index) => {
                    return (
                        <div key={index}>
                            <Dice value={dice} selected={false} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}