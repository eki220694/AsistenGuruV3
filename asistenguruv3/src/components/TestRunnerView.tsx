import React, { useState } from 'react';
import { View } from '../types';
import Card from './common/Card';
import Button from './common/Button';

interface TestRunnerViewProps {
    setActiveView: (view: View) => void;
}

type TestStatus = 'pending' | 'running' | 'pass' | 'fail';
interface TestResult {
    status: TestStatus;
    message: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const TestRunnerView: React.FC<TestRunnerViewProps> = ({ setActiveView }) => {
    const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
    const [isRunning, setIsRunning] = useState(false);

    const tests = [
        {
            name: 'Dasbor Ditampilkan dengan Benar',
            run: async () => {
                setActiveView(View.Dashboard);
                await delay(200);
                const header = document.querySelector('h1');
                if (header?.textContent !== 'Dasbor') {
                    throw new Error(`Header yang diharapkan adalah 'Dasbor', tetapi ditemukan '${header?.textContent}'`);
                }
                const classroomHeader = document.querySelector('h2');
                if (!classroomHeader?.textContent?.includes('Periode 1 - Biologi')) {
                    throw new Error('Dasbor tidak menampilkan nama kelas default dengan benar.');
                }
            }
        },
        {
            name: 'Modal Perencana Pelajaran Terbuka',
            run: async () => {
                setActiveView(View.Planner);
                await delay(200);
                const createButton = document.evaluate("//button[contains(., 'Buat Rencana Pelajaran')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement;
                 if (!createButton) {
                    throw new Error("Tidak dapat menemukan tombol 'Buat Rencana Pelajaran'.");
                }
                createButton.click();
                await delay(200);
                const modalTitle = document.evaluate("//h3[contains(., 'Buat Rencana Pelajaran Baru')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (!modalTitle) {
                    throw new Error("Modal Perencana Pelajaran tidak terbuka.");
                }
                // Close the modal for the next test
                const closeButton = document.querySelector('.fixed.inset-0 button');
                 if(closeButton) (closeButton as HTMLElement).click();
            }
        },
        {
            name: 'Modal Penilaian Terbuka',
            run: async () => {
                setActiveView(View.Assessments);
                await delay(200);
                const createButton = document.evaluate("//button[contains(., 'Buat Kuis Baru')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement;
                if (!createButton) {
                    throw new Error("Tidak dapat menemukan tombol 'Buat Kuis Baru'.");
                }
                createButton.click();
                await delay(200);
                const modalTitle = document.evaluate("//h3[contains(., 'Buat Kuis Baru')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                 if (!modalTitle) {
                    throw new Error("Modal Penilaian tidak terbuka.");
                }
                // Close the modal
                 const closeButton = document.querySelector('.fixed.inset-0 button');
                 if(closeButton) (closeButton as HTMLElement).click();
            }
        },
        {
            name: 'Menavigasi ke Pelacak Siswa',
            run: async () => {
                setActiveView(View.Students);
                await delay(200);
                 const header = document.querySelector('h1');
                if (header?.textContent !== 'Pelacak Keterlibatan Siswa') {
                    throw new Error(`Header yang diharapkan adalah 'Pelacak Keterlibatan Siswa', tetapi ditemukan '${header?.textContent}'`);
                }
            }
        }
    ];
    
    const runAllTests = async () => {
        setIsRunning(true);
        const initialResults = tests.reduce((acc, test) => ({...acc, [test.name]: { status: 'pending', message: '' } }), {});
        setTestResults(initialResults);

        for (const test of tests) {
            setTestResults(prev => ({...prev, [test.name]: { status: 'running', message: 'Mengeksekusi...' } }));
            await delay(100); // Small delay for UI to update
            try {
                await test.run();
                setTestResults(prev => ({...prev, [test.name]: { status: 'pass', message: 'Tes berhasil dilewati.' } }));
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
                setTestResults(prev => ({...prev, [test.name]: { status: 'fail', message } }));
            }
        }
        
        // Return to dashboard after tests
        setActiveView(View.Dashboard);
        setIsRunning(false);
    };

    const getStatusColor = (status: TestStatus) => {
        switch (status) {
            case 'pass': return 'text-green-500';
            case 'fail': return 'text-red-500';
            case 'running': return 'text-blue-500';
            default: return 'text-gray-500';
        }
    }
    
    const getStatusIcon = (status: TestStatus) => {
         switch (status) {
            case 'pass': return '✓';
            case 'fail': return '✗';
            case 'running': return '…';
            default: return '○';
        }
    }

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-text-main">Penguji Otomatis</h1>
                <Button onClick={runAllTests} isLoading={isRunning}>
                    {isRunning ? 'Menjalankan Tes...' : 'Jalankan Semua Tes'}
                </Button>
            </div>
            <Card>
                <div className="space-y-4">
                    {tests.map(test => (
                        <div key={test.name} className="flex items-start p-3 border-b last:border-b-0">
                           <div className={`mr-4 mt-1 font-bold text-xl ${getStatusColor(testResults[test.name]?.status ?? 'pending')}`}>
                                {getStatusIcon(testResults[test.name]?.status ?? 'pending')}
                           </div>
                           <div>
                                <h3 className="font-semibold text-lg text-text-main">{test.name}</h3>
                                <p className={`text-sm ${getStatusColor(testResults[test.name]?.status ?? 'pending')}`}>
                                    {testResults[test.name] ? `${testResults[test.name].status.toUpperCase()}: ${testResults[test.name].message}` : 'Tertunda...'}
                                </p>
                           </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default TestRunnerView;