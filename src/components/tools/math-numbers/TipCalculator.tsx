'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);

  const calculateTip = () => {
    const bill = parseFloat(billAmount) || 0;
    const tip = (bill * tipPercentage) / 100;
    const total = bill + tip;
    const perPerson = total / numberOfPeople;

    return {
      tipAmount: tip.toFixed(2),
      totalAmount: total.toFixed(2),
      perPersonAmount: perPerson.toFixed(2)
    };
  };

  const results = calculateTip();

  return (
    <div className="flex flex-col w-full h-full m-0">
      {/* Input Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-b border-gray-800">
        <div>
          <label htmlFor="billAmount" className="block text-sm font-medium text-gray-300 mb-2">
            Bill Amount ($)
          </label>
          <input
            type="number"
            id="billAmount"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            className="w-full rounded-lg bg-gray-800 border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tip Percentage
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[10, 15, 20, 25].map((percentage) => (
              <button
                key={percentage}
                onClick={() => setTipPercentage(percentage)}
                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                  tipPercentage === percentage
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {percentage}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-300 mb-2">
            Number of People
          </label>
          <input
            type="number"
            id="numberOfPeople"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full rounded-lg bg-gray-800 border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 w-full flex-1">
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b md:border-b-0 border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-300 text-base md:text-xl lg:text-2xl">Tip Amount</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">${results.tipAmount}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b md:border-b-0 border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-300 text-base md:text-xl lg:text-2xl">Total Amount</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">${results.totalAmount}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center border-b border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-300 text-base md:text-xl lg:text-2xl">Per Person</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">${results.perPersonAmount}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
