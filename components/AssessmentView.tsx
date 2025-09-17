import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import type { Quiz, Student } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Modal from './common/Modal';
import { generateQuizQuestions } from '../services/geminiService';

interface AssessmentViewProps {
  quizzes: Quiz[];
  students: Student[];
  addQuiz: (quiz: Omit<Quiz, 'id' | 'classroomId'>) => void;
  currentTopic: string;
}

const AssessmentView: React.FC<AssessmentViewProps> = ({ quizzes, students, addQuiz, currentTopic }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(quizzes[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuiz, setNewQuiz] = useState<Partial<Omit<Quiz, 'id' | 'classroomId'>>>({ questions: [] });
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiNumQuestions, setAiNumQuestions] = useState(5);

  React.useEffect(() => {
    if (quizzes.length > 0 && !quizzes.find(q => q.id === selectedQuiz?.id)) {
        setSelectedQuiz(quizzes[0]);
    } else if (quizzes.length === 0) {
        setSelectedQuiz(null);
    }
  }, [quizzes, selectedQuiz]);


  const chartData = students.map(student => ({
    name: student.name,
    score: selectedQuiz ? student.grades[selectedQuiz.id] || 0 : 0,
  }));

  const averageScore = selectedQuiz && chartData.length > 0 ? chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length : 0;

  const handleCreateQuiz = () => {
    if(!newQuiz.title || !newQuiz.topic) return;
    const quizToAdd: Omit<Quiz, 'id' | 'classroomId'> = {
        title: newQuiz.title,
        topic: newQuiz.topic,
        questions: newQuiz.questions || [],
    }
    addQuiz(quizToAdd);
    setIsModalOpen(false);
  };
  
  const handleOpenModal = () => {
    setNewQuiz({ questions: [], topic: currentTopic });
    setAiTopic(currentTopic);
    setIsModalOpen(true);
  };

  const handleGenerateWithAi = async () => {
    if(!aiTopic) return;
    setIsLoadingAi(true);
    try {
        const questions = await generateQuizQuestions(aiTopic, aiNumQuestions);
        setNewQuiz(prev => ({...prev, questions: [...(prev.questions || []), ...questions], topic: aiTopic}));
    } catch(error) {
        console.error(error);
        alert("Gagal membuat soal kuis. Periksa kunci API Anda dan coba lagi.");
    } finally {
        setIsLoadingAi(false);
    }
  };


  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-main">Penilaian</h1>
        <Button onClick={handleOpenModal}>Buat Kuis Baru</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
            {quizzes.length > 0 ? quizzes.map(quiz => (
                <div
                key={quiz.id}
                onClick={() => setSelectedQuiz(quiz)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${selectedQuiz?.id === quiz.id ? 'bg-primary text-white shadow-lg' : 'bg-white hover:bg-gray-100'}`}
                >
                <h3 className="font-bold text-lg">{quiz.title}</h3>
                <p className={selectedQuiz?.id === quiz.id ? 'text-indigo-200' : 'text-text-secondary'}>{quiz.topic}</p>
                </div>
            )) : (
                <Card>
                    <p className="text-center text-text-secondary">Tidak ada kuis untuk kelas ini.</p>
                </Card>
            )}
        </div>

        <div className="lg:col-span-2">
          {selectedQuiz ? (
            <Card>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                 <h2 className="text-2xl font-bold text-text-main mb-2 sm:mb-0">{selectedQuiz.title} Kinerja</h2>
                 <div className="text-left sm:text-right">
                     <p className="text-3xl font-bold text-secondary">{averageScore.toFixed(1)}%</p>
                     <p className="text-text-secondary">Rata-rata Kelas</p>
                 </div>
              </div>
              <div className="w-full h-80 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          ) : (
            <Card>
                <p className="text-center text-text-secondary py-16">Pilih kuis untuk melihat data kinerja atau buat yang baru.</p>
            </Card>
          )}
        </div>
      </div>
      
       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Kuis Baru">
        <div className="space-y-4">
          <input type="text" placeholder="Judul Kuis" value={newQuiz.title || ''} onChange={e => setNewQuiz({...newQuiz, title: e.target.value})} className="p-2 border rounded w-full" />
          <input type="text" placeholder="Topik" value={newQuiz.topic || ''} onChange={e => setNewQuiz({...newQuiz, topic: e.target.value})} className="p-2 border rounded w-full" />
        
          <div className="p-4 border rounded-lg bg-gray-50">
             <h4 className="font-semibold mb-2">✨ Hasilkan Pertanyaan dengan AI</h4>
             <div className="flex flex-wrap items-center gap-2">
                <input type="text" placeholder="Masukkan topik..." value={aiTopic} onChange={e => setAiTopic(e.target.value)} className="flex-grow p-2 border rounded w-full sm:w-auto"/>
                <input type="number" value={aiNumQuestions} onChange={e => setAiNumQuestions(parseInt(e.target.value))} min="1" max="10" className="p-2 border rounded w-20"/>
                <Button onClick={handleGenerateWithAi} isLoading={isLoadingAi} disabled={!aiTopic}>Hasilkan</Button>
             </div>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 p-2 border rounded">
            {newQuiz.questions?.map((q, i) => (
                <div key={i} className="text-sm p-2 bg-gray-100 rounded">
                    <p className="font-semibold">{i+1}. {q.question}</p>
                    <ul className="list-disc list-inside ml-4">
                       {q.options.map(opt => <li key={opt} className={opt === q.correctAnswer ? 'text-green-600' : ''}>{opt}</li>)}
                    </ul>
                </div>
            ))}
            {newQuiz.questions?.length === 0 && <p className="text-center text-gray-500">Belum ada pertanyaan.</p>}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleCreateQuiz}>Simpan Kuis</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default AssessmentView;