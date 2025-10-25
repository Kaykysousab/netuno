import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  BarChart3, 
  Users, 
  BookOpen, 
  DollarSign,
  TrendingUp,
  Settings,
  Download,
  Upload
} from 'lucide-react';
import { Button } from '../common/Button';
import { CourseManager } from '../admin/CourseManager';
import { UserManager } from '../admin/UserManager';
import { useAuth } from '../../context/AuthContext';
import { StorageManager } from '../../utils/storage';
import { Course, User } from '../../types';
import { mockCourses } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const { getAllUsers } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'users' | 'settings'>('overview');
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load courses from storage or use mock data
    const storedCourses = StorageManager.getCourses();
    if (storedCourses.length === 0) {
      StorageManager.saveCourses(mockCourses);
      setCourses(mockCourses);
    } else {
      setCourses(storedCourses);
    }

    // Load users
    const allUsers = getAllUsers();
    setUsers(allUsers);
  }, [getAllUsers]);

  const handleUpdateCourses = (updatedCourses: Course[]) => {
    setCourses(updatedCourses);
    StorageManager.saveCourses(updatedCourses);
  };

  const handleUpdateUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    StorageManager.saveUsers(updatedUsers);
  };

  const handleExportData = () => {
    const data = StorageManager.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cosmic-learning-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (StorageManager.importData(content)) {
        alert('Dados importados com sucesso!');
        window.location.reload();
      } else {
        alert('Erro ao importar dados. Verifique o arquivo.');
      }
    };
    reader.readAsText(file);
  };

  const stats = [
    {
      label: 'Total de Estudantes',
      value: users.filter(u => u.role === 'student').length.toString(),
      change: '+12%',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      label: 'Cursos Ativos',
      value: courses.filter(c => c.status === 'published').length.toString(),
      change: '+8%',
      icon: BookOpen,
      color: 'text-green-400'
    },
    {
      label: 'Receita Total',
      value: `R$ ${courses.reduce((total, course) => total + (course.price * course.enrolledCount), 0).toLocaleString()}`,
      change: '+23%',
      icon: DollarSign,
      color: 'text-purple-400'
    },
    {
      label: 'Taxa de Conclusão',
      value: '94.2%',
      change: '+5%',
      icon: TrendingUp,
      color: 'text-yellow-400'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'courses', label: 'Cursos', icon: BookOpen },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cosmic-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
            <p className="text-gray-400">Gerencie cursos, usuários e configurações da plataforma</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex space-x-1 bg-cosmic-900 rounded-lg p-1 border border-cosmic-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-cosmic-800'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="bg-cosmic-900 border border-cosmic-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-cosmic-800 ${stat.color}`}>
                        <stat.icon size={24} />
                      </div>
                      <span className="text-green-400 text-sm font-medium">
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-cosmic-900 border border-cosmic-700 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Atividade Recente</h2>
                <div className="space-y-4">
                  {[
                    { action: 'Novo usuário cadastrado', user: 'João Silva', time: '2 min atrás' },
                    { action: 'Curso publicado', user: 'Admin', time: '15 min atrás' },
                    { action: 'Aula concluída', user: 'Maria Santos', time: '1 hora atrás' },
                    { action: 'Novo curso criado', user: 'Admin', time: '2 horas atrás' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-cosmic-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-gray-400 text-sm">por {activity.user}</p>
                      </div>
                      <span className="text-gray-400 text-sm">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <CourseManager
              courses={courses}
              onUpdateCourses={handleUpdateCourses}
            />
          )}

          {activeTab === 'users' && (
            <UserManager
              users={users}
              onUpdateUsers={handleUpdateUsers}
            />
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-cosmic-900 border border-cosmic-700 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Configurações do Sistema</h2>
                
                <div className="space-y-6">
                  {/* Data Management */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Gerenciamento de Dados</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={handleExportData}
                        icon={Download}
                        variant="outline"
                      >
                        Exportar Dados
                      </Button>
                      
                      <div className="relative">
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportData}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button
                          icon={Upload}
                          variant="outline"
                        >
                          Importar Dados
                        </Button>
                      </div>
                      
                      <Button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
                            StorageManager.clearAllData();
                            window.location.reload();
                          }
                        }}
                        variant="outline"
                        className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                      >
                        Limpar Todos os Dados
                      </Button>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                      Exporte seus dados para backup ou importe dados de um backup anterior.
                    </p>
                  </div>

                  {/* Platform Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Configurações da Plataforma</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-cosmic-800 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">Registros Públicos</h4>
                          <p className="text-gray-400 text-sm">Permitir que novos usuários se cadastrem</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 text-purple-600 bg-cosmic-700 border-cosmic-600 rounded focus:ring-purple-500"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-cosmic-800 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">Cursos Gratuitos</h4>
                          <p className="text-gray-400 text-sm">Permitir acesso a cursos gratuitos sem login</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 text-purple-600 bg-cosmic-700 border-cosmic-600 rounded focus:ring-purple-500"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-cosmic-800 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">Sistema de Badges</h4>
                          <p className="text-gray-400 text-sm">Ativar gamificação com badges e XP</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 text-purple-600 bg-cosmic-700 border-cosmic-600 rounded focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};