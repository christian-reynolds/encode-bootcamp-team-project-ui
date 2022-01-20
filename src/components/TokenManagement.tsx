import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { useParams, useNavigate } from 'react-router-dom';
import { ZERO_ADDRESS } from '../utils/constants';
import { getTokensForAccount } from '../utils/tokens';
import BASE_ERC20 from '../utils/BaseErc20.json';
import { ContractAbi } from '../utils/interfaces';
import TokenManagementWrite from './TokenManagementWrite';
import TokenManagementView from './TokenManagementView';

type Params = 'tokenId';

function TokenManagement() {
    const params = useParams<Params>();
    const navigate = useNavigate();
    const tokenId = params.tokenId;
    const { account } = useWeb3React<providers.Web3Provider>();

    const test = BASE_ERC20.abi as ContractAbi[];

    // const abiViewNoInput = test.filter((item) => item.type === 'function' && item.stateMutability === 'view' && item.inputs.length === 0);
    // const abiViewInput = test.filter((item) => item.type === 'function' && item.stateMutability === 'view' && item.inputs.length > 0);

    // const abiWriteNoInput = test.filter((item) => item.type === 'function' && item.stateMutability !== 'view' && item.inputs.length === 0);
    // const abiWriteInput = test.filter((item) => item.type === 'function' && item.stateMutability !== 'view' && item.inputs.length > 0);

    const abiView = test.filter((item) => item.type === 'function' && item.stateMutability === 'view');
    const abiWrite = test.filter((item) => item.type === 'function' && item.stateMutability !== 'view');

    console.log('abi: ', test);
    console.log('abiView: ', abiView);
    console.log('abiWrite: ', abiWrite);

    // TODO: There is a bug with this logic.
    // If there is no account connected then it allows you to stay on the page when you shouldn't be. Not sure how to handle this right now
    useEffect(() => {        
        if (account) {
            // Make sure the active account is the owner
            // This logic isn't bullet proof because someone could manually edit the local storage in their browser
            // but it will keep the average user from trying to work with a contract that they aren't the owner of
            const isContractOwner = () => {
                const retrievedTokens = getTokensForAccount(account ?? ZERO_ADDRESS);
                if (!retrievedTokens || !retrievedTokens?.includes(tokenId!)) navigate('/');
            };

            isContractOwner();
        }
    }, [account, tokenId]);

    return (
        <>
            <div className="flex flex-wrap justify-center items-center h-screen w-full">
                {abiView.map((item) => (<TokenManagementView functionName={item.name} inputs={item.inputs} tokenId={tokenId!} />))}
                {abiWrite.map((item) => (<TokenManagementWrite functionName={item.name} inputs={item.inputs} tokenId={tokenId!} />))}
            </div>
        </>
    );
}

export default TokenManagement;
