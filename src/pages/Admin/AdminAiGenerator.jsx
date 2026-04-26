import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import { Sparkles, Save, Trash2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import './AdminAiGenerator.css';

const AdminAiGenerator = () => {
    const { t, i18n } = useTranslation();
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState('');
    const [questionCount, setQuestionCount] = useState(5);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [previewQuestions, setPreviewQuestions] = useState([]);
    const [message, setMessage] = useState(null);

    const getLocalizedText = (field) => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field[i18n.language] || field['fr'] || field['ar'] || field['en'] || '';
    };

    useEffect(() => {
        fetchDomains();
    }, []);

    const fetchDomains = async () => {
        try {
            const response = await api.get('/domains');
            setDomains(response.data);
            if (response.data.length > 0) setSelectedDomain(response.data[0].id);
        } catch (error) {
            console.error('Error fetching domains', error);
        }
    };

    const handleGenerate = async () => {
        if (!selectedDomain) return;
        setIsGenerating(true);
        setMessage(null);
        try {
            const response = await api.post('/ai/generate-questions', {
                domain_id: selectedDomain,
                count: questionCount
            });
            setPreviewQuestions(response.data.questions);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || t('admin.generator.errorGen', 'Échec de la génération des questions.') });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (previewQuestions.length === 0) return;
        setIsSaving(true);
        try {
            await api.post('/ai/save-questions', {
                domain_id: selectedDomain,
                questions: previewQuestions
            });
            setMessage({ type: 'success', text: t('admin.generator.success', 'Questions enregistrées avec succès !') });
            setPreviewQuestions([]);
        } catch (error) {
            setMessage({ type: 'error', text: t('admin.generator.errorSave', "Erreur lors de l'enregistrement.") });
        } finally {
            setIsSaving(false);
        }
    };

    const removeQuestion = (index) => {
        setPreviewQuestions(previewQuestions.filter((_, i) => i !== index));
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div>
                    <h1>{t('admin.generator.title', 'Générateur IA')}</h1>
                    <p>{t('admin.generator.subtitle', 'Automatisez la création de questions pour le test d\'orientation.')}</p>
                </div>
            </div>

            <div className="ai-generator-card">
                <div className="generator-form">
                    <div className="form-group">
                        <label>{t('admin.generator.targetDomain', 'Domaine cible')}</label>
                        <select 
                            value={selectedDomain} 
                            onChange={(e) => setSelectedDomain(e.target.value)}
                        >
                            {domains.map(d => (
                                <option key={d.id} value={d.id}>{getLocalizedText(d.name)}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t('admin.generator.questionCount', 'Nombre de questions')}</label>
                        <input 
                            type="number" 
                            min="1" 
                            max="10" 
                            value={questionCount}
                            onChange={(e) => setQuestionCount(e.target.value)}
                        />
                    </div>
                    <button 
                        className="btn btn-ai" 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                    >
                        {isGenerating ? <RefreshCw className="spin" size={20} /> : <Sparkles size={20} />}
                        {t('admin.generateAI', 'Générer avec IA')}
                    </button>
                </div>

                {message && (
                    <div className={`ai-message ${message.type}`}>
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        {message.text}
                    </div>
                )}
            </div>

            {previewQuestions.length > 0 && (
                <div className="preview-container fade-in">
                    <div className="preview-header">
                        <h2>{t('admin.generator.preview', 'Prévisualisation')} ({previewQuestions.length})</h2>
                        <button 
                            className="btn btn-primary" 
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? <RefreshCw className="spin" size={20} /> : <Save size={20} />}
                            {t('admin.generator.saveAll', 'Tout valider et enregistrer')}
                        </button>
                    </div>

                    <div className="preview-list">
                        {previewQuestions.map((q, qIndex) => (
                            <div key={qIndex} className="preview-card">
                                <div className="preview-card-header">
                                    <h3>{q.text}</h3>
                                    <button className="btn-icon delete" onClick={() => removeQuestion(qIndex)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="preview-options">
                                    {q.options.map((opt, oIndex) => (
                                        <div key={oIndex} className={`preview-option ${opt.is_correct ? 'correct' : ''}`}>
                                            <span>{opt.text}</span>
                                            {opt.is_correct && <span className="badge">{t('admin.generator.correctAnswer', 'Bonne réponse')}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAiGenerator;
