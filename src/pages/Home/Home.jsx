import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, Target, Zap, CheckCircle, ArrowRight, BarChart3 } from 'lucide-react';
import heroImg from '../../assets/hero-illustration.png';
import './Home.css';

const Home = () => {
    const { t } = useTranslation();
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <div className="home-wrapper">
            <section className="hero-section">
                <div className="container hero-grid">
                    <motion.div 
                        className="hero-text"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.h1 variants={itemVariants}>
                            {t('home.heroTitle', "Définissez votre Avenir dès aujourd'hui.")}
                        </motion.h1>
                        <motion.p variants={itemVariants}>
                            {t('home.heroSubtitle', "Grâce à notre test d'orientation, découvrez les métiers et les formations qui vous correspondent vraiment.")}
                        </motion.p>
                        <motion.div className="hero-actions" variants={itemVariants}>
                            <Link to="/test" className="btn btn-primary btn-xl">
                                {t('home.startTest', 'Commencer le Test')} <ArrowRight size={20} />
                            </Link>
                            <Link to="/register" className="btn btn-outline btn-xl">
                                {t('home.createProfile', 'Créer un profil')}
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div 
                        className="hero-image"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <img src={heroImg} alt="Orientation Illustration" />
                        <div className="blob blob-1"></div>
                        <div className="blob blob-2"></div>
                    </motion.div>
                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">{t('home.whyTrustUs', 'Pourquoi nous faire confiance ?')}</h2>
                        <p>{t('home.methodology', 'Une méthodologie rigoureuse pour des résultats concrets.')}</p>
                    </div>

                    <div className="features-grid">
                        <motion.div 
                            className="feature-card glass-card"
                            whileHover={{ y: -10 }}
                        >
                            <div className="icon-box purple">
                                <Zap size={24} />
                            </div>
                            <h3>{t('home.fastAnalysis', 'Analyse Rapide')}</h3>
                            <p>{t('home.fastAnalysisDesc', 'Obtenez un profil détaillé en moins de 10 minutes avec des questions optimisées.')}</p>
                        </motion.div>

                        <motion.div 
                            className="feature-card glass-card"
                            whileHover={{ y: -10 }}
                        >
                            <div className="icon-box blue">
                                <Target size={24} />
                            </div>
                            <h3>{t('home.precision', 'Précision')}</h3>
                            <p>{t('home.precisionDesc', 'Nous analysons vos réponses pour détecter vos talents cachés.')}</p>
                        </motion.div>

                        <motion.div 
                            className="feature-card glass-card"
                            whileHover={{ y: -10 }}
                        >
                            <div className="icon-box green">
                                <BarChart3 size={24} />
                            </div>
                            <h3>{t('home.visualReport', 'Rapport Visuel')}</h3>
                            <p>{t('home.visualReportDesc', 'Visualisez vos scores par domaine avec des graphiques interactifs et clairs.')}</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <h2>{t('home.readyToFindWay', 'Prêt à trouver votre voie ?')}</h2>
                        <p>{t('home.joinThousands', "Rejoignez des milliers d'étudiants qui ont déjà trouvé leur chemin.")}</p>
                        <Link to="/test" className="btn btn-primary btn-xl">{t('home.doTestNow', 'Faire le test maintenant')}</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
