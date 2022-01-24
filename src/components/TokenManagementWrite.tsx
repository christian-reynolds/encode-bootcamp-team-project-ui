import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { useState } from 'react';
import TextboxDynamic from './common/TextboxDynamic';
import { Input } from '../utils/interfaces';
import { callContractWrite } from '../utils/web3';
import { toast, toastPromise } from "../utils";
import { ETHERSCAN_BASE } from '../utils/constants';
import Button from './common/Button';

interface Props {
    functionName: string;
    inputs: Input[];
    tokenId: string;
}

function TokenManagementWrite({ functionName, inputs, tokenId }: Props) {
    const { library } = useWeb3React<providers.Web3Provider>();
    const [inputValue, setInputValue] = useState({});
    const [txHash, setTxHash] = useState('');

    // const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = event.target;
    //     setInputValue(prevState => ({ ...prevState, [name]: value }));
    //   };
    
    const onClick = async () => {
        try {
            setTxHash('');
            const tx = callContractWrite(library!, tokenId!, functionName, Object.values(inputValue));
            const hash = await toastPromise(tx);
            console.log('hash: ', hash);
            setTxHash(hash);
        } catch (error: any) {
            if (!(error.code && error.code === 4001)) {
                toast('Something went horribly wrong!', {
                    position: 'top-center',
                    className: 'bg-red-500',
                    icon: '🤯',
                });
            }
        }
    };

    return (
        <div className="w-1/2 bg-gray-200 rounded shadow-2xl p-8 m-4"> 
            <h1 className="block w-full text-left text-gray-800 text-2xl font-bold mb-6">{functionName}</h1>
            {txHash &&
                <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                    Transaction completed successfully! <a href={`${ETHERSCAN_BASE}/tx/${txHash}`} target="_blank" rel="noreferrer">View the tx!</a>
                </p>
            }
            {inputs.map((item) => (
                <div className="flex flex-col mb-4">
                    <label className="mb-2 font-bold text-lg text-left text-gray-600" htmlFor={item.name}>{item.name}</label>
                    <TextboxDynamic label={item.type} update={setInputValue} className="border py-2 px-3 text-sm text-black" />
                </div>
            ))}
            <Button label="Write" onClick={onClick} />
        </div>
    );
}

export default TokenManagementWrite;
