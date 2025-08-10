// Service simulé pour l'API 1XBET - Récupération des scores réels
class XBetService {
  constructor() {
    this.apiUrl = 'https://1xbet.com/api/v1'; // URL simulée
    this.isConnected = true;
    
    // Simulation de données réelles de matchs FIFA Virtual
    this.mockMatches = [
      {
        id: 'match_001',
        homeTeam: 'Manchester City',
        awayTeam: 'Liverpool',
        status: 'finished',
        finalScore: '2-1',
        startTime: '2024-01-15T15:00:00Z',
        league: 'FIFA Virtual Premier League'
      },
      {
        id: 'match_002',
        homeTeam: 'Chelsea',
        awayTeam: 'Arsenal',
        status: 'live',
        currentScore: '1-0',
        minute: 67,
        startTime: '2024-01-15T17:30:00Z',
        league: 'FIFA Virtual Premier League'
      },
      {
        id: 'match_003',
        homeTeam: 'Tottenham',
        awayTeam: 'Manchester United',
        status: 'upcoming',
        startTime: '2024-01-15T20:00:00Z',
        league: 'FIFA Virtual Premier League'
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
    const match = this.mockMatches.find(m => 
      this.normalizeTeamName(m.homeTeam) === this.normalizeTeamName(homeTeam) &&
      this.normalizeTeamName(m.awayTeam) === this.normalizeTeamName(awayTeam)
    );

    if (match) {
      return this.formatMatchResult(match);
    }

    // Si aucun match trouvé, générer un résultat simulé
    return this.generateSimulatedResult(homeTeam, awayTeam, matchDateTime);
  }

  async getLiveMatches() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.mockMatches
      .filter(match => match.status === 'live')
      .map(match => this.formatMatchResult(match));
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
      startTime: match.startTime
    };

    switch (match.status) {
      case 'finished':
        return {
          ...baseResult,
          finalScore: match.finalScore,
          result: 'Terminé'
        };
      
      case 'live':
        return {
          ...baseResult,
          currentScore: match.currentScore,
          minute: match.minute,
          result: `${match.minute}'`
        };
      
      case 'upcoming':
        return {
          ...baseResult,
          scheduledTime: match.startTime,
          result: 'À venir'
        };
      
      default:
        return baseResult;
    }
  }

  generateSimulatedResult(homeTeam, awayTeam, matchDateTime) {
    const matchDate = new Date(matchDateTime);
    const now = new Date();
    
    // Déterminer le statut basé sur l'heure
    if (matchDate > now) {
      return {
        homeTeam,
        awayTeam,
        status: 'upcoming',
        scheduledTime: matchDateTime,
        result: 'À venir'
      };
    } else if (matchDate <= now && (now - matchDate) < 90 * 60 * 1000) {
      // Match en cours (moins de 90 minutes)
      const minute = Math.min(90, Math.floor((now - matchDate) / (60 * 1000)));
      const currentScore = this.generateRandomScore();
      
      return {
        homeTeam,
        awayTeam,
        status: 'live',
        currentScore,
        minute,
        result: `${minute}'`
      };
    } else {
      // Match terminé
      const finalScore = this.generateRandomScore();
      
      return {
        homeTeam,
        awayTeam,
        status: 'finished',
        finalScore,
        result: 'Terminé'
      };
    }
  }

  generateRandomScore() {
    const homeGoals = Math.floor(Math.random() * 4);
    const awayGoals = Math.floor(Math.random() * 4);
    return `${homeGoals}-${awayGoals}`;
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
    return {
      connected: this.isConnected,
      apiUrl: this.apiUrl,
      lastCheck: new Date().toISOString()
    };
  }
}

export const xbetService = new XBetService();