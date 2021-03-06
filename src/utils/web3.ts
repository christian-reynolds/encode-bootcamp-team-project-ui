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

  const block = await provider.getBlockNumber();
  console.log('block: ', block);
  console.log('contract.address: ', contract.address);
  return { address: contract.address, blockNum: block };
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
  const contract = new Contract(contractAddress, BASE_ERC721.abi, provider.getSigner());

  const tx = await contract.claim(proof);
  await tx.wait();
  
  console.log("claimNft: ", tx.hash);
  return tx.hash;
};

export const getTotalDividends = async (provider: providers.Web3Provider, contractAddress: string) => {
  const contract = new Contract(contractAddress, BASE_ERC20.abi, provider);

  // TODO: This is currently returning an incorrect value.  For now I will just get the contract balance
  // const data = await contract.totalDividends();
  const data = await provider.getBalance(contractAddress);
  
  console.log("getTotalDividends: ", utils.formatEther(data));
  return utils.formatEther(data);
};

export const addDividends = async (provider: providers.Web3Provider, contractAddress: string, amount: string) => {
  const contract = new Contract(contractAddress, BASE_ERC20.abi, provider.getSigner());

  const tx = await contract.depositDividends({
    value: utils.parseEther(amount)
  });
  await tx.wait();
  
  console.log("addDividends: ", tx.hash);
  return tx.hash;
};

export const getClaimableDividend = async (provider: providers.Web3Provider, contractAddress: string, address: string) => {
  const contract = new Contract(contractAddress, BASE_ERC20.abi, provider);

  const data = await contract.dividendBalanceOf(address);
  
  console.log("getClaimableDividend: ", utils.formatEther(data));
  return utils.formatEther(data);
};

export const claimDividend = async (provider: providers.Web3Provider, contractAddress: string) => {
  const contract = new Contract(contractAddress, BASE_ERC20.abi, provider.getSigner());

  const tx = await contract.claimDividend();
  await tx.wait();
  
  console.log("claimDividend: ", tx.hash);
  return tx.hash;
};
