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
import Profile from './pages/Dashboard/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import FormationsList from './pages/Courses/FormationsList';
import CoursesList from './pages/Courses/CoursesList';
import LessonView from './pages/Courses/LessonView';
import QuizView from './pages/Courses/QuizView';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminDomains from './pages/Admin/AdminDomains';
import AdminQuestions from './pages/Admin/AdminQuestions';
import AdminFormations from './pages/Admin/AdminFormations';
import AdminCourses from './pages/Admin/AdminCourses';
import AdminLessons from './pages/Admin/AdminLessons';
import AdminAiGenerator from './pages/Admin/AdminAiGenerator';
import AdminSettings from './pages/Admin/AdminSettings';
import AdminQuizzes from './pages/Admin/AdminQuizzes';
import AdminUsers from './pages/Admin/AdminUsers';
import { ThemeProvider } from './context/ThemeContext';

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
        <ThemeProvider>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/formations" element={<FormationsList />} />
                    <Route path="/formations/:id/courses" element={<CoursesList />} />
                    <Route path="/courses/:courseId/lessons" element={<LessonView />} />
                    
                    {/* User Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/formations/:formationId/quiz" element={<QuizView />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/test" element={<Test />} />
                        <Route path="/results" element={<Results />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
    
                    {/* Admin Protected Routes */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/domains" element={<AdminDomains />} />
                        <Route path="/admin/questions" element={<AdminQuestions />} />
                        <Route path="/admin/formations" element={<AdminFormations />} />
                        <Route path="/admin/courses" element={<AdminCourses />} />
                        <Route path="/admin/lessons" element={<AdminLessons />} />
                        <Route path="/admin/quizzes" element={<AdminQuizzes />} />
                        <Route path="/admin/ai-generator" element={<AdminAiGenerator />} />
                        <Route path="/admin/settings" element={<AdminSettings />} />
                        <Route path="/admin/users" element={<AdminUsers />} />
                    </Route>
                </Route>
            </Routes>
        </ThemeProvider>
    );
}

export default App;
