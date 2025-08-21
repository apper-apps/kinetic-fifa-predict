import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Header = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    toast.success('Déconnexion réussie !');
    onLogout();
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'Home' },
    { path: '/stats', label: 'Statistiques', icon: 'BarChart3' },
    { path: '/settings', label: 'Paramètres', icon: 'Settings' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">FP</span>
            </div>
            <span className="text-xl font-display font-bold text-white hidden sm:block">FIFA Predict</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-gray-300 hover:text-white hover:bg-surface/50'
                }`}
              >
                <ApperIcon name={item.icon} size={16} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="hidden md:flex items-center gap-3 bg-surface/30 rounded-lg px-3 py-2 border border-primary/20">
              <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-black" />
              </div>
              <div className="text-sm">
                <div className="text-white font-medium">Utilisateur</div>
                <div className="text-gray-400 text-xs">Pro Member</div>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 border-error/30 text-error hover:bg-error/10"
            >
              <ApperIcon name="LogOut" size={16} />
              <span>Déconnexion</span>
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-surface/30 border border-primary/20 text-gray-300 hover:text-white transition-colors"
            >
              <ApperIcon name={isMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-surface/90 border-t border-primary/20 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-gray-300 hover:text-white hover:bg-surface/50'
                }`}
              >
                <ApperIcon name={item.icon} size={18} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            
            <div className="border-t border-primary/20 pt-4 mt-4">
              <div className="flex items-center gap-3 px-4 py-2 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={20} className="text-black" />
                </div>
                <div>
                  <div className="text-white font-medium">Utilisateur</div>
                  <div className="text-gray-400 text-sm">Pro Member</div>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 border-error/30 text-error hover:bg-error/10"
              >
                <ApperIcon name="LogOut" size={16} />
                <span>Déconnexion</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;