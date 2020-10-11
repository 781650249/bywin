import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function({ content, callback, noAddNotice }) {
  const [value, setValue] = useState('');
  const el = useRef();
  if (noAddNotice) {
    if (value !== content) {
      setValue(content);
    }
  }

  useEffect(() => {
    if (value) {
      callback(value);
    }
  }, [value, content, callback]);

  return <ReactQuill ref={el} theme="snow" value={value} onChange={setValue} />;
}
