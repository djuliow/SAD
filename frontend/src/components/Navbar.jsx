import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <nav className="flex items-center justify-between p-4 text-white bg-indigo-800">
            <h1 className="text-xl font-bold">Klinik Sentosa</h1>
            <div className="flex items-center">
                <p className="mr-4">Welcome, {username}</p>
                <button
                    onClick={handleLogout}
                    className="px-3 py-1 bg-red-500 rounded-md hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
