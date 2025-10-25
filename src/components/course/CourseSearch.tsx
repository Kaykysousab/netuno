import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../common/Button';
import { CourseGrid } from '../courses/CourseGrid';
import { Course } from '../../types';

interface CourseSearchProps {
  courses: Course[];
  onEnroll: (courseId: string) => void;
  onCourseSelect: (course: Course) => void;
  enrolledCourses?: string[];
}

export const CourseSearch: React.FC<CourseSearchProps> = ({
  courses,
  onEnroll,
  onCourseSelect,
  enrolledCourses = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => {
    const cats = courses.map(course => course.category);
    return [...new Set(cats)];
  }, [courses]);

  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const priceOptions = [
    { value: '', label: 'Todos os preços' },
    { value: 'free', label: 'Gratuitos' },
    { value: 'paid', label: 'Pagos' },
    { value: 'premium', label: 'Premium' }
  ];

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || course.category === selectedCategory;
      const matchesLevel = !selectedLevel || course.level === selectedLevel;
      
      let matchesPrice = true;
      if (priceFilter === 'free') matchesPrice = course.price === 0;
      else if (priceFilter === 'paid') matchesPrice = course.price > 0 && !course.isPremium;
      else if (priceFilter === 'premium') matchesPrice = course.isPremium;

      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });
  }, [courses, searchTerm, selectedCategory, selectedLevel, priceFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLevel('');
    setPriceFilter('');
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedLevel || priceFilter;

  return (
    <div className="min-h-screen bg-cosmic-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Explore Nossos
            <span className="block bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Cursos
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descubra cursos incríveis para acelerar sua carreira
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cursos, instrutores ou tópicos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-cosmic-900 border border-cosmic-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              icon={showFilters ? X : SlidersHorizontal}
            >
              {showFilters ? 'Fechar' : 'Filtros'}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              className="bg-cosmic-900 rounded-xl p-6 border border-cosmic-700 mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Categoria
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Todas as categorias</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nível
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Todos os níveis</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preço
                  </label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {priceOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="w-full"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''} encontrado{filteredCourses.length !== 1 ? 's' : ''}
            </p>
            
            {hasActiveFilters && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Filtros ativos:</span>
                {searchTerm && (
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                    "{searchTerm}"
                  </span>
                )}
                {selectedCategory && (
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                    {selectedCategory}
                  </span>
                )}
                {selectedLevel && (
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                    {selectedLevel}
                  </span>
                )}
                {priceFilter && (
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                    {priceOptions.find(p => p.value === priceFilter)?.label}
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Course Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {filteredCourses.length > 0 ? (
            <CourseGrid
              courses={filteredCourses}
              onEnroll={onEnroll}
              onCourseSelect={onCourseSelect}
              enrolledCourses={enrolledCourses}
            />
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhum curso encontrado
              </h3>
              <p className="text-gray-400 mb-6">
                Tente ajustar seus filtros ou termos de busca
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};