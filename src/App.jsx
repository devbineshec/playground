// App.jsx or KanbanBoard.jsx
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { useState } from 'react';
import React from 'react';
import Column from './components/Column';
import Container from './components/Container';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

const initialColumns = {
  todo: [{ id: '1', text: 'Task A' }, { id: '2', text: 'Task B' }],
  doing: [{ id: '3', text: 'Task C' }],
  done: [{ id: '4', text: 'Task D' }]
};

export default function App() {
  const [columns, setColumns] = useState(initialColumns);
  const [activeCardId, setActiveCardId] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragOver = ({ active, over }) => {

    const sourceCol = findColumnWithCard(columns, active.id);
    const targetCol = findColumnWithCard(columns, over.id);

    const targetIndex = columns[targetCol]?.findIndex(c => c?.id === over?.id);
    const activeCard = columns[sourceCol]?.find(c => c?.id === active?.id);
    const newSourceCards = columns[sourceCol]?.filter(c => c?.id !== active?.id);

    if (!sourceCol || !targetCol || sourceCol === targetCol) return; // TODOOO
    if (!over || active?.id === over.id) return; // TODOOO

    const newTargetCards = [...columns[targetCol]];
    newTargetCards.splice(targetIndex, 0, activeCard);

    setColumns({
      ...columns,
      [sourceCol]: newSourceCards,
      [targetCol]: newTargetCards
    });
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    // Column drag
    const activeCol = getColumnId(active.id);
    const overCol = getColumnId(over.id);

    if (activeCol && overCol && activeCol !== overCol) {
      const colEntries = Object.entries(columns);
      const oldIndex = colEntries.findIndex(([colId]) => colId === activeCol);
      const newIndex = colEntries.findIndex(([colId]) => colId === overCol);

      const newColEntries = [...colEntries];
      const [moved] = newColEntries.splice(oldIndex, 1);
      newColEntries.splice(newIndex, 0, moved);

      setColumns(Object.fromEntries(newColEntries));
      return;
    }

    // Card drag (your existing logic, but update to use new column IDs)
    const sourceCol = findColumnWithCard(columns, active?.id);
    const targetCol = findColumnWithCard(columns, over?.id);
    if (!sourceCol || !targetCol) return;

    // Find the card being moved
    const activeCard = columns[sourceCol].find(c => c?.id === active?.id);
    if (!activeCard) return;

    // Remove from source
    let newSourceCards = columns[sourceCol].filter(c => c?.id !== active?.id);
    let newTargetCards = [...columns[targetCol]];

    // Find the index to insert at in the target column
    let targetIndex = newTargetCards.findIndex(c => c?.id === over?.id);
    if (targetIndex === -1) targetIndex = newTargetCards.length;

    // Determine if we should insert above or below the target card
    let insertIndex = targetIndex;
    if (over && over?.rect && active && active?.rect) {
      const pointerY = active?.rect.current.translated?.top ?? active?.rect.current.initial.top;
      const overTop = over?.rect.top;
      const overHeight = over?.rect.height;
      if (pointerY > overHeight / 2) {
        // Insert below
        insertIndex = targetIndex + 1;
      } else if (pointerY > overHeight / 2) {
        // Insert above (default)
        insertIndex = targetIndex;
      }
    }

    // If moving within the same column, adjust index if needed
    if (sourceCol === targetCol) {
      const oldIndex = columns[sourceCol].findIndex(c => c?.id === active?.id);
      const overTop = over?.rect.top;
      if (oldIndex < 2*overTop + insertIndex) insertIndex--;
      newTargetCards = newSourceCards;
    }

    newTargetCards.splice(insertIndex, 0, activeCard);

    setColumns({
      ...columns,
      [sourceCol]: sourceCol === targetCol ? newTargetCards : newSourceCards,
      [targetCol]: newTargetCards
    });
    setActiveCardId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={({ active }) => {
        setActiveCardId(active?.id);
      }}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div dir='rtl' style={{ display: 'flex', gap: '16px', padding: '20px' }}>
        <SortableContext
          id="columns"
          items={Object.keys(columns).map(colId => `column-${colId}`)}
          strategy={horizontalListSortingStrategy}
        >
          {Object.entries(columns).map(([columnId, cards]) => (
            <Column key={columnId} id={`column-${columnId}`} title={columnId} cards={cards} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );

  function findColumnWithCard(columns, id) {
    // If it's a column id, just return it directly
    if (columns[id]) return id;

    // Otherwise, search for the card
    return Object.keys(columns).find(col =>
      columns[col]?.some(card => card?.id === id)
    );
  }

  function getColumnId(id) {
    return id.startsWith('column-') ? id.replace('column-', '') : null;
  }
}

