import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HelpCircle, BookOpen, Users, BarChart3 } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ domains: 0, questions: 0, users: 0, results: 0 });
    const [activities, setActivities] = useState({ registrations: [], results: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, activitiesRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/activities')
                ]);
                setStats(statsRes.data);
                setActivities(activitiesRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="admin-dashboard">
            <h1>Tableau de Bord Admin</h1>
            <p className="subtitle" style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Aperçu global de la plateforme.</p>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <div className="stat-value">{stats.domains}</div>
                        <div className="stat-label">Domaines</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                        <HelpCircle size={24} />
                    </div>
                    <div>
                        <div className="stat-value">{stats.questions}</div>
                        <div className="stat-label">Questions</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <div className="stat-value">{stats.users}</div>
                        <div className="stat-label">Utilisateurs</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <div className="stat-value">{stats.results}</div>
                        <div className="stat-label">Tests Passés</div>
                    </div>
                </div>
            </div>
            
            <div className="activities-grid" style={{ marginTop: '32px' }}>
                <div className="activity-card">
                    <h3>Dernières Inscriptions</h3>
                    <div style={{ marginTop: '20px' }}>
                        {loading ? (
                            <p>Chargement...</p>
                        ) : activities.registrations.length > 0 ? (
                            <div className="activity-list">
                                {activities.registrations.map((user, index) => (
                                    <div key={index} className="activity-item">
                                        <div>
                                            <div className="activity-info-title">{user.message}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</div>
                                        </div>
                                        <div className="activity-date-badge">
                                            {new Date(user.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>Aucune inscription.</p>
                        )}
                    </div>
                </div>

                <div className="activity-card">
                    <h3>Derniers Tests Passés</h3>
                    <div style={{ marginTop: '20px' }}>
                        {loading ? (
                            <p>Chargement...</p>
                        ) : activities.results.length > 0 ? (
                            <div className="activity-list">
                                {activities.results.map((result, index) => (
                                    <div key={index} className="result-item">
                                        <div className="result-header">
                                            <span style={{ fontWeight: '600', color: 'var(--text)' }}>{result.message}</span>
                                            <span className="result-domain-badge">
                                                {result.domain}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                            {new Date(result.date).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>Aucun test complété.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
