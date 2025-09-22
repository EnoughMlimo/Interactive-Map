
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { CountryData } from './types';
import { countryData } from './data/countryData';
import MapChart from './components/MapChart';
import CountryInfoModal from './components/CountryInfoModal';

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const regions = useMemo(() => {
    const regionSet = new Set(countryData.map(c => c.region));
    return ['all', ...Array.from(regionSet).sort()];
  }, []);

  const handleCountryClick = useCallback((countryName: string) => {
    const country = countryData.find(c => c.name === countryName);
    setSelectedCountry(country || null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCountry(null);
  }, []);
  
  const availableCountries = useMemo(() => {
    if (filter === 'all') {
      return countryData.map(c => c.name);
    }
    return countryData.filter(c => c.region === filter).map(c => c.name);
  }, [filter]);

  useEffect(() => {
    if (selectedCountry && !availableCountries.includes(selectedCountry.name)) {
      setSelectedCountry(null);
    }
  }, [availableCountries, selectedCountry]);

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center p-4 sm:p-8 font-sans">
      <header className="w-full max-w-6xl text-center mb-4 sm:mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 tracking-tight">
          Interactive Map of African Officials
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Click on a highlighted country to view contact information for key officials.
        </p>
        <div className="mt-6 flex justify-center items-center gap-4">
          <label htmlFor="region-filter" className="text-gray-300 text-lg">Filter by Region:</label>
          <select
            id="region-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 border border-cyan-500/30 text-white text-md rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full max-w-xs p-2.5"
            aria-label="Filter countries by region"
          >
            {regions.map(region => (
              <option key={region} value={region}>
                {region === 'all' ? 'All Regions' : region}
              </option>
            ))}
          </select>
        </div>
      </header>
      
      <main className="w-full max-w-6xl h-[60vh] sm:h-[70vh] bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-cyan-500/20">
         <MapChart 
            onCountryClick={handleCountryClick} 
            availableCountries={availableCountries}
            selectedCountryName={selectedCountry?.name || ''}
          />
      </main>

      {selectedCountry && (
        <CountryInfoModal 
          country={selectedCountry} 
          onClose={handleCloseModal} 
        />
      )}

      <footer className="mt-8 text-gray-500 text-sm">
        <p>Data extracted from provided document. For informational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
