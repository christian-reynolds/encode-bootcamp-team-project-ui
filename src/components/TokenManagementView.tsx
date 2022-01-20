import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { useState } from 'react';
import TextboxDynamic from './common/TextboxDynamic';
import { Input } from '../utils/interfaces';
import { callContractView } from '../utils/web3';
import { toast, toastPromise } from "../utils";

interface Props {
    functionName: string;
    inputs: Input[];
    tokenId: string;
}

function TokenManagementView({ functionName, inputs, tokenId }: Props) {
    const { library } = useWeb3React<providers.Web3Provider>();
    const [inputValue, setInputValue] = useState({});
    const [data, setData] = useState('');
    
    const onClick = async () => {
        try {
            setData('');
            const tx = callContractView(library!, tokenId!, functionName, Object.values(inputValue));
            setData(await toastPromise(tx));
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
            {data &&
                <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                    {data}
                </p>
            }
            {inputs.map((item) => (
                <div className="flex flex-col mb-4">
                    <label className="mb-2 font-bold text-lg text-gray-900" htmlFor={item.name}>{item.name} ({item.type})</label>
                    {/* <input className="border py-2 px-3 text-black" type="text" name={item.name} id={item.name} onChange={onChange} /> */}
                    <TextboxDynamic label={item.name} update={setInputValue} className="border py-2 px-3 text-black" />
                </div>
            ))}
            <button className="block bg-teal-400 hover:bg-teal-600 text-white uppercase text-lg mx-auto p-4 rounded" onClick={onClick}>Read</button>
        </div>
    );
}

export default TokenManagementView;
