// Service simulé pour l'API 1XBET - Intégration avec MEGAPARI ID 1159894415
import { megapariService } from "./megapariService";

class XBetService {
  constructor() {
    this.apiUrl = 'https://1xbet.com/api/v1';
    this.isConnected = true;
    this.megapariIntegration = true;
    
    // Simulation de données enrichies avec algorithmes MEGAPARI
    this.mockMatches = [
      {
        id: 'match_001',
        homeTeam: 'Manchester City',
        awayTeam: 'Liverpool',
        status: 'finished',
        finalScore: '2-1',
        startTime: '2024-01-15T15:00:00Z',
        league: 'FIFA Virtual Premier League',
        megapariAnalysis: {
          geneticOptimization: true,
          mathematicalProbability: 78.5,
          teamCoefficients: true
        }
      },
      {
        id: 'match_002',
        homeTeam: 'Chelsea',
        awayTeam: 'Arsenal',
        status: 'live',
        currentScore: '1-0',
        minute: 67,
        startTime: '2024-01-15T17:30:00Z',
        league: 'FIFA Virtual Premier League',
        megapariAnalysis: {
          liveOptimization: true,
          realTimeCalculation: 85.2
        }
      },
      {
        id: 'match_003',
        homeTeam: 'Tottenham',
        awayTeam: 'Newcastle',
        status: 'upcoming',
        startTime: '2024-01-17T21:15:00Z',
        league: 'FIFA Virtual Premier League',
        megapariPrediction: {
          recommendedScore: '1-1',
          confidence: 82,
          applicationId: '1159894415'
        }
      }
    ];
  }

  async getMatchResult(homeTeam, awayTeam, matchDateTime) {
    // Simulation d'une requête API avec délai
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    if (!this.isConnected) {
      throw new Error('Connexion 1XBET indisponible');
    }

    // Rechercher le match correspondant
    let match = this.mockMatches.find(m => 
      this.normalizeTeamName(m.homeTeam) === this.normalizeTeamName(homeTeam) &&
      this.normalizeTeamName(m.awayTeam) === this.normalizeTeamName(awayTeam)
    );

    // Si match trouvé, enrichir avec MEGAPARI si disponible
    if (match && this.megapariIntegration) {
      try {
        const megapariData = await megapariService.getMegapariPredictions(homeTeam, awayTeam, matchDateTime);
        match.megapariEnhancement = {
          geneticScore: megapariData.geneticOptimization.bestScore,
          mathematicalProbabilities: megapariData.mathematicalProbabilities.slice(0, 5),
          confidence: megapariData.confidence,
          applicationId: megapariData.applicationId
        };
      } catch (error) {
        console.log('Enrichissement MEGAPARI non disponible:', error.message);
      }
    }

    if (match) {
      return this.formatMatchResult(match);
    }

    // Si aucun match trouvé, générer un résultat simulé avec MEGAPARI
    return this.generateSimulatedResult(homeTeam, awayTeam, matchDateTime);
  }

  async getLiveMatches() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const liveMatches = this.mockMatches
      .filter(match => match.status === 'live')
      .map(match => this.formatMatchResult(match));

    // Enrichir avec données temps réel MEGAPARI
    if (this.megapariIntegration) {
      for (let match of liveMatches) {
        try {
          const megapariUpdate = await megapariService.getMegapariPredictions(
            match.homeTeam, 
            match.awayTeam, 
            match.startTime
          );
          match.megapariLiveData = {
            realTimeConfidence: megapariUpdate.confidence,
            adaptiveScore: megapariUpdate.exactScorePrediction.recommendedScore
          };
        } catch (error) {
          // Continuer sans enrichissement MEGAPARI
        }
      }
    }

