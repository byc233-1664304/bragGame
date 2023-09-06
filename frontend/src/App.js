import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import io from "socket.io-client";

import './index.css';
import { AuthProvider } from "./contexts/AuthContext";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import User from "./components/account/User";
import Profile from "./components/account/Profile";
import Room from "./components/games/Room";
import JoinRoom from "./components/games/JoinRoom";
import Background from "./components/layouts/Background";
import ErrorMessage from "./components/layouts/ErrorMessage";
import WithPrivateRoute from "./utils/WithPrivateRoute";

const socket = io.connect("/");

function App() {
  const generateRoomId = () => {
    let S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() +S4();
  }

  return (
    <AuthProvider>
      <Router>
        <Background />
        <ErrorMessage />
        <Routes>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/profile" element={
            <WithPrivateRoute>
              <Profile  socket={socket}/>
            </WithPrivateRoute>
          } />
          <Route exact path="/" element={
            <WithPrivateRoute>
              <User generateRoomId={generateRoomId} socket={socket}/>
            </WithPrivateRoute>
          } />
          <Route exact path="/join" element={
            <WithPrivateRoute>
              <JoinRoom socket={socket}/>
            </WithPrivateRoute>
          } />
          <Route path="room/:roomId" element={
            <WithPrivateRoute>
              <Room socket={socket} />
            </WithPrivateRoute>
          }/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
