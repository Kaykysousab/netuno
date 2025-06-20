import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Laptop, Shield, Code, LogOut, User, Menu, X, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const { isAuthenticated, logout, currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      {/* Header */}
      <header className="bg-background-light border-b border-primary/30 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-primary text-2xl font-bold flex items-center">
            <Code className="mr-2 animate-glow" />
            <span>TechLearn</span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-text p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/category/cybersecurity" className="flex items-center text-text-secondary hover:text-primary transition-colors">
              <Shield size={18} className="mr-1" />
              <span>Cibersegurança</span>
            </Link>
            <Link to="/category/computing" className="flex items-center text-text-secondary hover:text-primary transition-colors">
              <Laptop size={18} className="mr-1" />
              <span>Informática Básica</span>
            </Link>
            <Link to="/category/frontend" className="flex items-center text-text-secondary hover:text-primary transition-colors">
              <Code size={18} className="mr-1" />
              <span>Frontend</span>
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-text-secondary">
                  <User size={18} className="inline mr-1" />
                  {currentUser?.username}
                </span>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center text-text-secondary hover:text-primary transition-colors"
                  >
                    <Settings size={18} className="mr-1" />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center text-text-secondary hover:text-primary transition-colors"
                >
                  <LogOut size={18} className="mr-1" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded border border-primary text-primary hover:bg-primary/10 transition-colors"
                >
                  Entrar
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded bg-primary text-black hover:bg-primary/90 transition-colors"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background-light border-b border-primary/30">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/category/cybersecurity" 
              className="flex items-center text-text-secondary hover:text-primary transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              <Shield size={18} className="mr-2" />
              <span>Cibersegurança</span>
            </Link>
            <Link 
              to="/category/computing" 
              className="flex items-center text-text-secondary hover:text-primary transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              <Laptop size={18} className="mr-2" />
              <span>Informática Básica</span>
            </Link>
            <Link 
              to="/category/frontend" 
              className="flex items-center text-text-secondary hover:text-primary transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              <Code size={18} className="mr-2" />
              <span>Frontend</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <div className="text-text-secondary py-2">
                  <User size={18} className="inline mr-2" />
                  {currentUser?.username}
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center text-text-secondary hover:text-primary transition-colors py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Settings size={18} className="mr-2" />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center text-text-secondary hover:text-primary transition-colors py-2"
                >
                  <LogOut size={18} className="mr-2" />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded border border-primary text-primary hover:bg-primary/10 transition-colors text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded bg-primary text-black hover:bg-primary/90 transition-colors text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-background-light border-t border-primary/30 py-6">
        <div className="container mx-auto px-4 text-center text-text-secondary">
          <p>© 2025 TechLearn Platform. Todos os direitos reservados.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <Link to="/category/cybersecurity" className="hover:text-primary transition-colors">Cibersegurança</Link>
            <Link to="/category/computing" className="hover:text-primary transition-colors">Informática Básica</Link>
            <Link to="/category/frontend" className="hover:text-primary transition-colors">Frontend</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;