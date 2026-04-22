import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Calendar, ArrowRight, Award, Clock, 
    ChevronRight, BookOpen, User as UserIcon,
    TrendingUp, LogOut, LayoutGrid, Star
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
import { Radar, Doughnut } from 'react-chartjs-2';
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
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await api.get('/orientation/results');
                setResults(response.data);
            } catch (error) {
                console.error('Error fetching results', error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
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
                            <h1>Heureux de vous revoir, <span className="gradient-text">{user.name}</span></h1>
                            <p>Votre futur se dessine ici. Prêt pour la suite ?</p>
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
                                    <h3>Profil Dominant</h3>
                                    <div className="stat-value">
                                        {latestResult ? latestResult.primary_domain.name : 'En attente'}
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div className="stat-card" variants={itemVariants}>
                                <div className="stat-icon success">
                                    <LayoutGrid size={28} />
                                </div>
                                <div className="stat-info">
                                    <h3>Parcours explorés</h3>
                                    <div className="stat-value">{results.length} Tests</div>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div className="quick-test-card" variants={itemVariants} whileHover={{ scale: 1.02 }}>
                            <div className="quick-test-content">
                                <h2>Nouveau départ ?</h2>
                                <p>Repassez le test pour affiner votre profil d'orientation.</p>
                            </div>
                            <Link to="/test" className="btn btn-primary">
                                Commencer <ArrowRight size={20} />
                            </Link>
                        </motion.div>

                        <div className="activity-section">
                            <div className="section-header-row">
                                <h2>Historique de vos tests</h2>
                            </div>

                            {loading ? (
                                <div className="loading-state">Analyse en cours...</div>
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
                                                    <span>{new Date(res.created_at).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                                                </div>
                                                <div className="result-text">
                                                    <h4>{res.primary_domain.name}</h4>
                                                    <p>Profil établi avec succès</p>
                                                </div>
                                            </div>
                                            <Link to="/results" className="btn btn-outline btn-sm">
                                                Voir l'analyse
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <Award size={48} />
                                    <h3>Aucun test enregistré</h3>
                                    <p>Lancez votre premier diagnostic pour voir vos résultats ici.</p>
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
                            <span className="user-badge">ÉLECTRON LIBRE</span>
                            <h3>{user.name}</h3>
                            <div className="profile-info">
                                <div className="info-item">
                                    <UserIcon size={18} />
                                    <span>{user.email}</span>
                                </div>
                                <div className="info-item">
                                    <Calendar size={18} />
                                    <span>Inscrit en {new Date(user.created_at).getFullYear()}</span>
                                </div>
                            </div>

                            <Link to="/profile" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
                                <UserIcon size={16} /> Gérer mon profil
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
                            style={{ background: '#f5f3ff', padding: '24px', borderRadius: '24px', border: '1px solid #ddd6fe' }}
                        >
                            <h4 style={{ color: 'var(--primary)', marginBottom: '12px' }}>Conseil du jour</h4>
                            <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                                Saviez-vous que 80% des carrières réussies commencent par une connaissance de soi ? Continuez à explorer !
                            </p>
                        </motion.div>

                        <motion.button 
                            onClick={logout}
                            className="btn btn-outline"
                            style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <LogOut size={18} /> Déconnexion
                        </motion.button>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
