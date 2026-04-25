import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../api/axios';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState({ title: '', description: '', duration: '', image: '', formation_id: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [coursesRes, formationsRes] = await Promise.all([
                api.get('/courses'),
                api.get('/formations')
            ]);
            setCourses(coursesRes.data);
            setFormations(formationsRes.data);
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
                await api.put(`/courses/${currentCourse.id}`, currentCourse);
            } else {
                await api.post('/courses', currentCourse);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error saving course', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce cours ?')) {
            try {
                await api.delete(`/courses/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting course', error);
            }
        }
    };

    const openEditModal = (course) => {
        setCurrentCourse(course);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setCurrentCourse({ title: '', description: '', duration: '', image: '', formation_id: formations.length > 0 ? formations[0].id : '' });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div>
                    <h2>Gestion des Cours</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Gérez les modules et cours au sein des formations.</p>
                </div>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <Plus size={20} /> Nouveau Cours
                </button>
            </header>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Titre du cours</th>
                                <th>Formation associée</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((c) => (
                                <tr key={c.id}>
                                    <td style={{ fontWeight: '600' }}>{c.title}</td>
                                    <td>{c.formation?.title || 'N/A'}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button className="btn btn-outline" style={{ padding: '8px', borderRadius: '8px' }} onClick={() => openEditModal(c)}>
                                                <Edit2 size={16} color="var(--primary)" />
                                            </button>
                                            <button className="btn btn-outline" style={{ padding: '8px', borderRadius: '8px', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(c.id)}>
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
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="modal-content" 
                            style={{ width: '500px', maxWidth: '90%' }}
                        >
                            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <h3>{isEditing ? 'Modifier' : 'Ajouter'} un cours</h3>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X /></button>
                            </div>
                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label>Formation</label>
                                    <select required value={currentCourse.formation_id} onChange={e => setCurrentCourse({...currentCourse, formation_id: e.target.value})}>
                                        <option value="">Sélectionner une formation</option>
                                        {formations.map(f => (
                                            <option key={f.id} value={f.id}>{f.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Titre du cours</label>
                                    <input type="text" required value={currentCourse.title} onChange={e => setCurrentCourse({...currentCourse, title: e.target.value})} placeholder="Ex: Introduction au Machine Learning" />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea value={currentCourse.description} onChange={e => setCurrentCourse({...currentCourse, description: e.target.value})} rows="3" placeholder="Bref aperçu du cours..." />
                                </div>
                                <div className="form-group">
                                    <label>Durée (ex: 2h 30m)</label>
                                    <input type="text" value={currentCourse.duration} onChange={e => setCurrentCourse({...currentCourse, duration: e.target.value})} placeholder="2h 15m" />
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
                                    <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Annuler</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                                        {isEditing ? 'Mettre à jour' : 'Enregistrer'}
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

export default AdminCourses;
