import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um endereço de email válido');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await register(username, email, password);
      
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
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">Criar uma Conta</h1>
        
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
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-background border border-secondary rounded focus:border-primary focus:outline-none transition-colors"
              disabled={loading}
            />
          </div>
          
          <div className="mb-4">
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
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1">
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-background border border-secondary rounded focus:border-primary focus:outline-none transition-colors"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary text-black py-3 rounded font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-text-secondary">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;