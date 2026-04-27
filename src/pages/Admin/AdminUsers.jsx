import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import { Trash2, Mail, Calendar, Search, Eye, GraduationCap, Award, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminUsers.css';

const AdminUsers = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users', error);
            setLoading(false);
        }
    };

    const handleViewDetails = async (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
        setLoadingDetails(true);
        setUserDetails(null);
        try {
            const response = await api.get(`/admin/users/${user.id}/details`);
            setUserDetails(response.data);
        } catch (error) {
            console.error('Error fetching user details', error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('common.confirmDelete', 'Voulez-vous vraiment supprimer cet élément ?'))) {
            try {
                await api.delete(`/admin/users/${id}`);
                setUsers(users.filter(u => u.id !== id));
            } catch (error) {
                console.error('Error deleting user', error);
                alert(t('common.errorDeleting', 'Erreur lors de la suppression'));
            }
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <h2>{t('admin.management.users', 'Gestion des Utilisateurs')}</h2>
                </div>
                <div className="search-bar">
                    <Search size={20} />
                    <input 
                        type="text" 
                        placeholder={t('common.searchPlaceholder', 'Rechercher par nom ou email...')} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {loading ? (
                <div className="loading">{t('common.loading', 'Chargement...')}</div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>{t('auth.name', 'Utilisateur')}</th>
                                <th>{t('auth.email', 'Email')} / {t('common.registration', 'Inscription')}</th>
                                <th className="text-center">{t('admin.formations', 'Formations')}</th>
                                <th className="text-center">{t('admin.quizzes', 'Quiz')}</th>
                                <th className="text-center">{t('common.certificates', 'Certificats')}</th>
                                <th style={{ textAlign: 'right' }}>{t('common.actions', 'Actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="user-row">
                                    <td>
                                        <div className="user-name">
                                            <div className="avatar">{user.name.charAt(0)}</div>
                                            <span>{user.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="user-email" style={{ marginBottom: '4px' }}>
                                            <Mail size={12} />
                                            <span style={{ fontSize: '13px' }}>{user.email}</span>
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Calendar size={10} />
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <span className="badge badge-info">{user.formations_count || 0}</span>
                                    </td>
                                    <td className="text-center">
                                        <span className="badge badge-success">{user.quizzes_count || 0}</span>
                                    </td>
                                    <td className="text-center">
                                        <span className="badge badge-warning">{user.certificates_count || 0}</span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="btn-view" 
                                                onClick={() => handleViewDetails(user)}
                                                title={t('common.viewHistory', "Voir l'historique complet")}
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button 
                                                className="btn-delete" 
                                                onClick={() => handleDelete(user.id)}
                                                title={t('common.deleteUser', "Supprimer cet utilisateur")}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <div className="modal-overlay">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="modal-content detail-modal" 
                            style={{ width: '800px', maxWidth: '95%' }}
                        >
                            <div className="modal-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div className="avatar large">{selectedUser?.name.charAt(0)}</div>
                                    <div>
                                        <h3>{selectedUser?.name}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{selectedUser?.email}</p>
                                    </div>
                                </div>
                                <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                {loadingDetails ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>{t('common.loadingHistory', "Chargement de l'historique...")}</div>
                                ) : (
                                    <div className="details-grid">
                                        {/* Orientation Section */}
                                        <section className="detail-section">
                                            <div className="section-header">
                                                <FileText size={18} />
                                                <h4 style={{ margin: 0, fontSize: '16px' }}>{t('admin.management.orientationTests', "Tests d'Orientation")}</h4>
                                            </div>
                                            {userDetails?.orientation?.length > 0 ? (
                                                <div className="detail-list">
                                                    {userDetails.orientation.map((res, i) => (
                                                        <div key={i} className="detail-card">
                                                            <div className="card-title">{t('admin.domains', 'Domaine')} : {res.primary_domain?.name || 'Inconnu'}</div>
                                                            <div className="card-sub">{t('common.onDate', 'Le')} {new Date(res.created_at).toLocaleString()}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : <p className="empty-text">{t('common.noTestsPassed', 'Aucun test passé.')}</p>}
                                        </section>

                                        {/* Formations Section */}
                                        <section className="detail-section">
                                            <div className="section-header">
                                                <GraduationCap size={18} />
                                                <h4 style={{ margin: 0, fontSize: '16px' }}>{t('admin.formations', 'Formations')}</h4>
                                            </div>
                                            {userDetails?.formations?.length > 0 ? (
                                                <div className="detail-list">
                                                    {userDetails.formations.map((f, i) => (
                                                        <div key={i} className="detail-card">
                                                            <div className="card-title">{f.title}</div>
                                                            <div className="progress-bar">
                                                                <div className="progress-fill" style={{ width: `${f.progress}%` }}></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : <p className="empty-text">{t('common.noFormationsStarted', 'Aucune formation entamée.')}</p>}
                                        </section>

                                        {/* Quizzes Section */}
                                        <section className="detail-section">
                                            <div className="section-header">
                                                <Award size={18} />
                                                <h4 style={{ margin: 0, fontSize: '16px' }}>{t('admin.quizzes', 'Quiz')} & {t('common.scores', 'Notes')}</h4>
                                            </div>
                                            {userDetails?.quizzes?.length > 0 ? (
                                                <div className="detail-list">
                                                    {userDetails.quizzes.map((q, i) => (
                                                        <div key={i} className="detail-card">
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                                <div>
                                                                    <div className="card-title">{q.course_title}</div>
                                                                    <div className="card-sub">{q.date}</div>
                                                                </div>
                                                                <div className={`card-score ${q.passed ? 'pass' : 'fail'}`}>
                                                                    {q.score}%
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : <p className="empty-text">{t('common.noQuizzesPassed', 'Aucun quiz passé.')}</p>}
                                        </section>

                                        {/* Certificates Section */}
                                        <section className="detail-section">
                                            <div className="section-header">
                                                <Award size={18} style={{ color: 'var(--accent)' }} />
                                                <h4 style={{ margin: 0, fontSize: '16px' }}>{t('common.certificates', 'Certificats')}</h4>
                                            </div>
                                            {userDetails?.certificates?.length > 0 ? (
                                                <div className="detail-list">
                                                    {userDetails.certificates.map((c, i) => (
                                                        <div key={i} className="detail-card cert-card">
                                                            <div className="card-title">{c.course_name}</div>
                                                            <div className="card-sub">{t('common.deliveredOn', 'Délivré le')} {c.date}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : <p className="empty-text">{t('common.noCertificates', 'Aucun certificat.')}</p>}
                                        </section>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
                                <button className="btn btn-primary" onClick={() => setIsModalOpen(false)}>{t('common.close', 'Fermer')}</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;
