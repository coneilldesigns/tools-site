'use client';

import UnitConverter from './UnitConverter';

export default function FahrenheitToCelsius() {
  return (
    <UnitConverter
      fromUnit="°F"
      toUnit="°C"
      fromToConversion={(f) => (f - 32) * 5/9}
      toFromConversion={(c) => (c * 9/5) + 32}
      allowNegative={true}
    />
  );
}
