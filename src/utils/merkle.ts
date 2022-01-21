import axios from 'axios';

export const getMerkleRoot = async () => {
    // TODO: Replace the query strings with the actual ERC20 owners
    const response = await axios.get("http://localhost:8081/merkle?address[]=0x41fACac9f2aD6483a2B19F7Cb34Ef867CD17667D&address[]=0x5178E1848AaFB9a1e8C7370205B2B6e680eCa323&address[]=0xA93Fbde736Be952019a3c32cFCc2065c1B2AcDf1");
    console.log('hitApi: ', response.data);
    return response.data;
};