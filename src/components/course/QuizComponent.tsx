import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { Button } from '../common/Button';
import { Quiz, Question } from '../../types';

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (score: number, passed: boolean) => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      calculateResults();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;
    
    setShowResults(true);
    setQuizCompleted(true);
    onComplete(score, passed);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizCompleted(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (showResults) {
    const score = (selectedAnswers.filter((answer, index) => 
      answer === quiz.questions[index].correctAnswer
    ).length / quiz.questions.length) * 100;

    const passed = score >= quiz.passingScore;

    return (
      <motion.div
        className="bg-cosmic-900 rounded-xl p-8 border border-cosmic-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
              passed ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            {passed ? (
              <Trophy size={40} className="text-green-400" />
            ) : (
              <XCircle size={40} className="text-red-400" />
            )}
          </motion.div>

          <h3 className="text-2xl font-bold text-white mb-2">
            {passed ? 'Parabéns!' : 'Tente Novamente'}
          </h3>
          
          <p className="text-gray-400 mb-6">
            {passed 
              ? 'Você passou no quiz com sucesso!' 
              : `Você precisa de ${quiz.passingScore}% para passar.`
            }
          </p>

          <div className={`text-4xl font-bold mb-6 ${getScoreColor(score)}`}>
            {Math.round(score)}%
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-cosmic-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">
                {selectedAnswers.filter((answer, index) => 
                  answer === quiz.questions[index].correctAnswer
                ).length}
              </div>
              <div className="text-sm text-gray-400">Corretas</div>
            </div>
            <div className="bg-cosmic-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">
                {quiz.questions.length - selectedAnswers.filter((answer, index) => 
                  answer === quiz.questions[index].correctAnswer
                ).length}
              </div>
              <div className="text-sm text-gray-400">Incorretas</div>
            </div>
            <div className="bg-cosmic-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">
                {quiz.questions.length}
              </div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={resetQuiz}
              icon={RotateCcw}
            >
              Tentar Novamente
            </Button>
            {passed && (
              <Button variant="primary">
                Continuar Curso
              </Button>
            )}
          </div>
        </div>

        {/* Detailed Results */}
        <div className="mt-8 space-y-4">
          <h4 className="text-lg font-semibold text-white mb-4">Revisão das Respostas</h4>
          {quiz.questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div key={question.id} className="bg-cosmic-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {isCorrect ? (
                      <CheckCircle size={16} className="text-white" />
                    ) : (
                      <XCircle size={16} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium mb-2">{question.question}</p>
                    <p className={`text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      Sua resposta: {question.options[userAnswer]}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-green-400">
                        Resposta correta: {question.options[question.correctAnswer]}
                      </p>
                    )}
                    {question.explanation && (
                      <p className="text-sm text-gray-400 mt-2">
                        {question.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-cosmic-900 rounded-xl p-8 border border-cosmic-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">
            Pergunta {currentQuestionIndex + 1} de {quiz.questions.length}
          </span>
          <span className="text-sm text-purple-400">
            {Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-cosmic-800 rounded-full h-2">
          <motion.div
            className="bg-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-bold text-white mb-6">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-cosmic-700 bg-cosmic-800 text-gray-300 hover:border-purple-500/50 hover:bg-cosmic-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-400'
                  }`}>
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Anterior
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestionIndex] === undefined}
            >
              {isLastQuestion ? 'Finalizar Quiz' : 'Próxima'}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};