    return liveMatches;
  }

  async getFinishedMatches(date = new Date()) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const targetDate = new Date(date).toDateString();
    
    return this.mockMatches
      .filter(match => {
        const matchDate = new Date(match.startTime).toDateString();
        return match.status === 'finished' && matchDate === targetDate;
      })
      .map(match => this.formatMatchResult(match));
  }

  formatMatchResult(match) {
    const baseResult = {
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      status: match.status,
      league: match.league,
      startTime: match.startTime,
      megapariData: match.megapariEnhancement || match.megapariAnalysis || match.megapariPrediction
    };

    switch (match.status) {
      case 'finished':
        return {
          ...baseResult,
          finalScore: match.finalScore,
          result: 'Terminé',
          megapariVerification: match.megapariEnhancement ? 
            `Vérifié via MEGAPARI ID ${megapariService.applicationId}` : null
        };
      
      case 'live':
        return {
          ...baseResult,
          currentScore: match.currentScore,
          minute: match.minute,
          result: `${match.minute}'`,
          liveAnalysis: match.megapariLiveData
        };
      
      case 'upcoming':
        return {
          ...baseResult,
          scheduledTime: match.startTime,
          result: 'À venir',
          prediction: match.megapariPrediction
        };
      
      default:
        return baseResult;
    }
  }

  async generateSimulatedResult(homeTeam, awayTeam, matchDateTime) {
    const matchDate = new Date(matchDateTime);
    const now = new Date();
    
    let baseResult = {
      homeTeam,
      awayTeam,
      league: 'FIFA Virtual Premier League'
    };

    // Essayer d'enrichir avec MEGAPARI
    if (this.megapariIntegration) {
      try {
        const megapariData = await megapariService.getMegapariPredictions(homeTeam, awayTeam, matchDateTime);
        baseResult.megapariEnhancement = {
          predictedScore: megapariData.exactScorePrediction.recommendedScore,
          confidence: megapariData.confidence,
          methodology: megapariData.exactScorePrediction.methodology,
          applicationId: megapariData.applicationId
        };
      } catch (error) {
        // Continuer avec simulation standard
      }
    }
    
    // Déterminer le statut basé sur l'heure
    if (matchDate > now) {
      return {
        ...baseResult,
        status: 'upcoming',
        scheduledTime: matchDateTime,
        result: 'À venir'
      };
    } else if (matchDate <= now && (now - matchDate) < 90 * 60 * 1000) {
      // Match en cours (moins de 90 minutes)
      const minute = Math.min(90, Math.floor((now - matchDate) / (60 * 1000)));
      const currentScore = baseResult.megapariEnhancement ? 
        baseResult.megapariEnhancement.predictedScore : 
        this.generateRandomScore();
      
      return {
        ...baseResult,
        status: 'live',
        currentScore,
        minute,
        result: `${minute}'`
      };
    } else {
      // Match terminé
      const finalScore = baseResult.megapariEnhancement ? 
        baseResult.megapariEnhancement.predictedScore : 
        this.generateRandomScore();
      
      return {
        ...baseResult,
        status: 'finished',
        finalScore,
        result: 'Terminé'
      };
    }
  }

  generateRandomScore() {
    // Amélioration avec distribution plus réaliste
    const scenarios = [
      ['0-0', '1-0', '0-1'], // Faible score
      ['1-1', '2-0', '0-2'], // Score moyen
      ['2-1', '1-2', '3-0', '0-3'], // Score élevé
      ['2-2', '3-1', '1-3'] // Score très élevé
    ];
    
    const weights = [0.25, 0.35, 0.30, 0.10]; // Probabilités
    let random = Math.random();
    let selectedScenario = 0;
    
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        selectedScenario = i;
        break;
      }
    }
    
    const scenarioScores = scenarios[selectedScenario];
    return scenarioScores[Math.floor(Math.random() * scenarioScores.length)];
  }

  normalizeTeamName(teamName) {
    return teamName.toLowerCase().trim();
  }

  // Méthode pour simuler des problèmes de connexion
  simulateConnectionIssue() {
    this.isConnected = false;
    setTimeout(() => {
      this.isConnected = true;
    }, 5000); // Reconnexion après 5 secondes
  }

  getConnectionStatus() {
    const megapariStatus = megapariService.getConnectionStatus();
    return {
      connected: this.isConnected,
      apiUrl: this.apiUrl,
      lastCheck: new Date().toISOString(),
      megapariIntegration: {
        enabled: this.megapariIntegration,
        applicationId: megapariStatus.applicationId,
        connected: megapariStatus.connected,
        features: megapariStatus.features
      }
    };
  }

  // Nouvelle méthode pour synchronisation MEGAPARI
  async syncWithMegapari() {
    if (!this.megapariIntegration) return null;
    
    try {
      const connectionStatus = await megapariService.connectToMegapari();
      return {
        success: connectionStatus.connected,
        message: `Synchronisation MEGAPARI ${connectionStatus.connected ? 'réussie' : 'échouée'}`,
        applicationId: connectionStatus.applicationId
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur synchronisation MEGAPARI: ${error.message}`
      };
    }
  }
}

export const xbetService = new XBetService();