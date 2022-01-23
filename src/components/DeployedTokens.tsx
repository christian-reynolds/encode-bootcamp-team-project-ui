import { shortenAddress } from "../utils/web3";

interface Props {
    deployedTokens: string;
}

function DeployedTokens({ deployedTokens }: Props) {
    if (!deployedTokens) return null;
    const deployedTokensObj = JSON.parse(deployedTokens);
    if (deployedTokensObj.length === 0) return null;

    return (
        <div className="w-1/2 bg-gray-200 rounded shadow-2xl p-8 m-4">
            <h3 className="font-bold text-center text-2xl">Deployed Stock Contracts</h3>
            {
                deployedTokensObj.map(
                    (contract: string) =>
                        (
                            <div className="grid grid-cols-2 p-2 m-2">
                                <div>
                                    <a href={`/token/${contract}`} target="_blank">Manage {shortenAddress(contract)}</a>
                                </div>
                                <div>
                                <a href={`/nft/${contract}`} target="_blank">Create NFT</a>
                                </div>
                            </div>
                        )
                    )
            }
        </div>
    );
  }
  
  export default DeployedTokens;
  