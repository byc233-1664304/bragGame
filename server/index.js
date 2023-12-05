// utils
const process = require("process");
const cors = require("cors");
const path = require("path");
const http = require("http");
const normalizePort = require('normalize-port');
const socket = require('socket.io');

// imports
const verifyToken = require("./middleware/VerifyToken");
const corsOptions = require("./config/corsOptions");
const { setUsername, join, addRoom, getRoom, deleteRoom, getCurrentUser, getUsersInRoom, leave } = require("./middleware/roomManagement");
const { newGame, updateGame, removeGame } = require("./middleware/gameManagement");

require("dotenv").config();

// express app
const express = require("express");
const app = express();
const portNumber = normalizePort(process.env.PORT_NUMBER || 8080);

const buildPath = path.join(__dirname, 'frontend', 'build');

// middleware
app.use(express());
app.use('/', express.static(buildPath));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));

app.use(verifyToken);

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'), { root: __dirname });
})

// var server = app.listen(portNumber, (e) => {
//     if(e) {
//         console.log("Failed to start the server with error message: " + e);
//     }else {
//         console.log(`Server is online on port: ${portNumber}`);
//     }
// });

const server = http.createServer(app);

const io = socket(server);

io.on("connection", (socket) => {
    console.log("socket connected");
    socket.on("changeName", (username) => {
        setUsername(socket.id, username);
    });

    socket.on("joinRoom", ({userId, roomId, username, isHost}) => {
        let roomData = getRoom(roomId);

        //console.log("outterRoomData", roomData);
        if(roomData && roomData.inGame) {
            //console.log("in if");
            socket.emit("roomData", roomData);
            return;
        }else {
            //console.log("in else");
            // create user
            const curUser = join(socket.id, userId, roomId, username, isHost);
            socket.join(curUser.roomId);

            // welcome message
            socket.emit("message", {
                username: "--- System",
                text: `Welcome, ${curUser.username}! ---`,
                isCipher: false
            });

            // show that the user joined
            socket.broadcast.to(curUser.roomId).emit("message", {
                username: "--- System",
                text: `${curUser.username} has joined the room ---`,
                isCipher: false
            });

            const users = getUsersInRoom(curUser.roomId);

            if(roomData) {
                // update roomData for room if it alreade exist
                roomData.users = users;
            }else {
                // create room if room is not already exist
                const hostId = curUser.userId;
                const status = false;
                roomData = addRoom(roomId, users, hostId, status);
            }

            console.log("innerRoomData", roomData);
            // send roomData to client side
            io.to(curUser.roomId).emit("roomData", roomData);
        }
    });

    // start game
    socket.on("startGame", (roomId, lastLose) => {
        let room = getRoom(roomId);
        if(room) {
            // set roomData.inGame to true and send it to client side
            room.inGame = true;
            io.to(roomId).emit("roomData", room);

            const game = newGame(roomId, lastLose);
            io.to(roomId).emit("game", game);
        }
    });

    // update game status
    socket.on("game", (game) => {
        const curUser = getCurrentUser(socket.id);
        const updatedGame = updateGame(curUser.roomId, game);
        io.to(curUser.roomId).emit("game", updatedGame);
    });

    socket.on("endGame", (roomId) => {
        let room = getRoom(roomId);
        if(room) {
            // set roomData.inGame to false and sned it to client side
            room.inGame = false;
            io.to(roomId).emit("roomData", room);

            // delete game in data
            removeGame(roomId);
        }
    });

    // user sending message
    socket.on("chat", (text) => {
        const curUser = getCurrentUser(socket.id);

        io.to(curUser.roomId).emit("message", {
            username: curUser.username,
            text: text,
            isCipher: true
        });
    });

    socket.on("called", (name) => {
        const curUser = getCurrentUser(socket.id);
        io.to(curUser.roomId).emit("called", name);
    });

    // user leave the room
    socket.on("leave", () => {
        const curUser = leave(socket.id);
        if(curUser) {
            socket.leave(curUser.roomId);
            // message shows user leaving
            io.to(curUser.roomId).emit("message", {
                username: "--- System",
                text: `${curUser.username} has left the room ---`
            });

            const users = getUsersInRoom(curUser.roomId);
            if(users.length == 0) {
                // delete room if there is no user in it
                deleteRoom(curUser.roomId);
            }else if(users.length > 0) {
                const room = getRoom(curUser.roomId);

                // set new host if host left
                if(room.hostId === curUser.userId) {
                    room.hostId = users[0].userId;
                    users[0].isHost = true;
                }

                // update users in room
                room.users = users;

                io.to(curUser.roomId).emit("roomData", room);
            }
        }
    });
});