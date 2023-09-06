const users = [];
const rooms = [];

function setUsername(socketId, username) {
    let userId = "";
    let roomId = "";
    users.forEach((user) => {
        if(user.socketId === socketId) {
            user.username = username;
            userId = user.userId;
            roomId = user.roomId;
        }
    });

    const curRoom = getRoom(roomId);
    if(curRoom) {
        curRoom.users.forEach((u) => {
            if(u.userId === userId) {
                u.username = username;
            }
        });
    }

}

function join(socketId, userId, roomId, username, isHost) {
    if(!isHost && getUserNumInRoom(roomId) === 0){
        isHost = true;
    }

    const curUser = { socketId, userId, roomId, username, isHost };
    users.push(curUser);
    return curUser;
}

function addRoom(roomId, users, hostId, inGame) {
    const room = { roomId, users, hostId, inGame };
    rooms.push(room);
    return room;
}

function getRoom(roomId) {
    return rooms.find((curRoom) => curRoom.roomId === roomId);
}

function deleteRoom(roomId) {
    const index = rooms.findIndex((curRoom) => curRoom.roomId === roomId);
    if(index !== -1) {
        return rooms.splice(index, 1)[0];
    }
}

function getCurrentUser(socketId) {
    return users.find((curUser) => curUser.socketId === socketId);
}

const getUsersInRoom = (roomId) => {
    return users.filter((user) => user.roomId === roomId);
}

const getUserNumInRoom = (roomId) => {
    return getUsersInRoom(roomId).length;
}

function leave(socketId) {
    const index = users.findIndex((curUser) => curUser.socketId === socketId);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

module.exports = {
    setUsername, join, addRoom, getRoom, deleteRoom, getCurrentUser, getUsersInRoom, leave
}