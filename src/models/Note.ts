
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  links: {
    incoming: string[]; // IDs das notas que linkam para esta
    outgoing: string[]; // IDs das notas para as quais esta linka
  };
  createdAt: Date;
  updatedAt: Date;
  color?: string;
  isPinned: boolean;
  isArchived: boolean;
  customFields?: Record<string, any>;
}
