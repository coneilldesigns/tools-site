'use client';

import { useState, useEffect } from 'react';

export default function CountdownTimer() {
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const target = new Date(`${targetDate}T${targetTime}`).getTime();
        const difference = target - now;

        if (difference <= 0) {
          setIsRunning(false);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, targetDate, targetTime]);

  const handleStart = () => {
    if (targetDate && targetTime) {
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Target Date
          </label>
          <input
            type="date"
            id="targetDate"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
          />
        </div>
        <div>
          <label htmlFor="targetTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Target Time
          </label>
          <input
            type="time"
            id="targetTime"
            value={targetTime}
            onChange={(e) => setTargetTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleStart}
          disabled={isRunning || !targetDate || !targetTime}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start
        </button>
        <button
          onClick={handleStop}
          disabled={!isRunning}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Stop
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Days</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">{timeLeft.days}</div>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Hours</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">{timeLeft.hours}</div>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Minutes</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">{timeLeft.minutes}</div>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Seconds</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">{timeLeft.seconds}</div>
        </div>
      </div>
    </div>
  );
} 