import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password);
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Identifiants invalides. Veuillez réessayer.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Connexion</h2>
                <p>Bienvenue sur Orientation. Connectez-vous pour continuer.</p>
                
                {error && (
                    <div className="error-alert">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="input-group">
                        <label>E-mail</label>
                        <div className="input-with-icon">
                            <Mail size={20} className="icon" />
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="votre@email.com"
                                autoComplete="off"
                                required 
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Mot de passe</label>
                        <div className="input-with-icon">
                            <Lock size={20} className="icon" />
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="********"
                                autoComplete="new-password"
                                required 
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Se connecter</button>
                </form>
                
                <p className="auth-footer">
                    Pas encore de compte ? <Link to="/register">S'inscrire</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
