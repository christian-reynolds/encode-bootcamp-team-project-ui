import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import './App.css';
import Main from './components/Main';

const getLibrary = (provider: any) => new providers.Web3Provider(provider);

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
          <header className="App-header">
            <Main />
          </header>
        </div>
    </Web3ReactProvider>
  );
}

export default App;
