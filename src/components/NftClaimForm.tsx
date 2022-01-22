import { useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toastPromise } from "../utils";
import { getMerkleProof } from "../utils/merkle";
import { claimNft } from "../utils/web3";

type Params = 'tokenId';

function NftClaimForm() {
    const { library, account } = useWeb3React<providers.Web3Provider>();
    const [hasCheckedEligibility, setHasCheckedEligibility] = useState(false);
    const [eligibleToClaim, setEligibleToClaim] = useState(false);
    const params = useParams<Params>();
    const navigate = useNavigate();
    const tokenId = params.tokenId;

    const onClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setHasCheckedEligibility(true);

        // Get the proof that will be sent to the ERC721 claim function
        const merkleProof = await getMerkleProof(tokenId!, account!);

        if (merkleProof) {
            setEligibleToClaim(true);
            // Call the ERC721 claim function and pass in the proof
            const tx = claimNft(library!, tokenId!, merkleProof);
            const txHash = await toastPromise(tx);
            console.log('txHash: ', txHash);
        } else {
            setEligibleToClaim(false);
        }
    };

    return (
        <div className="flex flex-wrap justify-center items-center w-full">
            <div className="w-full bg-gray-200 rounded shadow-2xl p-8 m-4"> 
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
                <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                    {/* Errors would go here */}
                </p>
                <button type="submit" className="block bg-gray-400 hover:bg-gray-600 text-white uppercase text-sm mx-auto p-4 rounded" onClick={onClick}>Claim NFT</button>
            </div>
        </div>
    );
}

export default NftClaimForm;
