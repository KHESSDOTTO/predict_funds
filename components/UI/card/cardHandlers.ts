import { RefObject } from "react";

function handleHovering(targetRef: RefObject<HTMLDivElement>) {
  if (targetRef.current) {
    targetRef.current.style.backgroundColor = 'rgba(255,255,245,0.15)';
  }
}

function handleHoveringStops(targetRef: RefObject<HTMLDivElement>) {
  if (targetRef.current) {
    targetRef.current.style.backgroundColor = 'transparent';
  }
}

export {
  handleHovering,
  handleHoveringStops,
}
