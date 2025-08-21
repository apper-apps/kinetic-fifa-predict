import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const PredictionCard = ({ prediction, isLoading }) => {
  const [displayConfidence, setDisplayConfidence] = useState(0);

  useEffect(() => {
    if (prediction?.confidence && !isLoading) {
      const timer = setTimeout(() => {
        setDisplayConfidence(prediction.confidence);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [prediction?.confidence, isLoading]);

  if (isLoading) {
    return (
      <Card className="h-[200px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mx-auto mb-4">
            <ApperIcon name="Loader2" size={32} className="text-primary" />
          </div>
          <p className="text-gray-300">Analyse IA en cours...</p>
          <p className="text-sm text-gray-500 mt-2">Traitement des données des bookmakers</p>
        </div>
      </Card>
    );
  }

  if (!prediction) {
    return (
      <Card className="h-[200px] flex items-center justify-center border-dashed border-primary/30">
        <div className="text-center">
          <ApperIcon name="Brain" size={48} className="mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400 font-medium">Prédiction IA</p>
          <p className="text-sm text-gray-500 mt-2">
            Remplissez le formulaire pour obtenir une prédiction
          </p>
        </div>
      </Card>
    );
  }

  const getConfidenceColor = () => {
    if (displayConfidence >= 80) return "text-primary";
    if (displayConfidence >= 60) return "text-accent";
    if (displayConfidence >= 40) return "text-warning";
    return "text-gray-400";
  };

  const getConfidenceGlow = () => {
    if (displayConfidence >= 80) return "shadow-neon";
    if (displayConfidence >= 60) return "shadow-gold";
    return "";
  };

return (
    <Card className={`relative overflow-hidden ${getConfidenceGlow()}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <ApperIcon name="Target" size={20} className="text-primary" />
            Prédiction IA
            {prediction.headToHeadData?.totalMatches >= 3 && (
              <span className="ml-1 px-1 py-0.5 bg-accent/20 text-accent text-xs rounded">H2H</span>
            )}
          </h3>
          <div className="flex items-center gap-2">
            <ApperIcon name="Zap" size={16} className="text-accent" />
            <span className="text-xs text-gray-400">Mi-temps</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl font-display font-bold gradient-text mb-2 animate-glow">
            {prediction.predictedScore}
            {prediction.megapariData && (
              <span className="ml-2 px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                MEGAPARI
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">Score exact prédit (1ère mi-temps)</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getConfidenceColor()}`}>
              {displayConfidence}%
            </div>
            <p className="text-xs text-gray-500">Confiance</p>
          </div>
          
          <div className="h-16 w-16 relative">
            <svg className="transform -rotate-90 w-16 h-16">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-gray-700"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - displayConfidence / 100)}`}
                className={`${getConfidenceColor()} transition-all duration-1000 ease-out`}
                style={{
                  filter: displayConfidence >= 60 ? "drop-shadow(0 0 6px currentColor)" : "none"
                }}
              />
            </svg>
          </div>

          <div className="text-center">
            <div className="text-lg font-semibold text-white">
              {prediction.scoreOdds?.length || 0}/20
            </div>
            <p className="text-xs text-gray-500">Scores analysés</p>
          </div>
        </div>

        {/* Head-to-Head Stats */}
        {prediction.headToHeadData?.totalMatches >= 3 && (
          <div className="mt-4 pt-4 border-t border-accent/20">
            <div className="flex items-center gap-2 mb-3">
              <ApperIcon name="Zap" size={14} className="text-accent" />
              <p className="text-xs text-gray-400 font-medium">Confrontations directes analysées:</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-surface/30 rounded p-2">
                <div className="text-primary font-bold">{prediction.headToHeadData.homeWinPercentage}%</div>
                <div className="text-gray-500">{prediction.homeTeam}</div>
              </div>
              <div className="bg-surface/30 rounded p-2">
                <div className="text-warning font-bold">{prediction.headToHeadData.drawPercentage}%</div>
                <div className="text-gray-500">Nuls</div>
              </div>
              <div className="bg-surface/30 rounded p-2">
                <div className="text-error font-bold">{prediction.headToHeadData.awayWinPercentage}%</div>
                <div className="text-gray-500">{prediction.awayTeam}</div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-xs text-gray-500">
                {prediction.headToHeadData.totalMatches} matchs • Moy: {prediction.headToHeadData.avgGoalsPerMatch} buts
              </span>
            </div>
          </div>
        )}

        {prediction.topPredictions && (
          <div className="mt-4 pt-4 border-t border-primary/20">
            <p className="text-xs text-gray-400 mb-2">Autres scores probables:</p>
            <div className="flex flex-wrap gap-2">
              {prediction.topPredictions.slice(1, 4).map((score, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-surface/50 rounded text-xs text-gray-300 border border-primary/10"
                >
                  {score.score} ({score.probability}%)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PredictionCard;