
export interface MenuItem {
  label: string;
  path: string;
}

export const MenuItems: MenuItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Store', path: '/store' },
  { label: 'Community', path: '/community' },
  { label: 'Events', path: '/community/events' },
  { label: 'JestCoin', path: '/jestcoin' }
];
