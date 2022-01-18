import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import Wallet from './Wallet';
import TokenCreationForm from './TokenCreationForm';
import DeployedTokens from './DeployedTokens';

function Main() {
    const [deployedTokens, setDeployedTokens] = useState<string>('');
    const { account } = useWeb3React<providers.Web3Provider>();
    const accountStorage = 'account-' + account!;
  
    const getDeployedTokens = () => {
      const retrievedData = localStorage.getItem(accountStorage);
      (retrievedData ? setDeployedTokens(retrievedData) : setDeployedTokens(''));
    };
  
    useEffect(() => {
        getDeployedTokens();
    }, [account, localStorage.getItem(accountStorage)]);
  
    return (
        <div>
            <Wallet />
            <TokenCreationForm accountStorage={accountStorage} deployedTokens={deployedTokens} getDeployedTokens={getDeployedTokens} />
            {deployedTokens && <DeployedTokens deployedTokens={deployedTokens} />}
        </div>
    );
  }
  
  export default Main;