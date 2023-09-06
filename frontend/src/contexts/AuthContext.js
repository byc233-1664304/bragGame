import { createContext, useContext, useState, useEffect } from "react";
import auth from "../config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    function register(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                localStorage.setItem("currentUser", JSON.stringify(userCredential.user));
            });
    }

    function logout() {
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
        return signOut(auth);
    }

    function updateUserProfile(user, profile) {
        return updateProfile(user, profile);
    }

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("currentUser");
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }else{
                setCurrentUser(null);
            }
          } catch (error) {
            console.error("Error parsing stored user from localStorage:", error);
            setCurrentUser(null);
          } finally {
            setLoading(false);
          }
    }, []);

    const value = {
        currentUser,
        error,
        setError,
        login,
        register,
        logout,
        updateUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}