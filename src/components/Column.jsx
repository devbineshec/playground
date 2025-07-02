import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from "react";
import Card from "./Card";
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function Column({ id, title, cards }) {
  const { isOver } = useDroppable({ id });

  const { attributes, listeners, transform, setNodeRef, transition, isDragging } = useSortable({ id });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} >
      <div
        
        data-column-id={id}
        style={{
          width: '250px',
          minHeight: '300px',
          padding: '12px',
          border: '2px solid #ccc',
          background: 'gray',
          borderRadius: '8px',
          transform: CSS.Transform.toString(transform),
        }}
      >
        <h4>{title}</h4>

        <SortableContext
          id={id}
          items={cards?.map(card => card?.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards?.map(card => (
            <Card key={card?.id} id={card?.id} text={card?.text} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
