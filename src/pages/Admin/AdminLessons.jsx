import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Eye } from 'lucide-react';
import api from '../../api/axios';

const AdminLessons = () => {
    const [lessons, setLessons] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLesson, setCurrentLesson] = useState({ title: '', content: '', video_url: '', course_id: '', order: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiFormData, setAiFormData] = useState({ course_id: '', lesson_count: 3 });
    const [aiLoading, setAiLoading] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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

    const openViewModal = (lesson) => {
        setCurrentLesson(lesson);
        setIsViewModalOpen(true);
    };

    const handleGenerateAI = async (e) => {
        e.preventDefault();
        setAiLoading(true);
        try {
            await api.post('/admin/lessons/generate-ai', aiFormData);
            alert('✅ Leçons générées avec succès par l\'IA !');
            setIsAiModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error generating AI lessons:', error);
            const errMsg = error.response?.data?.error || error.message || 'Erreur inconnue';
            alert('❌ Erreur lors de la génération par l\'IA :\n' + errMsg);
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                <div>
                    <h2>Gestion des Leçons</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Gérez le contenu détaillé de chaque module.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-add" onClick={() => setIsAiModalOpen(true)} style={{ background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)', margin: 0, color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        ✨ Générer par IA
                    </button>
                    <button className="btn btn-primary" onClick={openAddModal}>
                        <Plus size={20} /> Nouvelle Leçon
                    </button>
                </div>
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
                                            <button className="btn btn-outline" style={{ padding: '8px', borderRadius: '8px', borderColor: 'rgba(59, 130, 246, 0.2)' }} onClick={() => openViewModal(l)} title="Voir le contenu">
                                                <Eye size={16} color="#3b82f6" />
                                            </button>
                                            <button className="btn btn-outline" style={{ padding: '8px', borderRadius: '8px' }} onClick={() => openEditModal(l)} title="Modifier">
                                                <Edit2 size={16} color="var(--primary)" />
                                            </button>
                                            <button className="btn btn-outline" style={{ padding: '8px', borderRadius: '8px', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(l.id)} title="Supprimer">
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
                {isViewModalOpen && (
                    <div className="modal-overlay">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="modal-content glass-card" style={{ width: '800px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                                <h3 style={{ margin: 0 }}>{currentLesson.title}</h3>
                                <button onClick={() => setIsViewModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X /></button>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Cours :</strong> {currentLesson.course?.title || 'N/A'}
                            </div>
                            {currentLesson.video_url && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <strong>Lien Vidéo :</strong> <a href={currentLesson.video_url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>{currentLesson.video_url}</a>
                                </div>
                            )}
                            <div>
                                <strong>Contenu :</strong>
                                <div style={{ marginTop: '1rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: '1.6' }}>
                                    {currentLesson.content || <em style={{ color: '#94a3b8' }}>Aucun contenu textuel</em>}
                                </div>
                            </div>
                            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                                <button onClick={() => setIsViewModalOpen(false)} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Fermer</button>
                            </div>
                        </motion.div>
                    </div>
                )}

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

                {isAiModalOpen && (
                    <div className="modal-overlay">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="modal-content glass-card" style={{ width: '500px', maxWidth: '90%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3>Générer des Leçons par IA</h3>
                                <button onClick={() => setIsAiModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X /></button>
                            </div>
                            <form onSubmit={handleGenerateAI} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Pour quel cours ?</label>
                                    <select required value={aiFormData.course_id} onChange={e => setAiFormData({...aiFormData, course_id: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}>
                                        <option value="">Sélectionner un cours</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre de leçons (Max 20)</label>
                                    <input type="number" min="1" max="20" required value={aiFormData.lesson_count} onChange={e => setAiFormData({...aiFormData, lesson_count: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                                    L'IA générera automatiquement le titre et le contenu de chaque leçon. Les liens vidéo seront laissés vides pour que vous puissiez les ajouter manuellement plus tard.
                                </p>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', background: aiLoading ? '#94a3b8' : 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)', border: 'none' }} disabled={aiLoading}>
                                    {aiLoading ? '⏳ Génération en cours...' : 'Générer les leçons'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminLessons;
