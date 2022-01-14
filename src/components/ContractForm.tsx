import { useForm, SubmitHandler } from "react-hook-form";
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { deployContract } from '../utils/web3';
import Button from "./common/Button";

interface IFormInput {
    name: string;
    symbol: string;
    supply: number;
}

function ContractForm() {
    const { register, formState: { errors }, handleSubmit } = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = data => deployContract(library!, data.name, data.symbol, data.supply);

    const { library } = useWeb3React<providers.Web3Provider>();

    return (
        <div>
            {library &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <input {...register("name", { required: true, maxLength: 20 })} />
                    </div>
                    {errors.name && <div>Token name is required</div>}
                    <div>
                        <input {...register("symbol", { required: true, pattern: /^[A-Za-z]+$/i, max: 5 })} />
                    </div>
                    {errors.symbol && <div>Token symbol is required</div>}
                    <div>
                        <input type="number" {...register("supply", { required: true, min: 1 })} />
                    </div>
                    {errors.supply && <div>Token supply is required and must be greater than zero</div>}
                    <Button label="Deploy Contract" className="test" />
                </form>                
            }
        </div>
    );
}

export default ContractForm;