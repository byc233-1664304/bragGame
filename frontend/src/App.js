import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

import './index.css';
import { AuthProvider } from "./contexts/AuthContext";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Rules from "./components/Rules";
import User from "./components/account/User";
import Profile from "./components/account/Profile";
import Room from "./components/games/Room";
import JoinRoom from "./components/games/JoinRoom";
import Background from "./components/layouts/Background";
import ErrorMessage from "./components/layouts/ErrorMessage";
import WithPrivateRoute from "./utils/WithPrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Background />
        <ErrorMessage />
        <Routes>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/rules" element={<Rules />}/>
          <Route exact path="/profile" element={
            <WithPrivateRoute>
              <Profile />
            </WithPrivateRoute>
          } />
          <Route exact path="/" element={
            <WithPrivateRoute>
              <User />
            </WithPrivateRoute>
          } />
          <Route exact path="/join" element={
            <WithPrivateRoute>
              <JoinRoom />
            </WithPrivateRoute>
          } />
          <Route path="room/:roomId" element={
            <WithPrivateRoute>
              <Room />
            </WithPrivateRoute>
          }/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
