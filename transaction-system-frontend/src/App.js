// src/App.js
import React from 'react';

import './App.css';
import TransactionTable from './components/TransactionTable/TransactionTable';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Transaction Dashboard</h1>
      </header>
      <main>
        <TransactionTable/>
      </main>
    </div>
  );
};

export default App;
