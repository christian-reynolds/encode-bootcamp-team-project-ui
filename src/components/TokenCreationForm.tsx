import { useForm, SubmitHandler } from "react-hook-form";
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { deployErc20 } from '../utils/web3';
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
            const tx = deployErc20(library!, data.name, data.symbol, data.supply);
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
        <>
            {library &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-wrap justify-center items-center w-full">
                        <div className="w-full bg-gray-200 rounded shadow-2xl p-8 m-4"> 
                            {txComplete &&
                                <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                                    Your stock has been created!
                                </p>
                            }
                            <p className="block w-full text-center text-red-400 text-base font-bold mb-6">
                                {errors.name && <div>Stock name is required</div>}
                                {errors.symbol && <div>Stock symbol is required</div>}
                                {errors.supply && <div>Stock supply is required and must be greater than zero</div>}
                            </p>
                            <div className="flex flex-col mb-4">
                                <label className="mb-2 font-bold text-lg text-left text-gray-600">Stock Name</label>
                                <input className="border py-2 px-3 text-sm text-black" {...register("name", { required: true, maxLength: 20 })} placeholder="Stock Name" />
                            </div>
                            <div className="flex flex-col mb-4">
                                <label className="mb-2 font-bold text-lg text-left text-gray-600">Stock Symbol</label>
                                <input className="border py-2 px-3 text-sm text-black" {...register("symbol", { required: true, pattern: /^[A-Za-z]+$/i, max: 5 })} placeholder="Stock Symbol" />
                            </div>
                            <div className="flex flex-col mb-4">
                                <label className="mb-2 font-bold text-lg text-left text-gray-600">Stock Supply</label>
                                <input className="border py-2 px-3 text-sm text-black" type="number" {...register("supply", { required: true, min: 1 })} placeholder="Stock Supply" />
                            </div>
                            <Button label="Deploy Stock" className="block bg-gray-400 hover:bg-gray-600 text-white uppercase text-sm mx-auto p-4 rounded" />
                        </div>
                    </div>
                </form>
            }
        </>
    );
}

export default TokenCreationForm;
