
import React, { useState, useEffect } from 'react';
import { CountryData, Official } from '../types';
import { XIcon } from './icons/XIcon';

interface CountryInfoModalProps {
  country: CountryData;
  onClose: () => void;
}

const OfficialCard: React.FC<{ official: Official }> = ({ official }) => (
  <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 transform transition-transform hover:scale-105 hover:bg-gray-600">
    <h4 className="font-semibold text-cyan-300 text-lg">{official.name}</h4>
    {official.title && <p className="text-gray-300 text-sm">{official.title}</p>}
    {official.contact && (
      <a href={`mailto:${official.contact}`} className="text-teal-400 hover:text-teal-300 break-all text-sm block mt-1">
        {official.contact}
      </a>
    )}
  </div>
);


const CountryInfoModal: React.FC<CountryInfoModalProps> = ({ country, onClose }) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    // Animate in after component mounts
    const timer = requestAnimationFrame(() => {
      setIsShowing(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleClose = () => {
    setIsShowing(false);
    setTimeout(onClose, 200); // Wait for animation to finish
  };

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${isShowing ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`bg-gray-800 text-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-cyan-500/30 relative transition-all duration-200 ${isShowing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="sticky top-0 bg-gray-800 p-6 z-10 border-b border-gray-700">
          <h2 id="modal-title" className="text-3xl font-bold text-center text-cyan-400">{country.name}</h2>
          <button 
            onClick={handleClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
            aria-label="Close modal"
          >
            <XIcon />
          </button>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Key Officials</h3>
          {country.officials && country.officials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {country.officials.map((official, index) => (
                <OfficialCard key={index} official={official} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No official information available for this country.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryInfoModal;
