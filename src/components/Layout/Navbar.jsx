import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, ClipboardList, Settings, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="nav-logo">
                    Orientation
                </Link>
                
                <div className="nav-links">
                    <Link to="/" className="nav-link">Accueil</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            <Link to="/test" className="nav-link">Passer le Test</Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-link admin-badge">
                                    <Settings size={14} /> Admin
                                </Link>
                            )}
                            <div className="user-menu" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                <div className="user-avatar">
                                    {user.name.charAt(0)}
                                </div>
                                {isDropdownOpen && (
                                    <div className="dropdown animate-fade-in">
                                        <div className="dropdown-info">
                                            <strong>{user.name}</strong>
                                            <span>{user.email}</span>
                                        </div>
                                        <hr />
                                        <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)}>
                                            <LayoutDashboard size={16} /> Dashboard
                                        </Link>
                                        <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                                            <User size={16} /> Mon Profil
                                        </Link>
                                        <button onClick={handleLogout} className="logout-btn">
                                            <LogOut size={16} /> Déconnexion
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="auth-btns">
                            <Link to="/login" className="btn btn-outline btn-sm">Connexion</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">S'inscrire</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
