import "./App.css"
import React from 'react';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <main style={{ flex: 1 }}>
        <div>
          <Sidebar/>
        </div>
      </main>
    </div>
  );
}

export default App;
