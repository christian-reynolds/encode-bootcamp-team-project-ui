import { useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, toastPromise } from "../utils";
import { ETHERSCAN_BASE, ZERO_ADDRESS } from "../utils/constants";
import { getTokensForAccount } from "../utils/tokens";
import { useAsync } from "react-async-hook";
import { getTotalDividends, addDividends } from "../utils/web3";

type Params = 'tokenId';

function DividendManagement() {
    const { library, account } = useWeb3React<providers.Web3Provider>();
    const params = useParams<Params>();
    const navigate = useNavigate();
    const tokenId = params.tokenId;
    const [amount, setAmount] = useState('');
    const [txHash, setTxHash] = useState('');    

    const amountOnChange = (event: React.ChangeEvent<HTMLInputElement>) => setAmount(event.target.value);

    // TODO: Review the getDividends and getTotalDividends implementation
    // I don't think this is a proper implementation but I want to call getTotalDividends again when the txHash has been updated
    const getDividends = async (lib: providers.Web3Provider, addr: string, hash: string) => {
        return getTotalDividends(lib, addr);
    };

    const { result: totalDividends } = useAsync(getDividends, [library!, tokenId!, txHash]);
    
    const onClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            event.preventDefault();
            const tx = addDividends(library!, tokenId!, amount);
            const hash = await toastPromise(tx);
            setTxHash(hash);
        } catch (error: any) {
            if (!(error.code && error.code === 4001)) {
                toast('Something went horribly wrong!', {
                    position: 'top-center',
                    className: 'bg-red-500',
                    icon: '🤯',
                });
            }
        }
    };    

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
        <div className="flex flex-wrap justify-center items-center w-full">
            <div className="w-1/2 bg-gray-200 rounded shadow-2xl p-8 m-4"> 
                <p className="block w-full text-center text-gray-600 text-base font-bold mb-6">
                    Add ETH to distribute as dividends to your shareholders.
                </p>
                {txHash &&
                    <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                        Dividends have been added! <a href={`${ETHERSCAN_BASE}/tx/${txHash}`} target="_blank" rel="noreferrer">View the tx!</a><br /><br />
                        <a href={`/dividend/${tokenId}/claim`} target="_blank">Give the Dividend Claim link to your shareholders!</a>
                    </p>
                }
                {/* <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                    Errors would go here
                </p> */}
                <p className="block w-full text-left text-gray-500 text-base font-bold mb-6">
                    Current Dividend Balance: {totalDividends} ETH
                </p>
                <div className="flex flex-col mb-4">
                    <label className="mb-2 font-bold text-lg text-left text-gray-600">ETH</label>
                    <input className="border py-2 px-3 text-sm text-black" placeholder="Amount" type="text" onChange={amountOnChange} />
                </div>
                <button type="submit" className="bg-gray-500 hover:bg-red-500 shadow-sm px-4 py-2 text-xs sm:text-sm text-white font-bold focus:outline-none rounded" onClick={onClick}>Add ETH</button>
            </div>
        </div>
    );
}

export default DividendManagement;
