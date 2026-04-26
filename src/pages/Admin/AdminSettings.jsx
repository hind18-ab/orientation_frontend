import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import { Save, Key, Settings as SettingsIcon, AlertCircle, CheckCircle } from 'lucide-react';
import './AdminSettings.css';

const AdminSettings = () => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState({
        gemini_api_key: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/admin/settings');
            const data = response.data.settings;
            if (data) {
                setSettings({
                    gemini_api_key: data.gemini_api_key || ''
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            await api.post('/admin/settings', { settings });
            setMessage({ type: 'success', text: t('common.settingsSaved', 'Paramètres sauvegardés avec succès !') });
            
            // Masquer le message après 3 secondes
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: t('common.errorSavingSettings', 'Une erreur est survenue lors de la sauvegarde.') });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="loading">{t('common.loadingSettings', 'Chargement des paramètres...')}</div>;
    }

    return (
        <div className="admin-settings">
            <header className="page-header">
                <div className="header-title">
                    <SettingsIcon size={32} className="text-primary" />
                    <h1>{t('admin.management.generalSettings', 'Paramètres Généraux')}</h1>
                </div>
                <p>{t('admin.management.generalSettingsSubtitle', 'Gérez les configurations globales de la plateforme')}.</p>
            </header>

            {message && (
                <div className={`alert alert-${message.type}`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="settings-form card">
                <div className="settings-section">
                    <div className="section-header">
                        <Key size={24} className="icon" />
                        <h2>{t('admin.management.aiSettings', 'Intelligence Artificielle (Gemini API)')}</h2>
                    </div>
                    <p className="section-description">
                        {t('admin.management.aiSettingsNote', 'La clé API est utilisée pour générer automatiquement des questions pour le test d\'orientation. Si ce champ est vide, le système tentera d\'utiliser la clé définie dans le fichier de configuration du serveur (.env).')}
                    </p>

                    <div className="form-group">
                        <label htmlFor="gemini_api_key">{t('admin.management.googleGeminiKey', 'Clé API Google Gemini')}</label>
                        <input
                            type="password"
                            id="gemini_api_key"
                            name="gemini_api_key"
                            value={settings.gemini_api_key}
                            onChange={handleInputChange}
                            placeholder="AIzaSy............................."
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary btn-save-settings" disabled={isSaving}>
                        {isSaving ? (
                            <>{t('common.saving', 'Sauvegarde...')}</>
                        ) : (
                            <>
                                <Save size={18} />
                                {t('common.saveSettings', 'Sauvegarder les paramètres')}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
