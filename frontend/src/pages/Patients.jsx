import React, { useState, useEffect } from 'react';
import { getPatients, addPatient } from '../api/api';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [newPatient, setNewPatient] = useState({
        nama: '',
        alamat: '',
        keluhan: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const { data } = await getPatients();
                setPatients(data);
            } catch (error) {
                setError('Failed to fetch patients');
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const handleChange = (e) => {
        setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await addPatient(newPatient);
            setPatients([...patients, data]);
            setNewPatient({ nama: '', alamat: '', keluhan: '' });
        } catch (error) {
            setError('Failed to add patient');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">Manage Patients</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input
                    type="text"
                    name="nama"
                    placeholder="Name"
                    value={newPatient.nama}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                    type="text"
                    name="alamat"
                    placeholder="Address"
                    value={newPatient.alamat}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                    type="text"
                    name="keluhan"
                    placeholder="Complaint"
                    value={newPatient.keluhan}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                    Add Patient
                </button>
            </form>
            <div className="mt-8">
                <h2 className="text-2xl font-bold">Patient List</h2>
                <ul className="mt-4 space-y-2">
                    {patients.map((patient) => (
                        <li
                            key={patient.id}
                            className="p-4 bg-white rounded-lg shadow-md"
                        >
                            <p><strong>Name:</strong> {patient.nama}</p>
                            <p><strong>Address:</strong> {patient.alamat}</p>
                            <p><strong>Complaint:</strong> {patient.keluhan}</p>
                            <p><strong>Status:</strong> {patient.status}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Patients;
