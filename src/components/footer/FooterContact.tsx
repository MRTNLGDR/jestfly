
import React from 'react';

const FooterContact: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-6">Contact</h3>
      <ul className="space-y-3 text-white/60 text-sm">
        <li>Tokyo, Japan</li>
        <li>San Francisco, USA</li>
        <li>contact@jestfly.com</li>
        <li className="pt-4">
          <button className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm transition-colors">
            Send Message
          </button>
        </li>
      </ul>
    </div>
  );
};

export default FooterContact;
