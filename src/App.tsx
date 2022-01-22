import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Main from './components/Main';
import TokenManagement from './components/TokenManagement';
import Wallet from './components/Wallet';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import NftCreationForm from './components/NftCreationForm';
import NftClaimForm from './components/NftClaimForm';

const getLibrary = (provider: any) => new providers.Web3Provider(provider);

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="App">
        <header className="App-header flex flex-wrap bg-gray-700">
          <Wallet />
        </header>
        <div className="App-body">
          <div className="flex w-full h-full bg-gray-500">
            <BrowserRouter>
              <Routes>
                <Route 
                  path="/"
                  element={<Main />}
                />
                <Route 
                  path="/nft/:tokenId"
                  element={<NftCreationForm />}
                />
                <Route 
                  path="/nft/:tokenId/claim"
                  element={<NftClaimForm />}
                />
                <Route 
                  path="/token/:tokenId"
                  element={<TokenManagement />}
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </div>
    </Web3ReactProvider>
  );
}

export default App;
