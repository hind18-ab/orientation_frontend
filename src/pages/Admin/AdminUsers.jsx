import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { User, Trash2, Edit2, Shield, UserCheck } from 'lucide-react';
import './AdminUsers.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handleRoleToggle = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        if (!window.confirm(`Voulez-vous vraiment changer le rôle de ${user.name} en ${newRole} ?`)) return;

        try {
            await api.put(`/admin/users/${user.id}`, {
                name: user.name,
                email: user.email,
                role: newRole
            });
            fetchUsers();
        } catch (error) {
            alert('Erreur lors du changement de rôle.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;

        try {
            await api.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de la suppression.');
        }
    };

    if (loading) return <div className="admin-container">Chargement...</div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>Gestion des Utilisateurs</h2>
                <p>Gérez les comptes et les accès à la plateforme.</p>
            </div>

            <div className="users-grid">
                {users.map(u => (
                    <div key={u.id} className="user-card glass-card">
                        <div className="user-avatar">
                            <User size={32} />
                        </div>
                        <div className="user-info">
                            <h3>{u.name}</h3>
                            <p>{u.email}</p>
                            <div className={`role-badge ${u.role}`}>
                                {u.role === 'admin' ? <Shield size={14} /> : <UserCheck size={14} />}
                                {u.role}
                            </div>
                        </div>
                        <div className="user-actions">
                            <button 
                                onClick={() => handleRoleToggle(u)} 
                                title="Changer le rôle"
                                className="btn-icon"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button 
                                onClick={() => handleDelete(u.id)} 
                                title="Supprimer"
                                className="btn-icon delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminUsers;
