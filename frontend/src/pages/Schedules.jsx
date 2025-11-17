import React, { useState, useEffect } from 'react';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from '../api/api';

const Schedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [newSchedule, setNewSchedule] = useState({
        user_id: '',
        user_name: '',
        day: '',
        time: '',
        activity: '',
    });
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const { data } = await getSchedules();
                setSchedules(data);
            } catch (error) {
                setError('Failed to fetch schedules');
            } finally {
                setLoading(false);
            }
        };
        fetchSchedules();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editingSchedule) {
            setEditingSchedule({ ...editingSchedule, [name]: value });
        } else {
            setNewSchedule({ ...newSchedule, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSchedule) {
                const { data } = await updateSchedule(editingSchedule.id, editingSchedule);
                setSchedules(schedules.map((s) => (s.id === data.id ? data : s)));
                setEditingSchedule(null);
            } else {
                const { data } = await createSchedule(newSchedule);
                setSchedules([...schedules, data]);
            }
            setNewSchedule({ user_id: '', user_name: '', day: '', time: '', activity: '' });
        } catch (error) {
            setError('Failed to save schedule');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteSchedule(id);
            setSchedules(schedules.filter((s) => s.id !== id));
        } catch (error) {
            setError('Failed to delete schedule');
        }
    };

    const startEditing = (schedule) => {
        setEditingSchedule({ ...schedule });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const scheduleForm = (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
                type="number"
                name="user_id"
                placeholder="User ID"
                value={editingSchedule ? editingSchedule.user_id : newSchedule.user_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
                type="text"
                name="user_name"
                placeholder="User Name"
                value={editingSchedule ? editingSchedule.user_name : newSchedule.user_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
                type="text"
                name="day"
                placeholder="Day"
                value={editingSchedule ? editingSchedule.day : newSchedule.day}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
                type="text"
                name="time"
                placeholder="Time (e.g., 09:00 - 17:00)"
                value={editingSchedule ? editingSchedule.time : newSchedule.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
                type="text"
                name="activity"
                placeholder="Activity"
                value={editingSchedule ? editingSchedule.activity : newSchedule.activity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
                type="submit"
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
                {editingSchedule ? 'Update Schedule' : 'Add Schedule'}
            </button>
            {editingSchedule && (
                <button
                    type="button"
                    onClick={() => setEditingSchedule(null)}
                    className="px-4 py-2 ml-2 text-gray-700 bg-gray-200 rounded-md"
                >
                    Cancel
                </button>
            )}
        </form>
    );

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">Manage Schedules</h1>
            {error && <p className="text-red-500">{error}</p>}
            {scheduleForm}
            <div className="mt-8">
                <h2 className="text-2xl font-bold">Current Schedules</h2>
                <ul className="mt-4 space-y-2">
                    {schedules.map((schedule) => (
                        <li
                            key={schedule.id}
                            className="p-4 bg-white rounded-lg shadow-md"
                        >
                            <p><strong>User:</strong> {schedule.user_name} (ID: {schedule.user_id})</p>
                            <p><strong>Day:</strong> {schedule.day}</p>
                            <p><strong>Time:</strong> {schedule.time}</p>
                            <p><strong>Activity:</strong> {schedule.activity}</p>
                            <div className="mt-2 space-x-2">
                                <button
                                    onClick={() => startEditing(schedule)}
                                    className="px-3 py-1 text-sm text-white bg-yellow-500 rounded-md"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(schedule.id)}
                                    className="px-3 py-1 text-sm text-white bg-red-500 rounded-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Schedules;
