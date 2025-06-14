'use client';

interface DevAdCardProps {
  slot: string;
  format?: 'horizontal' | 'vertical';
  style?: React.CSSProperties;
}

export default function DevAdCard({ slot, format = 'horizontal', style }: DevAdCardProps) {
  return (
    <div className="w-full flex justify-center my-4">
      <div
        className="bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center"
        style={{
          ...(format === 'vertical' ? { width: '160px', height: '600px' } : { width: '100%', height: '90px' }),
          ...style
        }}
      >
        <div className="text-center p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ad Slot: {slot}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {format === 'vertical' ? '160x600' : '728x90'}
          </p>
        </div>
      </div>
    </div>
  );
} 