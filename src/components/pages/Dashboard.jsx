import React, { useEffect, useState } from "react";
import { predictionService } from "@/services/api/predictionService";
import { scoresService } from "@/services/api/scoresService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import PredictionHistory from "@/components/organisms/PredictionHistory";
import MatchForm from "@/components/organisms/MatchForm";
import OddsVisualization from "@/components/organisms/OddsVisualization";
import PredictionCard from "@/components/molecules/PredictionCard";

const Dashboard = () => {
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);

// Vérification automatique des scores au démarrage
  useEffect(() => {
    const checkScoresOnStartup = async () => {
      try {
        const results = await predictionService.checkAllPendingScores();
        const finished = results.filter(r => r.status === 'terminé');
        if (finished.length > 0) {
          toast.success(`${finished.length} nouveau(x) résultat(s) récupéré(s) depuis 1XBET!`);
          setRefreshHistory(prev => prev + 1);
        }
      } catch (error) {
        console.log('Vérification automatique échouée:', error.message);
      }
    };

    // Vérifier après 2 secondes de chargement
    setTimeout(checkScoresOnStartup, 2000);
  }, []);

  const generatePrediction = async (matchData) => {
    setIsLoading(true);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Analyze odds to generate prediction
      const analysis = analyzeOdds(matchData.scoreOdds);
      
      const prediction = {
        homeTeam: matchData.homeTeam,
        awayTeam: matchData.awayTeam,
        matchDateTime: matchData.dateTime,
        scoreOdds: matchData.scoreOdds,
        predictedScore: analysis.predictedScore,
        confidence: analysis.confidence,
        topPredictions: analysis.topPredictions,
        timestamp: new Date().toISOString()
      };

      // Save prediction
      await predictionService.create(prediction);
      
      setCurrentPrediction(prediction);
      setRefreshHistory(prev => prev + 1);
      
      toast.success(`Prédiction générée: ${analysis.predictedScore} avec ${analysis.confidence}% de confiance!`);
      
      // Vérifier immédiatement si le match a déjà un résultat sur 1XBET
      try {
        const scoreCheck = await scoresService.verifyPredictionResult(prediction);
        if (scoreCheck.actualScore) {
          toast.info(`Résultat déjà disponible sur 1XBET: ${scoreCheck.actualScore}`);
        } else if (scoreCheck.currentScore) {
          toast.info(`Match en cours sur 1XBET: ${scoreCheck.currentScore} (${scoreCheck.minute}')`);
        }
      } catch (error) {
        // Ignore les erreurs de vérification automatique
      }
      
    } catch (error) {
      console.error("Error generating prediction:", error);
      toast.error("Erreur lors de la génération de la prédiction");
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeOdds = (scoreOdds) => {
    // Advanced AI-like analysis algorithm
    const validScores = scoreOdds.filter(item => 
      item.score && item.coefficient && !isNaN(item.coefficient)
    );

    // Calculate weighted probabilities
    const scoreProbabilities = validScores.map(item => ({
      score: item.score,
      coefficient: parseFloat(item.coefficient),
      probability: parseFloat(item.probability),
      weight: 1 / parseFloat(item.coefficient)
    }));

    // Sort by probability (highest first)
    const sortedScores = scoreProbabilities.sort((a, b) => b.probability - a.probability);
    
    // AI prediction logic - factor in multiple variables
    let predictedScore = sortedScores[0]?.score || "0-0";
    let baseConfidence = sortedScores[0]?.probability || 0;

    // Boost confidence based on analysis depth
    const analysisDepth = validScores.length;
    let confidenceMultiplier = 1;
    
    if (analysisDepth >= 15) confidenceMultiplier = 1.3;
    else if (analysisDepth >= 10) confidenceMultiplier = 1.2;
    else if (analysisDepth >= 5) confidenceMultiplier = 1.1;

    // Apply coefficient clustering analysis
    const avgCoefficient = scoreProbabilities.reduce((sum, item) => sum + item.coefficient, 0) / scoreProbabilities.length;
    const topScore = sortedScores[0];
    
    if (topScore && topScore.coefficient < avgCoefficient * 0.8) {
      confidenceMultiplier *= 1.15; // High confidence for low coefficient
    }

    // Calculate final confidence (max 95%)
    const finalConfidence = Math.min(95, Math.round(baseConfidence * confidenceMultiplier));

    // Generate alternative predictions
    const topPredictions = sortedScores.slice(0, 5).map(score => ({
      score: score.score,
      probability: score.probability
    }));

    return {
      predictedScore,
      confidence: finalConfidence,
      topPredictions
    };
  };

return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-background via-secondary-500/20 to-background border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-display font-bold mb-4">
              <span className="gradient-text">FIFA</span>{" "}
              <span className="text-white">PREDICT</span>
            </h1>
            <p className="text-xl text-gray-300 mb-2">Prédictions IA pour FIFA Virtual Football</p>
            <p className="text-gray-400 text-sm">FC 24 • Championnat d'Angleterre 4×4 • Analyse avancée des cotes</p>
          </div>
        </div>
      </div>
      {/* Main Content */}
    <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Match Form */}
            <div className="space-y-6">
                <MatchForm onSubmit={generatePrediction} isLoading={isLoading} />
            </div>
            {/* Right Column - Prediction & Visualization */}
            <div className="space-y-6">
                <PredictionCard prediction={currentPrediction} isLoading={isLoading} />
                <OddsVisualization
                    scoreOdds={currentPrediction?.scoreOdds || []}
                    prediction={currentPrediction} />
            </div>
        </div>
        {/* History Section */}
        <div className="mt-12">
            <PredictionHistory refreshTrigger={refreshHistory} />
        </div>
    </div>
    {/* Footer */}
    <footer className="bg-surface/30 border-t border-primary/20 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Logo et Description */}
                <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                            <span className="text-black font-bold text-sm">FP</span>
                        </div>
                        <span className="text-xl font-display font-bold text-white">FIFA Predict</span>
                    </div>
                    <p className="text-gray-400 text-sm">Powered by Advanced AI • FIFA Virtual FC 24 Specialist • Intégration 1XBET • Scores en Temps Réel</p>
                </div>

                {/* Moyens de Paiement */}
                <div className="text-center">
                    <h3 className="text-white font-semibold mb-4 flex items-center justify-center gap-2">
                        <ApperIcon name="CreditCard" size={18} className="text-primary" />
                        Moyens de Paiement
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg px-3 py-2">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">O</span>
                            </div>
                            <span className="text-white text-sm font-medium">Orange</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-black text-xs font-bold">M</span>
                            </div>
                            <span className="text-white text-sm font-medium">MTN</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg px-3 py-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <ApperIcon name="Waves" size={12} className="text-white" />
                            </div>
                            <span className="text-white text-sm font-medium">Wave</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-lg px-3 py-2">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <ApperIcon name="Coins" size={12} className="text-white" />
                            </div>
                            <span className="text-white text-sm font-medium">Moov</span>
                        </div>
                    </div>
                </div>

                {/* Contact Créateur */}
                <div className="text-center md:text-right">
                    <h3 className="text-white font-semibold mb-4 flex items-center justify-center md:justify-end gap-2">
                        <ApperIcon name="User" size={18} className="text-accent" />
                        Créateur
                    </h3>
                    <div className="space-y-3">
                        <p className="text-primary font-medium">Ange Christ</p>
                        <div className="space-y-2">
                            <a href="https://wa.me/2250503951888" target="_blank" rel="noopener noreferrer" 
                               className="flex items-center justify-center md:justify-end gap-2 text-green-400 hover:text-green-300 transition-colors">
                                <ApperIcon name="MessageCircle" size={16} />
                                <span className="text-sm">WhatsApp: 0503951888</span>
                            </a>
                            <a href="https://t.me/+2250710335536" target="_blank" rel="noopener noreferrer"
                               className="flex items-center justify-center md:justify-end gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                                <ApperIcon name="Send" size={16} />
                                <span className="text-sm">Telegram: 0710335536</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Séparateur */}
            <div className="border-t border-primary/20 pt-6">
                <p className="text-center text-gray-500 text-xs">
                    © 2024 FIFA Predict - Tous droits réservés • Développé avec ❤️ par Ange Christ
                </p>
            </div>
        </div>
    </footer>
</div>
  );
};

export default Dashboard;