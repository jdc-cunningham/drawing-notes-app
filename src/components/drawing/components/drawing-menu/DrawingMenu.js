import React from 'react';
import { useState, useEffect } from 'react';
import './DrawingMenu.scss';
import axios from 'axios';

var searchTimeout = null;

// yuck, but menu below rerenders a lot
const save = (searchTerm, apiSavePath, setSavingState, setMenuOpen, setSearchTerm, tags, setTags, canvas) => {
  if (!searchTerm.length) {
    alert('Need a name');
    return;
  }

  setSavingState('saving');

  axios.post(apiSavePath, {
    name: searchTerm,
    topics: tags,
    drawing: canvas.toDataURL()
  }).then((res) => {
    if (res.status === 200) {
      setSavingState('saved');
      setMenuOpen(false);
      setSearchTerm(''); // bad
      setTags('');
    } else {
      alert('Failed to save');
    }
  });
}

const search = (apiSearchPath, searchTerm, tags, setSearchResults) => {
  setSearchResults([]);

  axios.post(apiSearchPath, {
    name: searchTerm,
    topics: tags
  }).then((res) => {
    if (res.status === 200) {
      if (res.data.drawings.length) {
        setSearchResults(res.data.drawings);
      }
    } else {
      alert('Failed to search');
    }
  });
}

const closeMenu = (setMenuOpen, setSearchTerm, setTags) => {
  setMenuOpen(false);
  setSearchTerm(''); // bad
  setTags('');
}

const loadDrawing = (apiGetDrawingPath, drawingId, canvas, setMenuOpen, setSearchTerm, setTags, erase) => {
  axios.post(apiGetDrawingPath, {
    id: drawingId
  }).then((res) => {
    if (res.status === 200) {
      if (res.data.length) {
        // https://stackoverflow.com/a/4409745
        erase();

        let image = new Image();
    
        image.onload = function() {
          canvas.getContext("2d").drawImage(image, 0, 0);
        };

        image.src = res.data[0].drawing;
        closeMenu(setMenuOpen, setSearchTerm, setTags);
      }
    } else {
      alert('Failed to load drawing');
    }
  });
}

const DrawingMenu = (props) => {
  const { menuOpen, setMenuOpen, drawing, setActiveDrawing, canvas, setSavingState, erase } = props;

  const baseApi = 'http://192.168.1.144:5003';
  const apiSavePath = `${baseApi}/save-drawing`;
  const apiSearchPath = `${baseApi}/search-drawing`;
  const apiGetDrawingPath = `${baseApi}/get-drawing`;

  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    clearTimeout(searchTimeout);

    if (!searchTerm.length && searchResults.length) {
      setSearchResults([]);
    } else {
      if (searchTerm.length || tags.length) {
        searchTimeout = setTimeout(() => {
          search(apiSearchPath, searchTerm, tags, setSearchResults);
        }, 500);
      }
    }
  }, [searchTerm, tags]);

  return (
    <div className={`DrawingMenu ${menuOpen ? 'open' : ''}`}>
      <h2>Save or load drawing</h2>
      <input type="text" className="DrawingMenu__search-input" placeholder="drawing name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      <input type="text" className="DrawingMenu__tag-input" placeholder="tags" value={tags} onChange={(e) => setTags(e.target.value)}/>
      <div className="DrawingMenu__btns">
        <button type="button" onClick={() => closeMenu(setMenuOpen, setSearchTerm, setTags)}>Cancel</button>
        <button
          type="button"
          onClick={() => save(searchTerm, apiSavePath, setSavingState, setMenuOpen, setSearchTerm, tags, setTags, canvas)}
        >Save</button>
      </div>
      <div className={`DrawingMenu__search-results ${searchResults.length ? 'open' : ''}`}>
        {searchResults.map((searchResult, index) =>
          <div
            key={index}
            className="DrawingMenu__search-result"
            onClick={() => loadDrawing(apiGetDrawingPath, searchResult.id, canvas, setMenuOpen, setSearchTerm, setTags, erase)}
          >{searchResult.name}</div>
        )}
      </div>
    </div>  
  );
}

export default DrawingMenu;