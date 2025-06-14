'use client';

import UnitConverter from './UnitConverter';

export default function GramsToOunces() {
  return (
    <UnitConverter
      fromUnit="GRAMS"
      toUnit="OZ"
      fromToConversion={(grams) => grams / 28.3495}
      toFromConversion={(ounces) => ounces * 28.3495}
    />
  );
} 