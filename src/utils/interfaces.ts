export interface Input {
    internalType: string;
    name: string;
    type: string;
    indexed?: boolean;
}

export interface Output {
    internalType: string;
    name: string;
    type: string;
}

export interface ContractAbi {
    inputs: Input[];
    stateMutability: string;
    type: string;
    anonymous?: boolean;
    name: string;
    outputs: Output[];
}