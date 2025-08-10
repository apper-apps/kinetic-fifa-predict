import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';

const LoginPage = ({ onAuthenticate }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a brief loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === '1989') {
      toast.success('Accès autorisé ! Bienvenue dans FIFA Predict');
      onAuthenticate();
    } else {
      toast.error('Code d\'accès incorrect. Veuillez réessayer.');
      setPassword('');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-xl mb-4 shadow-neon">
            <ApperIcon name="Shield" size={32} className="text-black" />
          </div>
          <h1 className="text-3xl font-display gradient-text mb-2">
            FIFA PREDICT
          </h1>
          <p className="text-gray-400">
            Entrez le code d'accès pour continuer
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gradient-to-br from-surface to-secondary-500 rounded-2xl p-8 border border-primary/20 shadow-neon">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Code d'accès"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre code d'accès"
              className="text-center text-lg font-mono tracking-wider"
              disabled={isLoading}
              autoFocus
            />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading || !password}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>Vérification...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Lock" size={16} />
                  <span>Accéder</span>
                </div>
              )}
            </Button>
          </form>

{/* Help Text */}
          <div className="mt-6 pt-6 border-t border-primary/20">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <ApperIcon name="Info" size={14} />
              <span>Contactez l'administrateur si vous avez oublié le code</span>
            </div>
          </div>

          {/* Moyens de Paiement Preview */}
          <div className="mt-8 pt-6 border-t border-accent/20">
            <div className="text-center mb-6">
              <h3 className="text-white font-semibold mb-2 flex items-center justify-center gap-2">
                <ApperIcon name="CreditCard" size={18} className="text-primary" />
                Moyens de Paiement Disponibles
              </h3>
              <p className="text-sm text-gray-400">Contactez le créateur pour vous inscrire</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg px-3 py-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">O</span>
                </div>
                <span className="text-white text-sm font-medium">Orange</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">M</span>
                </div>
                <span className="text-white text-sm font-medium">MTN</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg px-3 py-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="Waves" size={12} className="text-white" />
                </div>
                <span className="text-white text-sm font-medium">Wave</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-lg px-3 py-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="Coins" size={12} className="text-white" />
                </div>
                <span className="text-white text-sm font-medium">Moov</span>
              </div>
            </div>
          </div>

          {/* Contact Créateur */}
          <div className="mt-6 pt-6 border-t border-accent/20">
            <div className="text-center">
              <h3 className="text-white font-semibold mb-4 flex items-center justify-center gap-2">
                <ApperIcon name="User" size={18} className="text-accent" />
                Contacter le Créateur
              </h3>
              <div className="space-y-3">
                <p className="text-primary font-medium text-lg">Ange Christ</p>
                <div className="space-y-3">
                  <a href="https://wa.me/2250503951888" target="_blank" rel="noopener noreferrer" 
                     className="flex items-center justify-center gap-2 text-green-400 hover:text-green-300 transition-colors bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
                    <ApperIcon name="MessageCircle" size={16} />
                    <span className="text-sm font-medium">WhatsApp: 0503951888</span>
                  </a>
                  <a href="https://t.me/+2250710335536" target="_blank" rel="noopener noreferrer"
                     className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2">
                    <ApperIcon name="Send" size={16} />
                    <span className="text-sm font-medium">Telegram: 0710335536</span>
                  </a>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Contactez-moi pour obtenir votre code d'accès et commencer à utiliser FIFA Predict
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 FIFA Predict - Application sécurisée</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;