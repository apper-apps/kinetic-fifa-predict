import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = () => {
  const handleGetStarted = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto">
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-surface to-secondary-500 rounded-full flex items-center justify-center border border-primary/20">
            <ApperIcon name="Brain" size={36} className="text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
            <ApperIcon name="Zap" size={16} className="text-black" />
          </div>
        </div>
        
        <h3 className="text-2xl font-display font-bold text-white mb-3">
          Aucune prédiction pour le moment
        </h3>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          Commencez à analyser les matchs FIFA Virtual pour obtenir des prédictions 
          précises basées sur l'intelligence artificielle et les données des bookmakers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface/30 border border-primary/20 rounded-lg p-4">
            <div className="w-10 h-10 mx-auto mb-3 bg-primary/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" size={20} className="text-primary" />
            </div>
            <h4 className="font-semibold text-white mb-1">1. Créer un match</h4>
            <p className="text-xs text-gray-400">Ajoutez les équipes, date et heure</p>
          </div>
          
          <div className="bg-surface/30 border border-accent/20 rounded-lg p-4">
            <div className="w-10 h-10 mx-auto mb-3 bg-accent/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="BarChart3" size={20} className="text-accent" />
            </div>
            <h4 className="font-semibold text-white mb-1">2. Ajouter les cotes</h4>
            <p className="text-xs text-gray-400">Entrez les scores et coefficients</p>
          </div>
          
          <div className="bg-surface/30 border border-info/20 rounded-lg p-4">
            <div className="w-10 h-10 mx-auto mb-3 bg-info/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" size={20} className="text-info" />
            </div>
            <h4 className="font-semibold text-white mb-1">3. Obtenir la prédiction</h4>
            <p className="text-xs text-gray-400">L'IA analyse et prédit le score</p>
          </div>
        </div>

        <Button
          onClick={handleGetStarted}
          size="lg"
          className="flex items-center gap-3 mx-auto"
        >
          <ApperIcon name="Play" size={20} />
          Commencer une prédiction
        </Button>

        <div className="mt-6 text-xs text-gray-500">
          <p>🎯 Prédictions spécialisées pour FIFA Virtual FC 24</p>
        </div>
      </div>
    </div>
  );
};

export default Empty;