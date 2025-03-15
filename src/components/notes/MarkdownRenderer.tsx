
import React from 'react';

interface MarkdownRendererProps {
  content: string;
  onLinkClick?: (noteId: string) => void;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content,
  onLinkClick
}) => {
  // Renderizador customizado para links internos usando o formato [[link]]
  const renderMarkdownWithClickableLinks = (markdown: string) => {
    const renderedContent = markdown.replace(
      /\[\[(.*?)\]\]/g,
      (match, linkText) => `<a class="internal-link" data-link="${linkText}">${linkText}</a>`
    );
    
    return (
      <div 
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
        onClick={(e) => {
          if ((e.target as HTMLElement).classList.contains('internal-link')) {
            const linkText = (e.target as HTMLElement).getAttribute('data-link');
            if (linkText && onLinkClick) {
              onLinkClick(linkText);
            }
          }
        }}
      />
    );
  };

  return renderMarkdownWithClickableLinks(content);
};
