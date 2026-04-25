import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import api from '../../api/axios';
import './Courses.css';

const FormationsList = () => {
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/formations');
                const formationsData = res.data;
                
                // Fetch progress for each formation
                const formationsWithProgress = await Promise.all(formationsData.map(async (f) => {
                    try {
                        const pRes = await api.get(`/formations/${f.id}/progress`);
                        return { ...f, progress: pRes.data.percentage };
                    } catch (e) {
                        return { ...f, progress: 0 };
                    }
                }));
                
                setFormations(formationsWithProgress);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Chargement...</div>;

    return (
        <div className="container formations-page" style={{ padding: '4rem 1rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-header">
                <h1 className="section-title">Nos Formations</h1>
                <p>Découvrez nos programmes pour construire votre avenir.</p>
            </motion.div>

            <div className="formations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                {formations.map((f, i) => (
                    <motion.div 
                        key={f.id} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: i * 0.1 }}
                        className="formation-card glass-card"
                        style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}
                    >
                        <div className="icon-box blue" style={{ marginBottom: '1rem' }}>
                            <BookOpen size={24} />
                        </div>
                        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#6366f1', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            {f.domain?.name || 'Général'}
                        </span>
                        <h3>{f.title}</h3>
                        <p style={{ flexGrow: 1, color: '#666', marginBottom: '1rem' }}>{f.description || 'Aucune description.'}</p>
                        
                        {/* Progress Bar */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginBottom: '0.4rem' }}>
                                <span>Progression</span>
                                <span>{f.progress || 0}%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${f.progress || 0}%` }}
                                    style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: 'auto', flexWrap: 'wrap' }}>
                            <Link to={`/formations/${f.id}/courses`} className="btn btn-primary btn-sm">Voir les cours</Link>
                            <Link to={`/formations/${f.id}/quiz`} className="btn btn-outline btn-sm" style={{ padding: '0.5rem 1rem', border: '1px solid #6366f1', borderRadius: '4px', color: '#6366f1', textDecoration: 'none', fontSize: '0.875rem' }}>Passer le Quiz</Link>
                            
                            {f.progress === 100 && (
                                <button 
                                    onClick={async () => {
                                        try {
                                            const res = await api.post(`/formations/${f.id}/certificate/generate`);
                                            const certId = res.data.certificate.id;
                                            window.open(`http://localhost:8000/api/certificates/${certId}/download`, '_blank');
                                        } catch (err) {
                                            alert(err.response?.data?.message || 'Erreur lors de la génération du certificat.');
                                        }
                                    }}
                                    className="btn btn-success btn-sm"
                                    style={{ padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                                >
                                    Certificat
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FormationsList;
