import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { LogOut, LayoutDashboard, Settings, User, Sun, MoonStar } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher.jsx';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();
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
                <div className="nav-left">
                    <Link to="/" className="nav-logo">
                        Orientation
                    </Link>
                    <div className="nav-links">
                        <Link to="/" className="nav-link">{t('nav.home', 'Accueil')}</Link>
                        <Link to="/formations" className="nav-link">{t('nav.formations', 'Formations')}</Link>
                        {user && (
                            <>
                                <Link to="/dashboard" className="nav-link">{t('nav.dashboard', 'Dashboard')}</Link>
                                <Link to="/test" className="nav-link">{t('nav.test', 'Passer le Test')}</Link>
                            </>
                        )}
                    </div>
                </div>
                
                <div className="nav-right">
                    <LanguageSwitcher />
                    <button className="theme-toggle" onClick={toggleTheme} title="Changer de thème">
                        {theme === 'light' ? <MoonStar size={20} /> : <Sun size={20} />}
                    </button>

                    {user ? (
                        <div className="user-section">
                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-link admin-badge">
                                    <Settings size={14} /> {t('nav.admin', 'Admin')}
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
                                            <LayoutDashboard size={16} /> {t('nav.dashboard', 'Dashboard')}
                                        </Link>
                                        <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                                            <User size={16} /> {t('nav.profile', 'Mon Profil')}
                                        </Link>
                                        <button onClick={handleLogout} className="logout-btn">
                                            <LogOut size={16} /> {t('nav.logout', 'Déconnexion')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="auth-btns">
                            <Link to="/login" className="btn btn-outline btn-sm">{t('auth.login', 'Connexion')}</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">{t('auth.register', "S'inscrire")}</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
