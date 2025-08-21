import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';

const SettingsPage = () => {
const [settings, setSettings] = useState({
    notifications: {
      predictions: true,
      results: true,
      weekly: false
    },
    preferences: {
      autoCheck: true,
      confidenceThreshold: 70,
      defaultScoreCount: 5
    },
    megapari: {
      enabled: true,
      applicationId: '1159894415',
      geneticAlgorithm: true,
      mathematicalProbabilities: true,
      teamCoefficients: true,
      generationSize: 50,
      mutationRate: 0.1
    },
    profile: {
      username: 'Utilisateur',
      timezone: 'Africa/Abidjan'
    }
  });

  const handleNotificationChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const handlePreferenceChange = (key, value) => {
setSettings(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }));
  };

  const handleMegapariChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      megapari: { ...prev.megapari, [key]: value }
    }));
  };

  const handleProfileChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      profile: { ...prev.profile, [key]: value }
    }));
  };

const saveSettings = () => {
    localStorage.setItem('fifa-predict-settings', JSON.stringify(settings));
    toast.success(`Paramètres sauvegardés! MEGAPARI ID: ${settings.megapari.applicationId}`);
  };

  const resetSettings = () => {
    const defaultSettings = {
      notifications: { predictions: true, results: true, weekly: false },
      preferences: { autoCheck: true, confidenceThreshold: 70, defaultScoreCount: 5 },
      megapari: {
        enabled: true,
        applicationId: '1159894415',
        geneticAlgorithm: true,
        mathematicalProbabilities: true,
        teamCoefficients: true,
        generationSize: 50,
        mutationRate: 0.1
      },
      profile: { username: 'Utilisateur', timezone: 'Africa/Abidjan' }
    };
    setSettings(defaultSettings);
    toast.info('Paramètres réinitialisés - MEGAPARI ID restauré');
  };

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold mb-4">
            <span className="gradient-text">Paramètres</span>
          </h1>
          <p className="text-gray-400">Personnalisez votre expérience FIFA Predict</p>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="User" size={20} className="text-black" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Profil</h3>
                <p className="text-sm text-gray-400">Informations de votre compte</p>
              </div>
            </div>

            <div className="space-y-4">
              <FormField
                label="Nom d'utilisateur"
                value={settings.profile.username}
                onChange={(e) => handleProfileChange('username', e.target.value)}
                placeholder="Votre nom d'utilisateur"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fuseau horaire
                </label>
                <select
                  value={settings.profile.timezone}
                  onChange={(e) => handleProfileChange('timezone', e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="Africa/Abidjan">Afrique/Abidjan (GMT+0)</option>
                  <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                  <option value="America/New_York">Amérique/New York (GMT-5)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-info to-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Bell" size={20} className="text-black" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Notifications</h3>
                <p className="text-sm text-gray-400">Gérez vos préférences de notification</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 px-4 bg-surface/30 rounded-lg">
                <div>
                  <div className="text-white font-medium">Nouvelles prédictions</div>
                  <div className="text-sm text-gray-400">Recevoir une notification à chaque prédiction générée</div>
                </div>
                <button
                  onClick={() => handleNotificationChange('predictions', !settings.notifications.predictions)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications.predictions ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications.predictions ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 px-4 bg-surface/30 rounded-lg">
                <div>
                  <div className="text-white font-medium">Résultats de matchs</div>
                  <div className="text-sm text-gray-400">Notification quand les résultats sont disponibles</div>
                </div>
                <button
                  onClick={() => handleNotificationChange('results', !settings.notifications.results)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications.results ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications.results ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 px-4 bg-surface/30 rounded-lg">
                <div>
                  <div className="text-white font-medium">Résumé hebdomadaire</div>
                  <div className="text-sm text-gray-400">Rapport de performance chaque semaine</div>
                </div>
                <button
                  onClick={() => handleNotificationChange('weekly', !settings.notifications.weekly)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications.weekly ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications.weekly ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Prediction Preferences */}
<Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="Cpu" size={20} className="text-black" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Configuration MEGAPARI</h3>
                <p className="text-sm text-gray-400">ID: {settings.megapari.applicationId}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 px-4 bg-surface/30 rounded-lg">
                <div>
                  <div className="text-white font-medium">Intégration MEGAPARI</div>
                  <div className="text-sm text-gray-400">Utiliser l'API MEGAPARI pour les prédictions</div>
                </div>
                <button
                  onClick={() => handleMegapariChange('enabled', !settings.megapari.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.megapari.enabled ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.megapari.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 px-4 bg-surface/30 rounded-lg">
                <div>
                  <div className="text-white font-medium">Algorithmes Génétiques</div>
                  <div className="text-sm text-gray-400">Optimisation par évolution des prédictions</div>
                </div>
                <button
                  onClick={() => handleMegapariChange('geneticAlgorithm', !settings.megapari.geneticAlgorithm)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.megapari.geneticAlgorithm ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.megapari.geneticAlgorithm ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 px-4 bg-surface/30 rounded-lg">
                <div>
                  <div className="text-white font-medium">Calculs Mathématiques</div>
                  <div className="text-sm text-gray-400">Probabilités avancées et coefficients</div>
                </div>
                <button
                  onClick={() => handleMegapariChange('mathematicalProbabilities', !settings.megapari.mathematicalProbabilities)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.megapari.mathematicalProbabilities ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.megapari.mathematicalProbabilities ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Taille Population Génétique ({settings.megapari.generationSize})
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="10"
                  value={settings.megapari.generationSize}
                  onChange={(e) => handleMegapariChange('generationSize', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>20</span>
                  <span>100</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Taux de Mutation ({(settings.megapari.mutationRate * 100).toFixed(0)}%)
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.05"
                  value={settings.megapari.mutationRate}
                  onChange={(e) => handleMegapariChange('mutationRate', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5%</span>
                  <span>30%</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-warning rounded-lg flex items-center justify-center">
                <ApperIcon name="Settings" size={20} className="text-black" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Préférences de Prédiction</h3>
                <p className="text-sm text-gray-400">Personnalisez le comportement de l'IA</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 px-4 bg-surface/30 rounded-lg">
                <div>
                  <div className="text-white font-medium">Vérification automatique</div>
                  <div className="text-sm text-gray-400">Vérifier automatiquement les résultats MEGAPARI/1XBET</div>
                </div>
                <button
                  onClick={() => handlePreferenceChange('autoCheck', !settings.preferences.autoCheck)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.preferences.autoCheck ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.preferences.autoCheck ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Seuil de confiance minimum ({settings.preferences.confidenceThreshold}%)
                </label>
                <input
                  type="range"
                  min="30"
                  max="95"
                  step="5"
                  value={settings.preferences.confidenceThreshold}
                  onChange={(e) => handlePreferenceChange('confidenceThreshold', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>30%</span>
                  <span>95%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de scores par défaut
                </label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={settings.preferences.defaultScoreCount}
                  onChange={(e) => handlePreferenceChange('defaultScoreCount', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-surface border border-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 justify-center">
            <Button
              onClick={saveSettings}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Save" size={16} />
              Sauvegarder
            </Button>
            
            <Button
              variant="outline"
              onClick={resetSettings}
              className="flex items-center gap-2"
            >
              <ApperIcon name="RotateCcw" size={16} />
              Réinitialiser
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;