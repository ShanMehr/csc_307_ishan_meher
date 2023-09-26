// src/MyApp.js
import Table from "./Table";
import Form from './Form';
import React, {useState} from 'react';

function MyApp() {
  // initialize characters to have empty state
	const [characters, setCharacters] = useState([]);  

	function removeOneCharacter (index) {
	    const updated = characters.filter((character, i) => {
	        return i !== index
	    });
	  setCharacters(updated);
	}
    
  return (
    <div className="container">
      <Table characterData={characters} 
        removeCharacter={removeOneCharacter} />
      <Form />
    </div>
  )

}

export default MyApp;