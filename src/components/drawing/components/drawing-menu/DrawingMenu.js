import React from 'react';
import { useState, useEffect } from 'react';
import './DrawingMenu.scss';
import axios from 'axios';

const DrawingMenu = (props) => {
  const { menuOpen, setMenuOpen, drawing, setActiveDrawing } = props;

  const baseApi = 'http://192.168.1.144:5003';
  const apiSavePath = `${baseApi}/save-drawing`;
  const apiSearchPath = `${baseApi}/search-drawing`;
  const apiGetDrawingPath = `${baseApi}/get-drawing`;

  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const save = () => {
  
  }

  const cancel = () => {
    setMenuOpen(false);
  }

  return (
    <div className={`DrawingMenu ${true ? 'open' : ''}`}>
      <h2>Save or load drawing</h2>
      <input type="text" className="DrawingMenu__search-input" placeholder="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      <input type="text" className="DrawingMenu__tag-input" placeholder="tags" value={tags} onChange={(e) => setTags(e.target.value)}/>
      <div className="DrawingMenu__btns">
        <button type="button" onClick={() => save()}>Cancel</button>
        <button type="button" onClick={() => cancel()}>Save</button>
      </div>
      <div className={`DrawingMenu__search-results ${searchResults.length ? 'open' : ''}`}></div>
    </div>  
  );
}

export default DrawingMenu;