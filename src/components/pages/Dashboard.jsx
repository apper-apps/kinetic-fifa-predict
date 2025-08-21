import React, { useEffect, useState } from "react";
import { predictionService } from "@/services/api/predictionService";
import { scoresService } from "@/services/api/scoresService";
import { megapariService } from "@/services/api/megapariService";
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
        // Vérifier la connexion MEGAPARI d'abord
        const megapariStatus = await megapariService.connectToMegapari();
        if (megapariStatus.connected) {
          toast.success(`MEGAPARI connecté (ID: ${megapariStatus.applicationId})`);
        }
        
        const results = await predictionService.checkAllPendingScores();
        const finished = results.filter(r => r.status === 'terminé');
        if (finished.length > 0) {
          const megapariResults = results.filter(r => r.source === 'MEGAPARI').length;
          const xbetResults = finished.length - megapariResults;
          
          let message = `${finished.length} nouveau(x) résultat(s): `;
          if (megapariResults > 0) message += `${megapariResults} MEGAPARI, `;
          if (xbetResults > 0) message += `${xbetResults} 1XBET`;
          
          toast.success(message);
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
      toast.info('Initialisation des algorithmes MEGAPARI...');
      
      // Essayer d'abord avec MEGAPARI (ID: 1159894415)
      let prediction = null;
      let usedMegapari = false;
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        prediction = await predictionService.generateMegapariPrediction(matchData);
        usedMegapari = true;
        toast.success('Algorithmes génétiques MEGAPARI appliqués!');
      } catch (megapariError) {
        console.log('MEGAPARI indisponible, utilisation algorithmes standard:', megapariError.message);
        
        // Fallback vers l'algorithme standard
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const analysis = analyzeOdds(matchData.scoreOdds);
        
        prediction = {
          homeTeam: matchData.homeTeam,
          awayTeam: matchData.awayTeam,
          matchDateTime: matchData.dateTime,
          scoreOdds: matchData.scoreOdds,
          predictedScore: analysis.predictedScore,
          confidence: analysis.confidence,
          topPredictions: analysis.topPredictions,
          timestamp: new Date().toISOString()
        };
        
        toast.warning('Prédiction standard générée (MEGAPARI indisponible)');
      }

      // Sauvegarder la prédiction
      await predictionService.create(prediction);
      
      setCurrentPrediction(prediction);
      setRefreshHistory(prev => prev + 1);
      
      const sourceMessage = usedMegapari ? 
        `Prédiction MEGAPARI (ID: 1159894415): ${prediction.predictedScore} - Confiance: ${prediction.confidence}%` :
        `Prédiction générée: ${prediction.predictedScore} - Confiance: ${prediction.confidence}%`;
      
      toast.success(sourceMessage);
      
      // Vérification immédiate des résultats
      try {
        const scoreCheck = await scoresService.verifyPredictionResult(prediction);
        if (scoreCheck.actualScore) {
          const source = scoreCheck.source || 'API';
          toast.info(`Résultat déjà disponible (${source}): ${scoreCheck.actualScore}`);
        } else if (scoreCheck.currentScore) {
          toast.info(`Match en cours: ${scoreCheck.currentScore} (${scoreCheck.minute}')`);
        }
      } catch (error) {
        // Ignorer les erreurs de vérification automatique
      }
      
    } catch (error) {
      console.error("Erreur génération prédiction:", error);
      toast.error("Erreur lors de la génération de la prédiction");
    } finally {
      setIsLoading(false);
    }
  };

const analyzeOdds = (scoreOdds) => {
    // Algorithme d'analyse avancé avec simulation MEGAPARI
    const validScores = scoreOdds.filter(item => 
      item.score && item.coefficient && !isNaN(item.coefficient)
    );

    // Calculs de probabilités pondérées avec coefficients mathématiques
    const scoreProbabilities = validScores.map(item => ({
      score: item.score,
      coefficient: parseFloat(item.coefficient),
      probability: parseFloat(item.probability),
      weight: 1 / parseFloat(item.coefficient),
      // Simulation des facteurs MEGAPARI
      megapariWeight: Math.random() * 0.3 + 0.85, // Facteur d'optimisation
      geneticFactor: Math.random() * 0.2 + 0.9 // Simulation algorithme génétique
    }));

    // Tri par probabilité avec facteurs MEGAPARI
    const sortedScores = scoreProbabilities
      .map(item => ({
        ...item,
        adjustedProbability: item.probability * item.megapariWeight * item.geneticFactor
      }))
      .sort((a, b) => b.adjustedProbability - a.adjustedProbability);
    
    // Prédiction IA avec logique multi-variables
    let predictedScore = sortedScores[0]?.score || "0-0";
    let baseConfidence = sortedScores[0]?.adjustedProbability || 0;

    // Boost de confiance basé sur la profondeur d'analyse
    const analysisDepth = validScores.length;
    let confidenceMultiplier = 1;
    
    // Multiplicateurs inspirés des algorithmes MEGAPARI
    if (analysisDepth >= 15) confidenceMultiplier = 1.4; // Analyse très profonde
    else if (analysisDepth >= 10) confidenceMultiplier = 1.3; // Analyse profonde
    else if (analysisDepth >= 5) confidenceMultiplier = 1.2; // Analyse standard

    // Application de l'analyse de clustering des coefficients
    const avgCoefficient = scoreProbabilities.reduce((sum, item) => sum + item.coefficient, 0) / scoreProbabilities.length;
    const topScore = sortedScores[0];
    
    if (topScore && topScore.coefficient < avgCoefficient * 0.75) {
      confidenceMultiplier *= 1.2; // Forte confiance pour coefficient faible
    }

    // Facteur de cohérence des algorithmes génétiques (simulation)
    const geneticConsistency = sortedScores.slice(0, 3).reduce((sum, item) => sum + item.geneticFactor, 0) / 3;
    if (geneticConsistency > 0.95) {
      confidenceMultiplier *= 1.15; // Bonus de cohérence génétique
    }

    // Calcul de la confiance finale (max 95%, style MEGAPARI)
    const finalConfidence = Math.min(95, Math.round(baseConfidence * confidenceMultiplier));

    // Génération des prédictions alternatives avec facteurs mathématiques
    const topPredictions = sortedScores.slice(0, 5).map(score => ({
      score: score.score,
      probability: score.probability.toFixed(1),
      megapariOptimized: score.adjustedProbability.toFixed(1)
    }));

    return {
      predictedScore,
      confidence: finalConfidence,
      topPredictions,
      analysisMetadata: {
        depth: analysisDepth,
        geneticConsistency: (geneticConsistency * 100).toFixed(1),
        coefficientAnalysis: avgCoefficient.toFixed(2),
        megapariOptimization: true
      }
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
<p className="text-gray-400 text-sm">FIFA Virtual FC 24 • IA MEGAPARI ID: 1159894415 • Algorithmes Génétiques • Calculs Mathématiques Avancés</p>
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
<p className="text-gray-400 text-sm">MEGAPARI ID: 1159894415 • Algorithmes Génétiques • Probabilités Mathématiques • Coefficients d'Équipes • Scores Exacts</p>
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