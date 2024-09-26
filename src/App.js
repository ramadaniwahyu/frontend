import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import {DataProvider} from './GlobalState'
import Header from './components/header/Header'
import Pages from './components/mainpages/Pages';

export default function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Header />
          <Pages />
        </div>
      </Router>
    </DataProvider>
  )
}