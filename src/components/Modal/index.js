import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const Modal = React.memo(({ children, mount }) => {
  const elRef = useRef(document.createElement('div'));
  useEffect(() => {
    const el = elRef.current;
    const node = mount || document.getElementById('body');
    node.appendChild(el);
    return () => {
      node.removeChild(el);
    };
  }, [mount]);
  if (!elRef.current) return null;
  return ReactDOM.createPortal(children, elRef.current);
});

export default Modal;
