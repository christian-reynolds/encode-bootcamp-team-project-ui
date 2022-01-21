import { useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, toastPromise } from "../utils";
import { ZERO_ADDRESS } from "../utils/constants";
import { getTokensForAccount } from "../utils/tokens";
import { addFile } from "../utils/ipfs";
import { deployErc721 } from "../utils/web3";
import { getMerkleRoot } from "../utils/merkle";

type Params = 'tokenId';

function NftCreationForm() {
    const { library } = useWeb3React<providers.Web3Provider>();
    const params = useParams<Params>();
    const navigate = useNavigate();
    const tokenId = params.tokenId;
    const { account } = useWeb3React<providers.Web3Provider>();
    const [selectedFile, setSelectedFile] = useState<File>();
    const [ipfsUrl, setIpfsUrl] = useState('');
    // const [fileBuffer, setFileBuffer] = useState<File>();

    // On file select (from the pop up)
    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const file = event.target.files && event.target.files[0];
        // Update the state
        setSelectedFile(file!);
    };

    const onClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        console.log('selectedFile: ', selectedFile);

        // Upload the image to IPFS
        const url = await addFile(selectedFile);
        setIpfsUrl(url);
        console.log('ipfsUrl: ', url);
        
        // TODO: Get the ERC20 owners

        // TODO: Pass the ERC20 owners into the getMerkleRoot function
        // Create the Merkle Tree and get the Merkle Root
        const merkleRoot = await getMerkleRoot();

        // Deploy the ERC721 contract
        const tx = deployErc721(library!, "This is test", "TST", url, merkleRoot);
        const contractAddr = await toastPromise(tx);
        console.log('contractAddr: ', contractAddr);
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
            <div className="w-full bg-gray-200 rounded shadow-2xl p-8 m-4"> 
                {ipfsUrl &&
                    <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                        Your image has been uploaded to IPFS! <a href={ipfsUrl} target="_blank">{ipfsUrl}</a>
                    </p>
                }
                <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                    {/* Errors would go here */}
                </p>
                <div className="flex flex-col mb-4">
                    <label className="mb-2 font-bold text-lg text-left text-gray-600">Select Image</label>
                    <input className="border py-2 px-3 text-sm text-black" placeholder="Select Image" type="file" onChange={onFileChange} />
                </div>
                <button type="submit" className="block bg-gray-400 hover:bg-gray-600 text-white uppercase text-sm mx-auto p-4 rounded" onClick={onClick}>Create NFT</button>
            </div>
        </div>
    );
}

export default NftCreationForm;
