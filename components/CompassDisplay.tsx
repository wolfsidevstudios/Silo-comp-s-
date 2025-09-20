
import React from 'react';
import { DirectionCountries } from '../types';

interface CompassDisplayProps {
  heading: number | null;
  countries: DirectionCountries | null;
}

const CountryLabel: React.FC<{ direction: string; country: string; positionClass: string }> = ({ direction, country, positionClass }) => (
    <div className={`absolute ${positionClass} flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 w-32 h-20 text-center`}>
        <div className="text-sm font-bold text-cyan-500 tracking-widest">{direction}</div>
        <div className="text-lg font-bold text-white truncate w-full" title={country}>{country}</div>
    </div>
);


const CompassDisplay: React.FC<CompassDisplayProps> = ({ heading, countries }) => {
  const rotation = heading !== null ? -heading : 0;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
        {countries && (
            <>
                <CountryLabel direction="NORTH" country={countries.north} positionClass="top-1/4 left-1/2" />
                <CountryLabel direction="SOUTH" country={countries.south} positionClass="top-3/4 left-1/2" />
                <CountryLabel direction="WEST" country={countries.west} positionClass="top-1/2 left-1/4" />
                <CountryLabel direction="EAST" country={countries.east} positionClass="top-1/2 left-3/4" />
            </>
        )}
      
      <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute w-full h-full rounded-full border-2 border-cyan-500/30"></div>
        {/* Inner Ring */}
        <div className="absolute w-3/4 h-3/4 rounded-full border border-cyan-500/20"></div>

        {/* Compass Rose */}
        <div 
          className="relative w-full h-full rounded-full transition-transform duration-500 ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* North Marker */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 
            border-l-[12px] border-l-transparent
            border-r-[12px] border-r-transparent
            border-b-[24px] border-b-red-500">
          </div>
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white font-bold text-xl">N</div>
          
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
        <div className="absolute w-6 h-6 bg-cyan-500 rounded-full border-2 border-gray-900 shadow-[0_0_10px_rgba(0,255,255,0.7)]"></div>
      </div>

       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500/30">
          <span className="text-2xl font-bold text-white">
            {heading !== null ? `${Math.round(heading)}°` : '---°'}
          </span>
      </div>
    </div>
  );
};

export default CompassDisplay;
