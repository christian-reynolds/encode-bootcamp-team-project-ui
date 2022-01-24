import { useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import { useState } from "react";
import { useAsync } from "react-async-hook";
import { useParams } from "react-router-dom";
import { toast, toastPromise } from "../utils";
import { ETHERSCAN_BASE } from "../utils/constants";
import { getClaimableDividend, claimDividend } from "../utils/web3";

type Params = 'tokenId';

function DividendClaimForm() {
    const { library, account } = useWeb3React<providers.Web3Provider>();
    const [txHash, setTxHash] = useState('');
    const params = useParams<Params>();
    const tokenId = params.tokenId;

    const { result: claimableDividend } = useAsync(getClaimableDividend, [library!, tokenId!, account!]);

    const onClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            event.preventDefault();
            const tx = claimDividend(library!, tokenId!);
            const hash = await toastPromise(tx);
            setTxHash(hash);
        } catch (error: any) {
            if (!(error.code && error.code === 4001)) {
                toast('Oh no! Something went wrong!', {
                    position: 'top-center',
                    className: 'border-2 border-black text-black font-bold rounded bg-red-500 text-center',
                    icon: '🤯',
                });
            }
        }
    };

    return (
        <div className="flex flex-wrap justify-center items-center w-full">
            <div className="w-1/2 bg-gray-200 rounded shadow-2xl p-8 m-4"> 
                {claimableDividend && claimableDividend === '0.0' &&
                    <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                        You are not eligible to claim the dividend!
                    </p>
                }
                {txHash &&
                    <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                        Your dividend has been claimed! <a href={`${ETHERSCAN_BASE}/tx/${txHash}`} target="_blank" rel="noreferrer">View the tx!</a>
                    </p>
                }
                {claimableDividend && claimableDividend !== '0.0' &&
                    <>
                        <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                            You are eligible to claim {claimableDividend} ETH!
                        </p>
                        <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                            {/* Errors would go here */}
                        </p>
                        <p className="block w-full text-center text-gray-600 text-base font-bold mb-6">
                            Click below to claim the dividend!
                        </p>
                        <button type="submit" className="bg-gray-500 hover:bg-red-500 shadow-sm px-4 py-2 text-xs sm:text-sm text-white font-bold focus:outline-none rounded" onClick={onClick}>Claim Dividend</button>
                    </>
                }
            </div>
        </div>
    );
}

export default DividendClaimForm;
