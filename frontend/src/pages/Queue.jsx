import React, { useState, useEffect } from 'react';
import { getQueue, updateQueueStatus } from '../api/api';

const Queue = () => {
    const [queue, setQueue] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQueue = async () => {
            try {
                const { data } = await getQueue();
                setQueue(data);
            } catch (error) {
                setError('Failed to fetch queue');
            } finally {
                setLoading(false);
            }
        };
        fetchQueue();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            const { data } = await updateQueueStatus(id, { status });
            setQueue(queue.map((item) => (item.id === id ? data : item)));
        } catch (error) {
            setError('Failed to update status');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">Patient Queue</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mt-8">
                <ul className="space-y-4">
                    {queue.map((item) => (
                        <li
                            key={item.id}
                            className="p-4 bg-white rounded-lg shadow-md"
                        >
                            <p><strong>Patient:</strong> {item.patient_name}</p>
                            <p><strong>Status:</strong> {item.status}</p>
                            <div className="mt-2 space-x-2">
                                <button
                                    onClick={() => handleUpdateStatus(item.id, 'diperiksa')}
                                    className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md"
                                >
                                    Mark as Examining
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(item.id, 'selesai')}
                                    className="px-3 py-1 text-sm text-white bg-green-500 rounded-md"
                                >
                                    Mark as Done
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Queue;
