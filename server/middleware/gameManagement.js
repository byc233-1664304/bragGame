const { getUsersInRoom } = require("./roomManagement");

const games = new Map();

// Helper function to generate a random dice value
function rollOneDice() {
    // Generate a random number between 1 and 6
    return Math.floor(Math.random() * 6) + 1;
};

function rollDiceForAll(userIds) {
    const diceResultsForAll = [];
    userIds.forEach((userId) => {
        const resForOne = [userId, Array.from({ length: 5 }, rollOneDice)];
        diceResultsForAll.push(resForOne);
    });
    return diceResultsForAll;
}

function newGame(roomId, lastLose) {
    const userIds = getUsersInRoom(roomId).map((user) => user.userId);
    const resultsForAll = rollDiceForAll(userIds);
    const inTurn = lastLose ? lastLose : "";
    // lastCall[0] is the number of a certain dice result
    // lastCall[1] is the dice result
    const lastCall = [0, 1];
    const opened = "";
    const winner = "";
    const opener = "";
    const game = { resultsForAll, inTurn, lastCall, lastLose, opened, winner, opener };
    games.set(roomId, game);
    return game;
}

function updateGame(roomId, game) {
    games.set(roomId, game);
    return games.get(roomId);
}

function removeGame(roomId) {
    games.delete(roomId);
}

module.exports = {
    newGame, updateGame, removeGame
}