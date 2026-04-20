import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Edit2, Trash2, HelpCircle, X } from 'lucide-react';
import './AdminQuestions.css';

const AdminQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [domains, setDomains] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState({
        question_text: '',
        options: [{ option_text: '', domain_id: '', points: 1 }]
    });

    useEffect(() => {
        fetchQuestions();
        fetchDomains();
    }, []);

    const fetchQuestions = async () => {
        const response = await api.get('/questions');
        setQuestions(response.data);
    };

    const fetchDomains = async () => {
        const response = await api.get('/domains');
        setDomains(response.data);
    };

    const handleAddOption = () => {
        setCurrentQuestion({
            ...currentQuestion,
            options: [...currentQuestion.options, { option_text: '', domain_id: '', points: 1 }]
        });
    };

    const handleRemoveOption = (index) => {
        const newOptions = currentQuestion.options.filter((_, i) => i !== index);
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...currentQuestion.options];
        newOptions[index][field] = value;
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/questions/${currentQuestion.id}`, currentQuestion);
            } else {
                await api.post('/questions', currentQuestion);
            }
            setIsModalOpen(false);
            fetchQuestions();
            setCurrentQuestion({ question_text: '', options: [{ option_text: '', domain_id: '', points: 1 }] });
        } catch (error) {
            console.error('Error saving question', error);
        }
    };

    const handleAddNew = () => {
        setCurrentQuestion({
            question_text: '',
            options: [{ option_text: '', domain_id: '', points: 1 }]
        });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleEdit = (question) => {
        setCurrentQuestion(question);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
            await api.delete(`/questions/${id}`);
            fetchQuestions();
        }
    };

    return (
        <div className="admin-questions">
            <header className="admin-header">
                <div>
                    <h1>Gestion des Questions</h1>
                    <p>Configurez les questions du test d'orientation et leurs points.</p>
                </div>
                <button className="btn btn-primary" onClick={handleAddNew}>
                    <Plus size={20} /> Ajouter une Question
                </button>
            </header>

            <div className="questions-list">
                {questions.map(question => (
                    <div key={question.id} className="question-item card">
                        <div className="question-content">
                            <div className="question-info">
                                <HelpCircle size={24} className="icon" />
                                <h3>{question.question_text}</h3>
                            </div>
                            <div className="options-summary">
                                {question.options.map((opt, idx) => (
                                    <span key={idx} className="option-badge">
                                        {opt.option_text} ({opt.domain.name})
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="card-actions">
                            <button className="btn btn-outline btn-sm" onClick={() => handleEdit(question)}>
                                <Edit2 size={16} />
                            </button>
                            <button className="btn btn-outline btn-sm btn-danger" onClick={() => handleDelete(question.id)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal question-modal card">
                        <h2>{isEditing ? 'Modifier la question' : 'Ajouter une question'}</h2>
                        <form onSubmit={handleSave}>
                            <div className="input-group">
                                <label>Texte de la question</label>
                                <input 
                                    type="text" 
                                    value={currentQuestion.question_text} 
                                    onChange={(e) => setCurrentQuestion({...currentQuestion, question_text: e.target.value})} 
                                    required 
                                />
                            </div>
                            
                            <div className="options-editor">
                                <div className="options-header">
                                    <h4>Options de réponse</h4>
                                    <button type="button" className="btn btn-outline btn-sm" onClick={handleAddOption}>
                                        <Plus size={16} /> Ajouter une option
                                    </button>
                                </div>
                                
                                {currentQuestion.options.map((option, index) => (
                                    <div key={index} className="option-edit-row animate-fade-in">
                                        <input 
                                            type="text" 
                                            placeholder="Texte de l'option" 
                                            value={option.option_text}
                                            onChange={(e) => handleOptionChange(index, 'option_text', e.target.value)}
                                            required
                                        />
                                        <select 
                                            value={option.domain_id} 
                                            onChange={(e) => handleOptionChange(index, 'domain_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Domaine...</option>
                                            {domains.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                        <input 
                                            type="number" 
                                            placeholder="Pts" 
                                            className="points-input"
                                            value={option.points}
                                            onChange={(e) => handleOptionChange(index, 'points', e.target.value)}
                                            required
                                        />
                                        <button type="button" className="btn-remove" onClick={() => handleRemoveOption(index)} title="Supprimer">
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Annuler</button>
                                <button type="submit" className="btn btn-primary">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminQuestions;
