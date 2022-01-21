import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import TokenCreationForm from './TokenCreationForm';
import DeployedTokens from './DeployedTokens';
import { getTokensForAccount } from "../utils/tokens";
import { ZERO_ADDRESS } from '../utils/constants';

function Main() {
    const [deployedTokens, setDeployedTokens] = useState<string>('');
    const { account } = useWeb3React<providers.Web3Provider>();
    const accountStorage = 'account-' + account!;
  
    const getDeployedTokens = () => {
      const retrievedTokens = getTokensForAccount(account ?? ZERO_ADDRESS);
      (retrievedTokens ? setDeployedTokens(retrievedTokens) : setDeployedTokens(''));
    };
  
    useEffect(() => {
        getDeployedTokens();
    }, [account, localStorage.getItem(accountStorage)]);
  
    return (
        <div className="p-10">
            <TokenCreationForm accountStorage={accountStorage} deployedTokens={deployedTokens} getDeployedTokens={getDeployedTokens} />
            {deployedTokens && <DeployedTokens deployedTokens={deployedTokens} />}
        </div>
    );
  }
  
  export default Main;
  