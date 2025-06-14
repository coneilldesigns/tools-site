export interface AdSlot {
  id: string;
  format: 'horizontal' | 'vertical' | 'rectangle';
  style?: React.CSSProperties;
  position: 'top' | 'middle' | 'bottom' | 'sidebar';
}

export const adSlots: Record<string, AdSlot[]> = {
  // Main page ad slots
  home: [
    {
      id: 'home-top',
      format: 'horizontal',
      style: { minHeight: '90px' },
      position: 'top'
    },
    {
      id: 'home-middle',
      format: 'horizontal',
      style: { minHeight: '90px' },
      position: 'middle'
    },
    {
      id: 'home-bottom',
      format: 'horizontal',
      style: { minHeight: '90px' },
      position: 'bottom'
    }
  ],

  // Tool pages ad slots
  tool: [
    {
      id: 'tool-top',
      format: 'horizontal',
      style: { minHeight: '90px' },
      position: 'top'
    },
    {
      id: 'tool-middle',
      format: 'horizontal',
      style: { minHeight: '90px' },
      position: 'middle'
    },
    {
      id: 'tool-bottom',
      format: 'horizontal',
      style: { minHeight: '90px' },
      position: 'bottom'
    },
    {
      id: 'tool-sidebar',
      format: 'vertical',
      style: { minHeight: '600px' },
      position: 'sidebar'
    }
  ]
}; 