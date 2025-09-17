import React, { useState, useEffect } from 'react';
import type { Student, Classroom, Subject } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Modal from './common/Modal';

interface ClassViewProps {
  classrooms: Classroom[];
  allStudents: Student[];
  subjects: Subject[];
  addSubject: (name: string) => Subject;
  addClassroom: (name: string, subject: Subject) => void;
  updateClassroom: (classroomId: string, newName: string, newSubject: Subject) => void;
  deleteClassroom: (classroomId: string) => void;
  addStudentToClass: (name: string, classroomId: string) => void;
  deleteStudentFromClass: (studentId: number, classroomId: string) => void;
}

const ClassView: React.FC<ClassViewProps> = ({ 
    classrooms, 
    allStudents, 
    subjects, 
    addSubject, 
    addClassroom,
    updateClassroom,
    deleteClassroom,
    addStudentToClass, 
    deleteStudentFromClass 
}) => {
    const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
    const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false);
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [classroomToDelete, setClassroomToDelete] = useState<Classroom | null>(null);
    
    // State for creating
    const [newClassName, setNewClassName] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [newSubjectName, setNewSubjectName] = useState('');

    // State for editing
    const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
    const [editClassName, setEditClassName] = useState('');
    const [editSubjectId, setEditSubjectId] = useState('');
    
    // State for adding students
    const [newStudentName, setNewStudentName] = useState('');
    const [targetClassroomId, setTargetClassroomId] = useState<string | null>(null);
    
    useEffect(() => {
        if(editingClassroom) {
            setEditClassName(editingClassroom.name);
            setEditSubjectId(editingClassroom.subject.id);
        } else {
            setEditClassName('');
            setEditSubjectId('');
        }
    }, [editingClassroom]);


    const handleCreateClass = () => {
        let subject: Subject | undefined = subjects.find(s => s.id === selectedSubjectId);
        if (selectedSubjectId === 'new' && newSubjectName.trim()) {
            subject = addSubject(newSubjectName.trim());
        }

        if (newClassName.trim() && subject) {
            addClassroom(newClassName.trim(), subject);
            setNewClassName('');
            setSelectedSubjectId('');
            setNewSubjectName('');
            setIsCreateClassModalOpen(false);
        }
    };

    const openEditModal = (classroom: Classroom) => {
        setEditingClassroom(classroom);
        setIsEditClassModalOpen(true);
    };

    const handleUpdateClass = () => {
        const subject = subjects.find(s => s.id === editSubjectId);
        if (editingClassroom && editClassName.trim() && subject) {
            updateClassroom(editingClassroom.id, editClassName.trim(), subject);
            setIsEditClassModalOpen(false);
            setEditingClassroom(null);
        }
    };
    
    const handleDeleteClass = (classroomId: string) => {
        const classroom = classrooms.find(c => c.id === classroomId);
        if (!classroom) return;
        setClassroomToDelete(classroom);
        setIsDeleteConfirmModalOpen(true);
    };

    const confirmDeleteClass = () => {
        if (classroomToDelete) {
            deleteClassroom(classroomToDelete.id);
            setIsDeleteConfirmModalOpen(false);
            setClassroomToDelete(null);
        }
    };

    const cancelDeleteClass = () => {
        setIsDeleteConfirmModalOpen(false);
        setClassroomToDelete(null);
    };
    
    const openAddStudentModal = (classroomId: string) => {
        setTargetClassroomId(classroomId);
        setIsStudentModalOpen(true);
    };

    const handleAddStudent = () => {
        if (newStudentName.trim() && targetClassroomId) {
            addStudentToClass(newStudentName.trim(), targetClassroomId);
            setNewStudentName('');
            setTargetClassroomId(null);
            setIsStudentModalOpen(false);
        }
    };
    
    const handleDeleteStudent = (studentId: number, classroomId: string) => {
        if (window.confirm('Apakah Anda yakin ingin mengeluarkan siswa ini dari kelas?')) {
            deleteStudentFromClass(studentId, classroomId);
        }
    };
    
    const getStudentsForClass = (classroomId: string) => {
        const classroom = classrooms.find(c => c.id === classroomId);
        if (!classroom) return [];
        return allStudents.filter(s => classroom.studentIds.includes(s.id));
    };

    const renderCardHeader = (classroom: Classroom) => (
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
            <h3 className="text-xl font-bold text-text-main">{`${classroom.name} - ${classroom.subject.name}`}</h3>
            <div className="flex space-x-2 self-end sm:self-center">
                <Button 
                    onClick={(e) => { e.stopPropagation(); openEditModal(classroom); }} 
                    variant="secondary" 
                    className="!px-2 !py-1 text-xs"
                >
                    Edit
                </Button>
                <Button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteClass(classroom.id); }} 
                    variant="danger" 
                    className="!px-2 !py-1 text-xs"
                >
                    Hapus
                </Button>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-text-main">Manajemen Kelas</h1>
                <Button onClick={() => setIsCreateClassModalOpen(true)}>Buat Kelas Baru</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {classrooms.map(classroom => (
                    <Card key={classroom.id} className="flex flex-col">
                        {renderCardHeader(classroom)}
                        <div className="flex-grow mb-4">
                           <h4 className="font-semibold mb-2 text-text-secondary">Daftar Siswa ({getStudentsForClass(classroom.id).length})</h4>
                           <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                               {getStudentsForClass(classroom.id).map(student => (
                                   <li key={student.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                       <div className="flex items-center">
                                           <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full mr-3" />
                                           <span className="font-medium text-sm">{student.name}</span>
                                       </div>
                                       <button 
                                           onClick={() => handleDeleteStudent(student.id, classroom.id)} 
                                           className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
                                       >
                                           Hapus
                                       </button>
                                   </li>
                               ))}
                               {getStudentsForClass(classroom.id).length === 0 && (
                                   <p className="text-center text-sm text-gray-400 py-4">Belum ada siswa.</p>
                               )}
                           </ul>
                        </div>
                        <Button 
                            onClick={() => openAddStudentModal(classroom.id)} 
                            variant="secondary" 
                            className="w-full mt-auto"
                        >
                            Tambah Siswa ke Kelas
                        </Button>
                    </Card>
                ))}
                {classrooms.length === 0 && (
                    <div className="md:col-span-2 xl:col-span-3 text-center p-12 bg-white rounded-lg shadow-md">
                        <p className="text-text-secondary">Belum ada kelas yang dibuat.</p>
                        <p className="text-text-secondary">Klik 'Buat Kelas Baru' untuk memulai.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isCreateClassModalOpen} onClose={() => setIsCreateClassModalOpen(false)} title="Buat Kelas Baru">
                <div className="space-y-4">
                    <input 
                        type="text" 
                        value={newClassName} 
                        onChange={e => setNewClassName(e.target.value)} 
                        placeholder="Nama Kelas (e.g., Biologi Periode 1)" 
                        className="w-full p-2 border rounded" 
                    />
                    <select 
                        value={selectedSubjectId} 
                        onChange={e => setSelectedSubjectId(e.target.value)} 
                        className="w-full p-2 border rounded"
                    >
                        <option value="" disabled>Pilih Mata Pelajaran</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        <option value="new">-- Buat Mata Pelajaran Baru --</option>
                    </select>
                    {selectedSubjectId === 'new' && (
                        <input 
                            type="text" 
                            value={newSubjectName} 
                            onChange={e => setNewSubjectName(e.target.value)} 
                            placeholder="Nama Mata Pelajaran Baru" 
                            className="w-full p-2 border rounded" 
                        />
                    )}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="secondary" onClick={() => setIsCreateClassModalOpen(false)}>Batal</Button>
                        <Button onClick={handleCreateClass}>Simpan Kelas</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isEditClassModalOpen} onClose={() => setIsEditClassModalOpen(false)} title="Edit Kelas">
                <div className="space-y-4">
                    <input 
                        type="text" 
                        value={editClassName} 
                        onChange={e => setEditClassName(e.target.value)} 
                        placeholder="Nama Kelas" 
                        className="w-full p-2 border rounded" 
                    />
                    <select 
                        value={editSubjectId} 
                        onChange={e => setEditSubjectId(e.target.value)} 
                        className="w-full p-2 border rounded"
                    >
                        <option value="" disabled>Pilih Mata Pelajaran</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="secondary" onClick={() => setIsEditClassModalOpen(false)}>Batal</Button>
                        <Button onClick={handleUpdateClass}>Simpan Perubahan</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isStudentModalOpen} onClose={() => setIsStudentModalOpen(false)} title="Tambah Siswa Baru">
                <div className="space-y-4">
                    <input 
                        type="text" 
                        value={newStudentName} 
                        onChange={e => setNewStudentName(e.target.value)} 
                        placeholder="Nama Lengkap Siswa" 
                        className="w-full p-2 border rounded" 
                    />
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="secondary" onClick={() => setIsStudentModalOpen(false)}>Batal</Button>
                        <Button onClick={handleAddStudent}>Simpan Siswa</Button>
                    </div>
                </div>
            </Modal>

            <Modal 
                isOpen={isDeleteConfirmModalOpen} 
                onClose={cancelDeleteClass} 
                title="Konfirmasi Hapus Kelas"
            >
                <div className="space-y-4">
                    {classroomToDelete && (
                        <div>
                            <p className="text-gray-700 mb-4">
                                Apakah Anda yakin ingin menghapus kelas <strong>"{classroomToDelete.name} - {classroomToDelete.subject.name}"</strong>?
                            </p>
                            {getStudentsForClass(classroomToDelete.id).length > 0 && (
                                <p className="text-red-600 mb-4">
                                    ⚠️ Kelas ini memiliki {getStudentsForClass(classroomToDelete.id).length} siswa. Semua data terkait akan dihapus.
                                </p>
                            )}
                            <p className="text-sm text-gray-500 mb-4">
                                Tindakan ini tidak dapat diurungkan.
                            </p>
                        </div>
                    )}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="secondary" onClick={cancelDeleteClass}>
                            Batal
                        </Button>
                        <Button 
                            onClick={confirmDeleteClass}
                            variant="danger"
                        >
                            Hapus Kelas
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ClassView;