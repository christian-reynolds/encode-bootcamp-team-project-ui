import { providers, ContractFactory, utils, Contract } from 'ethers';
import BASE_ERC20 from './BaseErc20.json';
import BASE_ERC721 from './BaseErc721.json';

export const getLibrary = (provider: any) => new providers.Web3Provider(provider);

export const lookupEnsName = async (address: string, provider: providers.Provider) => {
  try {
    return await provider.lookupAddress(address);
  } catch {
    return undefined;
  }
};

export const shortenAddress = (address: string) => `${address.substr(0, 6)}...${address.substr(address.length - 4, 4)}`;

export const displayAddress = async (address?: string | null, provider?: providers.Web3Provider) => {
  if (!address) return undefined;
  const ensName = provider && await lookupEnsName(address, provider);
  return ensName ?? shortenAddress(address);
};

export const deployErc20 = async (provider: providers.Web3Provider, name: string, symbol: string, supply: string) => {
  const factory = new ContractFactory(BASE_ERC20.abi, BASE_ERC20.bytecode, provider.getSigner());
  const contract = await factory.deploy(name, symbol, utils.parseUnits(supply));
  await contract.deployed();
  
  console.log('contract.address: ', contract.address);
  return contract.address;
};

export const deployErc721 = async (provider: providers.Web3Provider, name: string, symbol: string, baseUrl: string, merkleRoot: string) => {
  const factory = new ContractFactory(BASE_ERC721.abi, BASE_ERC721.bytecode, provider.getSigner());
  const contract = await factory.deploy(name, symbol, baseUrl, "0x".concat(merkleRoot));
  await contract.deployed();
  
  console.log('contract.address: ', contract.address);
  return contract.address;
};

export const callContractWrite = async (provider: providers.Web3Provider, contractAddress: string, functionName: string, funcParams: string[]) => {
  const contract = new Contract(contractAddress, BASE_ERC20.abi, provider.getSigner());
  const tx = await contract[functionName](...funcParams);
  await tx.wait();

  console.log(functionName + ": ", tx.hash);
  return tx.hash;
};

export const callContractView = async (provider: providers.Web3Provider, contractAddress: string, functionName: string, funcParams: string[]) => {
  const contract = new Contract(contractAddress, BASE_ERC20.abi, provider);
  const data = await contract[functionName](...funcParams);
  
  console.log("data: ", String(data));
  return String(data);
};

export const claimNft = async (provider: providers.Web3Provider, contractAddress: string, proof: string[]) => {
  // TODO: Figure out how to get the ERC721 contract address and replace the hardcoded address
  const contract = new Contract("0xd88f791bf1e939727d7e4f9027c1cfbe0029f5b0", BASE_ERC721.abi, provider.getSigner());
  // TODO: Fix the error that is happening with passing the proof to the function

  const test = ["0x58248f99b36b9446b2bd4020733ba808a3d9c153921f6465355d66211abb6d2d","0x4cf12ef96bfa6e34bd3489454bbf83e126c31d9ef6aa336129f61468b5c33d5a","0xf2a9ab8585283349d100869437e350504785f4bdd9d5420846e6c4c33c5dbe61","0x39fafd32ee8531d5959eee929a7466ff842e69f5e3456de6d3881a99eceeb0b5","0x26d11ba94fce02cb28e0eed5854aff9032f9b552b49d4671c1e5f6ccd5d87f0c","0xa9dbaa6573d178b663971ca135e9653b55c90e86909fd52535af7a54e5427ae2"];

  const tx = await contract.claim(test);
  await tx.wait();
  
  console.log("claimNft: ", tx.hash);
  return tx.hash;
};
