import React, { useState } from 'react';
import type { LessonPlan } from '../types';
import Button from './common/Button';
import Modal from './common/Modal';
import { generateLessonPlanIdea, saveLessonPlan } from '../services/geminiService';

interface LessonPlannerViewProps {
  lessons: LessonPlan[];
  addLesson: (lesson: Omit<LessonPlan, 'id' | 'classroomId'>) => void;
  deleteLesson: (lessonId: string) => void;
  currentTopic: string;
}

const LessonPlannerView: React.FC<LessonPlannerViewProps> = ({ lessons, addLesson, deleteLesson, currentTopic }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<LessonPlan | null>(null);
  const [newLesson, setNewLesson] = useState<Partial<Omit<LessonPlan, 'id' | 'classroomId'>>>({});
  const [aiTopic, setAiTopic] = useState('');
  const [aiGrade, setAiGrade] = useState('Kelas 10');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(lessons.length > 0 ? lessons[0].id : null);

  const handleCreateLesson = () => {
    const lessonToAdd: Omit<LessonPlan, 'id' | 'classroomId'> = {
      title: newLesson.title || 'Pelajaran Tanpa Judul',
      date: newLesson.date || new Date().toISOString().split('T')[0],
      topic: newLesson.topic || currentTopic,
      objectives: newLesson.objectives || [],
      materials: newLesson.materials || [],
      activities: newLesson.activities || [],
      assessment: newLesson.assessment || '',
    };
    addLesson(lessonToAdd);
    setNewLesson({});
    setIsModalOpen(false);
  };
  
  const handleGenerateWithAi = async () => {
    if (!aiTopic || !aiGrade) return;
    setIsLoadingAi(true);
    try {
      const generatedContent = await generateLessonPlanIdea(aiTopic, aiGrade);
      setNewLesson({
        ...newLesson,
        topic: aiTopic,
        ...generatedContent
      });
    } catch (error) {
      console.error(error);
      alert("Gagal membuat rencana pelajaran. Silakan periksa kunci API Anda dan coba lagi.");
    } finally {
      setIsLoadingAi(false);
    }
  };
  
  const handleOpenModal = () => {
    setNewLesson({ topic: currentTopic });
    setAiTopic(currentTopic);
    setIsModalOpen(true);
  }

  const handleToggleLesson = (lessonId: string) => {
    setExpandedLessonId(prevId => prevId === lessonId ? null : lessonId);
  };

  const handleCopyLesson = (lessonToCopy: LessonPlan) => {
    const newLessonData: Omit<LessonPlan, 'id' | 'classroomId'> = {
      ...lessonToCopy,
      title: `Salinan dari - ${lessonToCopy.title}`,
      date: new Date().toISOString().split('T')[0],
    };
    addLesson(newLessonData);
  };
  
  const handleDownloadLesson = (lesson: LessonPlan) => {
    const content = `
Rencana Pelajaran
====================

Judul: ${lesson.title}
Tanggal: ${lesson.date}
Topik: ${lesson.topic}

Tujuan Pembelajaran:
${lesson.objectives.map(o => `- ${o}`).join('
')}

Materi yang Diperlukan:
${lesson.materials.map(m => `- ${m}`).join('
')}

Kegiatan:
${lesson.activities.map(a => `- ${a}`).join('
')}

Penilaian:
${lesson.assessment}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${lesson.title.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteLesson = (lesson: LessonPlan) => {
    setLessonToDelete(lesson);
    setIsDeleteConfirmModalOpen(true);
  };

  const confirmDeleteLesson = () => {
    if (lessonToDelete) {
      deleteLesson(lessonToDelete.id);
      setIsDeleteConfirmModalOpen(false);
      setLessonToDelete(null);
    }
  };

  const cancelDeleteLesson = () => {
    setIsDeleteConfirmModalOpen(false);
    setLessonToDelete(null);
  };

  const renderLessonDetails = (lesson: LessonPlan) => (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-primary">Tujuan</h4>
        <ul className="list-disc list-inside text-text-secondary">{lesson.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
      </div>
      <div>
        <h4 className="font-semibold text-primary">Materi</h4>
        <ul className="list-disc list-inside text-text-secondary">{lesson.materials.map((m, i) => <li key={i}>{m}</li>)}</ul>
      </div>
       <div>
        <h4 className="font-semibold text-primary">Kegiatan</h4>
        <ul className="list-disc list-inside text-text-secondary">{lesson.activities.map((a, i) => <li key={i}>{a}</li>)}</ul>
      </div>
      <div>
        <h4 className="font-semibold text-primary">Penilaian</h4>
        <p className="text-text-secondary">{lesson.assessment}</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-main">Perencana Pelajaran</h1>
        <Button onClick={handleOpenModal}>Buat Rencana Pelajaran</Button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {lessons.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {lessons.map(lesson => (
              <li key={lesson.id}>
                <button
                  onClick={() => handleToggleLesson(lesson.id)}
                  className="w-full text-left p-4 md:p-6 hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                  aria-expanded={expandedLessonId === lesson.id}
                  aria-controls={`lesson-details-${lesson.id}`}
                >
                  <div className="flex justify-between items-center">
                    <div className='flex-1 pr-4'>
                      <h3 className="text-lg md:text-xl font-bold text-text-main">{lesson.title}</h3>
                      <p className="text-sm text-text-secondary">{lesson.date} | {lesson.topic}</p>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-3 text-gray-500">
                        <button
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                handleCopyLesson(lesson); 
                            }}
                            className="p-1 rounded-full hover:bg-gray-200"
                            title="Salin Rencana"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                        <button
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                handleDownloadLesson(lesson); 
                            }}
                            className="p-1 rounded-full hover:bg-gray-200"
                            title="Unduh Rencana"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </button>
                        <button
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                handleDeleteLesson(lesson); 
                            }}
                            className="p-1 rounded-full hover:bg-red-100 text-red-500"
                            title="Hapus Rencana"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        <span className={`transform transition-transform duration-300 ${expandedLessonId === lesson.id ? 'rotate-180' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </div>
                  </div>
                </button>
                {expandedLessonId === lesson.id && (
                  <div id={`lesson-details-${lesson.id}`} className="p-4 md:p-6 pt-4 bg-gray-50 border-t border-gray-200">
                    {renderLessonDetails(lesson)}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-text-secondary p-12">
            <p>Belum ada rencana pelajaran yang dibuat untuk kelas ini.</p>
            <p>Klik 'Buat Rencana Pelajaran' untuk memulai!</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Rencana Pelajaran Baru">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Judul Pelajaran" value={newLesson.title || ''} onChange={e => setNewLesson({...newLesson, title: e.target.value})} className="p-2 border rounded" />
            <input type="date" value={newLesson.date || ''} onChange={e => setNewLesson({...newLesson, date: e.target.value})} className="p-2 border rounded" />
          </div>

          <div className="p-4 border rounded-lg bg-gray-50">
            <h4 className="font-semibold mb-2">✨ Hasilkan dengan AI</h4>
            <div className="flex flex-wrap items-center gap-2">
              <input type="text" placeholder="Masukkan topik..." value={aiTopic} onChange={e => setAiTopic(e.target.value)} className="flex-grow p-2 border rounded w-full sm:w-auto" />
              <select value={aiGrade} onChange={e => setAiGrade(e.target.value)} className="p-2 border rounded">
                <option>Kelas 9</option>
                <option>Kelas 10</option>
                <option>Kelas 11</option>
                <option>Kelas 12</option>
              </select>
              <Button onClick={handleGenerateWithAi} isLoading={isLoadingAi} disabled={!aiTopic}>Hasilkan</Button>
            </div>
          </div>
          
          <input type="text" placeholder="Topik" value={newLesson.topic || ''} onChange={e => setNewLesson({...newLesson, topic: e.target.value})} className="p-2 border rounded w-full" />
          <textarea placeholder="Tujuan (satu per baris)" value={newLesson.objectives?.join('
') || ''} onChange={e => setNewLesson({...newLesson, objectives: e.target.value.split('
')})} className="p-2 border rounded w-full h-24" />
          <textarea placeholder="Materi (satu per baris)" value={newLesson.materials?.join('
') || ''} onChange={e => setNewLesson({...newLesson, materials: e.target.value.split('
')})} className="p-2 border rounded w-full h-24" />
          <textarea placeholder="Kegiatan (satu per baris)" value={newLesson.activities?.join('
') || ''} onChange={e => setNewLesson({...newLesson, activities: e.target.value.split('
')})} className="p-2 border rounded w-full h-24" />
          <textarea placeholder="Penilaian" value={newLesson.assessment || ''} onChange={e => setNewLesson({...newLesson, assessment: e.target.value})} className="p-2 border rounded w-full h-20" />
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleCreateLesson}>Simpan Pelajaran</Button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isDeleteConfirmModalOpen} 
        onClose={cancelDeleteLesson} 
        title="Konfirmasi Hapus Rencana Pelajaran"
      >
        <div className="space-y-4">
          {lessonToDelete && (
            <div>
              <p className="text-gray-700 mb-4">
                Apakah Anda yakin ingin menghapus rencana pelajaran <strong>"{lessonToDelete.title}"</strong>?
              </p>
              <p className="text-sm text-gray-500 mb-2">
                <strong>Tanggal:</strong> {lessonToDelete.date}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                <strong>Topik:</strong> {lessonToDelete.topic}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Tindakan ini tidak dapat diurungkan.
              </p>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={cancelDeleteLesson}>
              Batal
            </Button>
            <Button 
              onClick={confirmDeleteLesson}
              variant="danger"
            >
              Hapus Rencana Pelajaran
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LessonPlannerView;