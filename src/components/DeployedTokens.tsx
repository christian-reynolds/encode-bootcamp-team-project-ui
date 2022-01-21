interface Props {
    deployedTokens: string;
}

function DeployedTokens({ deployedTokens }: Props) {
    if (!deployedTokens) return null;
    const deployedTokensObj = JSON.parse(deployedTokens);
    if (deployedTokensObj.length === 0) return null;

    return (
        <div className="flex flex-wrap justify-center items-center w-full">
            <div className="w-full bg-gray-200 rounded shadow-2xl p-8 m-4">
                <h3 className="font-bold text-center text-2xl">Deployed Stock Contracts</h3>
                <div className="flex flex-col mb-4 w-full text-gray-600">
                    {deployedTokensObj.map((contract: string) => (<tr key={contract}><td><a href={`/token/${contract}`}>{contract}</a></td></tr>))}
                </div>
            </div>
        </div>
    );
  }
  
  export default DeployedTokens;
  