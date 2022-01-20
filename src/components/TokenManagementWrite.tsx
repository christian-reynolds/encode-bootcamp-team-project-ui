import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { useState } from 'react';
import TextboxDynamic from './common/TextboxDynamic';
import { Input } from '../utils/interfaces';
import { callContractWrite } from '../utils/web3';
import { toast, toastPromise } from "../utils";
import { ETHERSCAN_BASE } from '../utils/constants';

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
        <div className="w-1/2 bg-white rounded shadow-2xl p-8 m-4"> 
            <h1 className="block w-full text-center text-gray-800 text-2xl font-bold mb-6">{functionName}</h1>
            {txHash &&
                <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                    Transaction completed successfully! <a href={`${ETHERSCAN_BASE}/tx/${txHash}`} target="_blank" rel="noreferrer">View the tx!</a>
                </p>
            }
            {inputs.map((item) => (
                <div className="flex flex-col mb-4">
                    <label className="mb-2 font-bold text-lg text-gray-900" htmlFor={item.name}>{item.name} ({item.type})</label>
                    {/* <input className="border py-2 px-3 text-black" type="text" name={item.name} id={item.name} onChange={onChange} /> */}
                    <TextboxDynamic label={item.name} update={setInputValue} className="border py-2 px-3 text-black" />
                </div>
            ))}
            <button className="block bg-teal-400 hover:bg-teal-600 text-white uppercase text-lg mx-auto p-4 rounded" onClick={onClick}>Write</button>
        </div>
    );
}

export default TokenManagementWrite;
