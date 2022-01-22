const Web3 = require('web3')
//change mainnet to appropriate testnet: ropsten, rinkeby, goerli, kovan
const infura_RPC_URL = "shared_in_discord"
const web3 = new Web3(infura_RPC_URL)
const BASE_ERC20 = require('./BaseErc20.json')

const abi = BASE_ERC20.abi
const address = '0x3f990D28D725D439bd097E8f142C23dd0DCDCb92' //example ERC-20 deployed from our contract
const example_block_number = 1003700 // an example block # from the rinkeby network just before the contract's deployment

const contract = new web3.eth.Contract(abi,address)
//balances dict
balances = {}

async function getBalances() { 
    
    const events = await contract.getPastEvents( 
      'Transfer',{
        fromBlock:  example_block_number, // fromBlock should be the block when the erc-20 contract was deployed
        toBLock: 'latest'}) // toBLock: 'latest'}) 

    //add all addresses to the balances dict
    events.forEach(event=> balances[event.returnValues.to]=0)
    events.forEach(event=>balances[event.returnValues.from]=0)
    //sum all "to" values to each address's balance
    events.forEach(event => balances[event.returnValues.to] = balances[event.returnValues.to] + event.returnValues.value);
    //subtract all "from" values for each address's balance
    events.forEach(event => balances[event.returnValues.from] = balances[event.returnValues.from] - event.returnValues.value)
    //display output
    for(var address in balances) {
        console.log(address,balances[address])
      }
    };

getBalances()
