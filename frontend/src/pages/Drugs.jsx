import React, { useState, useEffect } from 'react';
import { getDrugs, updateDrugStock, addPrescription } from '../api/api';

const Drugs = () => {
    const [drugs, setDrugs] = useState([]);
    const [newPrescription, setNewPrescription] = useState({
        examination_id: '',
        drug_id: '',
        quantity: '',
        notes: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDrugs = async () => {
            try {
                const { data } = await getDrugs();
                setDrugs(data);
            } catch (error) {
                setError('Failed to fetch drugs');
            } finally {
                setLoading(false);
            }
        };
        fetchDrugs();
    }, []);

    const handleUpdateStock = async (id, stock) => {
        try {
            const { data } = await updateDrugStock(id, { stock });
            setDrugs(drugs.map((drug) => (drug.id === id ? data : drug)));
        } catch (error) {
            setError('Failed to update stock');
        }
    };

    const handlePrescriptionChange = (e) => {
        setNewPrescription({ ...newPrescription, [e.target.name]: e.target.value });
    };

    const handleAddPrescription = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const prescriptionData = {
                ...newPrescription,
                examination_id: parseInt(newPrescription.examination_id),
                drug_id: parseInt(newPrescription.drug_id),
                quantity: parseInt(newPrescription.quantity),
            };
            await addPrescription(prescriptionData);
            setNewPrescription({
                examination_id: '',
                drug_id: '',
                quantity: '',
                notes: '',
            });
        } catch (error) {
            setError('Failed to add prescription');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">Manage Drugs</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mt-8">
                <h2 className="text-2xl font-bold">Drug Stock</h2>
                <ul className="mt-4 space-y-2">
                    {drugs.map((drug) => (
                        <li
                            key={drug.id}
                            className="p-4 bg-white rounded-lg shadow-md"
                        >
                            <p><strong>Name:</strong> {drug.nama}</p>
                            <p><strong>Stock:</strong> {drug.stok}</p>
                            <p><strong>Price:</strong> {drug.harga}</p>
                            <input
                                type="number"
                                defaultValue={drug.stok}
                                onBlur={(e) => handleUpdateStock(drug.id, parseInt(e.target.value))}
                                className="w-full px-2 py-1 mt-2 border border-gray-300 rounded-md"
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-8">
                <h2 className="text-2xl font-bold">Add Prescription</h2>
                <form onSubmit={handleAddPrescription} className="mt-4 space-y-4">
                    <input
                        type="number"
                        name="examination_id"
                        placeholder="Examination ID"
                        value={newPrescription.examination_id}
                        onChange={handlePrescriptionChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <select
                        name="drug_id"
                        value={newPrescription.drug_id}
                        onChange={handlePrescriptionChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Select Drug</option>
                        {drugs.map((drug) => (
                            <option key={drug.id} value={drug.id}>
                                {drug.nama}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={newPrescription.quantity}
                        onChange={handlePrescriptionChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <textarea
                        name="notes"
                        placeholder="Notes"
                        value={newPrescription.notes}
                        onChange={handlePrescriptionChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    ></textarea>
                    <button
                        type="submit"
                        className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                        Add Prescription
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Drugs;
