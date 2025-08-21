import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import { predictionService } from '@/services/api/predictionService';

const HeadToHeadManager = ({ onDataUpdate }) => {
  const [confrontations, setConfrontations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    homeTeam: '',
    awayTeam: '',
    homeScore: '',
    awayScore: '',
    matchDate: ''
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadConfrontations();
  }, []);

  const loadConfrontations = async () => {
    try {
      const data = await predictionService.getHeadToHeadData();
      setConfrontations(data);
      calculateStats(data);
    } catch (error) {
      console.error('Erreur chargement confrontations:', error);
    }
  };

  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats(null);
      return;
    }

    const teamStats = {};
    
    data.forEach(match => {
      // Stats équipe domicile
      if (!teamStats[match.homeTeam]) {
        teamStats[match.homeTeam] = {
          name: match.homeTeam,
          matches: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0
        };
      }
      
      // Stats équipe visiteur
      if (!teamStats[match.awayTeam]) {
        teamStats[match.awayTeam] = {
          name: match.awayTeam,
          matches: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0
        };
      }

      const homeScore = parseInt(match.homeScore);
      const awayScore = parseInt(match.awayScore);

      // Mise à jour stats équipe domicile
      const homeTeamStats = teamStats[match.homeTeam];
      homeTeamStats.matches++;
      homeTeamStats.goalsFor += homeScore;
      homeTeamStats.goalsAgainst += awayScore;

      if (homeScore > awayScore) homeTeamStats.wins++;
      else if (homeScore === awayScore) homeTeamStats.draws++;
      else homeTeamStats.losses++;

      // Mise à jour stats équipe visiteur
      const awayTeamStats = teamStats[match.awayTeam];
      awayTeamStats.matches++;
      awayTeamStats.goalsFor += awayScore;
      awayTeamStats.goalsAgainst += homeScore;

      if (awayScore > homeScore) awayTeamStats.wins++;
      else if (homeScore === awayScore) awayTeamStats.draws++;
      else awayTeamStats.losses++;
    });

    // Calcul des pourcentages et moyennes
    Object.values(teamStats).forEach(team => {
      team.winPercentage = Math.round((team.wins / team.matches) * 100);
      team.drawPercentage = Math.round((team.draws / team.matches) * 100);
      team.lossPercentage = Math.round((team.losses / team.matches) * 100);
      team.avgGoalsFor = (team.goalsFor / team.matches).toFixed(1);
      team.avgGoalsAgainst = (team.goalsAgainst / team.matches).toFixed(1);
      team.goalDifference = team.goalsFor - team.goalsAgainst;
    });

    setStats(teamStats);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addConfrontation = async (e) => {
    e.preventDefault();
    
    if (confrontations.length >= 10) {
      toast.warning('Maximum 10 confrontations directes autorisées');
      return;
    }

    if (!formData.homeTeam || !formData.awayTeam || !formData.homeScore || !formData.awayScore) {
      toast.error('Tous les champs sont requis');
      return;
    }

    if (isNaN(formData.homeScore) || isNaN(formData.awayScore)) {
      toast.error('Les scores doivent être des nombres');
      return;
    }

    setIsLoading(true);
    
    try {
      const newConfrontation = {
        id: Date.now(),
        homeTeam: formData.homeTeam.trim(),
        awayTeam: formData.awayTeam.trim(),
        homeScore: parseInt(formData.homeScore),
        awayScore: parseInt(formData.awayScore),
        matchDate: formData.matchDate || new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };

      await predictionService.addHeadToHeadMatch(newConfrontation);
      
      const updatedData = [...confrontations, newConfrontation];
      setConfrontations(updatedData);
      calculateStats(updatedData);
      
      // Réinitialiser le formulaire
      setFormData({
        homeTeam: '',
        awayTeam: '',
        homeScore: '',
        awayScore: '',
        matchDate: ''
      });

      if (onDataUpdate) onDataUpdate(updatedData);
      
      toast.success(`Confrontation ajoutée (${updatedData.length}/10)`);
      setShowForm(false);
      
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la confrontation');
      console.error('Error adding confrontation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeConfrontation = async (id) => {
    try {
      await predictionService.removeHeadToHeadMatch(id);
      
      const updatedData = confrontations.filter(c => c.id !== id);
      setConfrontations(updatedData);
      calculateStats(updatedData);
      
      if (onDataUpdate) onDataUpdate(updatedData);
      
      toast.success('Confrontation supprimée');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const clearAllConfrontations = async () => {
    if (!window.confirm('Supprimer toutes les confrontations ?')) return;
    
    try {
      await predictionService.clearHeadToHeadData();
      setConfrontations([]);
      setStats(null);
      
      if (onDataUpdate) onDataUpdate([]);
      
      toast.success('Toutes les confrontations supprimées');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" size={20} className="text-black" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-white">Confrontations Directes</h3>
            <p className="text-sm text-gray-400">
              {confrontations.length}/10 confrontations • Analyse de performance
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {confrontations.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllConfrontations}
              className="text-error border-error/30 hover:bg-error/10"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => setShowForm(!showForm)}
            disabled={confrontations.length >= 10}
            className="flex items-center gap-2"
          >
            <ApperIcon name={showForm ? "X" : "Plus"} size={16} />
            {showForm ? 'Annuler' : 'Ajouter'}
          </Button>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="mb-6 p-4 bg-surface/30 rounded-lg border border-primary/20">
          <form onSubmit={addConfrontation} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Équipe Domicile"
                placeholder="Manchester City"
                value={formData.homeTeam}
                onChange={(e) => handleInputChange('homeTeam', e.target.value)}
                required
              />
              <FormField
                label="Équipe Visiteur"
                placeholder="Liverpool"
                value={formData.awayTeam}
                onChange={(e) => handleInputChange('awayTeam', e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Score Domicile"
                type="number"
                min="0"
                placeholder="2"
                value={formData.homeScore}
                onChange={(e) => handleInputChange('homeScore', e.target.value)}
                required
              />
              <FormField
                label="Score Visiteur"
                type="number"
                min="0"
                placeholder="1"
                value={formData.awayScore}
                onChange={(e) => handleInputChange('awayScore', e.target.value)}
                required
              />
              <FormField
                label="Date Match"
                type="date"
                value={formData.matchDate}
                onChange={(e) => handleInputChange('matchDate', e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                ) : (
                  <ApperIcon name="Plus" size={16} />
                )}
                Ajouter Confrontation
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des confrontations */}
      {confrontations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-4">Historique des Confrontations</h4>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {confrontations.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-3 bg-surface/20 rounded-lg border border-secondary-400/20">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-medium text-white">{match.homeTeam}</div>
                    <div className="text-2xl font-bold text-primary">{match.homeScore}</div>
                  </div>
                  <div className="text-gray-400 text-sm">vs</div>
                  <div className="text-center">
                    <div className="font-medium text-white">{match.awayTeam}</div>
                    <div className="text-2xl font-bold text-accent">{match.awayScore}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-400">
                    {new Date(match.matchDate).toLocaleDateString('fr-FR')}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeConfrontation(match.id)}
                    className="text-error hover:text-error/80 h-8 w-8 p-0"
                  >
                    <ApperIcon name="X" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistiques des équipes */}
      {stats && (
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Statistiques de Performance</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Object.values(stats).map((team) => (
              <div key={team.name} className="p-4 bg-surface/30 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <ApperIcon name="Shield" size={16} className="text-black" />
                  </div>
                  <h5 className="font-semibold text-white">{team.name}</h5>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                  <div>
                    <div className="text-primary font-bold">{team.wins}</div>
                    <div className="text-xs text-gray-400">Victoires</div>
                  </div>
                  <div>
                    <div className="text-warning font-bold">{team.draws}</div>
                    <div className="text-xs text-gray-400">Nuls</div>
                  </div>
                  <div>
                    <div className="text-error font-bold">{team.losses}</div>
                    <div className="text-xs text-gray-400">Défaites</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Buts marqués:</span>
                    <span className="text-white font-medium">{team.goalsFor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Buts encaissés:</span>
                    <span className="text-white font-medium">{team.goalsAgainst}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Moy. marqués:</span>
                    <span className="text-primary font-medium">{team.avgGoalsFor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Moy. encaissés:</span>
                    <span className="text-accent font-medium">{team.avgGoalsAgainst}</span>
                  </div>
                  <div className="flex justify-between col-span-2">
                    <span className="text-gray-400">Différence:</span>
                    <span className={`font-medium ${team.goalDifference >= 0 ? 'text-primary' : 'text-error'}`}>
                      {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="text-xs text-gray-400 mb-2">Taux de réussite:</div>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-primary/20 text-primary rounded">
                      V: {team.winPercentage}%
                    </span>
                    <span className="px-2 py-1 bg-warning/20 text-warning rounded">
                      N: {team.drawPercentage}%
                    </span>
                    <span className="px-2 py-1 bg-error/20 text-error rounded">
                      D: {team.lossPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {confrontations.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full flex items-center justify-center">
            <ApperIcon name="Zap" size={32} className="text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Aucune confrontation directe</h4>
          <p className="text-gray-400 mb-4">
            Ajoutez jusqu'à 10 confrontations pour améliorer les prédictions IA
          </p>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <ApperIcon name="Plus" size={16} />
            Ajouter la première confrontation
          </Button>
        </div>
      )}
    </Card>
  );
};

export default HeadToHeadManager;