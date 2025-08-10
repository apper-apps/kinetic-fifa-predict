import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Une erreur est survenue", onRetry }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-error/20 to-error/10 rounded-full flex items-center justify-center border-2 border-error/30">
          <ApperIcon name="AlertTriangle" size={32} className="text-error" />
        </div>
        
        <h3 className="text-2xl font-display font-bold text-white mb-3">
          Oups ! Une erreur est survenue
        </h3>
        
        <p className="text-gray-400 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="bg-surface/30 border border-error/20 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <ApperIcon name="Info" size={16} className="text-info mt-0.5 flex-shrink-0" />
            <div className="text-left text-sm text-gray-300">
              <p className="font-medium mb-1">Suggestions:</p>
              <ul className="space-y-1 text-gray-400">
                <li>• Vérifiez votre connexion internet</li>
                <li>• Réessayez dans quelques instants</li>
                <li>• Actualisez la page si le problème persiste</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button
              onClick={onRetry}
              className="flex items-center gap-2"
            >
              <ApperIcon name="RefreshCw" size={16} />
              Réessayer
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <ApperIcon name="RotateCcw" size={16} />
            Actualiser la page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Error;