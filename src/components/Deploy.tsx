import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { deployContract } from '../utils/web3';
import Button from "./common/Button";
import Textbox from "./common/Textbox";

function Deploy() {
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [supply, setSupply] = useState('');

    const nameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value);
    const symbolOnChange = (event: React.ChangeEvent<HTMLInputElement>) => setSymbol(event.target.value);
    const supplyOnChange = (event: React.ChangeEvent<HTMLInputElement>) => setSupply(event.target.value);

    const { library } = useWeb3React<providers.Web3Provider>();

    return (
        <div>
            {library &&
                [
                    <Textbox label="Token Name" onChange={nameOnChange} />,
                    <Textbox label="Token Symbol" onChange={symbolOnChange} />,
                    <Textbox label="Token Supply" onChange={supplyOnChange} />,
                    <Button label="Deploy Contract" className="test" onClick={() => deployContract(library!, name, symbol, Number(supply))} />
                ]
            }
        </div>
    );
}

export default Deploy;