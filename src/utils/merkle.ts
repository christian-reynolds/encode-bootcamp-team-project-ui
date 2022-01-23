import axios from 'axios';
import { REST_API_BASE } from './constants';

export const getMerkleRoot = async (contractAddress: string) => {
    const response = await axios.get(`${REST_API_BASE}merkle/${contractAddress}`);
    console.log('Merkle Root: ', response.data);
    return response.data;
};

export const getMerkleProof = async (contractAddress: string, claimAddress: string) => {
    const response = await axios.get(`${REST_API_BASE}merkle-proof/${contractAddress}/${claimAddress}`);
    console.log('Merkle Proof: ', response.data);
    return response.data;
};
