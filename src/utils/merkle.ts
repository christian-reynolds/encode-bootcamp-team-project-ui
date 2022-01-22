import axios from 'axios';

export const getMerkleRoot = async (contractAddress: string) => {
    const response = await axios.get(`http://localhost:8081/merkle/${contractAddress}`);
    console.log('Merkle Root: ', response.data);
    return response.data;
};

export const getMerkleProof = async (contractAddress: string, claimAddress: string) => {
    const response = await axios.get(`http://localhost:8081/merkle-proof/${contractAddress}/${claimAddress}`);
    console.log('Merkle Proof: ', response.data);
    return response.data;
};
