import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import { CYDDroppablePropsType } from './cydTypes';

export default function Droppable({children, id, disableOver}: CYDDroppablePropsType) {
  const {isOver, setNodeRef} = useDroppable({
    id: id,
  });
  const style = {
    backgroundColor: isOver && ! disableOver ? 'rgba(255,255,255,0.5)' : 'inherit',
    width: '100%',
    duration: '200ms',
    borderRadius: '12px'
  };
  
  
  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}