import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Ban, 
  UserCheck, 
  Mail,
  Calendar,
  Award,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { Button } from '../common/Button';
import { User } from '../../types';

interface UserManagerProps {
  users: User[];
  onUpdateUsers: (users: User[]) => void;
}

export const UserManager: React.FC<UserManagerProps> = ({ users, onUpdateUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleBanUser = (userId: string) => {
    if (confirm('Tem certeza que deseja banir este usuário?')) {
      // In a real app, you'd update the user's status
      console.log('Banning user:', userId);
    }
  };

  const getUserStats = (user: User) => {
    return {
      coursesEnrolled: user.enrolledCourses?.length || 0,
      lessonsCompleted: user.completedLessons?.length || 0,
      badgesEarned: user.badges?.length || 0,
      xpTotal: user.xp || 0,
      level: user.level || 1
    };
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'instructor': return 'Instrutor';
      case 'student': return 'Estudante';
      default: return 'Usuário';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400';
      case 'instructor': return 'bg-purple-500/20 text-purple-400';
      case 'student': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciar Usuários</h2>
          <p className="text-gray-400">Total: {users.length} usuários</p>
        </div>
        
        {/* Search and Filters */}
        <div className="flex space-x-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-cosmic-800 border border-cosmic-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Todos os tipos</option>
            <option value="student">Estudantes</option>
            <option value="instructor">Instrutores</option>
            <option value="admin">Administradores</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: 'Total de Usuários',
            value: users.length,
            icon: Users,
            color: 'text-blue-400'
          },
          {
            label: 'Estudantes',
            value: users.filter(u => u.role === 'student').length,
            icon: BookOpen,
            color: 'text-green-400'
          },
          {
            label: 'Instrutores',
            value: users.filter(u => u.role === 'instructor').length,
            icon: Award,
            color: 'text-purple-400'
          },
          {
            label: 'Administradores',
            value: users.filter(u => u.role === 'admin').length,
            icon: UserCheck,
            color: 'text-yellow-400'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-cosmic-900 border border-cosmic-700 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-cosmic-800 ${stat.color} mb-4`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-cosmic-900 border border-cosmic-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cosmic-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Usuário</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Tipo</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Progresso</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Cadastro</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cosmic-700">
              {filteredUsers.map((user) => {
                const stats = getUserStats(user);
                
                return (
                  <motion.tr
                    key={user.id}
                    className="hover:bg-cosmic-800/50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-gradient rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-400 flex items-center space-x-1">
                            <Mail size={12} />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <BookOpen size={12} className="text-blue-400" />
                          <span className="text-white">{stats.coursesEnrolled} cursos</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <TrendingUp size={12} className="text-green-400" />
                          <span className="text-white">Level {stats.level} ({stats.xpTotal} XP)</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Award size={12} className="text-yellow-400" />
                          <span className="text-white">{stats.badgesEarned} badges</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <Calendar size={12} />
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-gray-400 hover:text-purple-400 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        <button
                          onClick={() => handleBanUser(user.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Ban size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Nenhum usuário encontrado
            </h3>
            <p className="text-gray-400">
              Tente ajustar os filtros de busca
            </p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedUser(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cosmic-900 rounded-2xl p-8 w-full max-w-2xl border border-cosmic-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Detalhes do Usuário</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-gradient rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">{selectedUser.name}</h4>
                  <p className="text-gray-400">{selectedUser.email}</p>
                  <p className="text-sm text-purple-400">
                    {getRoleLabel(selectedUser.role)}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Cursos', value: getUserStats(selectedUser).coursesEnrolled },
                  { label: 'Aulas', value: getUserStats(selectedUser).lessonsCompleted },
                  { label: 'Badges', value: getUserStats(selectedUser).badgesEarned },
                  { label: 'Level', value: getUserStats(selectedUser).level }
                ].map((stat, index) => (
                  <div key={index} className="bg-cosmic-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Badges */}
              {selectedUser.badges && selectedUser.badges.length > 0 && (
                <div>
                  <h5 className="text-lg font-semibold text-white mb-3">Badges Conquistadas</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="bg-purple-500/20 text-purple-300 px-3 py-2 rounded-lg text-sm flex items-center space-x-2"
                      >
                        <span>{badge.icon}</span>
                        <span>{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Fechar
                </Button>
                <Button variant="outline" className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white">
                  Banir Usuário
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};