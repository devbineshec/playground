import React from 'react'
import Column from './Column'
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'

const Container = ({ id, columns }) => {
    console.log(columns);
    

    return (
        <SortableContext
            id={id}
            items={Object.entries(columns).map(([columnId, cards]) => columnId)}
            strategy={horizontalListSortingStrategy}
        >
            {Object.entries(columns).map(([columnId, cards]) => (
                <Column key={columnId} id={columnId} title={columnId} cards={cards} />
            ))}
        </SortableContext>
    )
}

export default Container