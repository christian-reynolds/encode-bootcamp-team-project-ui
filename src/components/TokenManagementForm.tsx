import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { useState } from 'react';
import { toast as doToast } from 'react-toastify';
import TextboxDynamic from './common/TextboxDynamic';
import { Input } from '../utils/interfaces';
import { callContractFunction } from '../utils/web3';
import { toast } from "../utils";

interface Props {
    functionName: string;
    inputs: Input[];
    tokenId: string;
}

function TokenManagementForm({ functionName, inputs, tokenId }: Props) {
    const { account, library } = useWeb3React<providers.Web3Provider>();
    const [inputValue, setInputValue] = useState({});

    // const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = event.target;
    //     setInputValue(prevState => ({ ...prevState, [name]: value }));
    //   };
    
    const onClick = async () => {
        try {
            const txHash = callContractFunction(library!, tokenId!, functionName, Object.values(inputValue));

            doToast.promise(
                txHash,
                {
                  pending: {
                    render(){
                      return "Transaction pending..."
                    },
                    icon: false,
                    position: 'top-center',
                    className: 'border-2 border-black text-black font-bold font-charriot rounded-none bg-white text-center',
                  },
                  success: {
                    render({data}){
                      return `${functionName} submitted successfully! tx hash: ${data}`
                    },
                    // other options
                    icon: "🟢",
                    className: '',
                  },
                  error: {
                    render({data}){
                      // When the promise reject, data will contains the error
                      console.log((data as any).code);
                        if ((data as any).code && (data as any).code === 4001) {
                            return `${functionName} rejected by user`
                        } else {
                            return `Error! ${data}`
                        }
                    },
                    icon: "🟢",
                    className: 'bg-red-500',
                  }
                }
            );

            // toast(functionName + ' submitted', {
            //     position: 'top-right',
            // });            
        } catch (error: any) {
            if (error.code && error.code === 4001) {
                toast(functionName + ' rejected by user', {
                    position: 'top-center',
                    className: 'bg-red-500',
                });
            } else {
                toast(functionName + ' FAILED', {
                    position: 'top-center',
                    className: 'bg-red-500',
                });
            }
        }
    };

    return (
        <div className="w-1/2 bg-white rounded shadow-2xl p-8 m-4"> 
            <h1 className="block w-full text-center text-gray-800 text-2xl font-bold mb-6">{functionName}</h1>
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

export default TokenManagementForm;
