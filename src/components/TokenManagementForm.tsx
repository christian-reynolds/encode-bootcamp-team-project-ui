import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { useState } from 'react';
import { Input } from '../utils/interfaces';
import { callFunction } from '../utils/web3';
import Textbox from './common/Textbox';

interface Props {
    name: string;
    inputs: Input[];
    tokenId: string;
}

function TokenManagementForm({ name, inputs, tokenId }: Props) {
    const { account, library } = useWeb3React<providers.Web3Provider>();
    const [inputValue, setInputValue] = useState({});

    // const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = event.target;
    //     setInputValue(prevState => ({ ...prevState, [name]: value }));
    //   };
    
    const callContractFunction = async () => {
        console.log('name: ', name);
        console.log((inputValue as any)._quantity);

        // TODO: Get this fully working using dynamic inputs
        // callFunction(library!, tokenId!, name, account!, (inputValue as any)._quantity);
    };

    return (
        <div className="w-1/2 bg-white rounded shadow-2xl p-8 m-4"> 
            <h1 className="block w-full text-center text-gray-800 text-2xl font-bold mb-6">{name}</h1>
            {inputs.map((item) => (
                <div className="flex flex-col mb-4">
                    <label className="mb-2 font-bold text-lg text-gray-900" htmlFor={item.name}>{item.name} ({item.type})</label>
                    {/* <input className="border py-2 px-3 text-black" type="text" name={item.name} id={item.name} onChange={onChange} /> */}
                    <Textbox label={item.name} update={setInputValue} className="border py-2 px-3 text-black" />
                </div>
            ))}
            <button className="block bg-teal-400 hover:bg-teal-600 text-white uppercase text-lg mx-auto p-4 rounded" onClick={callContractFunction}>Write</button>
        </div>
    );
}

export default TokenManagementForm;