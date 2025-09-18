import React, { useState } from 'react';
import type { Announcement } from '../types';
import Card from './common/Card';
import Button from './common/Button';

interface CommunicationViewProps {
    announcements: Announcement[];
    addAnnouncement: (announcement: Omit<Announcement, 'id' | 'classroomId' | 'date'>) => void;
}

const CommunicationView: React.FC<CommunicationViewProps> = ({ announcements, addAnnouncement }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSendAnnouncement = () => {
        if (!title || !content) return;
        addAnnouncement({ title, content });
        setTitle('');
        setContent('');
    };

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-8">Pusat Komunikasi</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Kirim Pengumuman Baru">
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Judul Pengumuman"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        <textarea
                            placeholder="Tulis pesan Anda di sini..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-2 border rounded h-40"
                        />
                        <Button onClick={handleSendAnnouncement} className="w-full">Kirim Pengumuman</Button>
                    </div>
                </Card>
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-text-main">Pengumuman Terkirim</h2>
                    <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
                        {announcements.map(announcement => (
                            <Card key={announcement.id}>
                                <h3 className="text-xl font-bold text-text-main">{announcement.title}</h3>
                                <p className="text-sm text-text-secondary mb-2">{announcement.date}</p>
                                <p className="text-text-secondary">{announcement.content}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunicationView;