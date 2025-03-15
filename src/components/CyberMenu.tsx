
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';

interface MenuItem {
  label: string;
  href: string;
}

interface CyberMenuProps {
  items: MenuItem[];
}

const CyberMenu: React.FC<CyberMenuProps> = ({ items }) => {
  // Component removed as requested
  return null;
};

export default CyberMenu;
