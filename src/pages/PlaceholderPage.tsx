import React from 'react';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
      <div className="mt-8 p-8 bg-white rounded-lg shadow-md">
        <p className="text-gray-600">This page is under construction. Functionality for "{title}" will be implemented here.</p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
