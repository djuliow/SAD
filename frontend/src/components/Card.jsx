import React from 'react';

const Card = ({ title, children }) => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            {title && <h2 className="mb-4 text-xl font-bold">{title}</h2>}
            {children}
        </div>
    );
};

export default Card;
