import React from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Sidebar from './components/Layout/Sidebar';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Test from './pages/Test/Test';
import Results from './pages/Results/Results';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminDomains from './pages/Admin/AdminDomains';
import AdminQuestions from './pages/Admin/AdminQuestions';
import AdminFormations from './pages/Admin/AdminFormations';

const MainLayout = () => {
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith('/admin');

    return (
        <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div className="main-content" style={{ display: 'flex', flexGrow: 1 }}>
                {isAdminPath && <Sidebar />}
                <main style={{ flexGrow: 1 }}>
                    <Outlet />
                </main>
            </div>
            {!isAdminPath && <Footer />}
        </div>
    );
};

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* User Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/test" element={<Test />} />
                    <Route path="/results" element={<Results />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/domains" element={<AdminDomains />} />
                    <Route path="/admin/questions" element={<AdminQuestions />} />
                    <Route path="/admin/formations" element={<AdminFormations />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
