
import React from 'react';
import FooterLink from './FooterLink';

interface FooterNavLinksProps {
  title: string;
  links: Array<{ href: string; label: string }>;
}

const FooterNavLinks: React.FC<FooterNavLinksProps> = ({ title, links }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <FooterLink key={index} href={link.href}>
            {link.label}
          </FooterLink>
        ))}
      </ul>
    </div>
  );
};

export default FooterNavLinks;
