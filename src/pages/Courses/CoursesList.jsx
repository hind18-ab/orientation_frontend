import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const CoursesList = () => {
    const { id } = useParams();
    const [courses, setCourses] = useState([]);
    const [formation, setFormation] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t, i18n } = useTranslation();

    const getLocalizedText = (field) => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field[i18n.language] || field['fr'] || field['ar'] || field['en'] || '';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fRes = await api.get(`/formations/${id}`);
                setFormation(fRes.data);
                
                const cRes = await api.get(`/formations/${id}/courses`);
                setCourses(cRes.data);
                
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="container" style={{ padding: '2rem' }}>{t('courses.loading', 'Chargement...')}</div>;

    return (
        <div className="container courses-page" style={{ padding: '4rem 1rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-header">
                <Link to="/formations" style={{ color: '#666', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
                    &larr; {t('courses.backToFormations', 'Retour aux formations')}
                </Link>
                <h1 className="section-title">{t('courses.title', 'Cours')}: {getLocalizedText(formation?.title)}</h1>
                <p>{getLocalizedText(formation?.description)}</p>
            </motion.div>

            <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginTop: '2rem' }}>
                {courses.length === 0 ? (
                    <p>{t('courses.noCourses', 'Aucun cours disponible pour le moment.')}</p>
                ) : (
                    courses.map((c, i) => (
                        <motion.div 
                            key={c.id} 
                            initial={{ opacity: 0, x: -20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ delay: i * 0.1 }}
                            className="course-card glass-card"
                            style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <div>
                                <h3>{getLocalizedText(c.title)}</h3>
                                <p style={{ color: '#666', margin: '0.5rem 0' }}>{getLocalizedText(c.description)}</p>
                            </div>
                            <Link to={`/courses/${c.id}/lessons`} className="btn btn-outline">
                                <PlayCircle size={18} style={{ marginRight: '0.5rem' }} /> {t('courses.start', 'Commencer')}
                            </Link>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CoursesList;
