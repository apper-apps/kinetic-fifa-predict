import React, { useEffect, useState } from 'react';
import { predictionService } from '@/services/api/predictionService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ReactApexChart from 'react-apexcharts';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [accuracyStats, allPredictions] = await Promise.all([
        predictionService.getAccuracyStats(),
        predictionService.getAll()
      ]);
      
      setStats(accuracyStats);
      setPredictions(allPredictions);
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    const completedPredictions = predictions.filter(p => p.actualResult);
    const last30Days = completedPredictions.slice(-30);
    
    // Accuracy over time
    const accuracyData = last30Days.map((prediction, index) => ({
      x: format(new Date(prediction.timestamp), 'dd/MM', { locale: fr }),
      y: prediction.actualResult.correct ? 100 : 0
    }));

    // Confidence vs Accuracy
    const confidenceData = completedPredictions.map(p => ({
      x: p.confidence,
      y: p.actualResult.correct ? 1 : 0
    }));

    return { accuracyData, confidenceData };
  };

  const getTopPerformingScores = () => {
    const scoreStats = {};
    
    predictions
      .filter(p => p.actualResult)
      .forEach(p => {
        const score = p.predictedScore;
        if (!scoreStats[score]) {
          scoreStats[score] = { total: 0, correct: 0 };
        }
        scoreStats[score].total++;
        if (p.actualResult.correct) {
          scoreStats[score].correct++;
        }
      });

    return Object.entries(scoreStats)
      .map(([score, stats]) => ({
        score,
        accuracy: Math.round((stats.correct / stats.total) * 100),
        total: stats.total
      }))
      .filter(item => item.total >= 3)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 5);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStatistics} />;

  const { accuracyData, confidenceData } = getChartData();
  const topScores = getTopPerformingScores();

  const accuracyChartOptions = {
    chart: {
      type: 'line',
      height: 250,
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: true }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#00FF87'],
    xaxis: {
      labels: { style: { colors: '#9CA3AF' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: { 
        formatter: (val) => `${val}%`,
        style: { colors: '#9CA3AF' }
      },
      min: 0,
      max: 100
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 3
    },
    tooltip: {
      theme: 'dark'
    }
  };

  const confidenceChartOptions = {
    chart: {
      type: 'scatter',
      height: 250,
      background: 'transparent',
      toolbar: { show: false }
    },
    colors: ['#FFD700'],
    xaxis: {
      title: { text: 'Confiance (%)', style: { color: '#9CA3AF' } },
      labels: { style: { colors: '#9CA3AF' } }
    },
    yaxis: {
      title: { text: 'Succès', style: { color: '#9CA3AF' } },
      labels: { 
        formatter: (val) => val === 1 ? 'Oui' : 'Non',
        style: { colors: '#9CA3AF' }
      },
      min: -0.1,
      max: 1.1
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 3
    },
    tooltip: {
      theme: 'dark'
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold mb-4">
            <span className="gradient-text">Statistiques</span>{' '}
            <span className="text-white">Avancées</span>
          </h1>
          <p className="text-gray-400">Analyse détaillée de vos performances de prédiction</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Target" size={24} className="text-black" />
            </div>
            <div className="text-3xl font-bold gradient-text mb-2">
              {stats?.accuracyRate || 0}%
            </div>
            <p className="text-gray-400 text-sm">Taux de Réussite</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-info to-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="BarChart3" size={24} className="text-black" />
            </div>
            <div className="text-3xl font-bold text-info mb-2">
              {stats?.totalPredictions || 0}
            </div>
            <p className="text-gray-400 text-sm">Total Prédictions</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-accent to-warning rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="CheckCircle" size={24} className="text-black" />
            </div>
            <div className="text-3xl font-bold text-accent mb-2">
              {stats?.correctPredictions || 0}
            </div>
            <p className="text-gray-400 text-sm">Prédictions Correctes</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-warning to-error rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Clock" size={24} className="text-black" />
            </div>
            <div className="text-3xl font-bold text-warning mb-2">
              {stats?.pendingPredictions || 0}
            </div>
            <p className="text-gray-400 text-sm">En Attente</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={20} className="text-black" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Précision dans le Temps</h3>
                <p className="text-sm text-gray-400">Évolution de vos performances</p>
              </div>
            </div>
            <ReactApexChart
              options={accuracyChartOptions}
              series={[{ name: 'Précision', data: accuracyData }]}
              type="line"
              height={250}
            />
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-warning rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={20} className="text-black" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Confiance vs Succès</h3>
                <p className="text-sm text-gray-400">Corrélation confiance/résultats</p>
              </div>
            </div>
            <ReactApexChart
              options={confidenceChartOptions}
              series={[{ name: 'Résultats', data: confidenceData }]}
              type="scatter"
              height={250}
            />
          </Card>
        </div>

        {/* Top Performing Scores */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-info to-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Crown" size={20} className="text-black" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Scores les Plus Performants</h3>
              <p className="text-sm text-gray-400">Vos scores les plus réussis (min. 3 prédictions)</p>
            </div>
          </div>

          {topScores.length > 0 ? (
            <div className="space-y-3">
              {topScores.map((scoreData, index) => (
                <div key={scoreData.score} className="flex items-center justify-between py-3 px-4 bg-surface/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-accent text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-500 text-black' :
                      'bg-primary/20 text-primary'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-lg">{scoreData.score}</div>
                      <div className="text-sm text-gray-400">{scoreData.total} prédiction{scoreData.total > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${
                      scoreData.accuracy >= 80 ? 'text-primary' :
                      scoreData.accuracy >= 60 ? 'text-accent' :
                      scoreData.accuracy >= 40 ? 'text-warning' :
                      'text-gray-400'
                    }`}>
                      {scoreData.accuracy}%
                    </div>
                    <div className="text-sm text-gray-400">de réussite</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ApperIcon name="Trophy" size={48} className="mx-auto mb-4 text-gray-600" />
              <p>Pas assez de données pour calculer les performances par score</p>
              <p className="text-sm mt-2">Continuez à faire des prédictions !</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StatsPage;