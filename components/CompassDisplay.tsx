import React from 'react';
import { DirectionCountries } from '../types';

interface CompassDisplayProps {
  heading: number | null;
  countries: DirectionCountries | null;
  onCountryChange: (direction: 'east' | 'west', value: string) => void;
}

const Label: React.FC<{ children: React.ReactNode; angle: number, distance: string }> = ({ children, angle, distance }) => (
    <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
            transform: `rotate(${angle}deg) translate(${distance}) rotate(${-angle}deg)`
        }}
    >
        {children}
    </div>
);

const CountryLabel: React.FC<{ direction: string; country: string; }> = ({ direction, country }) => (
    <div className="flex flex-col items-center justify-center w-36 h-20 text-center">
        <div className="text-sm font-bold text-cyan-500 tracking-widest">{direction}</div>
        <div className="text-lg font-bold text-white truncate w-full" title={country}>{country}</div>
    </div>
);

const EditableCountryLabel: React.FC<{
  direction: string;
  country: string;
  onChange: (value: string) => void;
}> = ({ direction, country, onChange }) => (
    <div className="flex flex-col items-center justify-center w-36 h-20 text-center">
        <div className="text-sm font-bold text-cyan-500 tracking-widest">{direction}</div>
        <input
            type="text"
            value={country}
            onChange={(e) => onChange(e.target.value)}
            className="text-lg font-bold text-white truncate w-full bg-transparent text-center rounded-md p-1 border border-transparent hover:border-cyan-500/30 focus:bg-gray-800/50 focus:border-cyan-500 focus:outline-none transition-all duration-300"
            aria-label={`Country to the ${direction}`}
            spellCheck="false"
        />
    </div>
);


const CompassDisplay: React.FC<CompassDisplayProps> = ({ heading, countries, onCountryChange }) => {
  const rotation = heading !== null ? -heading : 0;

  return (
    <div className="relative w-full h-full flex items-center justify-center animate-scale-up">
      <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] flex items-center justify-center scale-75 sm:scale-90 md:scale-100">
        
        {countries && (
            <>
                <Label angle={-90} distance="230px"><CountryLabel direction="NORTH" country={countries.north} /></Label>
                <Label angle={90} distance="230px"><CountryLabel direction="SOUTH" country={countries.south} /></Label>
                <Label angle={180} distance="230px"><EditableCountryLabel direction="WEST" country={countries.west} onChange={value => onCountryChange('west', value)} /></Label>
                <Label angle={0} distance="230px"><EditableCountryLabel direction="EAST" country={countries.east} onChange={value => onCountryChange('east', value)} /></Label>
            </>
        )}
      
        <div className="absolute w-full h-full rounded-full shadow-2xl shadow-cyan-500/10 bg-gray-800/30 backdrop-blur-sm" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}>
            {/* Outer Ring */}
            <div className="absolute w-full h-full rounded-full border-2 border-cyan-500/30"></div>
            {/* Inner Ring */}
            <div className="absolute w-3/4 h-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/20"></div>

            {/* Compass Rose */}
            <div 
            className="relative w-full h-full rounded-full"
            style={{ 
                transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `rotate(${rotation}deg)` 
            }}
            >
            {/* North Marker */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0 h-0 
                border-l-[12px] border-l-transparent
                border-r-[12px] border-r-transparent
                border-b-[24px] border-b-red-500"
                style={{ filter: 'drop-shadow(0 0 5px #f00)'}}
            >
            </div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white font-bold text-xl drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]">N</div>
            
            {/* Other cardinal markers */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 font-bold text-xl">S</div>
            <div className="absolute top-1/2 left-8 -translate-y-1/2 text-gray-400 font-bold text-xl">W</div>
            <div className="absolute top-1/2 right-8 -translate-y-1/2 text-gray-400 font-bold text-xl">E</div>

            {/* Degree markers */}
            {[...Array(12)].map((_, i) => {
                const angle = i * 30;
                const isCardinal = angle % 90 === 0;
                return (
                    <div 
                        key={i}
                        className="absolute top-0 left-1/2 w-px h-full -translate-x-1/2"
                        style={{ transform: `rotate(${angle}deg)`}}
                    >
                        <div className={`bg-cyan-500/50 mx-auto ${isCardinal ? 'w-1 h-6' : 'w-0.5 h-4'}`}></div>
                    </div>
                )
            })}
            </div>
            
            {/* Central Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-cyan-500 rounded-full border-2 border-gray-900 shadow-[0_0_15px_rgba(0,255,255,0.8)] animate-pulse"></div>
        </div>
      </div>

       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/50 backdrop-blur-sm px-6 py-2 rounded-lg border border-cyan-500/30">
          <span className="text-3xl font-bold text-white tracking-wider" style={{ textShadow: '0 0 8px rgba(255,255,255,0.5)' }}>
            {heading !== null ? `${Math.round(heading)}°` : '---°'}
          </span>
      </div>
    </div>
  );
};

export default CompassDisplay;