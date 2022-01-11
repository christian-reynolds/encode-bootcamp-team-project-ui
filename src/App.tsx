import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import React from 'react';
import logo from './logo.svg';
import './App.css';
import Wallet from './components/Wallet';

const getLibrary = (provider: any) => new providers.Web3Provider(provider);

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Wallet />
        </header>
      </div>
    </Web3ReactProvider>
  );
}

export default App;
