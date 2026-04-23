import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../api/axios';

const AdminFormations = () => {
    const [formations, setFormations] = useState([]);
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFormation, setCurrentFormation] = useState({ title: '', description: '', image: '', domain_id: '' });
    const [isEditing, setIsEditing] = useState(false);

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
        if (window.confirm('Voulez-vous vraiment supprimer cette formation ?')) {
            try {
                await api.delete(`/formations/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting formation', error);
            }
        }
    };

    const openEditModal = (formation) => {
        setCurrentFormation(formation);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setCurrentFormation({ title: '', description: '', image: '', domain_id: domains.length > 0 ? domains[0].id : '' });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    return (
        <div className="admin-container" style={{ padding: '2rem' }}>
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2>Gestion des Formations</h2>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <Plus size={20} /> Nouvelle Formation
                </button>
            </div>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <div className="table-container glass-card" style={{ padding: '1rem', borderRadius: '12px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '1rem' }}>Domaine</th>
                                <th style={{ padding: '1rem' }}>Titre</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formations.map((f) => (
                                <tr key={f.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem' }}>{f.domain?.name || 'N/A'}</td>
                                    <td style={{ padding: '1rem' }}>{f.title}</td>
                                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn-icon" onClick={() => openEditModal(f)} style={{ color: '#4CAF50', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="btn-icon" onClick={() => handleDelete(f.id)} style={{ color: '#F44336', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-content glass-card" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '500px', maxWidth: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3>{isEditing ? 'Modifier' : 'Ajouter'} une formation</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                        </div>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Domaine</label>
                                <select required value={currentFormation.domain_id} onChange={e => setCurrentFormation({...currentFormation, domain_id: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}>
                                    <option value="">Sélectionner un domaine</option>
                                    {domains.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Titre</label>
                                <input type="text" required value={currentFormation.title} onChange={e => setCurrentFormation({...currentFormation, title: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                                <textarea value={currentFormation.description} onChange={e => setCurrentFormation({...currentFormation, description: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }} rows="3" />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                {isEditing ? 'Mettre à jour' : 'Enregistrer'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminFormations;
