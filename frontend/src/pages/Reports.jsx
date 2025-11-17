import React, { useState, useEffect } from 'react';
import { getReports } from '../api/api';

const Reports = () => {
    const [report, setReport] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const { data } = await getReports();
                setReport(data);
            } catch (error) {
                setError('Failed to fetch report');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">Reports</h1>
            {report && (
                <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
                    <p><strong>Total Patients:</strong> {report.total_patients}</p>
                    <p><strong>Total Income:</strong> Rp {report.total_income.toLocaleString()}</p>
                    <h2 className="mt-4 text-2xl font-bold">Drugs Used</h2>
                    <ul className="mt-2 space-y-1">
                        {Object.entries(report.drugs_used).map(([drug, quantity]) => (
                            <li key={drug}>
                                <strong>{drug}:</strong> {quantity}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Reports;
