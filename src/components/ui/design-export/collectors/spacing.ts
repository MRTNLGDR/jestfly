
import { UISchemaItem } from '../types';

export const collectSpacing = (items: UISchemaItem[]): void => {
  // Padding
  const paddingValues = [
    { name: "p-0", value: "0px" },
    { name: "p-1", value: "0.25rem" },
    { name: "p-2", value: "0.5rem" },
    { name: "p-3", value: "0.75rem" },
    { name: "p-4", value: "1rem" },
    { name: "p-6", value: "1.5rem" },
    { name: "p-8", value: "2rem" },
    { name: "p-10", value: "2.5rem" },
    { name: "p-12", value: "3rem" },
    { name: "p-16", value: "4rem" }
  ];
  
  paddingValues.forEach(p => {
    items.push({
      name: p.name,
      type: "spacing",
      value: p.value,
      className: p.name
    });
  });
  
  // Margin
  const marginValues = [
    { name: "m-0", value: "0px" },
    { name: "m-1", value: "0.25rem" },
    { name: "m-2", value: "0.5rem" },
    { name: "m-3", value: "0.75rem" },
    { name: "m-4", value: "1rem" },
    { name: "m-6", value: "1.5rem" },
    { name: "m-8", value: "2rem" },
    { name: "m-10", value: "2.5rem" },
    { name: "m-12", value: "3rem" },
    { name: "m-16", value: "4rem" }
  ];
  
  marginValues.forEach(m => {
    items.push({
      name: m.name,
      type: "spacing",
      value: m.value,
      className: m.name
    });
  });
  
  // Gap
  const gapValues = [
    { name: "gap-0", value: "0px" },
    { name: "gap-1", value: "0.25rem" },
    { name: "gap-2", value: "0.5rem" },
    { name: "gap-3", value: "0.75rem" },
    { name: "gap-4", value: "1rem" },
    { name: "gap-6", value: "1.5rem" },
    { name: "gap-8", value: "2rem" },
    { name: "gap-10", value: "2.5rem" }
  ];
  
  gapValues.forEach(g => {
    items.push({
      name: g.name,
      type: "spacing",
      value: g.value,
      className: g.name
    });
  });
  
  // Space
  const spaceYValues = [
    { name: "space-y-0", value: "0px" },
    { name: "space-y-1", value: "0.25rem" },
    { name: "space-y-2", value: "0.5rem" },
    { name: "space-y-4", value: "1rem" },
    { name: "space-y-6", value: "1.5rem" },
    { name: "space-y-8", value: "2rem" }
  ];
  
  spaceYValues.forEach(s => {
    items.push({
      name: s.name,
      type: "spacing",
      value: s.value,
      className: s.name
    });
  });
};
