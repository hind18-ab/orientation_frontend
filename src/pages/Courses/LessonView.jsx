import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, CheckCircle } from 'lucide-react';
import api from '../../api/axios';

const LessonView = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [activeLesson, setActiveLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const cRes = await api.get(`/courses/${courseId}`);
                setCourse(cRes.data);
                
                const lRes = await api.get(`/courses/${courseId}/lessons`);
                setLessons(lRes.data);
                
                if (lRes.data.length > 0) {
                    setActiveLesson(lRes.data[0]);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchLessons();
    }, [courseId]);

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Chargement...</div>;

    const getEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('watch?v=', 'embed/');
        }
        if (url.includes('youtu.be/')) {
            return url.replace('youtu.be/', 'youtube.com/embed/');
        }
        return url;
    };

    return (
        <div className="lesson-layout" style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
            {/* Sidebar with lessons list */}
            <div className="lesson-sidebar glass-card" style={{ width: '300px', borderRight: '1px solid #eee', padding: '1rem', overflowY: 'auto' }}>
                <Link to={`/formations/${course?.formation_id}/courses`} style={{ color: '#666', textDecoration: 'none', display: 'block', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    &larr; Retour au cours
                </Link>
                <h3 style={{ marginBottom: '1.5rem' }}>{course?.title}</h3>
                
                <div className="lesson-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {lessons.length === 0 && <p style={{ color: '#888', fontSize: '0.9rem' }}>Aucune leçon disponible.</p>}
                    {lessons.map((l, index) => (
                        <div 
                            key={l.id} 
                            onClick={() => setActiveLesson(l)}
                            style={{ 
                                padding: '1rem', 
                                borderRadius: '8px', 
                                cursor: 'pointer',
                                background: activeLesson?.id === l.id ? '#e0e7ff' : 'transparent',
                                border: '1px solid',
                                borderColor: activeLesson?.id === l.id ? '#c7d2fe' : 'transparent',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}
                        >
                            <div style={{ background: activeLesson?.id === l.id ? '#4f46e5' : '#e5e7eb', color: activeLesson?.id === l.id ? 'white' : '#6b7280', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem' }}>
                                {index + 1}
                            </div>
                            <span style={{ fontWeight: activeLesson?.id === l.id ? '600' : '400', fontSize: '0.95rem' }}>{l.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main content area */}
            <div className="lesson-content" style={{ flexGrow: 1, padding: '2rem 4rem', overflowY: 'auto', background: '#fcfcfc' }}>
                {activeLesson ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={activeLesson.id}>
                        <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>{activeLesson.title}</h1>
                        
                        {activeLesson.video_url && (
                            <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                                <iframe 
                                    src={getEmbedUrl(activeLesson.video_url)} 
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                    title="Lesson Video"
                                ></iframe>
                            </div>
                        )}

                        {activeLesson.content && (
                            <div className="content-box glass-card" style={{ padding: '2rem', borderRadius: '12px', lineHeight: '1.7', color: '#333', fontSize: '1.05rem', whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>
                                {activeLesson.content}
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                            <button 
                                onClick={async () => {
                                    try {
                                        await api.post(`/lessons/${activeLesson.id}/complete`);
                                        alert('Félicitations ! Leçon terminée.');
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}
                                className="btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem' }}
                            >
                                <CheckCircle size={20} />
                                Marquer comme terminée
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#888' }}>
                        Sélectionnez une leçon pour commencer.
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonView;
