export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Tools & Utilities. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 