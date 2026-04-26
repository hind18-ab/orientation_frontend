import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import './AdminDomains.css';

const AdminDomains = () => {
    const { t, i18n } = useTranslation();
    const [domains, setDomains] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDomain, setCurrentDomain] = useState({ name: '', description: '', icon: '', language: i18n.language });
    const [isEditing, setIsEditing] = useState(false);

    const getLocalizedText = (field) => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field[i18n.language] || field['fr'] || field['ar'] || field['en'] || '';
    };

    useEffect(() => {
        fetchDomains();
    }, []);

    const fetchDomains = async () => {
        const response = await api.get('/domains');
        setDomains(response.data);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/domains/${currentDomain.id}`, currentDomain);
            } else {
                await api.post('/domains', currentDomain);
            }
            setIsModalOpen(false);
            fetchDomains();
            setCurrentDomain({ name: '', description: '', icon: '', language: i18n.language });
        } catch (error) {
            console.error('Error saving domain', error);
        }
    };

    const handleEdit = (domain) => {
        setCurrentDomain({
            ...domain,
            name: getLocalizedText(domain.name),
            description: getLocalizedText(domain.description),
            language: i18n.language
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('common.confirmDelete', 'Êtes-vous sûr de vouloir supprimer cet élément ?'))) {
            await api.delete(`/domains/${id}`);
            fetchDomains();
        }
    };

    return (
        <div className="admin-domains">
            <header className="admin-header">
                <div>
                    <h1>{t('admin.management.domains', 'Gestion des Domaines')}</h1>
                    <p>{t('admin.management.domainsSubtitle', "Définissez les catégories d'orientation")}.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setIsEditing(false); setCurrentDomain({ name: '', description: '', icon: '', language: i18n.language }); setIsModalOpen(true); }}>
                    <Plus size={20} /> {t('admin.management.addDomain', 'Ajouter un Domaine')}
                </button>
            </header>

            <div className="domains-list grid">
                {domains.map(domain => (
                    <div key={domain.id} className="domain-card card">
                        <div className="domain-info">
                            <BookOpen size={24} className="icon" />
                            <h3>{getLocalizedText(domain.name)}</h3>
                        </div>
                        <p>{getLocalizedText(domain.description)}</p>
                        <div className="card-actions">
                            <button className="btn btn-outline btn-sm" onClick={() => handleEdit(domain)}>
                                <Edit2 size={16} /> {t('common.edit', 'Modifier')}
                            </button>
                            <button className="btn btn-outline btn-sm btn-danger" onClick={() => handleDelete(domain.id)}>
                                <Trash2 size={16} /> {t('common.delete', 'Supprimer')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal card">
                        <h2>{isEditing ? t('common.edit', 'Modifier') : t('common.add', 'Ajouter')}</h2>
                        <form onSubmit={handleSave}>
                            <div className="input-group">
                                <label>{t('admin.domains', 'Domaine')}</label>
                                    <input 
                                        type="text" 
                                        value={currentDomain.name} 
                                        onChange={(e) => setCurrentDomain({...currentDomain, name: e.target.value})} 
                                        placeholder={t('admin.domains', 'Domaine')}
                                        required 
                                    />
                            </div>
                            <div className="input-group">
                                <label>{t('common.description', 'Description')}</label>
                                <textarea 
                                    value={currentDomain.description} 
                                    onChange={(e) => setCurrentDomain({...currentDomain, description: e.target.value})} 
                                    rows="4"
                                ></textarea>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>{t('common.cancel', 'Annuler')}</button>
                                <button type="submit" className="btn btn-primary">{t('common.save', 'Enregistrer')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDomains;
