import axios from 'axios';

export const getMerkleRoot = async (contractAddress: string) => {
    // TODO: Replace the query strings with the actual ERC20 owners
    const response = await axios.get(`http://localhost:8081/merkle/${contractAddress}`);
    console.log('hitApi: ', response.data);
    return response.data;
};