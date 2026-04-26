import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
    const { t, i18n } = useTranslation();
    const { user, updateUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' or 'error'

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' },
        { code: 'en', name: 'English', flag: '🇬🇧' }
    ];

    const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

    const changeLanguage = async (code) => {
        i18n.changeLanguage(code);
        
        if (user) {
            setLoading(true);
            try {
                // Update language preference on backend
                const response = await api.put('/user/profile', { 
                    name: user.name, 
                    email: user.email, 
                    preferred_language: code 
                });
                updateUser(response.data.user);
                setStatus('success');
                setTimeout(() => {
                    setStatus(null);
                    setIsOpen(false);
                }, 1500);
            } catch (error) {
                console.error("Error saving language preference", error);
                setStatus('error');
            } finally {
                setLoading(false);
            }
        } else {
            setIsOpen(false);
        }
    };

    return (
        <div className="language-switcher" onMouseLeave={() => !loading && setIsOpen(false)}>
            <button 
                className="theme-toggle" 
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                title={t('common.language', 'Langue')}
                style={{ width: '40px', height: '40px', border: '1px solid var(--border)' }}
            >
                <Globe size={20} />
            </button>
            
            {isOpen && (
                <div className="lang-menu-enhanced" role="dialog" aria-modal="true">
                    <div className="lang-header">
                        <h4>{t('profile.preferredLanguage', 'Langues et Préférences')}</h4>
                    </div>
                    
                    <ul className="lang-list" role="listbox">
                        {languages.map((lang) => (
                            <li 
                                key={lang.code}
                                role="option"
                                aria-selected={currentLang.code === lang.code}
                                className={currentLang.code === lang.code ? 'active' : ''}
                                onClick={() => !loading && changeLanguage(lang.code)}
                            >
                                <span className="lang-flag">{lang.flag}</span>
                                <span className="lang-name">{lang.name}</span>
                                {currentLang.code === lang.code && <CheckCircle size={16} className="check-icon" />}
                            </li>
                        ))}
                    </ul>

                    <div className="lang-info-box">
                        <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p>
                            La langue choisie ici sera utilisée pour le contenu de vos cours et générée automatiquement sur vos certificats de réussite.
                        </p>
                    </div>

                    {status === 'success' && (
                        <div className="lang-success-msg">
                            {t('common.success', 'Opération réussie')}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
