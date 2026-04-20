import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HelpCircle, BookOpen, Users, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ domains: 0, questions: 0, users: 0, results: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="admin-dashboard" style={{ padding: '24px' }}>
            <h1>Tableau de Bord Admin</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Aperçu global de la plateforme.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ padding: '12px', background: '#eff6ff', color: 'var(--primary)', borderRadius: '12px' }}>
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: '800' }}>{stats.domains}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Domaines</div>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ padding: '12px', background: '#fef2f2', color: '#ef4444', borderRadius: '12px' }}>
                        <HelpCircle size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: '800' }}>{stats.questions}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Questions</div>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ padding: '12px', background: '#f0fdf4', color: '#22c55e', borderRadius: '12px' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: '800' }}>{stats.users}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Utilisateurs</div>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ padding: '12px', background: '#fff7ed', color: '#f97316', borderRadius: '12px' }}>
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: '800' }}>{stats.results}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Tests Passés</div>
                    </div>
                </div>
            </div>
            
            <div className="card" style={{ marginTop: '32px' }}>
                <h3>Activités Récentes</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>Les fonctionnalités de suivi d'activité seront disponibles dans le prochain sprint.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
