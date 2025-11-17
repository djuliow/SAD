import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const role = localStorage.getItem('role');

    const adminLinks = [
        { to: '/dashboard', text: 'Dashboard' },
        { to: '/patients', text: 'Patients' },
        { to: '/queue', text: 'Queue' },
        { to: '/payments', text: 'Payments' },
        { to: '/reports', text: 'Reports' },
    ];

    const doctorLinks = [
        { to: '/dashboard', text: 'Dashboard' },
        { to: '/queue', text: 'Queue' },
        { to: '/examinations', text: 'Examinations' },
    ];

    const pharmacistLinks = [
        { to: '/dashboard', text: 'Dashboard' },
        { to: '/drugs', text: 'Drugs' },
    ];

    const headClinicLinks = [
        { to: '/dashboard', text: 'Dashboard' },
        { to: '/reports', text: 'Reports' },
        { to: '/schedules', text: 'Schedules' },
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
                return [{ to: '/dashboard', text: 'Dashboard' }];
        }
    };

    const links = getLinks();

    return (
        <div className="w-64 h-screen p-4 text-white bg-gray-800">
            <h2 className="text-2xl font-bold">Menu</h2>
            <ul className="mt-6 space-y-2">
                {links.map((link) => (
                    <li key={link.to}>
                        <Link
                            to={link.to}
                            className="block px-4 py-2 rounded-md hover:bg-gray-700"
                        >
                            {link.text}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
