import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { User, Mail, Lock, Save, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { user, updateUser } = useAuth();
    
    // Profile info state
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
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
            const response = await api.put('/user/profile', { name, email });
            updateUser(response.data.user);
            setProfileMessage({ type: 'success', text: response.data.message });
        } catch (error) {
            setProfileMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Une erreur est survenue lors de la mise à jour.' 
            });
        } finally {
            setProfileLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
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
            setPasswordMessage({ type: 'success', text: response.data.message });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setPasswordMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Le mot de passe actuel est incorrect ou les données sont invalides.' 
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
        <div className="profile-container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                    <motion.h1 
                        variants={itemVariants}
                        style={{ 
                            fontSize: '2.5rem', 
                            fontWeight: '800', 
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '0.5rem'
                        }}
                    >
                        Gestion du Profil
                    </motion.h1>
                    <motion.p variants={itemVariants} style={{ color: '#64748b' }}>
                        Gérez vos informations personnelles et votre sécurité.
                    </motion.p>
                </header>

                <div className="profile-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                    gap: '2rem' 
                }}>
                    
                    {/* Informatios Personnelles */}
                    <motion.section 
                        variants={itemVariants}
                        className="profile-card"
                        style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '24px',
                            padding: '2rem',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem' }}>
                            <div style={{ padding: '0.5rem', background: '#eef2ff', borderRadius: '12px', color: '#6366f1' }}>
                                <User size={24} />
                            </div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>Informations Personnelles</h2>
                        </div>

                        <form onSubmit={handleUpdateProfile}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Nom Complet</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                        <User size={18} />
                                    </div>
                                    <input 
                                        className="profile-input"
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem 0.75rem 2.75rem',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            outline: 'none',
                                            transition: 'all 0.2s',
                                            fontSize: '1rem'
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Email</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                        <Mail size={18} />
                                    </div>
                                    <input 
                                        className="profile-input"
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem 0.75rem 2.75rem',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            outline: 'none',
                                            transition: 'all 0.2s',
                                            fontSize: '1rem'
                                        }}
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
                                        style={{ 
                                            marginBottom: '1rem', 
                                            padding: '0.75rem', 
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.875rem',
                                            background: profileMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
                                            color: profileMessage.type === 'success' ? '#15803d' : '#b91c1c',
                                            border: `1px solid ${profileMessage.type === 'success' ? '#bcf0da' : '#fecaca'}`
                                        }}
                                    >
                                        {profileMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                        {profileMessage.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button 
                                type="submit" 
                                disabled={profileLoading}
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(99, 102, 241, 0.3)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(99, 102, 241, 0.2)'; }}
                            >
                                {profileLoading ? 'Chargement...' : (
                                    <>
                                        <Save size={18} />
                                        Enregistrer les modifications
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.section>

                    {/* Sécurité */}
                    <motion.section 
                        variants={itemVariants}
                        className="profile-card"
                        style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '24px',
                            padding: '2rem',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem' }}>
                            <div style={{ padding: '0.5rem', background: '#f5f3ff', borderRadius: '12px', color: '#8b5cf6' }}>
                                <Lock size={24} />
                            </div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>Sécurité</h2>
                        </div>

                        <form onSubmit={handleUpdatePassword}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Mot de passe actuel</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                        <Key size={18} />
                                    </div>
                                    <input 
                                        className="profile-input"
                                        type="password" 
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem 0.75rem 2.75rem',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            outline: 'none',
                                            transition: 'all 0.2s',
                                            fontSize: '1rem'
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Nouveau mot de passe</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                        <Lock size={18} />
                                    </div>
                                    <input 
                                        className="profile-input"
                                        type="password" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Minimum 8 caractères"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem 0.75rem 2.75rem',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            outline: 'none',
                                            transition: 'all 0.2s',
                                            fontSize: '1rem'
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Confirmer le nouveau mot de passe</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                        <Lock size={18} />
                                    </div>
                                    <input 
                                        className="profile-input"
                                        type="password" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem 0.75rem 2.75rem',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            outline: 'none',
                                            transition: 'all 0.2s',
                                            fontSize: '1rem'
                                        }}
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
                                        style={{ 
                                            marginBottom: '1rem', 
                                            padding: '0.75rem', 
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.875rem',
                                            background: passwordMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
                                            color: passwordMessage.type === 'success' ? '#15803d' : '#b91c1c',
                                            border: `1px solid ${passwordMessage.type === 'success' ? '#bcf0da' : '#fecaca'}`
                                        }}
                                    >
                                        {passwordMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                        {passwordMessage.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button 
                                type="submit" 
                                disabled={passwordLoading}
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.2)'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(139, 92, 246, 0.3)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(139, 92, 246, 0.2)'; }}
                            >
                                {passwordLoading ? 'Mise à jour...' : (
                                    <>
                                        <Key size={18} />
                                        Changer le mot de passe
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.section>
                </div>
            </motion.div>
            
            <style>
                {`
                    .profile-input:focus {
                        border-color: #6366f1 !important;
                        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                        background: #fff;
                    }
                    @media (max-width: 768px) {
                        .profile-grid {
                            grid-templateColumns: 1fr !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Profile;
