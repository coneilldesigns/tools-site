'use client';

import UnitConverter from './UnitConverter';

// Use exact conversion factors
const CM_TO_INCHES = (cm: number) => {
  // Convert to inches with full precision
  const inches = cm / 2.54;
  // Round to 8 decimal places to avoid floating point issues
  return Math.round(inches * 100000000) / 100000000;
};

const INCHES_TO_CM = (inches: number) => {
  // Convert to cm with full precision
  const cm = inches * 2.54;
  // Round to 8 decimal places to avoid floating point issues
  return Math.round(cm * 100000000) / 100000000;
};

export default function CmToInches() {
  return (
    <UnitConverter
      fromUnit="CM"
      toUnit="INCHES"
      fromToConversion={CM_TO_INCHES}
      toFromConversion={INCHES_TO_CM}
    />
  );
} 