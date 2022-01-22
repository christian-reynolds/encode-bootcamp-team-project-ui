import { useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toastPromise } from "../utils";
import { getMerkleRoot } from "../utils/merkle";

type Params = 'tokenId';

function NftClaimForm() {
    const { library, account } = useWeb3React<providers.Web3Provider>();
    const [nftClaimed, setNftClaimed] = useState('');
    const params = useParams<Params>();
    const navigate = useNavigate();
    const tokenId = params.tokenId;

    const onClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        // Create the Merkle Tree and get the Merkle Root
        const merkleRoot = await getMerkleRoot(tokenId!);

        // Deploy the ERC721 contract
        // const tx;
        // const contractAddr = await toastPromise(tx);
        // console.log('contractAddr: ', contractAddr);
    };

    return (
        <div className="flex flex-wrap justify-center items-center w-full">
            <div className="w-full bg-gray-200 rounded shadow-2xl p-8 m-4"> 
                {nftClaimed &&
                    <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                        {nftClaimed}
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
