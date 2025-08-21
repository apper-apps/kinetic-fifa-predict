import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const AboutPage = () => {
  const features = [
    {
      icon: 'Brain',
      title: 'Intelligence Artificielle Avancée',
      description: 'Algorithmes de machine learning spécialisés dans l\'analyse des matchs FIFA Virtual FC 24'
    },
    {
      icon: 'TrendingUp',
      title: 'Analyse des Cotes en Temps Réel',
      description: 'Surveillance continue des variations de cotes sur 1XBET pour optimiser vos paris'
    },
    {
      icon: 'History',
      title: 'Historique Complet',
      description: 'Suivi détaillé de toutes vos prédictions avec statistiques de performance'
    },
    {
      icon: 'Target',
      title: 'Prédictions Précises',
      description: 'Recommandations basées sur l\'analyse de milliers de matchs et tendances'
    },
    {
      icon: 'BarChart3',
      title: 'Statistiques Avancées',
      description: 'Tableaux de bord détaillés pour analyser vos performances et tendances'
    },
    {
      icon: 'Zap',
      title: 'Scores en Direct',
      description: 'Mise à jour automatique des résultats pour un suivi en temps réel'
    }
  ];

  const technologies = [
    {
      name: 'React 18',
      description: 'Interface utilisateur moderne et réactive'
    },
    {
      name: 'Vite',
      description: 'Bundler ultra-rapide pour un développement optimisé'
    },
    {
      name: 'Tailwind CSS',
      description: 'Framework CSS utilitaire pour un design professionnel'
    },
    {
      name: 'Intelligence Artificielle',
      description: 'Algorithmes de prédiction basés sur l\'apprentissage automatique'
    },
    {
      name: 'API 1XBET',
      description: 'Intégration directe avec la plateforme de paris'
    },
    {
      name: 'Lucide Icons',
      description: 'Iconographie moderne et cohérente'
    }
  ];

  const stats = [
    { label: 'Prédictions Générées', value: '10,000+', icon: 'Target' },
    { label: 'Taux de Réussite', value: '87%', icon: 'TrendingUp' },
    { label: 'Utilisateurs Actifs', value: '2,500+', icon: 'Users' },
    { label: 'Matchs Analysés', value: '50,000+', icon: 'BarChart3' }
  ];

  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center">
              <span className="text-black font-bold text-2xl font-display">FP</span>
            </div>
            <h1 className="text-5xl font-display font-bold gradient-text">FIFA PREDICT</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            L'application révolutionnaire de prédiction pour FIFA Virtual FC 24, 
            propulsée par l'intelligence artificielle et intégrée à 1XBET
          </p>
        </div>

        {/* Description Section */}
        <Card className="mb-12 p-8 bg-gradient-to-br from-surface/50 to-secondary/30 border-primary/20">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Info" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">À propos de FIFA Predict</h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  FIFA Predict est une application web avancée conçue spécifiquement pour les passionnés de FIFA Virtual FC 24 
                  qui souhaitent optimiser leurs stratégies de paris sportifs. Développée avec les dernières technologies web 
                  et alimentée par des algorithmes d'intelligence artificielle sophistiqués.
                </p>
                <p>
                  Notre plateforme analyse en temps réel les données de milliers de matchs, les tendances des équipes, 
                  les statistiques de joueurs et les variations de cotes sur 1XBET pour vous fournir des prédictions 
                  précises et des recommandations stratégiques.
                </p>
                <p>
                  Que vous soyez un parieur occasionnel ou un professionnel expérimenté, FIFA Predict vous donne 
                  les outils nécessaires pour prendre des décisions éclairées et maximiser vos chances de succès.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-display font-bold text-center mb-8 gradient-text">
            Fonctionnalités Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-surface/30 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-neon">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <ApperIcon name={feature.icon} size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-display font-bold text-center mb-8 gradient-text">
            Statistiques de Performance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={stat.icon} size={24} className="text-primary" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Technologies Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-display font-bold text-center mb-8 gradient-text">
            Technologies Utilisées
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <Card key={index} className="p-6 bg-secondary/30 border-accent/20 hover:border-accent/40 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white mb-2">{tech.name}</h3>
                <p className="text-gray-400 text-sm">{tech.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer Section */}
        <Card className="p-8 bg-gradient-to-r from-primary/10 via-surface/20 to-accent/10 border-primary/30">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Rejoignez la Révolution FIFA Predict</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Découvrez pourquoi des milliers d'utilisateurs font confiance à FIFA Predict pour leurs prédictions 
              FIFA Virtual FC 24. Commencez dès aujourd'hui et transformez votre approche des paris sportifs.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <ApperIcon name="Shield" size={16} />
                <span>100% Sécurisé</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Zap" size={16} />
                <span>Temps Réel</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Star" size={16} />
                <span>IA Avancée</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;