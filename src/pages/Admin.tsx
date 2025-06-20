import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getCourses, 
  getVideos, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  createVideo,
  updateVideo,
  deleteVideo
} from '../data/storage';
import type { Course, Video } from '../types';
import { Plus, Edit, Trash2, Save, X, Eye } from 'lucide-react';

const Admin: React.FC = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'courses' | 'videos'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
      return;
    }
    
    loadData();
  }, [isAuthenticated, isAdmin, navigate]);

  const loadData = () => {
    setCourses(getCourses());
    setVideos(getVideos());
  };

  const handleCreateCourse = (courseData: Omit<Course, 'id' | 'createdAt'>) => {
    createCourse(courseData);
    loadData();
    setShowCourseForm(false);
  };

  const handleUpdateCourse = (id: string, courseData: Partial<Course>) => {
    updateCourse(id, courseData);
    loadData();
    setEditingCourse(null);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este curso? Todos os vídeos relacionados também serão excluídos.')) {
      deleteCourse(id);
      loadData();
    }
  };

  const handleCreateVideo = (videoData: Omit<Video, 'id'>) => {
    createVideo(videoData);
    loadData();
    setShowVideoForm(false);
  };

  const handleUpdateVideo = (id: string, videoData: Partial<Video>) => {
    updateVideo(id, videoData);
    loadData();
    setEditingVideo(null);
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este vídeo?')) {
      deleteVideo(id);
      loadData();
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'cybersecurity':
        return 'Cibersegurança';
      case 'computing':
        return 'Informática Básica';
      case 'frontend':
        return 'Frontend';
      default:
        return category;
    }
  };

  const getCourseTitle = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Curso não encontrado';
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">Painel Administrativo</h1>
        <p className="text-text-secondary">Gerencie cursos e vídeos da plataforma</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'courses'
              ? 'bg-primary text-black'
              : 'bg-background-light text-text-secondary hover:text-primary'
          }`}
        >
          Cursos ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'videos'
              ? 'bg-primary text-black'
              : 'bg-background-light text-text-secondary hover:text-primary'
          }`}
        >
          Vídeos ({videos.length})
        </button>
      </div>

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Gerenciar Cursos</h2>
            <button
              onClick={() => setShowCourseForm(true)}
              className="flex items-center px-4 py-2 bg-primary text-black rounded hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Novo Curso
            </button>
          </div>

          <div className="grid gap-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-background-light rounded-lg p-6 border border-secondary">
                {editingCourse?.id === course.id ? (
                  <CourseEditForm
                    course={course}
                    onSave={(data) => handleUpdateCourse(course.id, data)}
                    onCancel={() => setEditingCourse(null)}
                  />
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold mr-3">{course.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          course.isActive 
                            ? 'bg-green-900/20 text-green-500' 
                            : 'bg-red-900/20 text-red-500'
                        }`}>
                          {course.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                        <span className="ml-2 px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                          {getCategoryName(course.category)}
                        </span>
                      </div>
                      <p className="text-text-secondary mb-2">{course.description}</p>
                      <p className="text-sm text-text-secondary">
                        Criado em: {new Date(course.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => navigate(`/course/${course.id}`)}
                        className="p-2 text-text-secondary hover:text-primary transition-colors"
                        title="Visualizar"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="p-2 text-text-secondary hover:text-primary transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Gerenciar Vídeos</h2>
            <button
              onClick={() => setShowVideoForm(true)}
              className="flex items-center px-4 py-2 bg-primary text-black rounded hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Novo Vídeo
            </button>
          </div>

          <div className="grid gap-4">
            {videos.map((video) => (
              <div key={video.id} className="bg-background-light rounded-lg p-6 border border-secondary">
                {editingVideo?.id === video.id ? (
                  <VideoEditForm
                    video={video}
                    courses={courses}
                    onSave={(data) => handleUpdateVideo(video.id, data)}
                    onCancel={() => setEditingVideo(null)}
                  />
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold mr-3">{video.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          video.isActive 
                            ? 'bg-green-900/20 text-green-500' 
                            : 'bg-red-900/20 text-red-500'
                        }`}>
                          {video.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                        <span className="ml-2 px-2 py-1 bg-secondary/50 text-text-secondary rounded text-xs">
                          Ordem: {video.order}
                        </span>
                      </div>
                      <p className="text-text-secondary mb-2">{video.description}</p>
                      <p className="text-sm text-text-secondary mb-1">
                        Curso: {getCourseTitle(video.courseId)}
                      </p>
                      <p className="text-sm text-text-secondary mb-1">
                        YouTube ID: {video.youtubeId}
                      </p>
                      <p className="text-sm text-text-secondary">
                        Duração: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')} min
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => navigate(`/video/${video.id}`)}
                        className="p-2 text-text-secondary hover:text-primary transition-colors"
                        title="Visualizar"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => setEditingVideo(video)}
                        className="p-2 text-text-secondary hover:text-primary transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Form Modal */}
      {showCourseForm && (
        <CourseForm
          onSave={handleCreateCourse}
          onCancel={() => setShowCourseForm(false)}
        />
      )}

      {/* Video Form Modal */}
      {showVideoForm && (
        <VideoForm
          courses={courses}
          onSave={handleCreateVideo}
          onCancel={() => setShowVideoForm(false)}
        />
      )}
    </div>
  );
};

