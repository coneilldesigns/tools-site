'use client';

import UnitConverter from './UnitConverter';

export default function FeetToInches() {
  return (
    <UnitConverter
      fromUnit="FEET"
      toUnit="INCHES"
      fromToConversion={(feet) => feet * 12}
      toFromConversion={(inches) => inches / 12}
    />
  );
} 