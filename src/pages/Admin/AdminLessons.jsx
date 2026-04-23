import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
        <div className="admin-container" style={{ padding: '2rem' }}>
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2>Gestion des Leçons</h2>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <Plus size={20} /> Nouvelle Leçon
                </button>
            </div>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <div className="table-container glass-card" style={{ padding: '1rem', borderRadius: '12px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '1rem' }}>Ordre</th>
                                <th style={{ padding: '1rem' }}>Titre</th>
                                <th style={{ padding: '1rem' }}>Cours</th>
                                <th style={{ padding: '1rem' }}>Vidéo</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lessons.map((l) => (
                                <tr key={l.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem' }}>{l.order}</td>
                                    <td style={{ padding: '1rem' }}>{l.title}</td>
                                    <td style={{ padding: '1rem' }}>{l.course?.title || 'N/A'}</td>
                                    <td style={{ padding: '1rem' }}>{l.video_url ? 'Oui' : 'Non'}</td>
                                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn-icon" onClick={() => openEditModal(l)} style={{ color: '#4CAF50', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="btn-icon" onClick={() => handleDelete(l.id)} style={{ color: '#F44336', background: 'none', border: 'none', cursor: 'pointer' }}>
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
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-content glass-card" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3>{isEditing ? 'Modifier' : 'Ajouter'} une leçon</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                        </div>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Cours</label>
                                <select required value={currentLesson.course_id} onChange={e => setCurrentLesson({...currentLesson, course_id: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}>
                                    <option value="">Sélectionner un cours</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Titre</label>
                                <input type="text" required value={currentLesson.title} onChange={e => setCurrentLesson({...currentLesson, title: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Contenu (Texte / Markdown)</label>
                                <textarea value={currentLesson.content} onChange={e => setCurrentLesson({...currentLesson, content: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', minHeight: '150px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Lien Vidéo (YouTube/Vimeo embed ou mp4)</label>
                                <input type="url" value={currentLesson.video_url} onChange={e => setCurrentLesson({...currentLesson, video_url: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }} placeholder="https://..." />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Ordre d'affichage</label>
                                <input type="number" value={currentLesson.order} onChange={e => setCurrentLesson({...currentLesson, order: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }} />
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

export default AdminLessons;
