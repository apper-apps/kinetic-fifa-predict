// Service MEGAPARI - ID Application: 1159894415
// Algorithmes génétiques et calculs de probabilité mathématiques avancés
class MegapariService {
  constructor() {
    this.applicationId = '1159894415';
    this.apiUrl = 'https://api.megapari.com/v2';
    this.isConnected = true;
    
    // Coefficients d'équipes pour analyse mathématique
    this.teamCoefficients = {
      'Manchester City': { attack: 0.92, defense: 0.88, form: 0.85, home: 0.78 },
      'Liverpool': { attack: 0.89, defense: 0.82, form: 0.87, home: 0.75 },
      'Chelsea': { attack: 0.84, defense: 0.85, form: 0.72, home: 0.68 },
      'Arsenal': { attack: 0.86, defense: 0.79, form: 0.81, home: 0.73 },
      'Tottenham': { attack: 0.82, defense: 0.76, form: 0.69, home: 0.71 },
      'Newcastle': { attack: 0.78, defense: 0.83, form: 0.76, home: 0.74 },
      'Manchester United': { attack: 0.85, defense: 0.77, form: 0.74, home: 0.72 }
    };
    
    // Population pour algorithme génétique
    this.geneticPopulation = [];
    this.generationSize = 50;
    this.mutationRate = 0.1;
    this.crossoverRate = 0.8;
  }

  // Connexion à l'API MEGAPARI avec ID d'application
  async connectToMegapari() {
    try {
      const response = await this.simulateApiCall('/connect', {
        applicationId: this.applicationId,
        timestamp: new Date().toISOString()
      });
      
      this.isConnected = response.success;
      return {
        connected: this.isConnected,
        applicationId: this.applicationId,
        message: response.success ? 
          'Connexion MEGAPARI établie avec succès' : 
          'Erreur de connexion MEGAPARI'
      };
    } catch (error) {
      this.isConnected = false;
      throw new Error(`Erreur MEGAPARI ID ${this.applicationId}: ${error.message}`);
    }
  }

  // Récupération des pronostics MEGAPARI fiables
  async getMegapariPredictions(homeTeam, awayTeam, matchDateTime) {
    if (!this.isConnected) {
      await this.connectToMegapari();
    }

    try {
      const predictionData = await this.simulateApiCall('/predictions/exact-scores', {
        applicationId: this.applicationId,
        homeTeam,
        awayTeam,
        matchDateTime,
        analysisDepth: 'advanced'
      });

      // Appliquer les algorithmes génétiques
      const geneticAnalysis = await this.runGeneticAlgorithm(homeTeam, awayTeam);
      
      // Calculs de probabilité mathématiques
      const mathProbabilities = this.calculateMathematicalProbabilities(
        homeTeam, 
        awayTeam, 
        predictionData.bookmakerOdds
      );

      return {
        megapariData: predictionData,
        geneticOptimization: geneticAnalysis,
        mathematicalProbabilities: mathProbabilities,
        exactScorePrediction: this.generateExactScore(geneticAnalysis, mathProbabilities),
        confidence: this.calculateAdvancedConfidence(geneticAnalysis, mathProbabilities),
        applicationId: this.applicationId
      };
    } catch (error) {
      throw new Error(`Erreur pronostics MEGAPARI: ${error.message}`);
    }
  }

  // Algorithme génétique pour optimisation des prédictions
  async runGeneticAlgorithm(homeTeam, awayTeam) {
    // Initialiser la population
    this.initializePopulation(homeTeam, awayTeam);
    
    let bestFitness = 0;
    let bestIndividual = null;
    const maxGenerations = 100;

    for (let generation = 0; generation < maxGenerations; generation++) {
      // Évaluer la fitness de chaque individu
      const fitness = this.evaluatePopulation();
      
      // Sélectionner les meilleurs
      const parents = this.selectParents(fitness);
      
      // Crossover et mutation
      this.geneticPopulation = this.crossoverAndMutate(parents);
      
      // Suivre le meilleur individu
      const currentBest = Math.max(...fitness);
      if (currentBest > bestFitness) {
        bestFitness = currentBest;
        bestIndividual = this.geneticPopulation[fitness.indexOf(currentBest)];
      }
    }

    return {
      bestScore: bestIndividual.predictedScore,
      fitness: bestFitness,
      generations: maxGenerations,
      optimizationFactors: bestIndividual.factors
    };
  }

  // Initialisation de la population génétique
  initializePopulation(homeTeam, awayTeam) {
    this.geneticPopulation = [];
    const homeCoeff = this.teamCoefficients[homeTeam] || { attack: 0.7, defense: 0.7, form: 0.7, home: 0.7 };
    const awayCoeff = this.teamCoefficients[awayTeam] || { attack: 0.7, defense: 0.7, form: 0.7, home: 0.3 };

    for (let i = 0; i < this.generationSize; i++) {
      const individual = {
        homeGoals: Math.floor(Math.random() * 5),
        awayGoals: Math.floor(Math.random() * 5),
        factors: {
          attackWeight: Math.random(),
          defenseWeight: Math.random(),
          formWeight: Math.random(),
          homeAdvantage: Math.random()
        },
        predictedScore: '',
        homeTeam,
        awayTeam,
        homeCoefficients: homeCoeff,
        awayCoefficients: awayCoeff
      };
      
      individual.predictedScore = `${individual.homeGoals}-${individual.awayGoals}`;
      this.geneticPopulation.push(individual);
    }
  }

