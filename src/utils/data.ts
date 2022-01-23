import axios from "axios";
import { REST_API_BASE } from "./constants";

export interface ContractObject {
    _id?: string;
    address: string;
    nftAddress?: string;
    createdBlock: number;
};

export const getContract = async (address: string) => {
    try {
        const response = await axios.get(`${REST_API_BASE}contracts/get-contract/${address}`);
        return response.data;
      } catch (error) {
        console.error(error);
      }
};

export const saveContract = async (contract: ContractObject) => {
    axios.post(`${REST_API_BASE}contracts/create-contract`, contract)
        .then(res => console.log('Saved to db! ', res.data))
        .catch(err => console.log('Error saving to db!', err));
};

export const updateContract = async (contract: ContractObject) => {
    axios.put(`${REST_API_BASE}contracts/update-contract/${contract._id}`, contract)
        .then(res => console.log('Saved to db! ', res.data))
        .catch(err => console.log('Error saving to db!', err));
};
