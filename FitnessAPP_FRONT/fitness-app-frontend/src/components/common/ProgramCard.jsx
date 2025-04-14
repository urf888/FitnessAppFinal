import React from 'react';
import { FaClock, FaCalendarAlt, FaDumbbell, FaRunning } from 'react-icons/fa';

const ProgramCard = ({ program, isPersonalized = false, onViewDetails }) => {
  return (
    <div className={`rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 
                    ${isPersonalized ? 'border-2 border-blue-500' : 'border border-gray-200'}`}>
      
      {/* Header cu imaginea programului */}
      <div className="relative h-48 overflow-hidden">
        {program.imageUrl ? (
          <img 
            src={program.imageUrl} 
            alt={program.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <FaDumbbell className="text-gray-400 text-5xl" />
          </div>
        )}
        
        {/* Badge pentru program personalizat */}
        {isPersonalized && (
          <div className="absolute top-0 right-0 mt-2 mr-2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
            <span className="mr-1">AI</span>
            <span>PERSONALIZAT</span>
          </div>
        )}
        
        {/* Badge pentru nivel de dificultate */}
        <div className="absolute bottom-0 left-0 mb-2 ml-2 bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded-md">
          {program.difficultyLevel}
        </div>
      </div>
      
      {/* Conținutul cardului */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{program.name}</h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {program.description}
        </p>
        
        {/* Etichete pentru categorii */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {program.programType === 'slabit' ? 'Slăbire' : 
             program.programType === 'masa' ? 'Masă musculară' : 'Tonifiere'}
          </span>
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {program.diet}
          </span>
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {program.gender}
          </span>
        </div>
        
        {/* Detalii program */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center text-gray-600">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            <span className="text-sm">{program.durationWeeks} săptămâni</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaRunning className="mr-2 text-gray-500" />
            <span className="text-sm">{program.workoutsPerWeek} antrenamente/săpt</span>
          </div>
        </div>
        
        {/* Buton pentru detalii */}
        <button 
          onClick={onViewDetails}
          className={`w-full mt-2 py-2 rounded-md font-medium transition-colors
                    ${isPersonalized 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
        >
          Vezi detalii
        </button>
      </div>
    </div>
  );
};

export default ProgramCard;