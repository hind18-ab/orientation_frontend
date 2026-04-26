import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Save, Key, AlertCircle, CheckCircle, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const { t, i18n } = useTranslation();
    
    // Profile info state
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [preferredLanguage, setPreferredLanguage] = useState(user?.preferred_language || 'fr');
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMessage({ type: '', text: '' });

        try {
            const response = await api.put('/user/profile', { name, email, preferred_language: preferredLanguage });
            updateUser(response.data.user);
            
            if (i18n.language !== preferredLanguage) {
                i18n.changeLanguage(preferredLanguage);
            }
            
            setProfileMessage({ type: 'success', text: t('profile.saved', 'Profil mis à jour avec succès') });
        } catch (error) {
            setProfileMessage({ 
                type: 'error', 
                text: error.response?.data?.message || t('common.error', 'Une erreur est survenue') 
            });
        } finally {
            setProfileLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: t('auth.passwordsDontMatch', 'Les mots de passe ne correspondent pas.') });
            return;
        }

        setPasswordLoading(true);
        setPasswordMessage({ type: '', text: '' });

        try {
            const response = await api.put('/user/password', {
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmPassword
            });
            setPasswordMessage({ type: 'success', text: t('profile.saved', 'Mot de passe mis à jour avec succès') });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setPasswordMessage({ 
                type: 'error', 
                text: error.response?.data?.message || t('common.error', 'Erreur lors de la mise à jour') 
            });
        } finally {
            setPasswordLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="profile-container">
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <header className="profile-header">
                    <motion.h1 
                        variants={itemVariants}
                        className="profile-title"
                    >
                        {t('profile.title', 'Gestion du Profil')}
                    </motion.h1>
                    <motion.p variants={itemVariants} className="profile-subtitle">
                        {t('profile.subtitle', 'Gérez vos informations personnelles et votre sécurité.')}
                    </motion.p>
                </header>

                <div className="profile-grid">
                    
                    {/* Informatios Personnelles */}
                    <motion.section 
                        variants={itemVariants}
                        className="profile-card"
                    >
                        <div className="profile-card-header">
                            <div className="icon-box">
                                <User size={24} />
                            </div>
                            <h2>{t('profile.personalInfo', 'Informations Personnelles')}</h2>
                        </div>

                        <form onSubmit={handleUpdateProfile}>
                            <div className="input-container">
                                <label>{t('auth.name', 'Nom Complet')}</label>
                                <div className="input-wrapper">
                                    <div className="input-icon">
                                        <User size={18} />
                                    </div>
                                    <input 
                                        className="profile-input"
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-container">
                                <label>{t('auth.email', 'Email')}</label>
                                <div className="input-wrapper">
                                    <div className="input-icon">
                                        <Mail size={18} />
                                    </div>
                                    <input 
                                        className="profile-input"
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <AnimatePresence>
                                {profileMessage.text && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`message-box ${profileMessage.type}`}
                                    >
                                        {profileMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                        {profileMessage.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button 
                                type="submit" 
                                disabled={profileLoading}
                                className="btn-profile-save"
                            >
                                {profileLoading ? t('common.loading', 'Chargement...') : (
                                    <>
                                        <Save size={18} />
                                        {t('common.save', 'Enregistrer les modifications')}
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.section>

                    {/* Sécurité */}
                    <motion.section 
                        variants={itemVariants}
                        className="profile-card"
                    >
                        <div className="profile-card-header">
                            <div className="icon-box" style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)' }}>
                                <Lock size={24} />
                            </div>
                            <h2>{t('profile.security', 'Sécurité')}</h2>
                        </div>

                        <form onSubmit={handleUpdatePassword}>
                            <div className="input-container">
                                <label>{t('profile.currentPassword', 'Mot de passe actuel')}</label>
                                <div className="input-wrapper">
                                    <div className="input-icon">
                                        <Key size={18} />
                                    </div>
                                    <input 
                                        className="profile-input"
                                        type="password" 
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-container">
                                <label>{t('profile.newPassword', 'Nouveau mot de passe')}</label>
                                <div className="input-wrapper">
                                    <div className="input-icon">
                                        <Lock size={18} />
                                    </div>
                                    <input 
                                        className="profile-input"
                                        type="password" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder={t('profile.passwordHint', 'Minimum 8 caractères')}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-container">
                                <label>{t('profile.confirmNewPassword', 'Confirmer le nouveau mot de passe')}</label>
                                <div className="input-wrapper">
                                    <div className="input-icon">
                                        <Lock size={18} />
                                    </div>
                                    <input 
                                        className="profile-input"
                                        type="password" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <AnimatePresence>
                                {passwordMessage.text && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`message-box ${passwordMessage.type}`}
                                    >
                                        {passwordMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                        {passwordMessage.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button 
                                type="submit" 
                                disabled={passwordLoading}
                                className="btn-security-save"
                            >
                                {passwordLoading ? t('common.loading', 'Mise à jour...') : (
                                    <>
                                        <Key size={18} />
                                        {t('profile.changePassword', 'Changer le mot de passe')}
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.section>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
