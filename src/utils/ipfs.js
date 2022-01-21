import { create } from 'ipfs-http-client';

// connect to a different API
const client = create('https://ipfs.infura.io:5001/api/v0');

export const addFile = async(file) => {
    const added = await client.add(file);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    
    return url;
};