// Course Form Component
const CourseForm: React.FC<{
  onSave: (data: Omit<Course, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    category: 'cybersecurity' as Course['category'],
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background-light rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Novo Curso</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 bg-background border border-secondary rounded focus:border-primary focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 bg-background border border-secondary rounded focus:border-primary focus:outline-none h-24"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              URL da Thumbnail
            </label>
            <input
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              className="w-full p-3 bg-background border border-secondary rounded focus:border-primary focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Categoria
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Course['category'] })}
              className="w-full p-3 bg-background border border-secondary rounded focus:border-primary focus:outline-none"
            >
              <option value="cybersecurity">Cibersegurança</option>
              <option value="computing">Informática Básica</option>
              <option value="frontend">Frontend</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-text-secondary">Curso ativo</span>
            </label>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-text-secondary hover:text-text transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-black rounded hover:bg-primary/90 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Course Edit Form Component
const CourseEditForm: React.FC<{
  course: Course;
  onSave: (data: Partial<Course>) => void;
  onCancel: () => void;
}> = ({ course, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    category: course.category,
    isActive: course.isActive
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Título
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 bg-background border border-secondary rounded focus:border-primary focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Categoria
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Course['category'] })}
            className="w-full p-2 bg-background border border-secondary rounded focus:border-primary focus:outline-none"
          >
            <option value="cybersecurity">Cibersegurança</option>
            <option value="computing">Informática Básica</option>
            <option value="frontend">Frontend</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Descrição
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 bg-background border border-secondary rounded focus:border-primary focus:outline-none h-20"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-text-secondary mb-1">
          URL da Thumbnail
        </label>
        <input
          type="url"
          value={formData.thumbnailUrl}
          onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
          className="w-full p-2 bg-background border border-secondary rounded focus:border-primary focus:outline-none"
          required
        />
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm text-text-secondary">Curso ativo</span>
        </label>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center px-3 py-1 text-text-secondary hover:text-text transition-colors"
        >
          <X size={16} className="mr-1" />
          Cancelar
        </button>
        <button
          type="submit"
          className="flex items-center px-3 py-1 bg-primary text-black rounded hover:bg-primary/90 transition-colors"
        >
          <Save size={16} className="mr-1" />
          Salvar
        </button>
      </div>
    </form>
  );
};

// Video Form Component
const VideoForm: React.FC<{
  courses: Course[];
  onSave: (data: Omit<Video, 'id'>) => void;
  onCancel: () => void;
}> = ({ courses, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    youtubeId: '',
    duration: 0,
    order: 1,
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background-light rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Novo Vídeo</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Curso
            </label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full p-3 bg-background border border-secondary rounded focus:border-primary focus:outline-none"
              required
            >
              <option value="">Selecione um curso</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 bg-background border border-secondary rounded focus:border-primary focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 bg-background border border-secondary rounded focus:border-primary focus:outline-none h-24"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                YouTube ID
              </label>
              <input
                type="text"
                value={formData.youtubeId}
                onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                className="w-full p-3 bg-background border border-secondary rounded focus:border-primary focus:outline-none"
                placeholder="Ex: dQw4w9WgXcQ"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Duração (segundos)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full p-3 bg-background border border-secondary rounded focus:border-primary focus:outline-none"
                min="1"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Ordem
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full p-3 bg-background border border-secondary rounded focus:border-primary focus:outline-none"
              min="1"
              required
            />
          </div>
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-text-secondary">Vídeo ativo</span>
            </label>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-text-secondary hover:text-text transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-black rounded hover:bg-primary/90 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Video Edit Form Component
const VideoEditForm: React.FC<{
  video: Video;
  courses: Course[];
  onSave: (data: Partial<Video>) => void;
  onCancel: () => void;
}> = ({ video, courses, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    courseId: video.courseId,
    title: video.title,
    description: video.description,
    youtubeId: video.youtubeId,
    duration: video.duration,
    order: video.order,
    isActive: video.isActive
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Curso
          </label>
          <select
            value={formData.courseId}
            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
            className="w-full p-2 bg-background border border-secondary rounded focus:border-primary focus:outline-none"
            required
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Ordem
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            className="w-full p-2 bg-background border border-secondary rounded focus:border-primary focus:outline-none"
            min="1"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Título
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 bg-background border border-secondary rounded focus:border-primary focus:outline-none"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Descrição
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 bg-background border border-secondary rounded focus:border-primary focus:outline-none h-20"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            YouTube ID
          </label>
          <input
            type="text"
            value={formData.youtubeId}
            onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
            className="w-full p-2 bg-background border border-secondary rounded focus:border-primary focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Duração (segundos)
          </label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            className="w-full p-2 bg-background border border-secondary rounded focus:border-primary focus:outline-none"
            min="1"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm text-text-secondary">Vídeo ativo</span>
        </label>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center px-3 py-1 text-text-secondary hover:text-text transition-colors"
        >
          <X size={16} className="mr-1" />
          Cancelar
        </button>
        <button
          type="submit"
          className="flex items-center px-3 py-1 bg-primary text-black rounded hover:bg-primary/90 transition-colors"
        >
          <Save size={16} className="mr-1" />
          Salvar
        </button>
      </div>
    </form>
  );
};

export default Admin;