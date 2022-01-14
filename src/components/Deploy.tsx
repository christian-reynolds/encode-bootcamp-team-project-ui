import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { deployContract } from '../utils/web3';
import Button from "./common/Button";

function Deploy() {
    const { library } = useWeb3React<providers.Web3Provider>();

    return (
        <div>
            {library && <Button label="Deploy Contract" className="test" onClick={() => deployContract(library!)} />}
        </div>
    );
}

export default Deploy;