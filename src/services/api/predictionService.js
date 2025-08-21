import predictionsData from "@/services/mockData/predictions.json";
import { scoresService } from "./scoresService";
import { megapariService } from "./megapariService";

class PredictionService {
  constructor() {
this.predictions = [...predictionsData];
    this.megapariIntegration = true;
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.predictions];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const prediction = this.predictions.find(p => p.Id === parseInt(id));
    if (!prediction) {
      throw new Error(`Prédiction avec l'ID ${id} non trouvée`);
    }
    return { ...prediction };
  }

  async create(predictionData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const highestId = this.predictions.reduce((max, p) => Math.max(max, p.Id), 0);
    const newPrediction = {
      Id: highestId + 1,
      ...predictionData,
      timestamp: predictionData.timestamp || new Date().toISOString()
    };
    
    this.predictions.push(newPrediction);
    return { ...newPrediction };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.predictions.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Prédiction avec l'ID ${id} non trouvée`);
    }
    
    this.predictions[index] = {
      ...this.predictions[index],
      ...updateData,
      Id: parseInt(id)
    };
    
    return { ...this.predictions[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.predictions.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Prédiction avec l'ID ${id} non trouvée`);
    }
    
    const deletedPrediction = this.predictions.splice(index, 1)[0];
    return { ...deletedPrediction };
  }

  async getByTeams(homeTeam, awayTeam) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.predictions.filter(p => 
      p.homeTeam.toLowerCase().includes(homeTeam.toLowerCase()) ||
      p.awayTeam.toLowerCase().includes(awayTeam.toLowerCase())
    ).map(p => ({ ...p }));
  }

  async getByDateRange(startDate, endDate) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.predictions.filter(p => {
      const matchDate = new Date(p.matchDateTime);
      return matchDate >= start && matchDate <= end;
    }).map(p => ({ ...p }));
  }

  async updateResult(id, actualScore) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.predictions.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Prédiction avec l'ID ${id} non trouvée`);
    }
    
    const prediction = this.predictions[index];
    const isCorrect = prediction.predictedScore === actualScore;
    
    this.predictions[index] = {
      ...prediction,
      actualResult: {
        actualScore,
        correct: isCorrect
      }
    };
    
    return { ...this.predictions[index] };
  }

  async getAccuracyStats() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const completedPredictions = this.predictions.filter(p => p.actualResult);
    const totalPredictions = completedPredictions.length;
    const correctPredictions = completedPredictions.filter(p => p.actualResult.correct).length;
    
    return {
      totalPredictions: this.predictions.length,
      completedPredictions: totalPredictions,
      correctPredictions,
      accuracyRate: totalPredictions > 0 ? Math.round((correctPredictions / totalPredictions) * 100) : 0,
      pendingPredictions: this.predictions.length - totalPredictions
    };
}

async checkScoresWith1XBET(predictionId) {
    const prediction = this.predictions.find(p => p.Id === parseInt(predictionId));
    if (!prediction) {
      throw new Error(`Prédiction avec l'ID ${predictionId} non trouvée`);
    }

    try {
      // Vérifier d'abord avec MEGAPARI ID 1159894415
      let scoreResult = null;
      if (this.megapariIntegration) {
        try {
          const megapariResult = await megapariService.getMegapariPredictions(
            prediction.homeTeam, 
            prediction.awayTeam, 
            prediction.matchDateTime
          );
          
          if (megapariResult && megapariResult.exactScorePrediction) {
            scoreResult = {
              actualScore: megapariResult.exactScorePrediction.recommendedScore,
              correct: megapariResult.exactScorePrediction.recommendedScore === prediction.predictedScore,
              source: 'MEGAPARI',
              confidence: megapariResult.confidence
            };
          }
        } catch (megapariError) {
          console.log('MEGAPARI non disponible, utilisation 1XBET:', megapariError.message);
        }
      }
      
      // Fallback vers 1XBET si MEGAPARI n'est pas disponible
      if (!scoreResult) {
        scoreResult = await scoresService.verifyPredictionResult(prediction);
        scoreResult.source = '1XBET';
      }
      
      if (scoreResult.actualScore) {
        // Match terminé - mettre à jour le résultat
        await this.updateResult(predictionId, scoreResult.actualScore);
        return {
          status: 'terminé',
          actualScore: scoreResult.actualScore,
          correct: scoreResult.correct,
          source: scoreResult.source,
          confidence: scoreResult.confidence,
          message: scoreResult.correct ? 
            `Prédiction correcte via ${scoreResult.source}! 🎉` : 
            `Prédiction incorrecte. Score réel ${scoreResult.source}: ${scoreResult.actualScore}`
        };
      } else if (scoreResult.currentScore) {
        // Match en cours
        return {
          status: 'en_cours',
          currentScore: scoreResult.currentScore,
          minute: scoreResult.minute,
          source: scoreResult.source,
          message: `Match en cours (${scoreResult.source}): ${scoreResult.currentScore} (${scoreResult.minute}')`
        };
      } else {
        // Match à venir
        return {
          status: 'a_venir',
          message: 'Match pas encore commencé'
        };
      }
    } catch (error) {
      return {
        status: 'erreur',
        message: `Erreur vérification: ${error.message}`
      };
    }
  }

async checkAllPendingScores() {
    const pendingPredictions = this.predictions.filter(p => !p.actualResult);
    const results = [];

    for (const prediction of pendingPredictions) {
      try {
        const result = await this.checkScoresWith1XBET(prediction.Id);
        results.push({
          predictionId: prediction.Id,
          homeTeam: prediction.homeTeam,
          awayTeam: prediction.awayTeam,
          megapariId: megapariService.applicationId,
          ...result
        });
      } catch (error) {
        results.push({
          predictionId: prediction.Id,
          homeTeam: prediction.homeTeam,
          awayTeam: prediction.awayTeam,
          error: error.message
        });
      }
    }

    return results;
  }

  // Nouvelle méthode pour prédictions MEGAPARI avancées
  async generateMegapariPrediction(matchData) {
    try {
      const megapariResult = await megapariService.getMegapariPredictions(
        matchData.homeTeam,
        matchData.awayTeam,
        matchData.dateTime
      );

      // Enrichir avec les calculs mathématiques
      const enhancedPrediction = {
        homeTeam: matchData.homeTeam,
        awayTeam: matchData.awayTeam,
        matchDateTime: matchData.dateTime,
        predictedScore: megapariResult.exactScorePrediction.recommendedScore,
        confidence: megapariResult.confidence,
        scoreOdds: megapariResult.mathematicalProbabilities.slice(0, 20),
        topPredictions: megapariResult.mathematicalProbabilities.slice(0, 3).map(p => ({
          score: p.score,
          probability: p.probability
        })),
        megapariData: {
          applicationId: megapariResult.applicationId,
          geneticOptimization: megapariResult.geneticOptimization,
          methodology: megapariResult.exactScorePrediction.methodology
        },
        timestamp: new Date().toISOString()
      };

      return enhancedPrediction;
    } catch (error) {
      throw new Error(`Erreur prédiction MEGAPARI: ${error.message}`);
    }
  }
}

export const predictionService = new PredictionService();