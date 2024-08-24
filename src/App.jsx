// src/App.js
import React, { useState, useEffect } from 'react';
import Scene from './Cube';
import Demo from './Demo';


function App() {
  const [rotation, setRotation] = useState([]);

  return (
    <div className="App">
      <Scene rotation={rotation} />
      <Demo rotation={setRotation}/>
    </div>
  );
}

export default App;
