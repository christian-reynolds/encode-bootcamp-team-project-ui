import { useEffect } from 'react';
import { useAsync } from 'react-async-hook';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { displayAddress } from "../utils/web3";

declare let window: {
    ethereum: any
};

function Wallet() {
    const injectedConnector = new InjectedConnector({ supportedChainIds: [4] });

    const { account, library, activate } = useWeb3React<providers.Web3Provider>();
    const { result: label = 'CONNECT WALLET' } = useAsync(displayAddress, [account, library], {
        setLoading: (state) => ({ ...state, loading: true }),
    });

    const connectIfUnlocked = async () => {
        if (!window.ethereum) return;
        const connectedAccounts = await window.ethereum.request({ method: 'eth_accounts', params: [] });
        if (connectedAccounts.length > 0) {
            activate(injectedConnector);
        } else {
            // activate(fallbackConnector);
        }
    };

    useEffect(() => {
        connectIfUnlocked();
    }, [account]);

    if (!window.ethereum) {
        return null;
    }

    return (
        <button type="button" onClick={() => activate(injectedConnector)}>{label}</button>
    );
}

export default Wallet;