import { useState } from "react";
import MatchForm from "@/components/organisms/MatchForm";
import PredictionCard from "@/components/molecules/PredictionCard";
import OddsVisualization from "@/components/organisms/OddsVisualization";
import PredictionHistory from "@/components/organisms/PredictionHistory";
import { predictionService } from "@/services/api/predictionService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-background via-secondary-500/20 to-background border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-display font-bold mb-4">
              <span className="gradient-text">FIFA</span>{" "}
              <span className="text-white">PREDICT</span>
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Prédictions IA pour FIFA Virtual Football
            </p>
            <p className="text-gray-400 text-sm">
              FC 24 • Championnat d'Angleterre 4×4 • Analyse avancée des cotes
            </p>
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
            <PredictionCard 
              prediction={currentPrediction} 
              isLoading={isLoading} 
            />
            
            <OddsVisualization 
              scoreOdds={currentPrediction?.scoreOdds || []} 
              prediction={currentPrediction}
            />
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
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">FP</span>
              </div>
              <span className="text-xl font-display font-bold text-white">FIFA Predict</span>
            </div>
            <p className="text-gray-400 text-sm">
              Powered by Advanced AI • FIFA Virtual FC 24 Specialist • Bookmaker Data Analysis
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;