  // Évaluation de la fitness de la population
  evaluatePopulation() {
    return this.geneticPopulation.map(individual => {
      const homeExpected = this.calculateExpectedGoals(individual, true);
      const awayExpected = this.calculateExpectedGoals(individual, false);
      
      // Fitness basée sur la probabilité réaliste du score
      const homeDiff = Math.abs(individual.homeGoals - homeExpected);
      const awayDiff = Math.abs(individual.awayGoals - awayExpected);
      
      return Math.max(0, 10 - homeDiff - awayDiff);
    });
  }

  // Calcul des buts attendus
  calculateExpectedGoals(individual, isHome) {
    const team = isHome ? individual.homeCoefficients : individual.awayCoefficients;
    const opponent = isHome ? individual.awayCoefficients : individual.homeCoefficients;
    
    const attackFactor = team.attack * individual.factors.attackWeight;
    const defenseFactor = opponent.defense * individual.factors.defenseWeight;
    const formFactor = team.form * individual.factors.formWeight;
    const homeFactor = isHome ? team.home * individual.factors.homeAdvantage : 0;
    
    return (attackFactor - defenseFactor + formFactor + homeFactor) * 2.5;
  }

  // Sélection des parents
  selectParents(fitness) {
    const parents = [];
    const totalFitness = fitness.reduce((sum, f) => sum + f, 0);
    
    for (let i = 0; i < this.generationSize / 2; i++) {
      let randomValue = Math.random() * totalFitness;
      let selectedIndex = 0;
      
      for (let j = 0; j < fitness.length; j++) {
        randomValue -= fitness[j];
        if (randomValue <= 0) {
          selectedIndex = j;
          break;
        }
      }
      
      parents.push(this.geneticPopulation[selectedIndex]);
    }
    
    return parents;
  }

  // Crossover et mutation
  crossoverAndMutate(parents) {
    const newPopulation = [];
    
    for (let i = 0; i < parents.length - 1; i += 2) {
      const parent1 = parents[i];
      const parent2 = parents[i + 1] || parents[0];
      
      let child1, child2;
      
      if (Math.random() < this.crossoverRate) {
        // Crossover
        child1 = this.crossover(parent1, parent2);
        child2 = this.crossover(parent2, parent1);
      } else {
        child1 = { ...parent1 };
        child2 = { ...parent2 };
      }
      
      // Mutation
      if (Math.random() < this.mutationRate) child1 = this.mutate(child1);
      if (Math.random() < this.mutationRate) child2 = this.mutate(child2);
      
      newPopulation.push(child1, child2);
    }
    
    return newPopulation.slice(0, this.generationSize);
  }

  // Opération de crossover
  crossover(parent1, parent2) {
    return {
      homeGoals: Math.random() < 0.5 ? parent1.homeGoals : parent2.homeGoals,
      awayGoals: Math.random() < 0.5 ? parent1.awayGoals : parent2.awayGoals,
      factors: {
        attackWeight: (parent1.factors.attackWeight + parent2.factors.attackWeight) / 2,
        defenseWeight: (parent1.factors.defenseWeight + parent2.factors.defenseWeight) / 2,
        formWeight: (parent1.factors.formWeight + parent2.factors.formWeight) / 2,
        homeAdvantage: (parent1.factors.homeAdvantage + parent2.factors.homeAdvantage) / 2
      },
      predictedScore: '',
      homeTeam: parent1.homeTeam,
      awayTeam: parent1.awayTeam,
      homeCoefficients: parent1.homeCoefficients,
      awayCoefficients: parent1.awayCoefficients
    };
  }

  // Opération de mutation
  mutate(individual) {
    const mutated = { ...individual };
    
    if (Math.random() < 0.3) mutated.homeGoals = Math.floor(Math.random() * 5);
    if (Math.random() < 0.3) mutated.awayGoals = Math.floor(Math.random() * 5);
    
    Object.keys(mutated.factors).forEach(key => {
      if (Math.random() < 0.2) {
        mutated.factors[key] = Math.random();
      }
    });
    
    mutated.predictedScore = `${mutated.homeGoals}-${mutated.awayGoals}`;
    return mutated;
  }

