import { xbetService } from './xbetService';

class ScoresService {
  constructor() {
    this.cachedScores = new Map();
    this.lastUpdateTime = null;
  }

  async getMatchScore(homeTeam, awayTeam, matchDateTime) {
    try {
      // Créer une clé unique pour le match
      const matchKey = `${homeTeam.toLowerCase()}-${awayTeam.toLowerCase()}-${matchDateTime}`;
      
      // Vérifier le cache (valide pendant 2 minutes)
      const cached = this.cachedScores.get(matchKey);
      if (cached && (Date.now() - cached.timestamp) < 120000) {
        return cached.data;
      }

      // Récupérer le score depuis 1XBET
      const score = await xbetService.getMatchResult(homeTeam, awayTeam, matchDateTime);
      
      // Mettre en cache
      this.cachedScores.set(matchKey, {
        data: score,
        timestamp: Date.now()
      });

      return score;
    } catch (error) {
      console.error('Erreur lors de la récupération du score:', error);
      return {
        status: 'error',
        error: 'Impossible de récupérer le score depuis 1XBET'
      };
    }
  }

  async getLiveMatches() {
    try {
      return await xbetService.getLiveMatches();
    } catch (error) {
      console.error('Erreur lors de la récupération des matchs en direct:', error);
      return [];
    }
  }

  async getFinishedMatches(date = new Date()) {
    try {
      return await xbetService.getFinishedMatches(date);
    } catch (error) {
      console.error('Erreur lors de la récupération des matchs terminés:', error);
      return [];
    }
  }

  async checkMultipleMatches(matches) {
    const results = [];
    
    for (const match of matches) {
      try {
        const score = await this.getMatchScore(
          match.homeTeam, 
          match.awayTeam, 
          match.matchDateTime
        );
        
        results.push({
          matchId: match.Id,
          ...score
        });
      } catch (error) {
        results.push({
          matchId: match.Id,
          status: 'error',
          error: error.message
        });
      }
    }

    return results;
  }

  clearCache() {
    this.cachedScores.clear();
    this.lastUpdateTime = null;
  }

  getCacheStatus() {
    return {
      cacheSize: this.cachedScores.size,
      lastUpdate: this.lastUpdateTime
    };
  }

  async verifyPredictionResult(prediction) {
    try {
      const score = await this.getMatchScore(
        prediction.homeTeam,
        prediction.awayTeam,
        prediction.matchDateTime
      );

      if (score.status === 'finished' && score.finalScore) {
        return {
          actualScore: score.finalScore,
          correct: prediction.predictedScore === score.finalScore,
          matchStatus: 'terminé'
        };
      } else if (score.status === 'live' && score.currentScore) {
        return {
          currentScore: score.currentScore,
          matchStatus: 'en cours',
          minute: score.minute || 'N/A'
        };
      } else {
        return {
          matchStatus: 'à venir',
          scheduledTime: score.scheduledTime || prediction.matchDateTime
        };
      }
    } catch (error) {
      return {
        error: error.message,
        matchStatus: 'erreur'
      };
    }
  }
}

export const scoresService = new ScoresService();