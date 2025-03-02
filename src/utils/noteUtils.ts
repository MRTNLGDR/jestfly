
/**
 * Extrai os links de texto no formato [[link]] do conteúdo da nota
 * @param content Conteúdo da nota
 * @returns Array de strings com os links encontrados
 */
export const extractLinks = (content: string): string[] => {
  const linkRegex = /\[\[(.*?)\]\]/g;
  const links: string[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    if (match[1] && !links.includes(match[1])) {
      links.push(match[1]);
    }
  }

  return links;
};

/**
 * Gera um ID único para novas notas
 * @returns String com ID único
 */
export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
