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