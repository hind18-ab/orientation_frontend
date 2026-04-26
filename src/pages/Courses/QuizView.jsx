import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import './QuizView.css';

const QuizView = () => {
    const { t, i18n } = useTranslation();

    const getLocalizedText = (field) => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field[i18n.language] || field['fr'] || field['ar'] || field['en'] || '';
    };
    const { formationId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    useEffect(() => {
        fetchQuiz();
    }, [formationId]);

    const fetchQuiz = async () => {
        try {
            // assuming token is attached via interceptor
            const res = await api.get(`/formations/${formationId}/quiz`);
            setQuiz(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quiz:', error);
            if (error.response && error.response.status === 404) {
                alert(t('quiz.noneForFormation', 'Aucun quiz trouvé pour cette formation.'));
                navigate('/formations');
            }
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, answerId) => {
        setAnswers({
            ...answers,
            [questionId]: answerId
        });
    };

    const handleSubmit = async () => {
        if (!quiz) return;
        
        // Ensure all questions are answered
        const unanswered = quiz.questions.filter(q => !answers[q.id]);
        if (unanswered.length > 0) {
            alert(t('quiz.answerAll', 'Veuillez répondre à toutes les questions avant de soumettre.'));
            return;
        }

        const formattedAnswers = Object.entries(answers).map(([qId, aId]) => ({
            question_id: parseInt(qId),
            answer_id: parseInt(aId)
        }));

        try {
            const res = await api.post(`/quizzes/${quiz.id}/submit`, { answers: formattedAnswers });
            setResult(res.data);
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert(t('quiz.submissionError', 'Erreur lors de la soumission du quiz.'));
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>{t('quiz.loading', 'Chargement du quiz...')}</div>;
    if (!quiz) return <div style={{ padding: '20px' }}>{t('quiz.notFound', 'Quiz introuvable.')}</div>;

    if (result) {
        return (
            <div className="quiz-page">
                <div className="quiz-container result-card">
                    <div className="quiz-header">
                        <h2>{t('quiz.results', 'Résultats')} : {getLocalizedText(quiz.title)}</h2>
                    </div>
                    
                    <div className={`score-circle ${result.passed ? 'passed' : 'failed'}`}>
                        {result.percentage}%
                    </div>
                    
                    <div className="result-message">
                        {result.passed ? t('quiz.passedMessage', 'Félicitations, vous avez réussi !') : t('quiz.failedMessage', 'Dommage, vous n\'avez pas atteint le score requis.')}
                    </div>
                    
                    <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                        {t('quiz.score', 'Score')}: {result.score} / {result.total_questions} {t('quiz.correctQuestions', 'questions correctes')}
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button onClick={() => navigate('/formations')} className="btn-submit-quiz" style={{ maxWidth: '200px', margin: '0' }}>
                            {t('quiz.backToFormations', 'Retour aux formations')}
                        </button>
                        
                        {result.passed && (
                            <button 
                                onClick={async () => {
                                    try {
                                        const res = await api.post(`/formations/${formationId}/certificate/generate`);
                                        window.location.href = res.data.download_url;
                                    } catch (err) {
                                        alert(err.response?.data?.message || t('quiz.certError', 'Erreur lors de la génération du certificat.'));
                                    }
                                }}
                                className="btn-submit-quiz" 
                                style={{ maxWidth: '200px', margin: '0', background: '#10b981' }}
                            >
                                {t('quiz.downloadCertificate', 'Télécharger le Certificat')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-page">
            <div className="quiz-container">
                <div className="quiz-header">
                    <h2>{getLocalizedText(quiz.title)}</h2>
                    <p>{getLocalizedText(quiz.description)}</p>
                </div>
                
                {quiz.questions.map((q, index) => (
                    <div key={q.id} className="question-card">
                        <h4>{index + 1}. {getLocalizedText(q.question_text)}</h4>
                        <div className="options-list">
                            {q.answers.map(a => (
                                <label 
                                    key={a.id} 
                                    className={`option-label ${answers[q.id] === a.id ? 'selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name={`question_${q.id}`}
                                        value={a.id}
                                        checked={answers[q.id] === a.id}
                                        onChange={() => handleOptionSelect(q.id, a.id)}
                                    />
                                    {getLocalizedText(a.answer_text)}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <button 
                    onClick={handleSubmit} 
                    className="btn-submit-quiz"
                >
                    {t('quiz.submitQuiz', 'Soumettre le Quiz')}
                </button>
            </div>
        </div>
    );
};

export default QuizView;
