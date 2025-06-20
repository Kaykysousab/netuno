import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await login(username, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-background-light rounded-lg p-8 border border-secondary">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">Entre na sua Conta</h1>
        
        <div className="mb-4 p-3 bg-secondary/20 rounded border border-secondary">
          <p className="text-sm text-text-secondary mb-2">Conta de teste:</p>
          <p className="text-xs text-text-secondary">Usuário: <span className="text-primary">admin</span></p>
          <p className="text-xs text-text-secondary">Senha: <span className="text-primary">admin123</span></p>
        </div>
        
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">
              Nome de Usuário
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-background border border-secondary rounded focus:border-primary focus:outline-none transition-colors"
              disabled={loading}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-background border border-secondary rounded focus:border-primary focus:outline-none transition-colors"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary text-black py-3 rounded font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-text-secondary">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Cadastre-se agora
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;