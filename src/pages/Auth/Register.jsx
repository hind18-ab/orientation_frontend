import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration error details:', err);
            if (err.response && err.response.data.errors) {
                const firstError = Object.values(err.response.data.errors)[0][0];
                setError(firstError);
            } else if (err.response) {
                setError(err.response.data.message || 'Une erreur est survenue lors de l\'inscription.');
            } else if (err.request) {
                setError('Impossible de contacter le serveur. Vérifiez que le backend est lancé.');
            } else {
                setError('Une erreur est survenue lors de l\'inscription.');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Inscription</h2>
                <p>Créez votre compte pour passer votre test d'orientation.</p>
                
                {error && (
                    <div className="error-alert">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="input-group">
                        <label>Nom complet</label>
                        <div className="input-with-icon">
                            <User size={20} className="icon" />
                            <input 
                                type="text" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                placeholder="Jean Dupont"
                                required 
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>E-mail</label>
                        <div className="input-with-icon">
                            <Mail size={20} className="icon" />
                            <input 
                                type="email" 
                                value={formData.email} 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
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
                                value={formData.password} 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                placeholder="********"
                                autoComplete="new-password"
                                required 
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Confirmer le mot de passe</label>
                        <div className="input-with-icon">
                            <Lock size={20} className="icon" />
                            <input 
                                type="password" 
                                value={formData.confirmPassword} 
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                                placeholder="********"
                                required 
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">S'inscrire</button>
                </form>
                
                <p className="auth-footer">
                    Déjà un compte ? <Link to="/login">Se connecter</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
