import React from 'react';
import { View } from '../types';
import type { Teacher, Classroom } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  teacher: Teacher | null;
  onLogout: () => void;
  classrooms: Classroom[];
  activeClassroomId: string | null;
  setActiveClassroomId: (id: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const navItems = [
    { view: View.Dashboard, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { view: View.Planner, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { view: View.Class, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a6 6 0 00-12 0v2" /></svg> },
    { view: View.Students, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { view: View.Assessments, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
    { view: View.TestRunner, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg> },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, teacher, onLogout, classrooms, activeClassroomId, setActiveClassroomId, isSidebarOpen, setIsSidebarOpen }) => {
  
  const handleNavClick = (view: View) => {
    setActiveView(view);
    if (window.innerWidth < 768) { // md breakpoint
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-white flex flex-col flex-shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-20 flex items-center justify-center text-2xl font-bold border-b border-sidebar-accent">
        Asisten Guru
      </div>

      <div className="p-4 border-b border-sidebar-accent">
        <label htmlFor="classroom-select" className="block text-sm font-medium text-gray-400 mb-1">Kelas Saat Ini</label>
        <select
          id="classroom-select"
          value={activeClassroomId || ''}
          onChange={(e) => setActiveClassroomId(e.target.value)}
          className="w-full p-2 bg-sidebar-accent border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={classrooms.length === 0}
        >
          {classrooms.length > 0 ? (
            classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
          ) : (
            <option>Buat kelas dulu</option>
          )}
        </select>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.view}>
              <button
                onClick={() => handleNavClick(item.view)}
                className={`w-full flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${
                  activeView === item.view
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-sidebar-accent hover:text-white'
                }`}
              >
                {item.icon}
                <span className="ml-4 font-medium">{item.view}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-accent">
        {teacher && (
            <div className="flex items-center mb-4">
                <img src={teacher.avatar} alt={teacher.name} className="w-10 h-10 rounded-full" />
                <div className="ml-3">
                    <p className="font-semibold">{teacher.name}</p>
                    <p className="text-sm text-gray-400">{teacher.email}</p>
                </div>
            </div>
        )}
        <button onClick={onLogout} className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Keluar
        </button>
      </div>
    </div>
  );
};

export default Sidebar;