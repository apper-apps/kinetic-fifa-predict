import predictionsData from "@/services/mockData/predictions.json";
import { scoresService } from "./scoresService";
import { megapariService } from "./megapariService";
import React from "react";
import Error from "@/components/ui/Error";

class PredictionService {
  constructor() {
    this.predictions = [...predictionsData];
    this.megapariIntegration = true;
    this.headToHeadData = [];
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

      // Enrichir avec les données Head-to-Head si disponibles
      let headToHeadStats = null;
      if (matchData.useHeadToHeadData) {
        headToHeadStats = this.getHeadToHeadStats(matchData.homeTeam, matchData.awayTeam);
      }

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
        headToHeadData: headToHeadStats,
        timestamp: new Date().toISOString()
      };

      // Ajuster la confiance si on a des données H2H
      if (headToHeadStats && headToHeadStats.totalMatches >= 3) {
        enhancedPrediction.confidence = Math.min(95, enhancedPrediction.confidence + 5);
      }

return enhancedPrediction;
    } catch (error) {
      throw new Error(`Erreur prédiction MEGAPARI: ${error.message}`);
    }
  }

  // Méthodes pour gestion des confrontations directes
  async getHeadToHeadData() {
    return [...this.headToHeadData];
  }

  async addHeadToHeadMatch(matchData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.headToHeadData.push({
      ...matchData,
      Id: this.headToHeadData.length + 1
    });
    return matchData;
  }

  async removeHeadToHeadMatch(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    this.headToHeadData = this.headToHeadData.filter(match => match.id !== id);
    return true;
  }

  async clearHeadToHeadData() {
    await new Promise(resolve => setTimeout(resolve, 200));
    this.headToHeadData = [];
    return true;
  }

  getHeadToHeadStats(homeTeam, awayTeam) {
    const relevantMatches = this.headToHeadData.filter(match => 
      (match.homeTeam === homeTeam && match.awayTeam === awayTeam) ||
      (match.homeTeam === awayTeam && match.awayTeam === homeTeam)
    );

    if (relevantMatches.length === 0) {
      return null;
    }

    const stats = {
      totalMatches: relevantMatches.length,
      homeTeamWins: 0,
      awayTeamWins: 0,
      draws: 0,
      homeTeamGoals: 0,
      awayTeamGoals: 0,
      avgGoalsPerMatch: 0,
      recentForm: []
    };

    relevantMatches.forEach(match => {
      let homeGoals, awayGoals;
      
      if (match.homeTeam === homeTeam) {
        homeGoals = match.homeScore;
        awayGoals = match.awayScore;
      } else {
        homeGoals = match.awayScore;
        awayGoals = match.homeScore;
      }

      stats.homeTeamGoals += homeGoals;
      stats.awayTeamGoals += awayGoals;

      if (homeGoals > awayGoals) {
        stats.homeTeamWins++;
        stats.recentForm.push('W');
      } else if (homeGoals < awayGoals) {
        stats.awayTeamWins++;
        stats.recentForm.push('L');
      } else {
        stats.draws++;
        stats.recentForm.push('D');
      }
    });

    stats.avgGoalsPerMatch = ((stats.homeTeamGoals + stats.awayTeamGoals) / stats.totalMatches).toFixed(1);
    stats.homeTeamAvgGoals = (stats.homeTeamGoals / stats.totalMatches).toFixed(1);
    stats.awayTeamAvgGoals = (stats.awayTeamGoals / stats.totalMatches).toFixed(1);
    stats.homeWinPercentage = Math.round((stats.homeTeamWins / stats.totalMatches) * 100);
    stats.awayWinPercentage = Math.round((stats.awayTeamWins / stats.totalMatches) * 100);
    stats.drawPercentage = Math.round((stats.draws / stats.totalMatches) * 100);

    // Garder seulement les 5 derniers résultats pour la forme
    stats.recentForm = stats.recentForm.slice(-5);

    return stats;
  }

  // Méthode pour obtenir les statistiques complètes d'une équipe
  getTeamStats(teamName) {
    const teamMatches = this.headToHeadData.filter(match => 
      match.homeTeam === teamName || match.awayTeam === teamName
    );

    if (teamMatches.length === 0) return null;

    const stats = {
      name: teamName,
      matches: teamMatches.length,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      homeWins: 0,
      awayWins: 0,
      form: []
    };

    teamMatches.forEach(match => {
      let teamGoals, opponentGoals, isHome;

      if (match.homeTeam === teamName) {
        teamGoals = match.homeScore;
        opponentGoals = match.awayScore;
        isHome = true;
      } else {
        teamGoals = match.awayScore;
        opponentGoals = match.homeScore;
        isHome = false;
      }

      stats.goalsFor += teamGoals;
      stats.goalsAgainst += opponentGoals;

      if (teamGoals > opponentGoals) {
        stats.wins++;
        if (isHome) stats.homeWins++;
        else stats.awayWins++;
        stats.form.push('W');
      } else if (teamGoals < opponentGoals) {
        stats.losses++;
        stats.form.push('L');
      } else {
        stats.draws++;
        stats.form.push('D');
      }
    });

    stats.winPercentage = Math.round((stats.wins / stats.matches) * 100);
    stats.avgGoalsFor = (stats.goalsFor / stats.matches).toFixed(1);
    stats.avgGoalsAgainst = (stats.goalsAgainst / stats.matches).toFixed(1);
    stats.goalDifference = stats.goalsFor - stats.goalsAgainst;
    stats.form = stats.form.slice(-5); // 5 derniers matchs

    return stats;
  }
}