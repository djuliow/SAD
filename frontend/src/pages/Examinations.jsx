import React, { useState } from 'react';
import { saveExamination } from '../api/api';

const Examinations = () => {
    const [newExamination, setNewExamination] = useState({
        patient_id: '',
        doctor_id: '',
        diagnosis: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setNewExamination({ ...newExamination, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const examinationData = {
                ...newExamination,
                patient_id: parseInt(newExamination.patient_id),
                doctor_id: parseInt(newExamination.doctor_id),
                id: 0, // The backend will assign the ID
            };
            await saveExamination(examinationData);
            setSuccess('Examination saved successfully!');
            setNewExamination({
                patient_id: '',
                doctor_id: '',
                diagnosis: '',
                notes: '',
                date: new Date().toISOString().split('T')[0],
            });
        } catch (error) {
            setError('Failed to save examination');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">Conduct Examination</h1>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input
                    type="number"
                    name="patient_id"
                    placeholder="Patient ID"
                    value={newExamination.patient_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                    type="number"
                    name="doctor_id"
                    placeholder="Doctor ID"
                    value={newExamination.doctor_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <textarea
                    name="diagnosis"
                    placeholder="Diagnosis"
                    value={newExamination.diagnosis}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
                <textarea
                    name="notes"
                    placeholder="Notes"
                    value={newExamination.notes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                    Save Examination
                </button>
            </form>
        </div>
    );
};

export default Examinations;
