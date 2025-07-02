import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from "react";

export default function Card({ id, text, activeCardId }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '8px 12px',
    marginBottom: '8px',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'grab',
    boxShadow: isDragging ? '0 2px 6px rgba(0,0,0,0.2)' : undefined
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {text}
    </div>
  );
}
