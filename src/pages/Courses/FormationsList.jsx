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
        api.get('/formations')
            .then(res => {
                setFormations(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
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
                        <p style={{ flexGrow: 1, color: '#666', marginBottom: '1.5rem' }}>{f.description || 'Aucune description.'}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Link to={`/formations/${f.id}/courses`} className="btn btn-primary btn-sm">Voir les cours</Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FormationsList;
