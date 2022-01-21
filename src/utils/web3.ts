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

export const deployErc721 = async (provider: providers.Web3Provider, name: string, symbol: string, baseUrl: string) => {
  const factory = new ContractFactory(BASE_ERC721.abi, BASE_ERC721.bytecode, provider.getSigner());
  // TODO: Replace last parameter with the actual Merkle Root
  const contract = await factory.deploy(name, symbol, baseUrl, "0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712");
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
