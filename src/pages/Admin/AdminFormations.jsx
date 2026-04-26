import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../api/axios';

const AdminFormations = () => {
    const { t, i18n } = useTranslation();
    const [formations, setFormations] = useState([]);
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFormation, setCurrentFormation] = useState({ title: '', description: '', image: '', domain_id: '', language: i18n.language });
    const [isEditing, setIsEditing] = useState(false);

    const getLocalizedText = (field) => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field[i18n.language] || field['fr'] || field['ar'] || field['en'] || '';
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [formationsRes, domainsRes] = await Promise.all([
                api.get('/formations'),
                api.get('/domains')
            ]);
            setFormations(formationsRes.data);
            setDomains(domainsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data', error);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/formations/${currentFormation.id}`, currentFormation);
            } else {
                await api.post('/formations', currentFormation);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error saving formation', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('common.confirmDelete', 'Voulez-vous vraiment supprimer cet élément ?'))) {
            try {
                await api.delete(`/formations/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting formation', error);
            }
        }
    };

    const openEditModal = (formation) => {
        setCurrentFormation({
            ...formation,
            title: getLocalizedText(formation.title),
            description: getLocalizedText(formation.description),
            language: i18n.language
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setCurrentFormation({ title: '', description: '', image: '', domain_id: domains.length > 0 ? domains[0].id : '', language: i18n.language });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div>
                    <h2>{t('admin.management.formations', 'Gestion des Formations')}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>{t('admin.management.formationsSubtitle', 'Gérez les programmes de formation par domaine')}.</p>
                </div>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <Plus size={20} /> {t('admin.management.newFormation', 'Nouvelle Formation')}
                </button>
            </header>

            {loading ? (
                <p>{t('common.loading', 'Chargement...')}</p>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>{t('admin.domains', 'Domaine')}</th>
                                <th>{t('admin.history.title', 'Titre')}</th>
                                <th style={{ textAlign: 'right' }}>{t('common.actions', 'Actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formations.map((f) => (
                                <tr key={f.id}>
                                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{getLocalizedText(f.domain?.name) || 'N/A'}</td>
                                    <td>
                                        {getLocalizedText(f.title)}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button className="btn btn-outline" style={{ padding: '8px', borderRadius: '8px' }} onClick={() => openEditModal(f)}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="btn btn-outline" style={{ padding: '8px', borderRadius: '8px', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(f.id)}>
                                                <Trash2 size={16} color="var(--error)" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <div className="modal-overlay">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="modal-content" 
                            style={{ width: '550px', maxWidth: '90%' }}
                        >
                            <div className="modal-header">
                                <h3>{isEditing ? t('common.edit', 'Modifier') : t('common.add', 'Ajouter')} {t('admin.formations', 'Formation')}</h3>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X /></button>
                            </div>
                            
                            <form onSubmit={handleSave}>
                                <div className="modal-body">
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label>{t('admin.domains', 'Domaine')}</label>
                                        <select required value={currentFormation.domain_id} onChange={e => setCurrentFormation({...currentFormation, domain_id: e.target.value})}>
                                            <option value="">{t('common.select', 'Sélectionner')} {t('admin.domains', 'un domaine')}</option>
                                            {domains.map(d => (
                                                <option key={d.id} value={d.id}>{getLocalizedText(d.name)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label>{t('admin.history.title', 'Titre')}</label>
                                        <input type="text" required value={currentFormation.title} onChange={e => setCurrentFormation({...currentFormation, title: e.target.value})} placeholder="Ex: Master en Intelligence Artificielle" />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                         <label>{t('common.description', 'Description')}</label>
                                         <textarea value={currentFormation.description} onChange={e => setCurrentFormation({...currentFormation, description: e.target.value})} rows="4" placeholder="..." />
                                     </div>
                                     
                                </div>
                                
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>{t('common.cancel', 'Annuler')}</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                                        {t('common.save', 'Enregistrer')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminFormations;
