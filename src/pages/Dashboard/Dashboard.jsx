import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
    ArrowRight,
    Award,
    Star,
    LayoutGrid,
    User as UserIcon,
    Calendar,
    LogOut
} from 'lucide-react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    ArcElement,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { t, i18n } = useTranslation();
    const [results, setResults] = useState([]);
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);

    const getLocalizedText = (field) => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field[i18n.language] || field['fr'] || field['ar'] || field['en'] || '';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resResponse, formResponse] = await Promise.all([
                    api.get('/orientation/results'),
                    api.get('/formations')
                ]);
                
                setResults(resResponse.data);
                
                const formationsWithProgress = await Promise.all(formResponse.data.map(async (f) => {
                    try {
                        const pRes = await api.get(`/formations/${f.id}/progress`);
                        return { ...f, progress: pRes.data.percentage };
                    } catch (e) {
                        return { ...f, progress: 0 };
                    }
                }));
                setFormations(formationsWithProgress);
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Prepare chart data if results exist
    const latestResult = results.length > 0 ? results[0] : null;
    const chartData = latestResult && latestResult.scores ? {
        labels: Object.keys(latestResult.scores).map(key => key.split(' ')[0]), // Short names
        datasets: [{
            label: 'Affinité',
            data: Object.values(latestResult.scores),
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderColor: '#4f46e5',
            borderWidth: 2,
            pointBackgroundColor: '#4f46e5',
        }]
    } : null;

    return (
        <div className="dashboard-wrapper">
            <div className="container">
                <motion.header 
                    className="dashboard-header"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="welcome-box">
                        <div className="avatar-circle">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <h1>{t('dashboard.welcome', 'Heureux de vous revoir')}, <span className="gradient-text">{user.name}</span></h1>
                            <p>{t('dashboard.subtitle', 'Votre futur se dessine ici. Prêt pour la suite ?')}</p>
                        </div>
                    </div>
                </motion.header>

                <div className="dashboard-grid">
                    <motion.div 
                        className="main-content"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="stats-grid">
                            <motion.div className="stat-card" variants={itemVariants}>
                                <div className="stat-icon">
                                    <Star size={28} />
                                </div>
                                <div className="stat-info">
                                    <h3>{t('dashboard.primaryProfile', 'Profil Dominant')}</h3>
                                    <div className="stat-value">
                                        {latestResult ? getLocalizedText(latestResult.primary_domain.name) : t('common.pending', 'En attente')}
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div className="stat-card" variants={itemVariants}>
                                <div className="stat-icon success">
                                    <LayoutGrid size={28} />
                                </div>
                                <div className="stat-info">
                                    <h3>{t('dashboard.exploredPaths', 'Parcours explorés')}</h3>
                                    <div className="stat-value">{results.length} {t('dashboard.tests', 'Tests')}</div>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div className="quick-test-card" variants={itemVariants} whileHover={{ scale: 1.02 }}>
                            <div className="quick-test-content">
                                <h2>{t('dashboard.newStartTitle', 'Nouveau départ ?')}</h2>
                                <p>{t('dashboard.newStartDesc', 'Repassez le test pour affiner votre profil d\'orientation.')}</p>
                            </div>
                            <Link to="/test" className="btn btn-primary">
                                {t('dashboard.start', 'Commencer')} <ArrowRight size={20} />
                            </Link>
                        </motion.div>

                        <div className="activity-section" style={{ marginBottom: '40px' }}>
                            <div className="section-header-row">
                                <h2>{t('dashboard.myProgress', 'Ma Progression E-learning')}</h2>
                            </div>
                            {loading ? (
                                <div className="loading-state">{t('common.loading', 'Chargement...')}</div>
                            ) : formations.length > 0 ? (
                                <div className="formations-progress-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '16px' }}>
                                    {formations.filter(f => f.progress > 0).map(f => (
                                        <div key={f.id} className="glass-card" style={{ padding: '20px' }}>
                                            <h4 style={{ margin: '0 0 12px 0' }}>{getLocalizedText(f.title)}</h4>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                                                <span>{t('dashboard.completed', 'Complété')}</span>
                                                <span>{f.progress}%</span>
                                            </div>
                                            <div style={{ width: '100%', height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${f.progress}%`, height: '100%', background: 'var(--primary)' }}></div>
                                            </div>
                                            <Link to={`/formations/${f.id}/courses`} style={{ display: 'block', marginTop: '16px', fontSize: '14px', color: 'var(--primary)', textDecoration: 'none' }}>
                                                {t('formations.continue', 'Continuer le cours')} &rarr;
                                            </Link>
                                        </div>
                                    ))}
                                    {formations.filter(f => f.progress > 0).length === 0 && (
                                        <p style={{ color: '#666' }}>{t('dashboard.noProgress', 'Vous n\'avez pas encore commencé de formation.')}</p>
                                    )}
                                </div>
                            ) : (
                                <p style={{ color: '#666' }}>{t('formations.noFormations', 'Aucune formation disponible.')}</p>
                            )}
                        </div>

                        <div className="activity-section">
                            <div className="section-header-row">
                                <h2>{t('dashboard.history', 'Historique de vos tests')}</h2>
                            </div>

                            {loading ? (
                                <div className="loading-state">{t('common.loading', 'Analyse en cours...')}</div>
                            ) : results.length > 0 ? (
                                <div className="results-list">
                                    {results.map((res) => (
                                        <motion.div 
                                            key={res.id} 
                                            className="result-item"
                                            variants={itemVariants}
                                        >
                                            <div className="result-main">
                                                <div className="result-date">
                                                    <span>{new Date(res.created_at).getDate()}</span>
                                                    <span>{new Date(res.created_at).toLocaleDateString(i18n.language || 'fr', { month: 'short' })}</span>
                                                </div>
                                                <div className="result-text">
                                                    <h4>{getLocalizedText(res.primary_domain.name)}</h4>
                                                    <p>{t('dashboard.successProfile', 'Profil établi avec succès')}</p>
                                                </div>
                                            </div>
                                            <Link to="/results" className="btn btn-outline btn-sm">
                                                {t('dashboard.viewAnalysis', 'Voir l\'analyse')}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <Award size={48} />
                                    <h3>{t('dashboard.noTest', 'Aucun test enregistré')}</h3>
                                    <p>{t('dashboard.noTestDesc', 'Lancez votre premier diagnostic pour voir vos résultats ici.')}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <aside className="dashboard-sidebar">
                        <motion.div 
                            className="profile-card"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className="user-badge">{t('dashboard.student', 'CANDIDAT')}</span>
                            <h3>{user.name}</h3>
                            <div className="profile-info">
                                <div className="info-item">
                                    <UserIcon size={18} />
                                    <span>{user.email}</span>
                                </div>
                                <div className="info-item">
                                    <Calendar size={18} />
                                    <span>{t('dashboard.registeredIn', 'Inscrit en')} {new Date(user.created_at).getFullYear()}</span>
                                </div>
                            </div>

                            <Link to="/profile" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
                                <UserIcon size={16} /> {t('profile.editProfile', 'Gérer mon profil')}
                            </Link>

                            {chartData && (
                                <div className="chart-container">
                                    <Radar 
                                        data={chartData} 
                                        options={{
                                            scales: {
                                                r: {
                                                    angleLines: { display: false },
                                                    suggestedMin: 0,
                                                    suggestedMax: 100,
                                                    ticks: { display: false }
                                                }
                                            },
                                            plugins: { legend: { display: false } }
                                        }} 
                                    />
                                </div>
                            )}
                        </motion.div>

                        <motion.div 
                            className="tips-card"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h4 className="tips-card-title">{t('dashboard.tipTitle', 'Conseil du jour')}</h4>
                            <p className="tips-card-text">
                                {t('dashboard.tipDesc', 'Saviez-vous que 80% des carrières réussies commencent par une connaissance de soi ? Continuez à explorer !')}
                            </p>
                        </motion.div>

                        <motion.button 
                            onClick={logout}
                            className="btn btn-outline"
                            style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <LogOut size={18} /> {t('nav.logout', 'Déconnexion')}
                        </motion.button>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
