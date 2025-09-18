import React, { useState } from 'react';
import type { Quiz, Student } from '../types';
import Button from './common/Button';
import Modal from './common/Modal';
import { useModal } from '../hooks/useModal';
import { logger } from '../utils/logger';

interface AssessmentViewProps {
  quizzes: Quiz[];
  students: Student[];
  addQuiz: (quiz: Omit<Quiz, 'id' | 'classroomId'>) => void;
  deleteQuiz?: (quizId: string) => void;
  currentTopic: string;
}

const AssessmentView: React.FC<AssessmentViewProps> = ({ 
  quizzes, 
  students, 
  addQuiz, 
  deleteQuiz,
  currentTopic 
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newQuiz, setNewQuiz] = useState<Partial<Omit<Quiz, 'id' | 'classroomId'>>>({
    title: '',
    questions: [],
    topic: currentTopic,
  });
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);

  const { showConfirmDialog } = useModal();

  const handleCreateQuiz = () => {
    if (!newQuiz.title?.trim()) {
      alert('Please enter a quiz title');
      return;
    }

    if (!newQuiz.questions?.length) {
      alert('Please add at least one question');
      return;
    }

    const quizToAdd: Omit<Quiz, 'id' | 'classroomId'> = {
      title: newQuiz.title.trim(),
      questions: newQuiz.questions,
      topic: newQuiz.topic || currentTopic,
      duration: newQuiz.duration || 30,
      passingScore: newQuiz.passingScore || 70,
      attempts: newQuiz.attempts || 1,
      isActive: newQuiz.isActive || true,
      createdAt: new Date().toISOString(),
    };

    addQuiz(quizToAdd);
    setNewQuiz({ title: '', questions: [], topic: currentTopic });
    setIsCreateModalOpen(false);
    logger.info('Quiz created successfully');
  };

  const handleDeleteQuiz = (quiz: Quiz) => {
    if (!deleteQuiz) return;

    showConfirmDialog(
      'Hapus Kuis',
      `Apakah Anda yakin ingin menghapus kuis "${quiz.title}"? Tindakan ini tidak dapat diurungkan.`,
      () => {
        deleteQuiz(quiz.id);
        logger.info('Quiz deleted:', quiz.id);
      },
      {
        confirmText: 'Hapus',
        cancelText: 'Batal',
        type: 'danger'
      }
    );
  };

  const handleToggleQuiz = (quizId: string) => {
    setExpandedQuizId(prev => prev === quizId ? null : quizId);
  };

  const addQuestion = () => {
    const newQuestion = {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1,
    };
    
    setNewQuiz(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    setNewQuiz(prev => ({
      ...prev,
      questions: prev.questions?.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const removeQuestion = (index: number) => {
    setNewQuiz(prev => ({
      ...prev,
      questions: prev.questions?.filter((_, i) => i !== index)
    }));
  };

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    setNewQuiz(prev => ({
      ...prev,
      questions: prev.questions?.map((q, i) => 
        i === questionIndex 
          ? { ...q, options: q.options.map((opt, oi) => oi === optionIndex ? value : opt) }
          : q
      )
    }));
  };

  const renderQuizDetails = (quiz: Quiz) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{quiz.questions?.length || 0}</div>
          <div className="text-sm text-gray-600">Pertanyaan</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{quiz.duration || 30}</div>
          <div className="text-sm text-gray-600">Menit</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{quiz.passingScore || 70}%</div>
          <div className="text-sm text-gray-600">Nilai Lulus</div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-3 text-gray-800">Daftar Pertanyaan</h4>
        <div className="space-y-3">
          {quiz.questions?.map((question, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white">
              <div className="font-medium text-gray-800 mb-2">
                {index + 1}. {question.question}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {question.options?.map((option, optIndex) => (
                  <div 
                    key={optIndex} 
                    className={`p-2 rounded ${
                      optIndex === question.correctAnswer 
                        ? 'bg-green-100 text-green-800 font-medium' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {String.fromCharCode(65 + optIndex)}. {option}
                    {optIndex === question.correctAnswer && (
                      <span className="ml-2 text-green-600">✓</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Poin: {question.points || 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-text-main">Penilaian & Kuis</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>Buat Kuis Baru</Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {quizzes.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {quizzes.map(quiz => (
              <li key={quiz.id}>
                <button
                  onClick={() => handleToggleQuiz(quiz.id)}
                  className="w-full text-left p-6 hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-text-main">{quiz.title}</h3>
                      <p className="text-sm text-text-secondary">
                        {quiz.topic} | {quiz.questions?.length || 0} pertanyaan | {quiz.duration || 30} menit
                      </p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          quiz.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {quiz.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Dibuat: {new Date(quiz.createdAt || '').toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-500">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle start quiz
                        }}
                        className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
                        title="Mulai Kuis"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      
                      {deleteQuiz && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuiz(quiz);
                          }}
                          className="p-2 rounded-full hover:bg-red-100 text-red-500"
                          title="Hapus Kuis"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}

                      <span className={`transform transition-transform duration-300 ${
                        expandedQuizId === quiz.id ? 'rotate-180' : ''
                      }`}>
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </button>
                
                {expandedQuizId === quiz.id && (
                  <div className="px-6 pb-6 bg-gray-50 border-t border-gray-200">
                    {renderQuizDetails(quiz)}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-text-secondary p-12">
            <p>Belum ada kuis yang dibuat untuk kelas ini.</p>
            <p>Klik 'Buat Kuis Baru' untuk memulai!</p>
          </div>
        )}
      </div>

      {/* Create Quiz Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        title="Buat Kuis Baru"
        size="lg"
      >
        <div className="space-y-6">
          {/* Quiz Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Judul Kuis"
              value={newQuiz.title || ''}
              onChange={(e) => setNewQuiz(prev => ({...prev, title: e.target.value}))}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Topik"
              value={newQuiz.topic || ''}
              onChange={(e) => setNewQuiz(prev => ({...prev, topic: e.target.value}))}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (menit)</label>
              <input
                type="number"
                min="1"
                value={newQuiz.duration || 30}
                onChange={(e) => setNewQuiz(prev => ({...prev, duration: parseInt(e.target.value)}))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Lulus (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newQuiz.passingScore || 70}
                onChange={(e) => setNewQuiz(prev => ({...prev, passingScore: parseInt(e.target.value)}))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maksimal Percobaan</label>
              <input
                type="number"
                min="1"
                value={newQuiz.attempts || 1}
                onChange={(e) => setNewQuiz(prev => ({...prev, attempts: parseInt(e.target.value)}))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Questions */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Pertanyaan</h4>
              <Button onClick={addQuestion} variant="secondary">Tambah Pertanyaan</Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {newQuiz.questions?.map((question, qIndex) => (
                <div key={qIndex} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">Pertanyaan {qIndex + 1}</span>
                    <button
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Hapus
                    </button>
                  </div>

                  <textarea
                    placeholder="Tulis pertanyaan di sini..."
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />

                  <div className="space-y-2">
                    {question.options?.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={question.correctAnswer === oIndex}
                          onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                          className="text-green-600"
                        />
                        <span className="text-sm font-medium">{String.fromCharCode(65 + oIndex)}.</span>
                        <input
                          type="text"
                          placeholder={`Pilihan ${String.fromCharCode(65 + oIndex)}`}
                          value={option}
                          onChange={(e) => updateQuestionOption(qIndex, oIndex, e.target.value)}
                          className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700">Poin</label>
                    <input
                      type="number"
                      min="1"
                      value={question.points || 1}
                      onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                      className="w-20 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleCreateQuiz}>
              Simpan Kuis
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AssessmentView;