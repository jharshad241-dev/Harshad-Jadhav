import React from 'react';
import * as Icons from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-4 h-4' }) => {
  const IconComponent = (Icons as Record<string, React.ElementType>)[name] || Icons.Sparkles;
  return <IconComponent className={className} />;
};
