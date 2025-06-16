export default function Footer() {
  return (
    <footer className="md:fixed relative bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <p className="text-center text-sm text-gray-500 dark:text-gray-300">
          © {new Date().getFullYear()} Everyday Tools. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 