import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { socket } from "../../services/socket"

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { currentUser, login, setError } = useAuth();

    useEffect(() => {
        if(currentUser) {
            socket.connect();
            navigate("/");
        }
    }, [currentUser, navigate]);

    async function handleFormSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(email, password);
            socket.connect();
        } catch(e) {
            setError(e.message);
            return;
        }finally{
            window.location.reload();
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="authbox">
                <h2>Brag Game</h2>

                <form id="login-form" method="post" action="/login" onSubmit={handleFormSubmit}>
                    <div>
                        <div>
                            <label htmlFor="login-email">email: </label>
                            <input
                                type="email"
                                id="login-email"
                                className="authInput"
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="login-password">password: </label>
                            <input
                                type="password"
                                id="login-password"
                                className="authInput"
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" id="loginbutton" disabled={loading}>Sign In</button>
                </form>
                <div className="authtips">Don't have an account?<br />
                    <div className="authlink"><Link to="/register">Register here!</Link></div>
                </div>
            </div>
        </div>
    );
}