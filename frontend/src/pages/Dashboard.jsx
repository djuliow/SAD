import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    const adminLinks = [
        { to: '/patients', text: 'Manage Patients' },
        { to: '/queue', text: 'View Queue' },
        { to: '/payments', text: 'Manage Payments' },
        { to: '/reports', text: 'View Reports' },
    ];

    const doctorLinks = [
        { to: '/queue', text: 'View Queue' },
        { to: '/examinations', text: 'Conduct Examinations' },
    ];

    const pharmacistLinks = [
        { to: '/drugs', text: 'Manage Drugs' },
        { to: '/prescriptions', text: 'View Prescriptions' },
    ];

    const headClinicLinks = [
        { to: '/reports', text: 'View Reports' },
        { to: '/schedules', text: 'Manage Schedules' },
    ];

    const getLinks = () => {
        switch (role) {
            case 'admin':
                return adminLinks;
            case 'dokter':
                return doctorLinks;
            case 'apoteker':
                return pharmacistLinks;
            case 'kepala':
                return headClinicLinks;
            default:
                return [];
        }
    };

    const links = getLinks();

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">Welcome, {username}!</h1>
            <p className="mt-2 text-lg text-gray-600">Your role: {role}</p>
            <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
                {links.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className="p-6 text-center text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700"
                    >
                        <h2 className="text-xl font-semibold">{link.text}</h2>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
