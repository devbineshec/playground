import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from "react";
import Card from "./Card";
import { useDroppable } from '@dnd-kit/core';

export default function Column({ id, title, cards, activeCardId }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: '250px',
        minHeight: '300px',
        padding: '12px',
        border: '2px solid #ccc',
        background: isOver ? '#f0f9ff' : 'gray',
        borderRadius: '8px'
      }}
    >
      <h4>{title}</h4>

      <SortableContext
        id={id}
        items={cards.map(card => card.id)}
        strategy={verticalListSortingStrategy}
      >
        {cards.map(card => (
          <Card key={card.id} id={card.id} text={card.text} activeCardId={activeCardId} />
        ))}
      </SortableContext>
    </div>
  );
}
