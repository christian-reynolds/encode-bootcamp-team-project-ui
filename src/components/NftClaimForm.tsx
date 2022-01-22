import { useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, toastPromise } from "../utils";
import { ETHERSCAN_BASE } from "../utils/constants";
import { getMerkleProof } from "../utils/merkle";
import { claimNft } from "../utils/web3";

type Params = 'tokenId';

function NftClaimForm() {
    const { library, account } = useWeb3React<providers.Web3Provider>();
    const [hasCheckedEligibility, setHasCheckedEligibility] = useState(false);
    const [eligibleToClaim, setEligibleToClaim] = useState(false);
    const [txHash, setTxHash] = useState('');
    const params = useParams<Params>();
    const navigate = useNavigate();
    const tokenId = params.tokenId;

    const onClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            event.preventDefault();
            setHasCheckedEligibility(true);

            // Get the proof that will be sent to the ERC721 claim function
            const merkleProof = await getMerkleProof(tokenId!, account!);

            if (!Array.isArray(merkleProof) || !merkleProof.length) {
                setEligibleToClaim(false);
            } else {
                setEligibleToClaim(true);
                // Call the ERC721 claim function and pass in the proof
                const tx = claimNft(library!, tokenId!, merkleProof);
                const hash = await toastPromise(tx);
                setTxHash(hash);
            }
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

    return (
        <div className="flex flex-wrap justify-center items-center w-full h-full">
            <div className="w-1/2 bg-gray-200 rounded shadow-2xl p-8 m-4"> 
                {hasCheckedEligibility && !eligibleToClaim &&
                    <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                        You are not eligible to claim the NFT!
                    </p>
                }
                {hasCheckedEligibility && eligibleToClaim &&
                    <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                        You are eligible to claim the NFT!
                    </p>
                }
                {txHash &&
                    <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                        Your NFT has been claimed! <a href={`${ETHERSCAN_BASE}/tx/${txHash}`} target="_blank" rel="noreferrer">View the tx!</a>
                    </p>
                }
                <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                    {/* Errors would go here */}
                </p>
                <button type="submit" className="bg-gray-500 hover:bg-red-500 shadow-sm px-4 py-2 text-xs sm:text-sm text-white font-bold focus:outline-none rounded" onClick={onClick}>Claim NFT</button>
            </div>
        </div>
    );
}

export default NftClaimForm;
