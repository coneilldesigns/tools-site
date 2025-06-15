// Google Analytics event tracking
export const GA_TRACKING_ID = 'G-9RQM1SLE8W';

// Log page views
export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Log specific events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Add TypeScript support for gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: {
        page_path?: string;
        event_category?: string;
        event_label?: string;
        value?: number;
        [key: string]: string | number | boolean | undefined;
      }
    ) => void;
  }
} 