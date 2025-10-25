import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Trash2, CreditCard as Edit, Mail, Calendar, Award, BookOpen, TrendingUp, UserPlus, X } from 'lucide-react';
import { Button } from '../common/Button';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface UserWithStats {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'instructor' | 'student';
  xp: number;
  level: number;
  created_at: string;
  stats?: {
    enrolledCourses: number;
    completedLessons: number;
    badges: number;
  };
}

export const EnhancedUserManager: React.FC = () => {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [editingUser, setEditingUser] = useState<UserWithStats | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();

      const usersWithStats = await Promise.all(
        data.map(async (user) => {
          const stats = await adminService.getUserStats(user.id);
          return { ...user, stats };
        })
      );

      setUsers(usersWithStats);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.')) {
      try {
        await adminService.deleteUser(userId);
        await loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Erro ao deletar usuário');
      }
    }
  };

  const handleUpdateUser = async (userId: string, updates: any) => {
    try {
      await adminService.updateUser(userId, updates);
      await loadUsers();
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Erro ao atualizar usuário');
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
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
      case 'instructor': return 'bg-blue-500/20 text-blue-400';
      case 'student': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciar Usuários</h2>
          <p className="text-gray-400">Total: {users.length} usuários</p>
        </div>

        <div className="flex space-x-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-cosmic-800 border border-cosmic-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os tipos</option>
            <option value="student">Estudantes</option>
            <option value="instructor">Instrutores</option>
            <option value="admin">Administradores</option>
          </select>
        </div>
      </div>

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
            color: 'text-blue-400'
          },
          {
            label: 'Administradores',
            value: users.filter(u => u.role === 'admin').length,
            icon: Users,
            color: 'text-red-400'
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
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  className="hover:bg-cosmic-800/50 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
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
                        <span className="text-white">{user.stats?.enrolledCourses || 0} cursos</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <TrendingUp size={12} className="text-green-400" />
                        <span className="text-white">Level {user.level} ({user.xp} XP)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Award size={12} className="text-yellow-400" />
                        <span className="text-white">{user.stats?.badges || 0} badges</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <Calendar size={12} />
                      <span>{formatDate(user.created_at)}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                        title="Ver detalhes"
                      >
                        <Users size={16} />
                      </button>
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-gray-400 hover:text-green-400 transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Deletar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
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
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">{selectedUser.name}</h4>
                  <p className="text-gray-400">{selectedUser.email}</p>
                  <p className="text-sm text-blue-400">
                    {getRoleLabel(selectedUser.role)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Cursos', value: selectedUser.stats?.enrolledCourses || 0 },
                  { label: 'Aulas', value: selectedUser.stats?.completedLessons || 0 },
                  { label: 'Badges', value: selectedUser.stats?.badges || 0 },
                  { label: 'Level', value: selectedUser.level }
                ].map((stat, index) => (
                  <div key={index} className="bg-cosmic-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {editingUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setEditingUser(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cosmic-900 rounded-2xl p-8 w-full max-w-md border border-cosmic-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Editar Usuário</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUpdateUser(editingUser.id, {
                  name: formData.get('name') as string,
                  role: formData.get('role') as 'admin' | 'instructor' | 'student'
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingUser.name}
                  required
                  className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Usuário
                </label>
                <select
                  name="role"
                  defaultValue={editingUser.role}
                  required
                  className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="student">Estudante</option>
                  <option value="instructor">Instrutor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
