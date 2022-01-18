import { useForm, SubmitHandler } from "react-hook-form";
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { deployContract } from '../utils/web3';
import Button from "./common/Button";

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
    const { account, library } = useWeb3React<providers.Web3Provider>();

    const { register, formState: { errors }, handleSubmit } = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        const contractAddr = await deployContract(library!, data.name, data.symbol, data.supply);
        const contracts = [contractAddr];

        if (deployedTokens) {
            const retrievedObj = JSON.parse(deployedTokens);
            localStorage.setItem(accountStorage, JSON.stringify([...retrievedObj, ...contracts]));
        } else {
            localStorage.setItem(accountStorage, JSON.stringify(contracts));
        }

        getDeployedTokens();
    };

    return (
        <div>
            {library &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex justify-center align-middle items-center">
                        <div className="w-full text-lg text-red-500">
                            {errors.name && <div>Token name is required</div>}
                            {errors.symbol && <div>Token symbol is required</div>}
                            {errors.supply && <div>Token supply is required and must be greater than zero</div>}
                        </div>
                    </div>
                    <div className="flex justify-center align-middle items-center">
                        <div className="border-2 p-2 my-2">
                            <div className="grid grid-cols-1 items-center px-4 text-lg font-bold text-black">
                                <input {...register("name", { required: true, maxLength: 20 })} placeholder="Token Name" className="px-1" />
                            </div>
                        </div>
                        <div className="border-2 p-2 my-2">
                            <div className="grid grid-cols-1 items-center px-4 text-lg font-bold text-black">
                                <input {...register("symbol", { required: true, pattern: /^[A-Za-z]+$/i, max: 5 })} placeholder="Token Symbol" className="px-1" />
                            </div>
                        </div>
                        <div className="border-2 p-2 my-2">
                            <div className="grid grid-cols-1 items-center px-4 text-lg font-bold text-black">
                                <input type="number" {...register("supply", { required: true, min: 1 })} placeholder="Token Supply" className="px-1" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 items-center px-4 text-lg font-bold">
                            <Button label="Deploy Token" />
                        </div>
                    </div>
                </form>                
            }
        </div>
    );
}

export default TokenCreationForm;