import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle, ChevronLeft, BookOpen, Clock, Target, Layout, Server, Database } from 'lucide-react';
import api from '../../api/axios';

const LessonView = () => {
    const { t, i18n } = useTranslation();

    const getLocalizedText = (field) => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field[i18n.language] || field['fr'] || field['ar'] || field['en'] || '';
    };
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
                    const firstLesson = lRes.data[0];
                    setActiveLesson(firstLesson);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchLessons();
    }, [courseId]);

    const renderContent = (content) => {
        if (!content) return null;

        const lines = content.split('\n');
        return lines.map((line, i) => {
            const trimmedLine = line.trim();
            if (trimmedLine === '') return <br key={i} />;

            // 1. Main Titles (###)
            if (trimmedLine.startsWith('###')) {
                return (
                    <div key={i} className="content-main-title">
                        {trimmedLine.replace('###', '').trim()}
                    </div>
                );
            }

            // 2. Section Headers (1. **Title**)
            const sectionMatch = trimmedLine.match(/^(\d+\.)\s*\*\*(.*)\*\*/);
            if (sectionMatch) {
                return (
                    <div key={i} className="content-section-header">
                        <span className="section-number">{sectionMatch[1]}</span>
                        <span className="section-text">{sectionMatch[2]}</span>
                    </div>
                );
            }

            // 3. Keyword Lists (* Keyword: description)
            const keywordMatch = trimmedLine.match(/^\*\s*\*\*(.*?)\*\*:\s*(.*)/) || trimmedLine.match(/^\*\s*(.*?):\s*(.*)/);
            if (keywordMatch) {
                return (
                    <div key={i} className="content-keyword-box">
                        <strong className="keyword-highlight">{keywordMatch[1]}</strong>
                        <span className="keyword-desc">{keywordMatch[2]}</span>
                    </div>
                );
            }

            // 4. Bullet Points (* item)
            if (trimmedLine.startsWith('*')) {
                const itemContent = trimmedLine.replace('*', '').trim();
                return (
                    <div key={i} className="content-bullet-item">
                        <div className="bullet-dot"></div>
                        <span>{itemContent.replace(/\*\*/g, '')}</span>
                    </div>
                );
            }

            // Default Paragraph with inline bolding
            const parts = trimmedLine.split('**');
            return (
                <p key={i} className="content-p">
                    {parts.map((part, index) => 
                        index % 2 === 1 ? <span key={index} className="inline-keyword">{part}</span> : part
                    )}
                </p>
            );
        });
    };

    const FullStackSchema = () => (
        <div className="visual-schema glass-card">
            <h4 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1e3a8a' }}>{t('lessons.architecture', 'Architecture Full-Stack')}</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div className="schema-box frontend">
                    <Layout size={32} />
                    <span>{t('lessons.frontend', 'Frontend')} (React)</span>
                    <p>{t('lessons.ui', 'Interface Utilisateur')}</p>
                </div>
                <div className="schema-arrow">
                    <div className="arrow-line"></div>
                    <div className="arrow-text">{t('lessons.apiRest', 'API REST')}</div>
                </div>
                <div className="schema-box backend">
                    <Server size={32} />
                    <span>{t('lessons.backend', 'Backend')} (Laravel)</span>
                    <p>{t('lessons.logic', 'Logique & API')}</p>
                </div>
                <div className="schema-arrow">
                    <div className="arrow-line"></div>
                </div>
                <div className="schema-box database">
                    <Database size={32} />
                    <span>{t('lessons.database', 'Base de Données')}</span>
                    <p>{t('lessons.storage', 'MySQL / Storage')}</p>
                </div>
            </div>
        </div>
    );

    const getEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
        if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
        return url;
    };

    if (loading) return <div className="loading-screen">{t('lessons.loading', 'Chargement de votre leçon...')}</div>;

    return (
        <div className="lesson-view-container">
            {/* Styles injectés localement pour rapidité */}
            <style>{`
                .lesson-view-container {
                    display: flex;
                    height: calc(100vh - 80px);
                    background: #f8fafc;
                }
                .lesson-sidebar {
                    width: 320px;
                    background: white;
                    border-right: 1px solid #e2e8f0;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 4px 0 10px rgba(0,0,0,0.02);
                }
                .sidebar-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #f1f5f9;
                }
                .back-link {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #64748b;
                    text-decoration: none;
                    font-size: 0.875rem;
                    margin-bottom: 1rem;
                    transition: color 0.2s;
                }
                .back-link:hover { color: #4f46e5; }
                .lesson-list {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 1rem;
                }
                .lesson-item {
                    padding: 1rem;
                    border-radius: 12px;
                    cursor: pointer;
                    margin-bottom: 0.5rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    position: relative;
                }
                .lesson-item.active {
                    background: #eff6ff;
                    color: #2563eb;
                }
                .lesson-item:hover:not(.active) {
                    background: #f1f5f9;
                }
                .lesson-number {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 600;
                    background: #f1f5f9;
                    color: #64748b;
                }
                .active .lesson-number {
                    background: #2563eb;
                    color: white;
                }
                .lesson-main-content {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 3rem;
                }
                .content-max-width {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .lesson-title-section {
                    margin-bottom: 2.5rem;
                }
                .lesson-meta {
                    display: flex;
                    gap: 1.5rem;
                    margin-top: 1rem;
                    color: #64748b;
                    font-size: 0.875rem;
                }
                .meta-item { display: flex; align-items: center; gap: 0.4rem; }
                .content-main-title {
                    font-size: 1.75rem;
                    color: #1e3a8a;
                    margin: 3rem 0 1.5rem 0;
                    font-weight: 800;
                    padding: 1rem 1.5rem;
                    background: #eff6ff;
                    border-radius: 12px;
                    border-left: 6px solid #2563eb;
                }
                .content-section-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin: 2.5rem 0 1.5rem 0;
                    padding: 1.25rem;
                    background: white;
                    border: 2px solid #e2e8f0;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                }
                .section-number {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #4f46e5;
                    background: #f1f5f9;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                }
                .section-text {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #1e293b;
                }
                .content-keyword-box {
                    margin-bottom: 1rem;
                    padding: 1rem 1.5rem;
                    background: white;
                    border-radius: 12px;
                    border: 1px solid #f1f5f9;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    transition: transform 0.2s;
                }
                .content-keyword-box:hover {
                    transform: translateX(5px);
                    border-color: #f97316;
                }
                .keyword-highlight {
                    color: #ea580c;
                    font-size: 1.1rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .keyword-desc {
                    color: #475569;
                    line-height: 1.6;
                }
                .content-bullet-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 0.5rem 0;
                    color: #334155;
                    line-height: 1.6;
                }
                .bullet-dot {
                    width: 8px;
                    height: 8px;
                    background: #6366f1;
                    border-radius: 50%;
                    margin-top: 0.6rem;
                    flex-shrink: 0;
                }
                .inline-keyword {
                    color: #4f46e5;
                    font-weight: 700;
                    background: #f1f5f9;
                    padding: 0.1rem 0.4rem;
                    border-radius: 4px;
                }
                .content-p {
                    font-size: 1.1rem;
                    line-height: 1.8;
                    color: #334155;
                    margin-bottom: 1.25rem;
                }
                .visual-schema {
                    background: white;
                    padding: 2rem;
                    border-radius: 20px;
                    margin: 3rem 0;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                }
                .schema-box {
                    flex: 1;
                    padding: 1.5rem;
                    border-radius: 12px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    color: white;
                }
                .schema-box span { font-weight: 700; font-size: 0.9rem; }
                .schema-box p { font-size: 0.7rem; margin: 0; opacity: 0.9; }
                .frontend { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); }
                .backend { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
                .database { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
                .schema-arrow {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                }
                .arrow-line {
                    width: 40px;
                    height: 2px;
                    background: #cbd5e1;
                    position: relative;
                }
                .arrow-line::after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: -4px;
                    border-left: 6px solid #cbd5e1;
                    border-top: 5px solid transparent;
                    border-bottom: 5px solid transparent;
                }
                .arrow-text { font-size: 0.65rem; color: #94a3b8; font-weight: 600; }
                .video-section {
                    margin-bottom: 3rem;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    background: black;
                }
                .complete-btn-container {
                    display: flex;
                    justify-content: center;
                    margin-top: 4rem;
                    padding-bottom: 4rem;
                }
                .loading-screen {
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.25rem;
                    color: #4f46e5;
                    font-weight: 600;
                }
            `}</style>

            <aside className="lesson-sidebar">
                <div className="sidebar-header">
                    <Link to={`/formations/${course?.formation_id}/courses`} className="back-link">
                        <ChevronLeft size={16} />
                        {t('lessons.backToCourse', 'Retour au cours')}
                    </Link>
                    <h3 style={{ fontSize: '1.25rem', color: '#1e293b' }}>{getLocalizedText(course?.title)}</h3>
                </div>
                
                <div className="lesson-list">
                    {lessons.map((l, index) => (
                        <div 
                            key={l.id} 
                            onClick={() => setActiveLesson(l)}
                            className={`lesson-item ${activeLesson?.id === l.id ? 'active' : ''}`}
                        >
                            <div className="lesson-number">{index + 1}</div>
                            <span style={{ fontSize: '0.925rem', fontWeight: activeLesson?.id === l.id ? '600' : '500' }}>
                                {getLocalizedText(l.title)}
                            </span>
                        </div>
                    ))}
                </div>
            </aside>

            <main className="lesson-main-content">
                <div className="content-max-width">
                    <AnimatePresence mode="wait">
                        {activeLesson && (
                            <motion.div 
                                key={activeLesson.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="lesson-title-section">
                                    <h1 style={{ fontSize: '2.5rem', color: '#0f172a', letterSpacing: '-0.025em' }}>
                                        {getLocalizedText(activeLesson.title)}
                                    </h1>
                                    <div className="lesson-meta">
                                        <div className="meta-item"><BookOpen size={16} /> {t('lessons.module', 'Module')} 1</div>
                                        <div className="meta-item"><Clock size={16} /> 15 {t('lessons.min', 'min')}</div>
                                        <div className="meta-item"><Target size={16} /> {t('lessons.objectives', 'Objectifs')}</div>
                                    </div>
                                </div>

                                {activeLesson.video_url && (
                                    <div className="video-section">
                                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                                            <iframe 
                                                src={getEmbedUrl(activeLesson.video_url)} 
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                allowFullScreen
                                                title={t('lessons.videoTitle', 'Lesson Video')}
                                            ></iframe>
                                        </div>
                                    </div>
                                )}

                                {/* Injection du schéma pour la première leçon ou si spécifique */}
                                {activeLesson.id === 1 && <FullStackSchema />}

                                <div className="lesson-body-content">
                                    {renderContent(getLocalizedText(activeLesson.content))}
                                </div>

                                <div className="complete-btn-container">
                                    <button 
                                        onClick={async () => {
                                            try {
                                                await api.post(`/lessons/${activeLesson.id}/complete`);
                                                alert(t('lessons.completedSuccess', 'Félicitations ! Leçon terminée.'));
                                            } catch (err) {
                                                console.error(err);
                                            }
                                        }}
                                        className="btn btn-primary"
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '0.75rem', 
                                            padding: '1.25rem 3rem',
                                            borderRadius: '50px',
                                            fontSize: '1.1rem',
                                            boxShadow: '0 10px 20px rgba(79, 70, 229, 0.2)'
                                        }}
                                    >
                                        <CheckCircle size={22} />
                                        {t('lessons.markCompleted', 'Marquer comme terminée')}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default LessonView;
