import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { currentUser, register, setError } = useAuth();

    useEffect(() => {
        if(currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate]);

    async function handleFormSubmit(e) {
        e.preventDefault();

        if(password !== confirmPassword) {
            return setError("Error: Password do not match!");
        }

        try {
            setError("");
            setLoading(true);
            await register(email, password);
        } catch(e) {
            console.log(e.message);
        }finally{
            navigate("/profile");
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="authbox">
                <h2>Brag Game</h2>

                <form id="register-form" method="post" action="/register" onSubmit={handleFormSubmit}>
                    <div>
                        <div>
                            <label htmlFor="register-email">email: </label>
                            <div><input type="email" id="register-email" className="authInput" onChange={(e) => setEmail(e.target.value)} required /></div>
                        </div>

                        <div>
                            <label htmlFor="register-password">password: </label>
                            <div><input type="password" id="register-password" className="authInput" onChange={(e) => setPassword(e.target.value)} required /></div>
                        </div>

                        <div>
                            <label htmlFor="register-password-confirmation">confirm<br/>password: </label>
                            <div><input type="password" id="register-password-confirmation" className="authInput" onChange={(e) => setConfirmPassword(e.target.value)} required /></div>
                        </div>
                    </div>
                    <button type="submit" id="registerbutton" disabled={loading}>Sign Up</button>
                </form>
                <div className="authtips">Already have an account?<br />
                    <div className="authlink"><Link to="/">Sign in here!</Link></div>
                </div>
            </div>
        </div>
    );
}