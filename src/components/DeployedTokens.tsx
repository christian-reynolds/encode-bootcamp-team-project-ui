interface Props {
    deployedTokens: string;
}

function DeployedTokens({ deployedTokens }: Props) {
    if (!deployedTokens) return null;
    const deployedTokensObj = JSON.parse(deployedTokens);
    if (deployedTokensObj.length === 0) return null;

    return (
        <div>
            <br />
            <h3 className="font-bold text-center text-base">DEPLOYED TOKENS</h3>
            <div className="w-full">
                <table className="table-fixed w-full text-base">
                    <tbody>
                        {deployedTokensObj.map((contract: string) => (<tr key={contract}><td><a href={`/token/${contract}`}>{contract}</a></td></tr>))}
                    </tbody>
                </table>
            </div>
        </div>
    );
  }
  
  export default DeployedTokens;