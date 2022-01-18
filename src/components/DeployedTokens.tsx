import { ReactChild, ReactFragment, ReactPortal, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';

interface Props {
    deployedTokens: string;
}

function DeployedTokens({ deployedTokens }: Props) {
    if (!deployedTokens) return null;
    const deployedTokensObj = JSON.parse(deployedTokens);
    if (deployedTokensObj.length === 0) return null;

    return (
        <div>
            <h3 className="font-bold text-center text-base">DEPLOYED TOKENS</h3>
            <div className="w-full xl:w-4/5 mx-auto">
                <table className="table-fixed w-full text-base">
                    <tbody>
                        {deployedTokensObj.map((contract: string) => (<tr><td>{contract}</td></tr>))}
                    </tbody>
                </table>
            </div>
        </div>
    );
  }
  
  export default DeployedTokens;