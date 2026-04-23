import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Award, Share2, Download, RefreshCw, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import FormationCard from '../../components/Formations/FormationCard';
import './Results.css';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const Results = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formations, setFormations] = useState([]);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response = await api.get('/orientation/results/latest');
                setResult(response.data);
            } catch (error) {
                console.error('Error fetching result', error);
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, []);

    useEffect(() => {
        if (result && result.recommended_formations) {
            setFormations(result.recommended_formations);
        }
    }, [result]);

    if (loading) return <div className="loading">Chargement de vos résultats...</div>;

    if (!result) return (
        <div className="no-result container">
            <h2>Aucun résultat trouvé</h2>
            <p>Il semble que vous n'ayez pas encore passé le test.</p>
            <Link to="/test" className="btn btn-primary">Passer le test maintenant</Link>
        </div>
    );

    const chartData = {
        labels: Object.keys(result.scores),
        datasets: [
            {
                label: 'Votre Score',
                data: Object.values(result.scores),
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(37, 99, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(37, 99, 235, 1)',
            },
        ],
    };

    const chartOptions = {
        scales: {
            r: {
                angleLines: { display: true },
                suggestedMin: 0,
                suggestedMax: 10,
                ticks: { stepSize: 2 }
            }
        },
        plugins: {
            legend: { display: false }
        }
    };

    return (
        <div className="results-page">
            <div className="container results-container">
                <header className="results-header">
                    <div className="award-icon"><Award size={48} /></div>
                    <h1>Félicitations !</h1>
                    <p>Voici votre profil d'orientation basé sur vos réponses.</p>
                </header>

                <div className="results-grid">
                    <div className="primary-result card">
                        <h3>Domaine Dominant</h3>
                        <div className="domain-badge">{result.primary_domain.name}</div>
                        <p className="domain-description">{result.primary_domain.description || "Vous avez une forte affinité pour ce domaine, ce qui indique des aptitudes et un intérêt marqué pour les activités qui y sont liées."}</p>
                    </div>

                    <div className="chart-section card">
                        <h3>Visualisation de votre profil</h3>
                        <div className="chart-container">
                            <Radar data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                <div className="recommended-formations card">
                    <div className="section-header">
                        <BookOpen className="section-icon" size={24} />
                        <h3>Formations Recommandées</h3>
                    </div>
                    <p className="section-subtitle">Basé sur votre affinité pour le domaine : <strong>{result.primary_domain.name}</strong></p>
                    
                    {formations.length > 0 ? (
                        <div className="formations-grid">
                            {formations.map(formation => (
                                <FormationCard key={formation.id} formation={formation} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-formations">
                            <p>Aucune formation spécifique n'est actuellement répertoriée pour ce domaine.</p>
                        </div>
                    )}
                </div>

                <div className="detailed-scores card">
                    <h3>Scores par domaine</h3>
                    <div className="scores-list">
                        {Object.entries(result.scores).map(([domain, score]) => (
                            <div key={domain} className="score-item">
                                <span className="score-label">{domain}</span>
                                <div className="score-bar-bg">
                                    <div className="score-bar-fill" style={{ width: `${(score / 20) * 100}%` }}></div>
                                </div>
                                <span className="score-value">{score} pts</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="results-actions">
                    <button className="btn btn-outline" onClick={() => window.print()}>
                        <Download size={20} /> Télécharger PDF
                    </button>
                    <button className="btn btn-outline">
                        <Share2 size={20} /> Partager
                    </button>
                    <Link to="/test" className="btn btn-primary">
                        <RefreshCw size={20} /> Refaire le test
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Results;
