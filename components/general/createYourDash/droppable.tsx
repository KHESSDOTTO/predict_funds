import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import { CYDDroppablePropsType } from './cydTypes';

export default function Droppable({children, id}: CYDDroppablePropsType) {
  const {isOver, setNodeRef} = useDroppable({
    id: id,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  
  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}