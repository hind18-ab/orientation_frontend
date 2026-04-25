import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Edit2, Trash2, HelpCircle, X, Sparkles, RefreshCw, Save } from 'lucide-react';
import './AdminQuestions.css';

const AdminQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [domains, setDomains] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSavingAi, setIsSavingAi] = useState(false);
    const [aiPreview, setAiPreview] = useState([]);
    const [aiQuestionCount, setAiQuestionCount] = useState(3);
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

    const handleGenerateAi = async () => {
        setIsGenerating(true);
        try {
            const response = await api.post('/ai/generate-questions', { count: aiQuestionCount });
            setAiPreview(response.data.questions);
            setIsAiModalOpen(true);
        } catch (error) {
            console.error('Error generating AI questions', error);
            alert('Erreur lors de la génération IA');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveAi = async () => {
        setIsSavingAi(true);
        try {
            await api.post('/ai/save-questions', {
                domain_id: domains[0]?.id, // Using first domain as fallback if needed, but AiController should handle it
                questions: aiPreview
            });
            setIsAiModalOpen(false);
            fetchQuestions();
            setAiPreview([]);
        } catch (error) {
            console.error('Error saving AI questions', error);
        } finally {
            setIsSavingAi(false);
        }
    };

    const handleAiQuestionChange = (qIndex, value) => {
        const updated = [...aiPreview];
        updated[qIndex].text = value;
        setAiPreview(updated);
    };

    const handleAiOptionChange = (qIndex, optIndex, field, value) => {
        const updated = [...aiPreview];
        if (field === 'points') {
            updated[qIndex].options[optIndex][field] = parseInt(value, 10) || 0;
        } else {
            updated[qIndex].options[optIndex][field] = value;
        }
        setAiPreview(updated);
    };

    return (
        <div className="admin-questions">
            <header className="admin-header">
                <div>
                    <h1>Gestion des Questions</h1>
                    <p>Configurez les questions du test d'orientation et leurs points.</p>
                </div>
                <div className="header-actions">
                    <div className="ai-controls">
                        <input 
                            type="number" 
                            min="1" 
                            max="10" 
                            value={aiQuestionCount}
                            onChange={(e) => setAiQuestionCount(parseInt(e.target.value))}
                            className="ai-count-input"
                            title="Nombre de questions à générer"
                        />
                        <button 
                            className="btn btn-ai" 
                            onClick={handleGenerateAi}
                            disabled={isGenerating}
                        >
                            {isGenerating ? <RefreshCw className="spin" size={18} /> : <Sparkles size={18} />}
                            Générer avec IA
                        </button>
                    </div>
                    <button className="btn btn-primary" onClick={handleAddNew}>
                        <Plus size={20} /> Ajouter une Question
                    </button>
                </div>
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

            {isAiModalOpen && (
                <div className="modal-overlay">
                    <div className="modal ai-preview-modal card">
                        <div className="modal-header">
                            <h2>Prévisualisation IA</h2>
                            <button className="btn-close" onClick={() => setIsAiModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="ai-questions-preview">
                            <p className="helper-text">Vérifiez et modifiez les questions générées avant de les valider.</p>
                            {aiPreview.map((q, idx) => (
                                <div key={idx} className="preview-item card" style={{ padding: '24px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
                                    <div className="input-group">
                                        <label>Texte de la question {idx + 1}</label>
                                        <input 
                                            type="text" 
                                            value={q.text} 
                                            onChange={(e) => handleAiQuestionChange(idx, e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="options-editor" style={{ marginTop: '20px' }}>
                                        <div className="options-header">
                                            <h4>Options de réponse</h4>
                                        </div>
                                        {q.options.map((opt, oIdx) => (
                                            <div key={oIdx} className="option-edit-row" style={{ gridTemplateColumns: '2fr 1fr 80px' }}>
                                                <input 
                                                    type="text" 
                                                    placeholder="Texte de l'option" 
                                                    value={opt.text}
                                                    onChange={(e) => handleAiOptionChange(idx, oIdx, 'text', e.target.value)}
                                                    required
                                                />
                                                <select 
                                                    value={opt.domain_id || ''} 
                                                    onChange={(e) => handleAiOptionChange(idx, oIdx, 'domain_id', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Domaine...</option>
                                                    {domains.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                </select>
                                                <input 
                                                    type="number" 
                                                    placeholder="Pts" 
                                                    className="points-input"
                                                    value={opt.points !== undefined ? opt.points : 5}
                                                    onChange={(e) => handleAiOptionChange(idx, oIdx, 'points', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setIsAiModalOpen(false)}>Annuler</button>
                            <button 
                                className="btn btn-primary btn-ai-save" 
                                onClick={handleSaveAi}
                                disabled={isSavingAi}
                            >
                                {isSavingAi ? <RefreshCw className="spin" size={18} /> : <Save size={18} />}
                                Valider et Ajouter tout
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
