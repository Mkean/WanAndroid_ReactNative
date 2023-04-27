import React from 'react';
import {ReducersProvider} from './src/utils/redux';
import Navigation from './src/Navigation';

function App() {
  return (
    <ReducersProvider>
      <Navigation />
    </ReducersProvider>
  );
}

export default App;
