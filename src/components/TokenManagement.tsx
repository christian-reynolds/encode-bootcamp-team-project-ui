import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { useParams, useNavigate } from 'react-router-dom';
import { ZERO_ADDRESS } from '../utils/constants';
import { getTokensForAccount } from '../utils/tokens';
import BASE_ERC20 from '../utils/BaseErc20.json';
import { callFunction } from '../utils/web3';

type Params = 'tokenId';

function TokenManagement() {
    const params = useParams<Params>();
    const navigate = useNavigate();
    const tokenId = params.tokenId;
    const { account, library } = useWeb3React<providers.Web3Provider>();

    const abiViewNoInput = BASE_ERC20.abi.filter((item) => item.type === 'function' && item.stateMutability === 'view' && item.inputs.length === 0);
    const abiViewInput = BASE_ERC20.abi.filter((item) => item.type === 'function' && item.stateMutability === 'view' && item.inputs.length > 0);

    const abiWriteNoInput = BASE_ERC20.abi.filter((item) => item.type === 'function' && item.stateMutability !== 'view' && item.inputs.length === 0);
    const abiWriteInput = BASE_ERC20.abi.filter((item) => item.type === 'function' && item.stateMutability !== 'view' && item.inputs.length > 0);

    console.log('abi: ', BASE_ERC20.abi);

    console.log('abiViewNoInput: ', abiViewNoInput);
    console.log('abiViewInput: ', abiViewInput);

    console.log('abiWriteNoInput: ', abiWriteNoInput);
    console.log('abiWriteInput: ', abiWriteInput);

    // Make sure the active account is the owner
    // This logic isn't bullet proof because someone could manually edit the local storage in their browser
    // but it will keep the average user from trying to work with a contract that they aren't the owner of
    const isContractOwner = () => {
        const retrievedTokens = getTokensForAccount(account ?? ZERO_ADDRESS);
        if (!retrievedTokens || !retrievedTokens?.includes(tokenId!)) navigate('/');
    };

    // TODO: There is a bug with this logic.
    // If there is no account connected then it allows you to stay on the page when you shouldn't be. Not sure how to handle this right now
    useEffect(() => {        
        if (account) {
            isContractOwner();
            callFunction(library!, tokenId!, "balanceOf(address)", account);
        }
    }, [account, tokenId]);

    return (
        <div>
            <div className="w-full">
                <table className="table-fixed w-full text-base">
                    <tbody>
                        {abiViewNoInput.map((item) => (<tr><td>{item.name}</td></tr>))}
                        <tr><td>&nbsp;</td></tr>
                        {abiViewInput.map((item) => (<tr><td>{item.name}</td></tr>))}
                        <tr><td>&nbsp;</td></tr>
                        {abiWriteNoInput.map((item) => (<tr><td>{item.name}</td></tr>))}
                        <tr><td>&nbsp;</td></tr>
                        {/* {abiWriteInput.map((item) => (<tr><td>{item.name}</td></tr>))} */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TokenManagement;