import React from 'react';
import { Tag } from '../types/news';

interface Props {
  tag: Tag;
}

export const TagBadge: React.FC<Props> = ({ tag }) => {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `${tag.color}20`,
        color: tag.color,
      }}
    >
      {tag.name}
    </span>
  );
};