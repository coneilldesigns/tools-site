'use client';

import UnitConverter from './UnitConverter';

export default function LitresToGallons() {
  return (
    <UnitConverter
      fromUnit="LITRES"
      toUnit="GALLONS"
      fromToConversion={(litres) => litres / 3.78541}
      toFromConversion={(gallons) => gallons * 3.78541}
    />
  );
} 