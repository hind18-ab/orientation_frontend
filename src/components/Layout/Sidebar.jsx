import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Layers, 
    HelpCircle, 
    Users, 
    Settings, 
    GraduationCap, 
    Library, 
    BookOpen 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-menu">
                <NavLink to="/admin" end className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}>
                    <LayoutDashboard size={20} />
                    <span>Tableau de Bord</span>
                </NavLink>
                <NavLink to="/admin/domains" className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}>
                    <Layers size={20} />
                    <span>Domaines</span>
                </NavLink>
                <NavLink to="/admin/formations" className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}>
                    <GraduationCap size={20} />
                    <span>Formations</span>
                </NavLink>
                <NavLink to="/admin/courses" className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}>
                    <Library size={20} />
                    <span>Cours</span>
                </NavLink>
                <NavLink to="/admin/lessons" className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}>
                    <BookOpen size={20} />
                    <span>Leçons</span>
                </NavLink>
                <div className="sidebar-divider"></div>
                <NavLink to="/admin/questions" className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}>
                    <HelpCircle size={20} />
                    <span>Questions</span>
                </NavLink>
                <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}>
                    <Users size={20} />
                    <span>Utilisateurs</span>
                </NavLink>
                <div className="sidebar-divider"></div>
                <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}>
                    <Settings size={20} />
                    <span>Paramètres</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
