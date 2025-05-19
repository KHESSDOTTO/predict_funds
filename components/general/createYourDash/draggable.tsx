import React from 'react';
import {useDraggable} from '@dnd-kit/core';
import { CYDDroppablePropsType } from './cydTypes';

export default function Draggable({children, id}: CYDDroppablePropsType) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: id,
  });
  let style: React.CSSProperties = {
    touchAction: 'none', // Evitar drag com scroll em mobile
    flexGrow: 1,
    maxWidth: '24%'
  };

  if (transform) {
    style = {
      ...style,
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    };
  }
  
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  );
}
