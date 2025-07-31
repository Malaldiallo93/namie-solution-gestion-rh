import React, { useState, useEffect, useRef } from 'react';
import { useThemeProvider } from '../../utils/ThemeContext';

function TimeClock({ employee, onTimeUpdate }) {
  const { currentTheme } = useThemeProvider();
  const [timeState, setTimeState] = useState('stopped'); // stopped, running, paused
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [pauseTime, setPauseTime] = useState(0);
  const [totalPauseTime, setTotalPauseTime] = useState(0);
  const [breaks, setBreaks] = useState([]);
  const [currentBreak, setCurrentBreak] = useState(null);
  const intervalRef = useRef(null);

  // Format time to HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate work time (excluding breaks)
  const workTime = currentTime - totalPauseTime;

  // Force re-render when theme changes
  useEffect(() => {
    // This effect will trigger a re-render when theme changes
  }, [currentTheme]);

  // Start timer
  const startTimer = () => {
    if (timeState === 'stopped') {
      setStartTime(new Date());
      setCurrentTime(0);
      setTotalPauseTime(0);
      setBreaks([]);
    }
    setTimeState('running');
  };

  // Pause timer
  const pauseTimer = (breakType = 'other') => {
    if (timeState === 'running') {
      setPauseTime(currentTime);
      setTimeState('paused');
      const newBreak = {
        type: breakType,
        startTime: new Date(),
        duration: 0
      };
      setCurrentBreak(newBreak);
      setBreaks([...breaks, newBreak]);
    }
  };

  // Resume timer
  const resumeTimer = () => {
    if (timeState === 'paused' && currentBreak) {
      const breakDuration = Math.floor((new Date() - currentBreak.startTime) / 1000);
      setTotalPauseTime(totalPauseTime + breakDuration);
      
      setBreaks(breaks.map((break_, index) => 
        index === breaks.length - 1 
          ? { ...break_, duration: breakDuration }
          : break_
      ));
      
      setTimeState('running');
      setCurrentBreak(null);
    }
  };

  // Stop timer
  const stopTimer = () => {
    if (timeState === 'paused') {
      resumeTimer(); // Resume to calculate final break time
    }
    
    // Save time record
    if (onTimeUpdate) {
      onTimeUpdate({
        employeeId: employee.id,
        employeeName: employee.name,
        date: new Date().toISOString().split('T')[0],
        startTime: startTime,
        endTime: new Date(),
        totalTime: currentTime,
        workTime: workTime,
        pauseTime: totalPauseTime,
        breaks: breaks
      });
    }
    
    setTimeState('stopped');
    setStartTime(null);
    setPauseTime(0);
    setTotalPauseTime(0);
    setBreaks([]);
    setCurrentBreak(null);
  };

  // Timer effect
  useEffect(() => {
    if (timeState === 'running') {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeState]);

  const getStatusColor = () => {
    switch (timeState) {
      case 'running':
        return 'text-green-600 dark:text-green-400';
      case 'paused':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'stopped':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (timeState) {
      case 'running':
        return 'En cours';
      case 'paused':
        return 'En pause';
      case 'stopped':
        return 'Arrêté';
      default:
        return 'Arrêté';
    }
  };

  return (
    <div className="space-y-6">
      {/* Employee Info */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            {employee.avatar}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {employee.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {employee.department}
        </p>
      </div>

      {/* Timer Display */}
      <div className="text-center">
        <div className="mb-4">
          <div className={`text-4xl font-mono font-bold ${getStatusColor()}`}>
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {getStatusText()}
          </div>
        </div>

        {/* Work Time Display */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Temps de travail effectif
          </div>
          <div className="text-2xl font-mono font-bold text-gray-800 dark:text-gray-100">
            {formatTime(workTime)}
          </div>
          {totalPauseTime > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Pauses: {formatTime(totalPauseTime)}
            </div>
          )}
        </div>
      </div>

            {/* Control Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {timeState === 'stopped' && (
          <button
            onClick={startTimer}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Arrivée
          </button>
        )}

        {timeState === 'running' && (
          <>
            <button
              onClick={() => pauseTimer('lunch')}
              className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pause
            </button>
            <button
              onClick={stopTimer}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Départ
            </button>
          </>
        )}

        {timeState === 'paused' && (
          <>
            <button
              onClick={resumeTimer}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Reprendre
            </button>
            <button
              onClick={stopTimer}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
              Départ
            </button>
          </>
        )}
      </div>

      {/* Breaks List */}
      {breaks.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Pauses prises aujourd'hui
          </h4>
          <div className="space-y-2">
            {breaks.map((break_, index) => (
              <div key={index} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    break_.type === 'lunch' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {break_.type === 'lunch' ? 'Pause déjeuner' : 'Autre pause'}
                  </span>
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-mono">
                  {break_.duration > 0 ? formatTime(break_.duration) : 'En cours...'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeClock; 