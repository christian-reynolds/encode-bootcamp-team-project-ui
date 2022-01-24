import { useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, toastPromise } from "../utils";
import { ETHERSCAN_BASE, ZERO_ADDRESS } from "../utils/constants";
import { getTokensForAccount } from "../utils/tokens";
import { addFile } from "../utils/ipfs";
import { deployErc721 } from "../utils/web3";
import { getMerkleRoot } from "../utils/merkle";
import { useAsync } from "react-async-hook";
import { getContract, updateContract } from "../utils/data";

type Params = 'tokenId';

function DividendManagement() {
    const { library, account } = useWeb3React<providers.Web3Provider>();
    const params = useParams<Params>();
    const navigate = useNavigate();
    const tokenId = params.tokenId;
    const [selectedFile, setSelectedFile] = useState<File>();
    const [ipfsUrl, setIpfsUrl] = useState('');
    const [deployedNft, setDeployedNft] = useState('');
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');

    const { result: mongoObj } = useAsync(getContract, [tokenId!]);

    const nameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value);
    const symbolOnChange = (event: React.ChangeEvent<HTMLInputElement>) => setSymbol(event.target.value);

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
        
        // Create the Merkle Tree and get the Merkle Root
        const merkleRoot = await getMerkleRoot(tokenId!);

        // Deploy the ERC721 contract
        const tx = deployErc721(library!, name, symbol, url, merkleRoot);
        const contractAddr = await toastPromise(tx);
        console.log('contractAddr: ', contractAddr);
        setDeployedNft(contractAddr)

        // Update the database
        const update = {
            _id: mongoObj._id,
            address: mongoObj.address,
            nftAddress: contractAddr,
            createdBlock: mongoObj.createdBlock
        };
        updateContract(update);
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
                {ipfsUrl && deployedNft &&
                    <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                        Your image has been uploaded to IPFS! <a href={ipfsUrl} target="_blank">{ipfsUrl}</a><br /><br />
                        <a href={`${ETHERSCAN_BASE}/address/${deployedNft}`} target="_blank" rel="noreferrer">View the contract on Etherscan!</a><br /><br />
                        <a href={`/nft/${tokenId}/claim`} target="_blank">NFT Claim link!</a>
                    </p>
                }
                {/* <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                    Errors would go here
                </p> */}
                <div className="flex flex-col mb-4">
                    <label className="mb-2 font-bold text-lg text-left text-gray-600">NFT Name</label>
                    <input className="border py-2 px-3 text-sm text-black" placeholder="NFT Name" type="text" onChange={nameOnChange} />
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-2 font-bold text-lg text-left text-gray-600">NFT Symbol</label>
                    <input className="border py-2 px-3 text-sm text-black" placeholder="NFT Symbol" type="text" onChange={symbolOnChange} />
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-2 font-bold text-lg text-left text-gray-600">Select Image</label>
                    <input className="border py-2 px-3 text-sm text-black" placeholder="Select Image" type="file" onChange={onFileChange} />
                </div>
                <button type="submit" className="block bg-gray-400 hover:bg-gray-600 text-white uppercase text-sm mx-auto p-4 rounded" onClick={onClick}>Create NFT</button>
            </div>
        </div>
    );
}

export default DividendManagement;
