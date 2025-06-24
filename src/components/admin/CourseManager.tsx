import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload,
  Youtube,
  BookOpen,
  Clock,
  Users,
  Star,
  Image as ImageIcon,
  Video,
  Link,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../common/Button';
import { Course, Lesson } from '../../types';

interface CourseManagerProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
}

export const CourseManager: React.FC<CourseManagerProps> = ({ courses, onUpdateCourses }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ courseId: string; lesson: Lesson | null }>({ courseId: '', lesson: null });

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    thumbnail: '',
    instructor: '',
    instructorAvatar: '',
    duration: '',
    level: 'Beginner' as const,
    category: '',
    price: 0,
    isPremium: false,
    skills: [] as string[],
  });

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
  });

  const [skillInput, setSkillInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [showVideoPreview, setShowVideoPreview] = useState(false);

  const resetCourseForm = () => {
    setCourseForm({
      title: '',
      description: '',
      thumbnail: '',
      instructor: '',
      instructorAvatar: '',
      duration: '',
      level: 'Beginner',
      category: '',
      price: 0,
      isPremium: false,
      skills: [],
    });
    setSkillInput('');
    setImagePreview('');
  };

  const resetLessonForm = () => {
    setLessonForm({
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
    });
    setVideoPreview('');
    setShowVideoPreview(false);
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('A imagem deve ter menos de 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setCourseForm(prev => ({ ...prev, thumbnail: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Extract YouTube video ID
  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  // Get YouTube thumbnail
  const getYouTubeThumbnail = (url: string) => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  // Handle video URL change
  const handleVideoUrlChange = (url: string) => {
    setLessonForm(prev => ({ ...prev, videoUrl: url }));
    if (extractYouTubeId(url)) {
      setVideoPreview(getYouTubeEmbedUrl(url));
    } else {
      setVideoPreview('');
    }
  };

  const handleCreateCourse = () => {
    if (!courseForm.title || !courseForm.description) {
      alert('Por favor, preencha pelo menos o título e descrição do curso');
      return;
    }

    const newCourse: Course = {
      id: Date.now().toString(),
      ...courseForm,
      rating: 0,
      reviewCount: 0,
      enrolledCount: 0,
      lessons: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
    };

    const updatedCourses = [...courses, newCourse];
    onUpdateCourses(updatedCourses);
    setIsCreating(false);
    resetCourseForm();
  };

  const handleUpdateCourse = () => {
    if (!editingCourse) return;

    const updatedCourses = courses.map(course =>
      course.id === editingCourse.id
        ? { ...course, ...courseForm, updatedAt: new Date() }
        : course
    );

    onUpdateCourses(updatedCourses);
    setEditingCourse(null);
    resetCourseForm();
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Tem certeza que deseja excluir este curso?')) {
      const updatedCourses = courses.filter(course => course.id !== courseId);
      onUpdateCourses(updatedCourses);
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      instructor: course.instructor,
      instructorAvatar: course.instructorAvatar || '',
      duration: course.duration,
      level: course.level,
      category: course.category,
      price: course.price,
      isPremium: course.isPremium,
      skills: course.skills,
    });
    setImagePreview(course.thumbnail);
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !courseForm.skills.includes(skillInput.trim())) {
      setCourseForm(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setCourseForm(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleAddLesson = (courseId: string) => {
    if (!lessonForm.title || !lessonForm.videoUrl) {
      alert('Por favor, preencha pelo menos o título e URL do vídeo');
      return;
    }

    const newLesson: Lesson = {
      id: Date.now().toString(),
      ...lessonForm,
      order: courses.find(c => c.id === courseId)?.lessons.length || 0,
      isCompleted: false,
      resources: [],
    };

    const updatedCourses = courses.map(course =>
      course.id === courseId
        ? { ...course, lessons: [...course.lessons, newLesson] }
        : course
    );

    onUpdateCourses(updatedCourses);
    setEditingLesson({ courseId: '', lesson: null });
    resetLessonForm();
  };

  const handleUpdateLesson = (courseId: string, lessonId: string) => {
    const updatedCourses = courses.map(course =>
      course.id === courseId
        ? {
            ...course,
            lessons: course.lessons.map(lesson =>
              lesson.id === lessonId ? { ...lesson, ...lessonForm } : lesson
            )
          }
        : course
    );

    onUpdateCourses(updatedCourses);
    setEditingLesson({ courseId: '', lesson: null });
    resetLessonForm();
  };

  const handleDeleteLesson = (courseId: string, lessonId: string) => {
    if (confirm('Tem certeza que deseja excluir esta aula?')) {
      const updatedCourses = courses.map(course =>
        course.id === courseId
          ? { ...course, lessons: course.lessons.filter(lesson => lesson.id !== lessonId) }
          : course
      );

      onUpdateCourses(updatedCourses);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciar Cursos</h2>
        <Button
          onClick={() => setIsCreating(true)}
          icon={Plus}
        >
          Novo Curso
        </Button>
      </div>

      {/* Course Creation/Edit Modal */}
      <AnimatePresence>
        {(isCreating || editingCourse) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-cosmic-900 rounded-2xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-cosmic-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {editingCourse ? 'Editar Curso' : 'Criar Novo Curso'}
                </h3>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingCourse(null);
                    resetCourseForm();
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Imagem do Curso</h4>
                  
                  {/* Image Preview */}
                  <div className="aspect-video bg-cosmic-800 rounded-lg border-2 border-dashed border-cosmic-700 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-400">Nenhuma imagem selecionada</p>
                      </div>
                    )}
                  </div>

                  {/* Upload Options */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Upload de Arquivo
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button variant="outline" className="w-full" icon={Upload}>
                          Escolher Arquivo
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Formatos: JPG, PNG, GIF (máx. 5MB)
                      </p>
                    </div>

                    <div className="text-center text-gray-400">ou</div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        URL da Imagem
                      </label>
                      <input
                        type="url"
                        value={courseForm.thumbnail}
                        onChange={(e) => {
                          setCourseForm(prev => ({ ...prev, thumbnail: e.target.value }));
                          setImagePreview(e.target.value);
                        }}
                        className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Título do Curso *
                        </label>
                        <input
                          type="text"
                          value={courseForm.title}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Ex: React Fundamentals"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Instrutor
                        </label>
                        <input
                          type="text"
                          value={courseForm.instructor}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, instructor: e.target.value }))}
                          className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Nome do instrutor"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Duração
                          </label>
                          <input
                            type="text"
                            value={courseForm.duration}
                            onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                            className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Ex: 6 horas"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Nível
                          </label>
                          <select
                            value={courseForm.level}
                            onChange={(e) => setCourseForm(prev => ({ ...prev, level: e.target.value as any }))}
                            className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="Beginner">Iniciante</option>
                            <option value="Intermediate">Intermediário</option>
                            <option value="Advanced">Avançado</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Categoria
                          </label>
                          <input
                            type="text"
                            value={courseForm.category}
                            onChange={(e) => setCourseForm(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Ex: Programação"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Preço (R$)
                          </label>
                          <input
                            type="number"
                            value={courseForm.price}
                            onChange={(e) => setCourseForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                            className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isPremium"
                          checked={courseForm.isPremium}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, isPremium: e.target.checked }))}
                          className="w-4 h-4 text-purple-600 bg-cosmic-800 border-cosmic-700 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="isPremium" className="text-sm text-gray-300">
                          Curso Premium
                        </label>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Descrição *
                        </label>
                        <textarea
                          value={courseForm.description}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={6}
                          className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Descrição detalhada do curso..."
                        />
                      </div>

                      {/* Skills */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Habilidades
                        </label>
                        <div className="flex space-x-2 mb-2">
                          <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                            className="flex-1 bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Adicionar habilidade"
                          />
                          <Button size="sm" onClick={handleAddSkill}>
                            <Plus size={16} />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {courseForm.skills.map((skill) => (
                            <span
                              key={skill}
                              className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                            >
                              <span>{skill}</span>
                              <button
                                onClick={() => handleRemoveSkill(skill)}
                                className="text-purple-300 hover:text-white"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-cosmic-700">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false);
                        setEditingCourse(null);
                        resetCourseForm();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={editingCourse ? handleUpdateCourse : handleCreateCourse}
                      icon={Save}
                    >
                      {editingCourse ? 'Atualizar' : 'Criar'} Curso
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lesson Creation/Edit Modal */}
      <AnimatePresence>
        {editingLesson.courseId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-cosmic-900 rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-cosmic-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {editingLesson.lesson ? 'Editar Aula' : 'Nova Aula'}
                </h3>
                <button
                  onClick={() => {
                    setEditingLesson({ courseId: '', lesson: null });
                    resetLessonForm();
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Video Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-white">Preview do Vídeo</h4>
                    <button
                      onClick={() => setShowVideoPreview(!showVideoPreview)}
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {showVideoPreview ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  <div className="aspect-video bg-cosmic-800 rounded-lg border border-cosmic-700 overflow-hidden">
                    {videoPreview && showVideoPreview ? (
                      <iframe
                        src={videoPreview}
                        className="w-full h-full"
                        allowFullScreen
                        title="Video Preview"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <Video size={48} className="mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-400">
                            {lessonForm.videoUrl ? 'Clique no olho para ver o preview' : 'Adicione uma URL do YouTube'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {lessonForm.videoUrl && extractYouTubeId(lessonForm.videoUrl) && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-400">
                        <Youtube size={16} />
                        <span className="text-sm font-medium">✓ Vídeo válido do YouTube</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lesson Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Título da Aula *
                    </label>
                    <input
                      type="text"
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ex: Introdução ao React"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={lessonForm.description}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Descrição da aula..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <div className="flex items-center space-x-2">
                        <Youtube size={16} className="text-red-400" />
                        <span>URL do YouTube *</span>
                      </div>
                    </label>
                    <input
                      type="url"
                      value={lessonForm.videoUrl}
                      onChange={(e) => handleVideoUrlChange(e.target.value)}
                      className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Cole o link completo do YouTube (watch?v= ou youtu.be/)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duração
                    </label>
                    <input
                      type="text"
                      value={lessonForm.duration}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ex: 15 min"
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingLesson({ courseId: '', lesson: null });
                        resetLessonForm();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => {
                        if (editingLesson.lesson) {
                          handleUpdateLesson(editingLesson.courseId, editingLesson.lesson.id);
                        } else {
                          handleAddLesson(editingLesson.courseId);
                        }
                      }}
                      icon={Save}
                    >
                      {editingLesson.lesson ? 'Atualizar' : 'Criar'} Aula
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Courses List */}
      <div className="space-y-6">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            className="bg-cosmic-900 rounded-xl p-6 border border-cosmic-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex space-x-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-32 h-24 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-2 max-w-2xl">{course.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{course.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>{course.enrolledCount}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Star size={14} />
                      <span>{course.rating}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <BookOpen size={14} />
                      <span>{course.lessons.length} aulas</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditCourse(course)}
                  icon={Edit}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteCourse(course.id)}
                  icon={Trash2}
                  className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                >
                  Excluir
                </Button>
              </div>
            </div>

            {/* Lessons */}
            <div className="border-t border-cosmic-700 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">Aulas ({course.lessons.length})</h4>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingLesson({ courseId: course.id, lesson: null });
                    resetLessonForm();
                  }}
                  icon={Plus}
                >
                  Nova Aula
                </Button>
              </div>

              <div className="space-y-2">
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3 bg-cosmic-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-400">#{index + 1}</span>
                      <div className="flex items-center space-x-2">
                        {lesson.videoUrl && extractYouTubeId(lesson.videoUrl) && (
                          <Youtube size={16} className="text-red-400" />
                        )}
                        <img
                          src={getYouTubeThumbnail(lesson.videoUrl || '')}
                          alt=""
                          className="w-12 h-8 rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <div>
                        <h5 className="font-medium text-white">{lesson.title}</h5>
                        <p className="text-sm text-gray-400">{lesson.duration}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingLesson({ courseId: course.id, lesson });
                          setLessonForm({
                            title: lesson.title,
                            description: lesson.description,
                            videoUrl: lesson.videoUrl || '',
                            duration: lesson.duration,
                          });
                          if (lesson.videoUrl) {
                            handleVideoUrlChange(lesson.videoUrl);
                          }
                        }}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(course.id, lesson.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {course.lessons.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Nenhuma aula criada ainda</p>
                    <p className="text-sm">Clique em "Nova Aula" para começar</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {courses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={64} className="mx-auto mb-4 text-gray-400 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum curso criado ainda
            </h3>
            <p className="text-gray-400 mb-6">
              Comece criando seu primeiro curso
            </p>
            <Button onClick={() => setIsCreating(true)} icon={Plus}>
              Criar Primeiro Curso
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};