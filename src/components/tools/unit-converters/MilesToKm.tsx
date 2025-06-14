'use client';

import UnitConverter from './UnitConverter';

export default function MilesToKm() {
  return (
    <UnitConverter
      fromUnit="MILES"
      toUnit="KM"
      fromToConversion={(miles) => miles * 1.60934}
      toFromConversion={(km) => km / 1.60934}
    />
  );
} 