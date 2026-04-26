import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, X, Eye } from 'lucide-react';
import api from '../../api/axios';

const AdminLessons = () => {
    const { t, i18n } = useTranslation();
    const [lessons, setLessons] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLesson, setCurrentLesson] = useState({ title: '', content: '', video_url: '', course_id: '', order: 0, language: i18n.language });
    const [isEditing, setIsEditing] = useState(false);

    const getLocalizedText = (field) => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field[i18n.language] || field['fr'] || field['ar'] || field['en'] || '';
    };
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
        if (window.confirm(t('common.confirmDelete', 'Voulez-vous vraiment supprimer cet élément ?'))) {
            try {
                await api.delete(`/lessons/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting lesson', error);
            }
        }
    };

    const openEditModal = (lesson) => {
        setCurrentLesson({
            ...lesson,
            title: getLocalizedText(lesson.title),
            content: getLocalizedText(lesson.content),
            language: i18n.language
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setCurrentLesson({ title: '', content: '', video_url: '', course_id: courses.length > 0 ? courses[0].id : '', order: 0, language: i18n.language });
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
            alert(t('admin.success.generateAI', '✅ Leçons générées avec succès par l\'IA !'));
            setIsAiModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error generating AI lessons:', error);
            const errMsg = error.response?.data?.error || error.message || 'Erreur inconnue';
            alert(t('admin.error.generateAI', '❌ Erreur lors de la génération par l\'IA :\n') + errMsg);
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                <div>
                    <h2>{t('admin.management.lessons', 'Gestion des Leçons')}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>{t('admin.management.lessonsSubtitle', 'Gérez le contenu détaillé de chaque module')}.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-add" onClick={() => setIsAiModalOpen(true)} style={{ background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)', margin: 0, color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        ✨ {t('admin.generateAI', 'Générer par IA')}
                    </button>
                    <button className="btn btn-primary" onClick={openAddModal}>
                        <Plus size={20} /> {t('admin.management.newLesson', 'Nouvelle Leçon')}
                    </button>
                </div>
            </header>

            {loading ? (
                <p>{t('common.loading', 'Chargement...')}</p>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>{t('admin.history.order', 'Ordre')}</th>
                                <th>{t('admin.history.title', 'Titre de la leçon')}</th>
                                <th>{t('admin.courses', 'Cours')}</th>
                                <th>{t('admin.history.video', 'Vidéo')}</th>
                                <th style={{ textAlign: 'right' }}>{t('common.actions', 'Actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lessons.map((l) => (
                                <tr key={l.id}>
                                    <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{l.order}</td>
                                    <td style={{ fontWeight: '600' }}>
                                        {getLocalizedText(l.title)}
                                    </td>
                                    <td>{getLocalizedText(l.course?.title) || l.course_id || 'N/A'}</td>
                                    <td>
                                        {l.video_url ? (
                                            <span style={{ color: 'var(--secondary)', fontSize: '12px', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>{t('common.available', 'Disponible')}</span>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{t('common.none', 'Aucune')}</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button className="btn btn-outline" style={{ padding: '8px', borderRadius: '8px', borderColor: 'rgba(59, 130, 246, 0.2)' }} onClick={() => openViewModal(l)} title={t('common.view', 'Voir le contenu')}>
                                                <Eye size={16} color="#3b82f6" />
                                            </button>
                                            <button className="btn btn-outline" style={{ padding: '8px', borderRadius: '8px' }} onClick={() => openEditModal(l)} title={t('common.edit', 'Modifier')}>
                                                <Edit2 size={16} color="var(--primary)" />
                                            </button>
                                            <button className="btn btn-outline" style={{ padding: '8px', borderRadius: '8px', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(l.id)} title={t('common.delete', 'Supprimer')}>
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
                                <h3 style={{ margin: 0 }}>{getLocalizedText(currentLesson.title)}</h3>
                                <button onClick={() => setIsViewModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X /></button>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>{t('admin.courses', 'Cours')} :</strong> {getLocalizedText(currentLesson.course?.title) || currentLesson.course_id || 'N/A'}
                            </div>
                            {currentLesson.video_url && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <strong>{t('admin.history.videoURL', 'Lien Vidéo')} :</strong> <a href={currentLesson.video_url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>{currentLesson.video_url}</a>
                                </div>
                            )}
                            <div>
                                <strong>{t('admin.history.content', 'Contenu')} :</strong>
                                <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'var(--background)', borderRadius: '8px', whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: '1.6', color: 'var(--text)' }}>
                                    {getLocalizedText(currentLesson.content) || <em style={{ color: 'var(--text-muted)' }}>{t('admin.history.noContent', 'Aucun contenu textuel')}</em>}
                                </div>
                            </div>
                            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                                <button onClick={() => setIsViewModalOpen(false)} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>{t('common.close', 'Fermer')}</button>
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
                                <h3>{isEditing ? t('common.edit', 'Modifier') : t('common.add', 'Ajouter')} {t('admin.lesson', 'une leçon')}</h3>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X /></button>
                            </div>
                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label>{t('admin.courses', 'Cours parent')}</label>
                                    <select required value={currentLesson.course_id} onChange={e => setCurrentLesson({...currentLesson, course_id: e.target.value})}>
                                        <option value="">{t('common.select', 'Sélectionner')} {t('admin.course', 'un cours')}</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>{getLocalizedText(c.title)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>{t('admin.history.title', 'Titre de la leçon')}</label>
                                    <input type="text" required value={currentLesson.title} onChange={e => setCurrentLesson({...currentLesson, title: e.target.value})} placeholder="..." />
                                </div>
                                <div className="form-group">
                                    <label>{t('admin.history.pContent', 'Contenu pédagogique')}</label>
                                    <textarea value={currentLesson.content} onChange={e => setCurrentLesson({...currentLesson, content: e.target.value})} rows="6" placeholder="..." />
                                </div>
                                <div className="form-group">
                                    <label>{t('admin.history.videoURL', 'URL Vidéo')}</label>
                                    <input type="url" value={currentLesson.video_url} onChange={e => setCurrentLesson({...currentLesson, video_url: e.target.value})} placeholder="https://youtube.com/embed/..." />
                                </div>
                                <div className="form-group">
                                    <label>{t('admin.history.order', "Ordre d'affichage")}</label>
                                    <input type="number" value={currentLesson.order} onChange={e => setCurrentLesson({...currentLesson, order: parseInt(e.target.value)})} />
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
                                    <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>{t('common.cancel', 'Annuler')}</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                                        {t('common.save', 'Enregistrer')}
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
                                <h3>{t('admin.management.generateLessonsByAI', 'Générer des Leçons par IA')}</h3>
                                <button onClick={() => setIsAiModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X /></button>
                            </div>
                            <form onSubmit={handleGenerateAI} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('admin.management.forWhichCourse', 'Pour quel cours ?')}</label>
                                    <select required value={aiFormData.course_id} onChange={e => setAiFormData({...aiFormData, course_id: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}>
                                        <option value="">{t('common.select', 'Sélectionner')} {t('admin.course', 'un cours')}</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>{getLocalizedText(c.title)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('admin.management.lessonCount', 'Nombre de leçons')} (Max 20)</label>
                                    <input type="number" min="1" max="20" required value={aiFormData.lesson_count} onChange={e => setAiFormData({...aiFormData, lesson_count: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {t('admin.management.aiLessonNote', "L'IA générera automatiquement le titre et le contenu de chaque leçon. Les liens vidéo seront laissés vides pour que vous puissiez les ajouter manuellement plus tard.")}
                                </p>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', background: aiLoading ? '#94a3b8' : 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)', border: 'none' }} disabled={aiLoading}>
                                    {aiLoading ? t('admin.generating', '⏳ Génération en cours...') : t('admin.management.generateLessons', 'Générer les leçons')}
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
