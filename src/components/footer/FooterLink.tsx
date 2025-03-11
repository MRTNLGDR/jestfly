
import React from 'react';
import { Link } from 'react-router-dom';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => (
  <li>
    <Link to={href} className="text-white/60 hover:text-white transition-colors text-sm">
      {children}
    </Link>
  </li>
);

export default FooterLink;
