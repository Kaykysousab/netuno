import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Alex Chen',
    role: 'Software Developer',
    avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    content: 'The gamification aspect made learning so much more engaging. I earned my first badge in just 2 days!',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'UX Designer',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    content: 'Cosmic Learning transformed my career. The interactive projects helped me build a portfolio that landed my dream job.',
  },
  {
    id: 3,
    name: 'Marcus Rodriguez',
    role: 'Data Scientist',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    content: 'The quality of instruction is incredible. Complex topics are broken down into digestible, fun lessons.',
  },
  {
    id: 4,
    name: 'Emily Park',
    role: 'Product Manager',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    content: 'I love the community aspect. Learning alongside other motivated students keeps me accountable and inspired.',
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-cosmic-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Our
            <span className="block bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Cosmic Learners Say
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied students who have transformed their careers
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-cosmic-800 rounded-xl p-8 border border-cosmic-700 hover:border-purple-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-purple-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {[
            { label: 'Student Satisfaction', value: '98%' },
            { label: 'Course Completion Rate', value: '89%' },
            { label: 'Career Advancement', value: '76%' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};