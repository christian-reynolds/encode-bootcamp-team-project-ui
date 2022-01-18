import { providers, ContractFactory, utils, Contract } from 'ethers';
import BASE_ERC20 from './BaseErc20.json';

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

export const deployContract = async (provider: providers.Web3Provider, name: string, symbol: string, supply: string) => {
  const factory = new ContractFactory(BASE_ERC20.abi, BASE_ERC20.bytecode, provider.getSigner());
  const contract = await factory.deploy(name, symbol, utils.parseUnits(supply));

  console.log('contract.address: ', contract.address);
  return contract.address;
};

export const callFunction = async (provider: providers.Web3Provider, contractAddress: string, functionName: string, walletAddress: string) => {
  const contract = new Contract(contractAddress, BASE_ERC20.abi, provider.getSigner());

  // balanceOf
  const balanceOf = await contract[functionName](walletAddress);
  console.log(functionName + ": ", utils.formatUnits(balanceOf));

  const owner = await contract['owner']();
  console.log('owner: ', owner);

  console.log('symbol: ', await contract.symbol());

  const test = await contract["renounceOwnership"]();
  console.log("renounceOwnership: ", test);
};