  // Calculs de probabilité mathématiques avancés
  calculateMathematicalProbabilities(homeTeam, awayTeam, bookmakerOdds) {
    const homeCoeff = this.teamCoefficients[homeTeam] || { attack: 0.7, defense: 0.7, form: 0.7, home: 0.7 };
    const awayCoeff = this.teamCoefficients[awayTeam] || { attack: 0.7, defense: 0.7, form: 0.7, home: 0.3 };

    // Distribution de Poisson pour les buts
    const homeExpectedGoals = (homeCoeff.attack * (1 - awayCoeff.defense) + homeCoeff.form + homeCoeff.home) * 1.3;
    const awayExpectedGoals = (awayCoeff.attack * (1 - homeCoeff.defense) + awayCoeff.form * 0.8) * 1.1;

    const scoreProbabilities = [];

    for (let homeGoals = 0; homeGoals <= 5; homeGoals++) {
      for (let awayGoals = 0; awayGoals <= 5; awayGoals++) {
        const homeProb = this.poissonProbability(homeGoals, homeExpectedGoals);
        const awayProb = this.poissonProbability(awayGoals, awayExpectedGoals);
        const combinedProb = homeProb * awayProb;

        // Intégrer les cotes bookmaker si disponibles
        let adjustedProb = combinedProb;
        if (bookmakerOdds && bookmakerOdds.length > 0) {
          const bookmakerScore = bookmakerOdds.find(odd => odd.score === `${homeGoals}-${awayGoals}`);
          if (bookmakerScore) {
            const bookmakerProb = 1 / parseFloat(bookmakerScore.coefficient);
            adjustedProb = (combinedProb + bookmakerProb) / 2;
          }
        }

        scoreProbabilities.push({
          score: `${homeGoals}-${awayGoals}`,
          probability: (adjustedProb * 100).toFixed(1),
          coefficient: (1 / adjustedProb).toFixed(2),
          mathematicalBase: combinedProb,
          homeExpected: homeExpectedGoals,
          awayExpected: awayExpectedGoals
        });
      }
    }

    return scoreProbabilities.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));
  }

  // Distribution de Poisson
  poissonProbability(k, lambda) {
    const e = Math.E;
    return (Math.pow(lambda, k) * Math.pow(e, -lambda)) / this.factorial(k);
  }

  // Calcul factorielle
  factorial(n) {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }

  // Génération du score exact optimisé
  generateExactScore(geneticAnalysis, mathProbabilities) {
    const geneticScore = geneticAnalysis.bestScore;
    const mathBestScore = mathProbabilities[0].score;

    // Combiner les résultats des deux approches
    const scores = [geneticScore, mathBestScore];
    const scoreFrequency = {};

    scores.forEach(score => {
      scoreFrequency[score] = (scoreFrequency[score] || 0) + 1;
    });

    // Retourner le score le plus fréquent ou celui avec la meilleure probabilité mathématique
    const mostFrequent = Object.keys(scoreFrequency).reduce((a, b) => 
      scoreFrequency[a] > scoreFrequency[b] ? a : b
    );

    return {
      recommendedScore: mostFrequent,
      alternatives: [geneticScore, mathBestScore].filter((score, index, self) => 
        self.indexOf(score) === index && score !== mostFrequent
      ),
      methodology: 'Algorithme génétique + Probabilités mathématiques MEGAPARI'
    };
  }

  // Calcul de confiance avancé
  calculateAdvancedConfidence(geneticAnalysis, mathProbabilities) {
    const geneticConfidence = Math.min(95, geneticAnalysis.fitness * 10);
    const mathConfidence = parseFloat(mathProbabilities[0].probability);
    
    // Moyenne pondérée avec bonus de cohérence
    let finalConfidence = (geneticConfidence * 0.4 + mathConfidence * 0.6);
    
    // Bonus si les deux méthodes convergent
    const convergenceBonus = geneticAnalysis.bestScore === mathProbabilities[0].score ? 10 : 0;
    
    return Math.min(95, Math.round(finalConfidence + convergenceBonus));
  }

  // Simulation d'appel API
  async simulateApiCall(endpoint, data) {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    if (!this.isConnected && Math.random() < 0.1) {
      throw new Error('Connexion MEGAPARI temporairement indisponible');
    }

    // Simuler les données bookmaker MEGAPARI
    const mockBookmakerOdds = [
      { score: '0-0', coefficient: 8.5, probability: '11.8' },
      { score: '1-0', coefficient: 4.2, probability: '23.8' },
      { score: '0-1', coefficient: 6.1, probability: '16.4' },
      { score: '1-1', coefficient: 3.8, probability: '26.3' },
      { score: '2-0', coefficient: 12.0, probability: '8.3' },
      { score: '0-2', coefficient: 15.0, probability: '6.7' },
      { score: '2-1', coefficient: 8.0, probability: '12.5' },
      { score: '1-2', coefficient: 10.0, probability: '10.0' }
    ];

    return {
      success: true,
      bookmakerOdds: mockBookmakerOdds,
      applicationId: this.applicationId,
      timestamp: new Date().toISOString(),
      analysisDepth: data.analysisDepth || 'standard'
    };
  }

  // Statut de connexion MEGAPARI
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      applicationId: this.applicationId,
      apiUrl: this.apiUrl,
      lastCheck: new Date().toISOString(),
      features: ['Algorithmes génétiques', 'Probabilités mathématiques', 'Coefficients équipes']
    };
  }
}

export const megapariService = new MegapariService();