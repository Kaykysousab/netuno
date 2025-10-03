import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  X,
  DollarSign,
  Users
} from 'lucide-react';
import { Button } from '../common/Button';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  instructor: string;
  price: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  status: 'draft' | 'published';
  enrolled_count: number;
  rating: number;
  created_at: string;
}

export const EnhancedCourseManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [creatingCourse, setCreatingCourse] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || course.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateCourse = async (formData: FormData) => {
    try {
      await adminService.createCourse({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        instructor: formData.get('instructor') as string,
        price: parseFloat(formData.get('price') as string),
        category: formData.get('category') as string,
        level: formData.get('level') as 'beginner' | 'intermediate' | 'advanced',
        duration: formData.get('duration') as string,
        status: formData.get('status') as 'draft' | 'published',
        thumbnail: formData.get('thumbnail') as string || null
      });
      await loadCourses();
      setCreatingCourse(false);
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Erro ao criar curso');
    }
  };

  const handleUpdateCourse = async (courseId: string, formData: FormData) => {
    try {
      await adminService.updateCourse(courseId, {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        instructor: formData.get('instructor') as string,
        price: parseFloat(formData.get('price') as string),
        category: formData.get('category') as string,
        level: formData.get('level') as 'beginner' | 'intermediate' | 'advanced',
        duration: formData.get('duration') as string,
        status: formData.get('status') as 'draft' | 'published',
        thumbnail: formData.get('thumbnail') as string || null
      });
      await loadCourses();
      setEditingCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Erro ao atualizar curso');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('Tem certeza que deseja deletar este curso? Esta ação não pode ser desfeita.')) {
      try {
        await adminService.deleteCourse(courseId);
        await loadCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Erro ao deletar curso');
      }
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return level;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const CourseForm = ({ course, onSubmit, onCancel }: {
    course?: Course;
    onSubmit: (formData: FormData) => void;
    onCancel: () => void;
  }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget));
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Título do Curso
        </label>
        <input
          type="text"
          name="title"
          defaultValue={course?.title}
          required
          className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Descrição
        </label>
        <textarea
          name="description"
          defaultValue={course?.description}
          required
          rows={4}
          className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Instrutor
          </label>
          <input
            type="text"
            name="instructor"
            defaultValue={course?.instructor}
            required
            className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Preço (R$)
          </label>
          <input
            type="number"
            name="price"
            defaultValue={course?.price}
            required
            min="0"
            step="0.01"
            className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Categoria
          </label>
          <input
            type="text"
            name="category"
            defaultValue={course?.category}
            required
            placeholder="Ex: Programação"
            className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nível
          </label>
          <select
            name="level"
            defaultValue={course?.level}
            required
            className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="beginner">Iniciante</option>
            <option value="intermediate">Intermediário</option>
            <option value="advanced">Avançado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Duração
          </label>
          <input
            type="text"
            name="duration"
            defaultValue={course?.duration}
            required
            placeholder="Ex: 10 horas"
            className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            name="status"
            defaultValue={course?.status || 'draft'}
            required
            className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          URL da Imagem (opcional)
        </label>
        <input
          type="url"
          name="thumbnail"
          defaultValue={course?.thumbnail || ''}
          placeholder="https://exemplo.com/imagem.jpg"
          className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {course ? 'Atualizar' : 'Criar'} Curso
        </Button>
      </div>
    </form>
  );

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
          <h2 className="text-2xl font-bold text-white">Gerenciar Cursos</h2>
          <p className="text-gray-400">Total: {courses.length} cursos</p>
        </div>

        <div className="flex space-x-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-cosmic-800 border border-cosmic-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os status</option>
            <option value="published">Publicados</option>
            <option value="draft">Rascunhos</option>
          </select>

          <Button icon={Plus} onClick={() => setCreatingCourse(true)}>
            Novo Curso
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: 'Total de Cursos',
            value: courses.length,
            icon: BookOpen,
            color: 'text-blue-400'
          },
          {
            label: 'Publicados',
            value: courses.filter(c => c.status === 'published').length,
            icon: Eye,
            color: 'text-green-400'
          },
          {
            label: 'Rascunhos',
            value: courses.filter(c => c.status === 'draft').length,
            icon: EyeOff,
            color: 'text-yellow-400'
          },
          {
            label: 'Total Matrículas',
            value: courses.reduce((sum, c) => sum + c.enrolled_count, 0),
            icon: Users,
            color: 'text-blue-400'
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <motion.div
            key={course.id}
            className="bg-cosmic-900 border border-cosmic-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <BookOpen size={48} className="text-white opacity-50" />
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(course.level)}`}>
                  {getLevelLabel(course.level)}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  course.status === 'published'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {course.status === 'published' ? 'Publicado' : 'Rascunho'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{course.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>{course.instructor}</span>
                <span className="text-green-400 font-semibold flex items-center">
                  <DollarSign size={14} />
                  R$ {course.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>{course.enrolled_count} alunos</span>
                <span>{course.duration}</span>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  icon={Edit}
                  onClick={() => setEditingCourse(course)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                  icon={Trash2}
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  Deletar
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Nenhum curso encontrado
          </h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || filterStatus
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando seu primeiro curso'}
          </p>
          {!searchTerm && !filterStatus && (
            <Button icon={Plus} onClick={() => setCreatingCourse(true)}>
              Criar Primeiro Curso
            </Button>
          )}
        </div>
      )}

      {creatingCourse && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setCreatingCourse(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cosmic-900 rounded-2xl p-8 w-full max-w-2xl border border-cosmic-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Criar Novo Curso</h3>
              <button
                onClick={() => setCreatingCourse(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <CourseForm
              onSubmit={handleCreateCourse}
              onCancel={() => setCreatingCourse(false)}
            />
          </motion.div>
        </motion.div>
      )}

      {editingCourse && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setEditingCourse(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cosmic-900 rounded-2xl p-8 w-full max-w-2xl border border-cosmic-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Editar Curso</h3>
              <button
                onClick={() => setEditingCourse(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <CourseForm
              course={editingCourse}
              onSubmit={(formData) => handleUpdateCourse(editingCourse.id, formData)}
              onCancel={() => setEditingCourse(null)}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
