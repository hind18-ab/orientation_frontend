import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import './Test.css';

const Test = () => {
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await api.get('/orientation/questions');
                setQuestions(response.data);
            } catch (error) {
                console.error('Error fetching questions', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleAnswerChange = (questionId, optionId) => {
        setAnswers({ ...answers, [questionId]: optionId });
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        if (!user) {
            navigate('/login', { state: { from: '/test', answers } });
            return;
        }

        if (Object.keys(answers).length < questions.length) {
            alert('Veuillez répondre à toutes les questions.');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/orientation/submit', { answers: Object.values(answers) });
            navigate('/results');
        } catch (error) {
            console.error('Submission error', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading">Chargement du test...</div>;

    if (questions.length === 0) return <div className="no-questions">Aucune question disponible pour le moment.</div>;

    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    return (
        <div className="test-page">
            <div className="container test-container">
                <div className="test-header">
                    <h2>Test d'Orientation</h2>
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                        <span className="progress-text">{currentStep + 1} / {questions.length}</span>
                    </div>
                </div>

                <div className="question-card animate-fade-in">
                    <h3>{currentQuestion.question_text}</h3>
                    <div className="options-grid">
                        {currentQuestion.options.map((option) => (
                            <label key={option.id} className={`option-item ${answers[currentQuestion.id] === option.id ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name={`question-${currentQuestion.id}`} 
                                    value={option.id}
                                    checked={answers[currentQuestion.id] === option.id}
                                    onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
                                />
                                <span className="option-text">{option.option_text}</span>
                                {answers[currentQuestion.id] === option.id && <CheckCircle size={20} className="check-icon" />}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="test-navigation">
                    <button 
                        onClick={handlePrev} 
                        className="btn btn-outline"
                        disabled={currentStep === 0}
                    >
                        <ArrowLeft size={20} /> Précédent
                    </button>
                    
                    {currentStep === questions.length - 1 ? (
                        <button 
                            onClick={handleSubmit} 
                            className="btn btn-primary"
                            disabled={submitting || !answers[currentQuestion.id]}
                        >
                            {submitting ? 'Envoi...' : 'Voir mes résultats'} <Send size={20} />
                        </button>
                    ) : (
                        <button 
                            onClick={handleNext} 
                            className="btn btn-primary"
                            disabled={!answers[currentQuestion.id]}
                        >
                            Suivant <ArrowRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Test;
