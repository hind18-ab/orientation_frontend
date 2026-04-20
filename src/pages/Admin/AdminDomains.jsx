import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import './AdminDomains.css';

const AdminDomains = () => {
    const [domains, setDomains] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDomain, setCurrentDomain] = useState({ name: '', description: '', icon: '' });
    const [isEditing, setIsEditing] = useState(false);

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
            setCurrentDomain({ name: '', description: '', icon: '' });
        } catch (error) {
            console.error('Error saving domain', error);
        }
    };

    const handleEdit = (domain) => {
        setCurrentDomain(domain);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce domaine ?')) {
            await api.delete(`/domains/${id}`);
            fetchDomains();
        }
    };

    return (
        <div className="admin-domains">
            <header className="admin-header">
                <div>
                    <h1>Gestion des Domaines</h1>
                    <p>Définissez les catégories d'orientation.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setIsEditing(false); setIsModalOpen(true); }}>
                    <Plus size={20} /> Ajouter un Domaine
                </button>
            </header>

            <div className="domains-list grid">
                {domains.map(domain => (
                    <div key={domain.id} className="domain-card card">
                        <div className="domain-info">
                            <BookOpen size={24} className="icon" />
                            <h3>{domain.name}</h3>
                        </div>
                        <p>{domain.description}</p>
                        <div className="card-actions">
                            <button className="btn btn-outline btn-sm" onClick={() => handleEdit(domain)}>
                                <Edit2 size={16} /> Modifier
                            </button>
                            <button className="btn btn-outline btn-sm btn-danger" onClick={() => handleDelete(domain.id)}>
                                <Trash2 size={16} /> Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal card">
                        <h2>{isEditing ? 'Modifier le domaine' : 'Ajouter un domaine'}</h2>
                        <form onSubmit={handleSave}>
                            <div className="input-group">
                                <label>Nom du domaine</label>
                                    <input 
                                        type="text" 
                                        value={currentDomain.name} 
                                        onChange={(e) => setCurrentDomain({...currentDomain, name: e.target.value})} 
                                        placeholder="ex: Technologies de l'information"
                                        required 
                                    />
                            </div>
                            <div className="input-group">
                                <label>Description</label>
                                <textarea 
                                    value={currentDomain.description} 
                                    onChange={(e) => setCurrentDomain({...currentDomain, description: e.target.value})} 
                                    rows="4"
                                ></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Annuler</button>
                                <button type="submit" className="btn btn-primary">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDomains;
