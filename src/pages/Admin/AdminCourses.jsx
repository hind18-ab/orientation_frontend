import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
        <div className="admin-container" style={{ padding: '2rem' }}>
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2>Gestion des Cours</h2>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <Plus size={20} /> Nouveau Cours
                </button>
            </div>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <div className="table-container glass-card" style={{ padding: '1rem', borderRadius: '12px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '1rem' }}>Titre</th>
                                <th style={{ padding: '1rem' }}>Formation</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((c) => (
                                <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem' }}>{c.title}</td>
                                    <td style={{ padding: '1rem' }}>{c.formation?.title || 'N/A'}</td>
                                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn-icon" onClick={() => openEditModal(c)} style={{ color: '#4CAF50', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="btn-icon" onClick={() => handleDelete(c.id)} style={{ color: '#F44336', background: 'none', border: 'none', cursor: 'pointer' }}>
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
                            <h3>{isEditing ? 'Modifier' : 'Ajouter'} un cours</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                        </div>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Formation</label>
                                <select required value={currentCourse.formation_id} onChange={e => setCurrentCourse({...currentCourse, formation_id: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}>
                                    <option value="">Sélectionner une formation</option>
                                    {formations.map(f => (
                                        <option key={f.id} value={f.id}>{f.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Titre</label>
                                <input type="text" required value={currentCourse.title} onChange={e => setCurrentCourse({...currentCourse, title: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                                <textarea value={currentCourse.description} onChange={e => setCurrentCourse({...currentCourse, description: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }} rows="3" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Durée (ex: 2h 30m)</label>
                                <input type="text" value={currentCourse.duration} onChange={e => setCurrentCourse({...currentCourse, duration: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }} />
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

export default AdminCourses;
