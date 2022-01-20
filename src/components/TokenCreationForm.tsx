import { useForm, SubmitHandler } from "react-hook-form";
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { deployContract } from '../utils/web3';
import Button from "./common/Button";
import { toast, toastPromise } from "../utils";
import { useState } from "react";

interface IFormInput {
    name: string;
    symbol: string;
    supply: string;
}

interface Props {
    accountStorage: string;
    deployedTokens: string;
    getDeployedTokens: () => void;
}

function TokenCreationForm({ accountStorage, deployedTokens, getDeployedTokens }: Props) {
    const { library } = useWeb3React<providers.Web3Provider>();
    const [txComplete, setTxComplete] = useState(false);
    const { register, formState: { errors }, handleSubmit } = useForm<IFormInput>();
    
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            setTxComplete(false);
            const tx = deployContract(library!, data.name, data.symbol, data.supply);
            const contractAddr = await toastPromise(tx);
            const contracts = [contractAddr];
            setTxComplete(true);            

            if (deployedTokens) {
                const retrievedObj = JSON.parse(deployedTokens);
                localStorage.setItem(accountStorage, JSON.stringify([...retrievedObj, ...contracts]));
            } else {
                localStorage.setItem(accountStorage, JSON.stringify(contracts));
            }

            getDeployedTokens();
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
        <div>
            {library &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex justify-center align-middle items-center">
                        <div className="w-full text-lg text-red-500">
                            {txComplete && <div>Your stock has been created!</div>}
                        </div>
                    </div>
                    <div className="flex justify-center align-middle items-center">
                        <div className="w-full text-lg text-red-500">
                            {errors.name && <div>Stock name is required</div>}
                            {errors.symbol && <div>Stock symbol is required</div>}
                            {errors.supply && <div>Stock supply is required and must be greater than zero</div>}
                        </div>
                    </div>
                    <div className="flex justify-center align-middle items-center">
                        <div className="border-2 p-2 my-2">
                            <div className="grid grid-cols-1 items-center px-4 text-lg font-bold text-black">
                                <input {...register("name", { required: true, maxLength: 20 })} placeholder="Stock Name" className="px-1" />
                            </div>
                        </div>
                        <div className="border-2 p-2 my-2">
                            <div className="grid grid-cols-1 items-center px-4 text-lg font-bold text-black">
                                <input {...register("symbol", { required: true, pattern: /^[A-Za-z]+$/i, max: 5 })} placeholder="Stock Symbol" className="px-1" />
                            </div>
                        </div>
                        <div className="border-2 p-2 my-2">
                            <div className="grid grid-cols-1 items-center px-4 text-lg font-bold text-black">
                                <input type="number" {...register("supply", { required: true, min: 1 })} placeholder="Stock Supply" className="px-1" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 items-center px-4 text-lg font-bold">
                            <Button label="Deploy Stock" />
                        </div>
                    </div>
                </form>                
            }
        </div>
    );
}

export default TokenCreationForm;
