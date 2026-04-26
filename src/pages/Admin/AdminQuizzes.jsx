import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './AdminQuizzes.css';

const AdminQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [formations, setFormations] = useState([]);
    const [formData, setFormData] = useState({
        formation_id: '',
        title: '',
        description: '',
        passing_score: 50,
        questions: []
    });
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiQuestionCount, setAiQuestionCount] = useState(5);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingQuizId, setEditingQuizId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [quizRes, formRes] = await Promise.all([
                api.get('/admin/quizzes'),
                api.get('/formations')
            ]);
            setQuizzes(quizRes.data);
            setFormations(formRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleAddQuestion = () => {
        setFormData({
            ...formData,
            questions: [...formData.questions, { question_text: '', answers: [] }]
        });
    };

    const handleGenerateAI = async () => {
        if (!formData.formation_id) {
            alert('Veuillez d\'abord sélectionner une formation.');
            return;
        }
        
        setAiLoading(true);
        try {
            const formation = formations.find(f => f.id === parseInt(formData.formation_id));
            const response = await api.post('/admin/quizzes/generate-ai', {
                title: formation.title,
                description: formation.description,
                question_count: aiQuestionCount
            });
            
            setFormData({
                ...formData,
                questions: response.data.questions
            });
            alert('✅ Questions générées avec succès par l\'IA !');
        } catch (error) {
            console.error('Error generating AI quiz:', error);
            const errMsg = error.response?.data?.error || error.message || 'Erreur inconnue';
            alert('❌ Erreur lors de la génération par l\'IA :\n' + errMsg);
        } finally {
            setAiLoading(false);
        }
    };

    const handleAddAnswer = (qIndex) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].answers.push({ answer_text: '', is_correct: false });
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleQuestionChange = (qIndex, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].question_text = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleAnswerChange = (qIndex, aIndex, field, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].answers[aIndex][field] = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingQuizId) {
                await api.put(`/admin/quizzes/${editingQuizId}`, formData);
                alert('Quiz mis à jour avec succès!');
            } else {
                await api.post('/admin/quizzes', formData);
                alert('Quiz créé avec succès!');
            }
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Error saving quiz:', error);
            alert('Erreur lors de la sauvegarde du quiz.');
        }
    };

    const resetForm = () => {
        setFormData({
            formation_id: '',
            title: '',
            description: '',
            passing_score: 50,
            questions: []
        });
        setEditingQuizId(null);
        setIsFormVisible(false);
    };

    const handleEdit = async (id) => {
        try {
            const response = await api.get(`/admin/quizzes/${id}`);
            const quiz = response.data;
            setFormData({
                formation_id: quiz.formation_id,
                title: quiz.title,
                description: quiz.description || '',
                passing_score: quiz.passing_score,
                questions: quiz.questions || []
            });
            setEditingQuizId(id);
            setIsFormVisible(true);
        } catch (error) {
            console.error('Error fetching quiz details:', error);
            alert('Erreur lors de la récupération du quiz.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce quiz ?')) return;
        try {
            await api.delete(`/admin/quizzes/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="admin-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>Gestion des Quizzes</h2>
                {!isFormVisible && (
                    <button onClick={() => setIsFormVisible(true)} className="btn-add" style={{ margin: 0 }}>
                        + Créer un Quiz
                    </button>
                )}
            </div>

            {!isFormVisible ? (
                <div style={{ overflowX: 'auto' }}>
                    <table className="quizzes-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Formation</th>
                                <th>Titre</th>
                                <th>Score Requis</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizzes.map(quiz => (
                                <tr key={quiz.id}>
                                    <td>{quiz.id}</td>
                                    <td>{quiz.formation?.title}</td>
                                    <td>{quiz.title}</td>
                                    <td>{quiz.passing_score}%</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        <button onClick={() => handleEdit(quiz.id)} className="btn-add" style={{ background: '#3b82f6', marginRight: '0.5rem', marginBottom: '0', padding: '0.5rem 1rem' }}>
                                            Modifier
                                        </button>
                                        <button onClick={() => handleDelete(quiz.id)} className="btn-delete" style={{ marginBottom: '0', padding: '0.5rem 1rem' }}>
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="quiz-form">
                    <h3>{editingQuizId ? 'Modifier le Quiz' : 'Créer un nouveau Quiz'}</h3>
                    
                    <div className="form-group">
                        <label>Formation:</label>
                        <select
                            value={formData.formation_id}
                            onChange={(e) => setFormData({ ...formData, formation_id: e.target.value })}
                            required
                        >
                            <option value="">Sélectionner une formation</option>
                            {formations.map(f => (
                                <option key={f.id} value={f.id}>{f.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Titre du Quiz:</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Score pour réussir (%):</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.passing_score}
                            onChange={(e) => setFormData({ ...formData, passing_score: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h4>Questions</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <label style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>Nombre :</label>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        max="50" 
                                        value={aiQuestionCount} 
                                        onChange={(e) => setAiQuestionCount(parseInt(e.target.value) || 5)}
                                        style={{ width: '70px', margin: 0, padding: '0.5rem' }}
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    onClick={handleGenerateAI} 
                                    className="btn-add"
                                    disabled={aiLoading}
                                    style={{ 
                                        background: aiLoading 
                                            ? '#94a3b8' 
                                            : 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)', 
                                        margin: 0,
                                        cursor: aiLoading ? 'not-allowed' : 'pointer',
                                        opacity: aiLoading ? 0.7 : 1
                                    }}
                                >
                                    {aiLoading ? '⏳ Génération en cours...' : '✨ Générer par IA'}
                                </button>
                            </div>
                        </div>
                        {formData.questions.map((q, qIndex) => (
                            <div key={qIndex} className="question-block">
                                <input
                                    type="text"
                                    placeholder={`Question ${qIndex + 1}`}
                                    value={q.question_text}
                                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                    required
                                    className="form-group"
                                    style={{ marginBottom: '1.5rem', fontWeight: 'bold' }}
                                />

                                <div style={{ paddingLeft: '1.5rem' }}>
                                    <h5 style={{ marginBottom: '1rem', color: '#6b7280' }}>Réponses:</h5>
                                    {q.answers.map((a, aIndex) => (
                                        <div key={aIndex} className="answer-row">
                                            <input
                                                type="text"
                                                placeholder={`Réponse ${aIndex + 1}`}
                                                value={a.answer_text}
                                                onChange={(e) => handleAnswerChange(qIndex, aIndex, 'answer_text', e.target.value)}
                                                required
                                            />
                                            <label style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={a.is_correct}
                                                    onChange={(e) => handleAnswerChange(qIndex, aIndex, 'is_correct', e.target.checked)}
                                                    style={{ width: 'auto', marginRight: '8px' }}
                                                />
                                                Bonne réponse
                                            </label>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => handleAddAnswer(qIndex)} className="btn-add" style={{ background: '#94a3b8', marginTop: '0.5rem' }}>
                                        + Ajouter une réponse
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddQuestion} className="btn-add">
                            + Ajouter une question
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn-submit" style={{ flex: 1 }}>
                            {editingQuizId ? 'Mettre à jour le Quiz' : 'Enregistrer le Quiz'}
                        </button>
                        <button type="button" onClick={resetForm} className="btn-delete" style={{ flex: 1, margin: 0, padding: '0.75rem', fontSize: '1rem', fontWeight: '600' }}>
                            Annuler
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AdminQuizzes;
