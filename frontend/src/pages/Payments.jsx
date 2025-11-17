import React, { useState } from 'react';
import { recordPayment } from '../api/api';

const Payments = () => {
    const [newPayment, setNewPayment] = useState({
        patient_id: '',
        examination_id: '',
        drug_cost: '',
        examination_fee: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setNewPayment({ ...newPayment, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const paymentData = {
                ...newPayment,
                patient_id: parseInt(newPayment.patient_id),
                examination_id: parseInt(newPayment.examination_id),
                drug_cost: parseInt(newPayment.drug_cost),
                examination_fee: parseInt(newPayment.examination_fee),
            };
            await recordPayment(paymentData);
            setSuccess('Payment recorded successfully!');
            setNewPayment({
                patient_id: '',
                examination_id: '',
                drug_cost: '',
                examination_fee: '',
            });
        } catch (error) {
            setError('Failed to record payment');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">Record Payment</h1>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input
                    type="number"
                    name="patient_id"
                    placeholder="Patient ID"
                    value={newPayment.patient_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                    type="number"
                    name="examination_id"
                    placeholder="Examination ID"
                    value={newPayment.examination_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                    type="number"
                    name="drug_cost"
                    placeholder="Drug Cost"
                    value={newPayment.drug_cost}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                    type="number"
                    name="examination_fee"
                    placeholder="Examination Fee"
                    value={newPayment.examination_fee}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                    Record Payment
                </button>
            </form>
        </div>
    );
};

export default Payments;
