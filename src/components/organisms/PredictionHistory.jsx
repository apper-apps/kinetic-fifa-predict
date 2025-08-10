import React, { useEffect, useState } from "react";
import { predictionService } from "@/services/api/predictionService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
const PredictionHistory = ({ refreshTrigger }) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPredictions = async () => {
try {
      setLoading(true);
      setError("");
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = await predictionService.getAll();
      setPredictions(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (err) {
      setError("Erreur lors du chargement de l'historique");
      console.error("Error loading predictions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPredictions();
  }, [refreshTrigger]);

  const getAccuracyRate = () => {
    const completedPredictions = predictions.filter(p => p.actualResult);
    if (completedPredictions.length === 0) return 0;
    const correct = completedPredictions.filter(p => p.actualResult.correct).length;
    return Math.round((correct / completedPredictions.length) * 100);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "text-primary";
    if (confidence >= 60) return "text-accent";
    if (confidence >= 40) return "text-warning";
    return "text-gray-400";
  };

  const getStatusBadge = (prediction) => {
    if (prediction.actualResult) {
      return prediction.actualResult.correct ? (
        <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium border border-primary/30">
<ApperIcon name="CheckCircle" size={12} className="inline mr-1" />
          Correct
        </span>
      ) : (
        <span className="px-2 py-1 bg-error/20 text-error rounded-full text-xs font-medium border border-error/30">
          <ApperIcon name="XCircle" size={12} className="inline mr-1" />
          Incorrect
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium border border-gray-500/30">
        <ApperIcon name="Clock" size={12} className="inline mr-1" />
        En attente
      </span>
    );
  };

  const checkScore = async (predictionId) => {
    try {
      const result = await predictionService.checkScoresWith1XBET(predictionId);
      toast.success(result.message);
      if (result.status === 'terminé') {
        loadPredictions(); // Actualiser la liste
      }
    } catch (error) {
      toast.error(`Erreur lors de la vérification: ${error.message}`);
    }
  };

  const checkAllScores = async () => {
    try {
      toast.info("Vérification des scores en cours...");
      const results = await predictionService.checkAllPendingScores();
      
      const finished = results.filter(r => r.status === 'terminé');
      if (finished.length > 0) {
        toast.success(`${finished.length} résultat(s) mis à jour depuis 1XBET!`);
        loadPredictions();
      } else {
        toast.info("Aucun nouveau résultat disponible");
      }
    } catch (error) {
      toast.error(`Erreur lors de la vérification: ${error.message}`);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPredictions} />;
  if (predictions.length === 0) return <Empty />;

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-info to-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="History" size={20} className="text-black" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-white">Historique des Prédictions</h3>
            <p className="text-sm text-gray-400">
              {predictions.length} prédiction{predictions.length > 1 ? "s" : ""} • 
              Précision: {getAccuracyRate()}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={checkAllScores}
            className="flex items-center gap-2 bg-accent/10 border-accent/30 text-accent hover:bg-accent/20"
          >
            <ApperIcon name="Zap" size={16} />
            1XBET
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadPredictions}
            className="flex items-center gap-2"
          >
            <ApperIcon name="RefreshCw" size={16} />
            Actualiser
          </Button>
        </div>
      </div>

<div className="space-y-4 max-h-[500px] overflow-y-auto">
        {predictions.map((prediction) => (
          <div
            key={prediction.Id}
            className="bg-surface/30 border border-secondary-400/20 rounded-lg p-4 hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <ApperIcon name="Shield" size={16} className="text-primary" />
                <div>
                  <div className="font-medium text-white">
                    {prediction.homeTeam} vs {prediction.awayTeam}
                  </div>
                  <div className="text-xs text-gray-400">
                    {format(new Date(prediction.matchDateTime), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                  </div>
                </div>
              </div>
              {getStatusBadge(prediction)}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold gradient-text">
                  {prediction.predictedScore}
                </div>
                <div className="text-xs text-gray-500">Prédiction IA</div>
              </div>
              
              <div className="text-center">
                <div className={`text-lg font-bold ${getConfidenceColor(prediction.confidence)}`}>
                  {prediction.confidence}%
                </div>
                <div className="text-xs text-gray-500">Confiance</div>
              </div>

              <div className="text-center">
                {prediction.actualResult ? (
                  <div className="text-lg font-bold text-white">
                    {prediction.actualResult.actualScore}
                  </div>
                ) : (
                  <div className="text-lg font-bold text-gray-500">-</div>
                )}
                <div className="text-xs text-gray-500">Résultat réel</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-gray-400">Prédit:</span>{" "}
                  <span className="text-primary font-medium">{prediction.predictedScore}</span>
                </div>
                {prediction.actualResult && (
                  <div className="text-sm">
                    <span className="text-gray-400">Réel:</span>{" "}
                    <span className="text-white font-medium">{prediction.actualResult.actualScore}</span>
                  </div>
                )}
              </div>
              
              {!prediction.actualResult && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => checkScore(prediction.Id)}
                  className="text-accent hover:text-accent hover:bg-accent/10"
                >
                  <ApperIcon name="Search" size={14} />
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 mt-3">
              <span>{prediction.scoreOdds?.length || 0} scores analysés</span>
              <span>
                {format(new Date(prediction.timestamp), "dd/MM/yyyy HH:mm", { locale: fr })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PredictionHistory;