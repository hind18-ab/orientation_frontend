import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../api/axios';

const AdminLessons = () => {
    const [lessons, setLessons] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLesson, setCurrentLesson] = useState({ title: '', content: '', video_url: '', course_id: '', order: 0 });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [lessonsRes, coursesRes] = await Promise.all([
                api.get('/lessons'),
                api.get('/courses')
            ]);
            setLessons(lessonsRes.data);
            setCourses(coursesRes.data);
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
                await api.put(`/lessons/${currentLesson.id}`, currentLesson);
            } else {
                await api.post('/lessons', currentLesson);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error saving lesson', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette leçon ?')) {
            try {
                await api.delete(`/lessons/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting lesson', error);
            }
        }
    };

    const openEditModal = (lesson) => {
        setCurrentLesson(lesson);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setCurrentLesson({ title: '', content: '', video_url: '', course_id: courses.length > 0 ? courses[0].id : '', order: 0 });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div>
                    <h2>Gestion des Leçons</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Gérez le contenu détaillé de chaque module.</p>
                </div>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <Plus size={20} /> Nouvelle Leçon
                </button>
            </header>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>Ordre</th>
                                <th>Titre de la leçon</th>
                                <th>Cours</th>
                                <th>Vidéo</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lessons.map((l) => (
                                <tr key={l.id}>
                                    <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{l.order}</td>
                                    <td style={{ fontWeight: '600' }}>{l.title}</td>
                                    <td>{l.course?.title || 'N/A'}</td>
                                    <td>
                                        {l.video_url ? (
                                            <span style={{ color: 'var(--secondary)', fontSize: '12px', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>Disponible</span>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Aucune</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button className="btn btn-outline" style={{ padding: '8px', borderRadius: '8px' }} onClick={() => openEditModal(l)}>
                                                <Edit2 size={16} color="var(--primary)" />
                                            </button>
                                            <button className="btn btn-outline" style={{ padding: '8px', borderRadius: '8px', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(l.id)}>
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
                            style={{ width: '600px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <h3>{isEditing ? 'Modifier' : 'Ajouter'} une leçon</h3>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X /></button>
                            </div>
                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label>Cours parent</label>
                                    <select required value={currentLesson.course_id} onChange={e => setCurrentLesson({...currentLesson, course_id: e.target.value})}>
                                        <option value="">Sélectionner un cours</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Titre de la leçon</label>
                                    <input type="text" required value={currentLesson.title} onChange={e => setCurrentLesson({...currentLesson, title: e.target.value})} placeholder="Ex: Les bases du Neural Network" />
                                </div>
                                <div className="form-group">
                                    <label>Contenu pédagogique</label>
                                    <textarea value={currentLesson.content} onChange={e => setCurrentLesson({...currentLesson, content: e.target.value})} rows="6" placeholder="Rédigez le contenu de la leçon ici..." />
                                </div>
                                <div className="form-group">
                                    <label>URL Vidéo</label>
                                    <input type="url" value={currentLesson.video_url} onChange={e => setCurrentLesson({...currentLesson, video_url: e.target.value})} placeholder="https://youtube.com/embed/..." />
                                </div>
                                <div className="form-group">
                                    <label>Ordre d'affichage</label>
                                    <input type="number" value={currentLesson.order} onChange={e => setCurrentLesson({...currentLesson, order: parseInt(e.target.value)})} />
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

export default AdminLessons;
