import axios from "axios";

export interface ContractObject {
    address: string;
    nftAddress?: string;
    createdBlock?: number;
};

export const saveContract = async (contract: ContractObject) => {
    axios.post('http://localhost:8081/contracts/create-contract', contract)
        .then(res => console.log('Saved to db! ', res.data))
        .catch(err => console.log('Error saving to db!', err));
};