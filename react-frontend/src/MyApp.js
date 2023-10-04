// src/MyApp.js
import Table from "./Table";
import Form from './Form';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

function MyApp() {
 
  // initialize characters to have empty state
	const [characters, setCharacters] = useState([]);  

	function removeOneCharacter (index) {
	    const updated = characters.filter((character, i) => {
	        return i !== index
	    });
	  setCharacters(updated);
	}
    // src/MyApp.js (a new function inside the MyApp function)
  function updateList(person) {
    setCharacters([...characters, person]);
  }

  async function fetchAll(){
    try {
        const response = await axios.get('http://localhost:8000/users');
        return response.data.users_list;     
    }
    catch (error){
        //We're not handling errors. Just logging into the console.
        console.log(error); 
        return false;         
    }
  }

  useEffect(() => {
   fetchAll().then( result => {
      if (result)
         setCharacters(result);
    });
  }, [] );
    
  return (
    <div className="container">
      <Table characterData={characters} 
        removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  )

}

export default MyApp;