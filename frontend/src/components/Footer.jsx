import React from 'react';

function Footer() {
  return (
    <footer className="mt-8 border-t border-gray-700/50">
      <div className="container mx-auto px-4 py-6 text-sm text-gray-400 flex justify-between items-center">
        <p>
          © {new Date().getFullYear()} Model Shield. Built for safer AI.
        </p>
        <a
          href="#"
          className="text-teal-400 hover:text-teal-300"
          onClick={(e) => e.preventDefault()}
        >
          Docs (coming soon)
        </a>
      </div>
    </footer>
  );
}

export default Footer;

