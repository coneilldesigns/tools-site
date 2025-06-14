'use client';

import UnitConverter from './UnitConverter';

export default function CmToInches() {
  return (
    <UnitConverter
      fromUnit="CM"
      toUnit="INCHES"
      fromToConversion={(cm) => cm / 2.54}
      toFromConversion={(inches) => inches * 2.54}
    />
  );
} 