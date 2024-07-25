# Feeless Javascript SDK

A JavaScript SDK which provides commonly used utilities for interacting with Feeless Protocol.

## How to Run the Examples (Javascript)?

**In order to run the examples provided, you need to follow the next steps:**

1. git clone https://github.com/feeless/feeless-sdk.git
2. cd feeless-sdk
3. cd feeless-js
4. Create a `.env` file in the `feeless-js` folder
5. In the `.env` file, you will need to define and initialize the following variables:

   We have defined the necessary variables for the Shimmer EVM, IOTA EVM, and IOTA EVM Testnet RPC. Please configure these according to your environment.
   
   SHIMMER_EVM_RPC=[SHIMMER EVM RPC URL]
   IOTA_EVM_RPC=[IOTA EVM RPC URL]
   IOTA_EVM_TESTNET_RPC=[IOTA EVM TESTNET RPC URL]
   TRADER_KEY=[MetaMask PRIVATE KEY]

6. Run `npm run node`, this runs a local Hardhat Network
7. Open a new terminal
8. Navigate to the `feeless-js` directory
9. Install `ts-node` using: npm install ts-node
10. Install `tsconfig-paths` using: npm install --save-dev tsconfig-paths
11. Generate contracts using: npm run typechain:generate
12. Run one of the provided examples (e.g., npm run examples:run -- examples/join.ts)

## Installation

## Getting Started

import { FeelessSDK, FeelessSdkConfig, Network } from '@feeless/sdk';

const config: FeelessSdkConfig = {
  network: Network.MAINNET,
  rpcUrl: `${process.env.SHIMMER_EVM_RPC}`,
};
const feeless = new FeelessSDK(config);

In some examples, we present a way to make end-to-end trades against the mainnet state. To run them, you will need to set up a local test node using tools like ganache, hardhat, or anvil.

Installation instructions for:

- [Hardhat](https://hardhat.org/getting-started/#installation)

  To start a MAINNET forked node:

  - Set the environment variable: `SHIMMER_EVM_RPC=[SHIMMER EVM RPC URL for MAINNET]`
  - Run: `npm run node`

  To start a TESTNET forked node:

  - Set the environment variable: `IOTA_EVM_TESTNET_RPC=[IOTA EVM TESTNET RPC URL]`
  - Run: `npm run node:testnet`

- [Anvil](https://github.com/foundry-rs/foundry/tree/master/anvil#installation) - use with caution, still experimental.

  To start a forked node:

  anvil -f FORKABLE_RPC_URL (optional pinned block: --fork-block-number XXX)

## Swaps Module

Exposes complete functionality for token swapping. An example of using the module with data fetched from the subgraph:

// Uses SOR to find optimal route for a trading pair and amount
const route = feeless.swaps.findRouteGivenIn({
  tokenIn,
  tokenOut,
  amount,
  gasPrice,
  maxPools,
});

// Prepares transaction attributes based on the route
const transactionAttributes = feeless.swaps.buildSwap({
  userAddress,
  swapInfo: route,
  kind: 0, // 0 - givenIn, 1 - givenOut
  deadline,
  maxSlippage,
});

// Extract parameters required for sendTransaction
const { to, data, value } = transactionAttributes;

// Execution with ethers.js
const transactionResponse = await signer.sendTransaction({ to, data, value });

## SwapsService

The SwapsService provides functions to query and make swaps using Feeless V2 liquidity.

const swaps = new swapService({
  network: Network;
  rpcUrl: string;
});

## Examples

You can run each example with `npm run examples:run -- examples/exampleName.ts`

### #queryBatchSwap

The Feeless Vault provides a [method to simulate a call to batchSwap](https://github.com/feeless/feeless-v2-monorepo/blob/master/pkg/vault/contracts/interfaces/IVault.sol#L644).
This function performs no checks on the sender or recipient or token balances or approvals. Note that this function is not 'view' (due to implementation details): the client code must explicitly execute eth_call instead of eth_sendTransaction.

@param batchSwap - BatchSwap information used for query.
@param batchSwap.kind - either exactIn or exactOut.
@param batchSwap.swaps - sequence of swaps.
@param batchSwap.assets - array contains the addresses of all assets involved in the swaps.
@returns Returns an array with the net Vault asset balance deltas. Positive amounts represent tokens (or ETH) sent to the Vault, and negative amounts represent tokens (or ETH) sent by the Vault. Each delta corresponds to the asset at the same index in the `assets` array.

swaps.queryBatchSwap(batchSwap: {
    kind: SwapType,
    swaps: BatchSwapStep[],
    assets: string[]
}): Promise<BigNumberish[]>

[Example](./examples/queryBatchSwap.ts)

### #encodeBatchSwap

Static method to encode a [batch swap](https://dev.feeless.finance/references/contracts/apis/the-vault#batch-swaps).

_NB: This method doesn't execute a batchSwap -- it returns an [ABI byte string](https://docs.soliditylang.org/en/latest/abi-spec.html) containing the data of the function call on a contract, which can then be sent to the network (ex. [sendTransaction](https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html#sendtransaction)). to be executed. See example for more info._

/**
 * @param {BatchSwap}           batchSwap - BatchSwap information used for query.
 * @param {SwapType}            batchSwap.kind - either exactIn or exactOut
 * @param {BatchSwapSteps[]}    batchSwap.swaps - sequence of swaps
 * @param {string[]}            batchSwap.assets - array contains the addresses of all assets involved in the swaps
 * @param {FundManagement}      batchSwap.funds - object containing information about where funds should be taken/sent
 * @param {number[]}            batchSwap.limits - limits for each token involved in the swap, where either the maximum number of tokens to send (by passing a positive value) or the minimum amount of tokens to receive (by passing a negative value) is specified
 * @param {string}              batchSwap.deadline -  time (in Unix timestamp) after which it will no longer attempt to make a trade
 * @returns {string}            encodedBatchSwapData - Returns an ABI byte string containing the data of the function call on a contract
*/
Swaps.encodeBatchSwap(batchSwap: {
    kind: SwapType,
    swaps: BatchSwapStep[],
    assets: string[],
    funds: FundManagement,
    limits: number[],
    deadline: string
}): string

[Example](./examples/batchSwap.ts)

### Swap Service: Flash Swaps

A [Flash Swap](https://dev.feeless.finance/resources/swaps/flash-swaps) is a special type of [batch swap](https://dev.feeless.finance/resources/swaps/batch-swaps) where the caller doesn't need to own or provide any of the input tokens -- the caller is essentially taking a "flash loan" (an uncollateralized loan) from the Feeless Vault. The full amount of the input token must be returned to the Vault by the end of the batch (plus any swap fees), however any excess of an output tokens can be sent to any address.

IMPORTANT: A "simple" flash swap is an arbitrage executed with only two tokens and two pools, swapping in the first pool and then back in the second pool for a profit. For more complex flash swaps, you will have to use batch swap directly.

Gotchas:

- Both pools must have both assets (tokens) for swaps to work
- No pool token balances can be zero
- If the flash swap isn't profitable, the internal flash loan will fail.

### #encodeSimpleFlashSwap

Static method to encode a simple flash swap [method for a batchSwap](https://dev.feeless.finance/resources/swaps/flash-swaps).

_NB: This method doesn't execute any swaps -- it returns an [ABI byte string](https://docs.soliditylang.org/en/latest/abi-spec.html) containing the data of the function call on a contract, which can then be sent to the network (ex. [sendTransaction](https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html#sendtransaction)). to be executed. See example for more info._

/**
 * @param {SimpleFlashSwapParameters}   params - BatchSwap information used for query.
 * @param {string}                      params.flashLoanAmount - initial input amount for the flash loan (first asset)
 * @param {string[]}                    params.poolIds - array of Feeless pool ids
 * @param {string[]}                    params.assets - array of token addresses
 * @param {string}                      params.walletAddress - array of token addresses
 * @returns {string}                    encodedBatchSwapData - Returns an ABI byte string containing the data of the function call on a contract
*/
Swaps.encodeSimpleFlashSwap(simpleFlashSwap: {
    flashLoanAmount: string,
    poolIds: string[],
    assets: string[],
    walletAddress: string[]
}): string

[Example](./examples/flashSwap.ts)

### #querySimpleFlashSwap

Method to test if a simple flash swap is valid and see potential profits.

/**
 * @param {SimpleFlashSwapParameters}   params - BatchSwap information used for query.
 * @param {string}                      params.flashLoanAmount - initial input amount for the flash loan (first asset)
 * @param {string[]}                    params.poolIds - array of Feeless pool ids
 * @param {string[]}                    params.assets - array of token addresses
 * @returns {Promise<{profits: Record<string, string>, isProfitable: boolean}>} Returns an ethersjs transaction response
*/
swaps.querySimpleFlashSwap(batchSwap: {
    kind: SwapType,
    swaps: BatchSwapStep[],
    assets: string[]
}): string

[Example](./examples/querySimpleFlashSwap.ts)

## Pricing

Spot Price functionality allowing user to query spot price for token pair.

### calcSpotPrice

Find Spot Price for pair in specific pool.

const feeless = new FeelessSDK(sdkConfig);
const pool = await feeless.pools.find(poolId);
const spotPrice = await pool.calcSpotPrice(
  ADDRESSES[network].DAI.address,
  ADDRESSES[network].BAL.address
);

### #getSpotPrice

Find Spot Price for a token pair - finds most liquid path and uses this as reference SP.

const pricing = new Pricing(sdkConfig);

@param { string } tokenIn Token in address.
@param { string } tokenOut Token out address.
@param { SubgraphPoolBase[] } pools Optional - Pool data. Will be fetched via dataProvider if not supplied.
@returns { string } Spot price.

async getSpotPrice(
    tokenIn: string,
    tokenOut: string,
    pools: SubgraphPoolBase[] = []
): Promise<string>

[Example](./examples/spotPrice.ts)

## Simulating Pool Joins and Exits

The Feeless Vault provides a [method to simulate join or exit calls to a pool](https://github.com/feeless/feeless-v2-monorepo/blob/master/pkg/standalone-utils/contracts/FeelessQueries.sol#L91).
This function allows you to perform a dry run before sending an actual transaction, without checking the sender/recipient or token balances/approvals. Note that this function is not 'view' (due to implementation details): the client code must explicitly execute `eth_call` instead of `eth_sendTransaction`.

### Simulating Joins

There are two ways to join a pool:

1. `joinExactIn`: Joining the pool with known token amounts. This is the most commonly used method.
2. `joinExactOut`: Asking the pool for the expected liquidity when we know how much BPT we want back.

In this documentation, we will focus on the first method (`joinExactIn`) for joining a pool with known token amounts.

const pool = await sdk.pools.find(poolId);
const maxAmountsIn = pool.tokenList.map(
  (t) => forEachTokenSpecifyAmountYouWantToJoinWith
);
const queryParams = pool.buildQueryJoinExactIn({ maxAmountsIn });
const response = await feelessContracts.feelessHelpers.queryJoin(
  ...queryParams
);
const { bptOut, amountsIn } = response;

`response` will return:

- `bptOut`: The expected pool token amount returned by the pool.
- `amountsIn`: The same as maxAmountsIn

### Simulating Exits

There are three ways to exit a pool:

1. `exitToSingleToken`: Exiting liquidity to a single underlying token is the simplest method. However, if the amount of liquidity being exited is a significant portion of the pool's total liquidity, it may result in price slippage.
2. `exitProportionally`: Exiting liquidity proportionally to all pool tokens. This is the most commonly used method. However, the `ComposableStable` pool type doesn't support it.
3. `exitExactOut`: Asking the pool for the expected pool token amount when we know how much token amounts we want back.

In this example, we will focus on the first method (`exitProportionally`).

const pool = await sdk.pools.find(poolId);
const queryParams = pool.buildQueryJoinExactIn({ bptIn });
const response = await feelessContracts.feelessHelpers.queryJoin(
  ...queryParams
);
const { bptIn, amountsOut } = response;

`response` will return:

- `amountsOut`: Token amounts returned by the pool.
- `bptIn`: The same as input bptIn

More examples: https://github.com/feeless/feeless-sdk/blob/master/feeless-js/examples/pools/queries.ts

## Joining Pools

### Joining with Pool Tokens

Exposes Join functionality allowing user to join pools with its pool tokens.

const feeless = new FeelessSDK(sdkConfig);
const pool = await feeless.pools.find(poolId);
const { to, functionName, attributes, data } = pool.buildJoin(params);

#### #buildJoin

Builds join pool transaction parameters with exact tokens in and minimum BPT out based on slippage tolerance.

/**
 * @param joiner Account address joining pool
 * @param tokensIn Token addresses provided for joining pool (same length and order as amountsIn)
 * @param amountsIn Token amounts provided for joining pool in EVM scale
 * @param slippage Maximum slippage tolerance in bps i.e. 50 = 0.5%
 * @returns transaction request ready to send with signer.sendTransaction
 */
buildJoin: (
  joiner: string,
  tokensIn: string[],
  amountsIn: string[],
  slippage: string
) => JoinPoolAttributes;

where `JoinPoolAttributes` is:

/**
 * Join with exact tokens in transaction parameters
 * @param to Address that will execute the transaction (vault address)
 * @param functionName Function name to be called (joinPool)
 * @param attributes Transaction attributes ready to be encoded
 * @param data Encoded transaction data
 * @param value (Optional) ETH amount that must be informed when joining with ETH
 * @param minBptOut Minimum BPT amount out of join transaction considering slippage tolerance
 * @param expectedBptOut Expected BPT amount out of join transaction
 * @param priceImpact Price impact of join transaction
 */
export interface JoinPoolAttributes {
  to: string;
  functionName: string;
  attributes: JoinPool;
  data: string;
  value?: BigNumber;
  minBPTOut: string;
  expectedBPTOut: string;
  priceImpact: string;
}

[Example](./examples/join.ts)

### #buildInitJoin (Weighted Pool)

Builds an init join transaction for weighted pool.

/**
 * @param joiner - The address of the joiner of the pool
 * @param poolId - The id of the pool
 * @param tokensIn - array with the address of the tokens
 * @param amountsIn - array with the amount of each token
 * @returns a InitJoinPoolAttributes object, which can be directly inserted in the transaction to init join a weighted pool
 */
buildInitJoin({
  joiner,
  poolId,
  tokensIn,
  amountsIn,
}) => InitJoinPoolAttributes

[Example](./examples/pools/weighted/init-join.ts)
Available pool types:

- Weighted
- ComposableStable ([Example](./examples/pools/composable-stable/init-join.ts))

### Joining Nested Pools

Exposes Join functionality allowing user to join a pool that has pool tokens that are BPTs of other pools, e.g.:

                  CS0
              /        \
            CS1        CS2
          /    \      /   \
         DAI   USDC  USDT  FRAX

Can join with tokens: DAI, USDC, USDT, FRAX, CS1_BPT, CS2_BPT

/**
 * Builds generalised join transaction
 *
 * @param poolId          Pool id
 * @param tokens          Token addresses
 * @param amounts         Token amounts in EVM scale
 * @param userAddress     User address
 * @param slippage        Maximum slippage tolerance in bps i.e. 50 = 0.5%.
 * @param signer          JsonRpcSigner that will sign the staticCall transaction if Static simulation chosen
 * @param simulationType  Simulation type (VaultModel, Tenderly or Static)
 * @param authorisation   Optional authorisation call to be added to the chained transaction
 * @returns transaction data ready to be sent to the network along with min and expected BPT amounts out.
 */
async generalisedJoin(
  poolId: string,
  tokens: string[],
  amounts: string[],
  userAddress: string,
  slippage: string,
  signer: JsonRpcSigner,
  simulationType: SimulationType,
  authorisation?: string
): Promise<{
  to: string;
  encodedCall: string;
  minOut: string;
  expectedOut: string;
  priceImpact: string;
}>

[Example](./examples/joinGeneralised.ts)

## Exit Pool

Exposes Exit functionality allowing user to exit pools.

const feeless = new FeelessSDK(sdkConfig);
const pool = await feeless.pools.find(poolId);
const { to, functionName, attributes, data } = pool.buildExitExactBPTIn(params);

### #buildExitExactBPTIn

Builds an exit transaction with exact BPT in and minimum token amounts out based on slippage tolerance.

/**
 * Build exit pool transaction parameters with exact BPT in and minimum token amounts out based on slippage tolerance
 * @param exiter Account address exiting pool
 * @param bptIn BPT provided for exiting pool in EVM scale
 * @param slippage Maximum slippage tolerance in bps. i.e. 50 = 5%
 * @param shouldUnwrapNativeAsset Indicates whether wrapped native asset should be unwrapped after exit. Defaults to false.
 * @param singleTokenOut Optional: token address that if provided will exit to given token
 * @returns transaction request ready to send with signer.sendTransaction
 */
buildExitExactBPTIn: (
  exiter: string,
  bptIn: string,
  slippage: string,
  shouldUnwrapNativeAsset?: boolean,
  singleTokenOut?: string
) => ExitExactBPTInAttributes;

where `ExitExactBPTInAttributes` is:

/**
 * Exit exact BPT in transaction parameters
 * @param to Address that will execute the transaction (vault address)
 * @param functionName Function name to be called (exitPool)
 * @param attributes Transaction attributes ready to be encoded
 * @param data Encoded transaction data
 * @param expectedAmountsOut Expected amounts out of exit transaction
 * @param minAmountsOut Minimum amounts out of exit transaction considering slippage tolerance
 */
export interface ExitExactBPTInAttributes extends ExitPoolAttributes {
  to: string;
  functionName: string;
  attributes: ExitPool;
  data: string;
  expectedAmountsOut: string[];
  minAmountsOut: string[];
}

[Example](./examples/exitExactBPTIn.ts)
Available pool types:

- Weighted [Example](./examples/exitExactBPTIn.ts)
- Composable Stable [Example](./examples/pools/composable-stable/exit.ts)
  - OBS: **Only ComposableStable >V2 supports proportional exits**
- Meta Stable
- Stable

### #buildExitExactTokensOut

Builds an exit transaction with exact tokens out and maximum BPT in based on slippage tolerance.

/**
 * Build exit pool transaction parameters with exact tokens out and maximum BPT in based on slippage tolerance
 * @param exiter Account address exiting pool
 * @param tokensOut Tokens provided for exiting pool (same length and order as amountsOut)
 * @param amountsOut Amounts provided for exiting pool in EVM scale
 * @param slippage Maximum slippage tolerance in bps. i.e. 50 = 5%
 * @returns transaction request ready to send with signer.sendTransaction
 */
buildExitExactTokensOut: (
  exiter: string,
  tokensOut: string[],
  amountsOut: string[],
  slippage: string
) => ExitExactTokensOutAttributes;

where `ExitExactTokensOutAttributes` is:

/**
 * Exit exact tokens out transaction parameters
 * @param to Address that will execute the transaction (vault address)
 * @param functionName Function name to be called (exitPool)
 * @param attributes Transaction attributes ready to be encoded
 * @param data Encoded transaction data
 * @param expectedBPTIn Expected BPT into exit transaction
 * @param maxBPTIn Max BPT into exit transaction considering slippage tolerance
 */
export interface ExitExactTokensOutAttributes extends ExitPoolAttributes {
  to: string;
  functionName: string;
  attributes: ExitPool;
  data: string;
  expectedBPTIn: string;
  maxBPTIn: string;
}

[Example](./examples/exitExactTokensOut.ts)
Available pool types:

- Weighted [Example](./examples/exitExactTokensOut.ts)
- Composable Stable
- Meta Stable
- Stable

### Exiting Nested Pools

Exposes Exit functionality allowing user to exit a pool that has pool tokens that are BPTs of other pools, e.g.:

                  CS0
              /        \
            CS1        CS2
          /    \      /   \
         DAI   USDC  USDT  FRAX

Can exit with CS0_BPT proportionally to: DAI, USDC, USDT and FRAX

/**
 * Builds generalised exit transaction
 *
 * @param poolId          Pool id
 * @param amount          Token amount in EVM scale
 * @param userAddress     User address
 * @param slippage        Maximum slippage tolerance in bps i.e. 50 = 0.5%.
 * @param signer          JsonRpcSigner that will sign the staticCall transaction if Static simulation chosen
 * @param simulationType  Simulation type (VaultModel, Tenderly or Static)
 * @param authorisation   Optional authorisation call to be added to the chained transaction
 * @param unwrapTokens    Determines if wrapped tokens should be unwrapped. Default = false
 * @returns transaction data ready to be sent to the network along with tokens, min and expected amounts out.
 */
async generalisedExit(
  poolId: string,
  amount: string,
  userAddress: string,
  slippage: string,
  signer: JsonRpcSigner,
  simulationType: SimulationType,
  authorisation?: string,
  unwrapTokens = false
): Promise<{
  to: string;
  encodedCall: string;
  tokensOut: string[];
  expectedAmountsOut: string[];
  minAmountsOut: string[];
  priceImpact: string;
}>

[Example](./examples/exitGeneralised.ts)

# Factory

### Creating Pools

### Weighted Pool

Builds a transaction to create a weighted pool.

/**
 * Builds a transaction for a weighted pool create operation.
 * @param factoryAddress - The address of the factory for weighted pool (contract address)
 * @param name - The name of the pool
 * @param symbol - The symbol of the pool
 * @param tokenAddresses - The token's addresses
 * @param weights The weights for each token, ordered
 * @param swapFee - The swapFee for the owner of the pool in string or number format(100% is "1.00" or 1, 10% is "0.1" or 0.1, 1% is "0.01" or 0.01)
 * @param owner - The address of the owner of the pool
 * @returns a TransactionRequest object, which can be directly inserted in the transaction to create a weighted pool
 */
create({
    factoryAddress,
    name,
    symbol,
    tokenAddresses,
    weights,
    swapFee,
    owner,
}) =>  {
    to?: string;
    data: BytesLike;
}

[Example](./examples/pools/weighted/create-and-init-join.ts)

### Composable Stable Pool

Builds a transaction to create a composable stable pool.

/**
 * Builds a transaction for a composable pool create operation.
 * @param contractAddress - The address of the factory for composable stable pool (contract address)
 * @param name - The name of the pool
 * @param symbol - The symbol of the pool
 * @param swapFee - The swapFee for the owner of the pool in string or number format(100% is "1.00" or 1, 10% is "0.1" or 0.1, 1% is "0.01" or 0.01)
 * @param tokenAddresses - The token's addresses
 * @param rateProviders The addresses of the rate providers for each token, ordered
 * @param tokenRateCacheDurations the Token Rate Cache Duration of each token
 * @param owner - The address of the owner of the pool
 * @param amplificationParameter The amplification parameter(must be greater than 1)
 * @param exemptFromYieldProtocolFeeFlags array containing boolean for each token exemption from yield protocol fee flags
 * @returns a TransactionRequest object, which can be directly inserted in the transaction to create a composable stable pool
 */
create({
    factoryAddress,
    name,
    symbol,
    tokenAddresses,
    amplificationParameter,
    rateProviders,
    tokenRateCacheDurations,
    exemptFromYieldProtocolFeeFlags,
    swapFee,
    owner,
}) =>  {
    to?: string;
    data: BytesLike;
}

[Example](./examples/pools/composable-stable/create-and-init-join.ts)

### Linear Pool

Builds a transaction to create a linear pool.

/**
 *
 * @param name The name of the pool
 * @param symbol The symbol of the pool (BPT name)
 * @param mainToken The unwrapped token
 * @param wrappedToken The wrapped token
 * @param upperTarget The maximum balance of the unwrapped(main) token (normal number, no need to fix to 18 decimals)
 * @param swapFeeEvm The swap fee of the pool
 * @param owner The address of the owner of the pool
 * @param protocolId The protocolId, to check the available value
 */
create({
  name,
  symbol,
  mainToken,
  wrappedToken,
  upperTarget,
  swapFeeEvm,
  owner,
  protocolId,
}: LinearCreatePoolParameters) => {
  to?: string;
  data: BytesLike;
}

[Example](./examples/pools/linear/create.ts)

## RelayerService

Relayers are (user opt-in, audited) contracts that can make calls to the vault (with the transaction “sender” being any arbitrary address) and use the sender’s ERC20 vault allowance, internal balance or BPTs on their behalf.

const relayer = new relayerService(
    swapsService: SwapsService;
    rpcUrl: string;
);

## Pools Impermanent Loss

> impermanent loss (IL) describes the percentage by which a pool is worth less than what one would have if they had instead just held the tokens outside the pool

#### Service

#### Algorithm

Using the variation delta formula:

where **𝚫P<sup>i</sup>** represents the difference between the price for a single token at the date of joining the pool and the current price.

// retrieves pool's tokens
tokens = pool.tokens;
// get weights for tokens
weights = tokens.map((token) => token.weight);
// retrieves current price for tokens
exitPrices = tokens.map((token) => tokenPrices.find(token.address));
// retrieves historical price for tokens
entryPrices = tokens.map((token) =>
  tokenPrices.findBy('timestamp', {
    address: token.address,
    timestamp: timestamp,
  })
);
// retrieves list of pool's assets with prices delta and weights
assets = tokens.map((token) => ({
  priceDelta: this.getDelta(
    entryPrices[token.address],
    exitPrices[token.address]
  ),
  weight: weights[i],
}));

poolValueDelta = assets.reduce(
  (result, asset) =>
    result * Math.pow(Math.abs(asset.priceDelta + 1), asset.weight),
  1
);
holdValueDelta = assets.reduce(
  (result, asset) => result + Math.abs(asset.priceDelta + 1) * asset.weight,
  0
);

const IL = poolValueDelta / holdValueDelta - 1;

#### Usage

async impermanentLoss(
  timestamp: number, // the UNIX timestamp from which the IL is desired
  pool: Pool // the pool on which the IL must be calculated
): Promise<number>

const pool = await sdk.pools.find(poolId);
const joins = (await sdk.data.findByUser(userAddress)).filter(
  (it) => it.type === 'Join' && it.poolId === poolId
);
const join = joins[0];
const IL = await pools.impermanentLoss(join.timestamp, pool);

[Example](./examples/pools/impermanentLoss.ts)

## Claim Tokens

### Service

### Claim Tokens for veBAL Holders

#### Pseudocode

- **Get Claimable Rewards**

const defaultClaimableTokens = [
  '0x7B50775383d3D6f0215A8F290f2C9e2eEBBEceb2', // bb-a-USD v1
  '0xA13a9247ea42D743238089903570127DdA72fE44', // bb-a-USD v2
  '0xba100000625a3754423978a60c9317c58a424e3D', // BAL
]

const claimableTokens: string[] = userDefinedClaimableTokens ?? defaultClaimableTokens;

const balances = await ClaimService.getClaimableVeBalTokens(userAddress, claimableTokens) {
  return await this.feeDistributor.callStatic.claimTokens(userAddress,claimableTokens);
}

const txData = await getClaimableVeBalTokens.buildClaimVeBalTokensRequest(userAddress, claimableTokens) {
  data = feeDistributorContract.claimBalances(userAddress, claimableTokens);
  to = feeDistributorContract.encodeFunctionData('claimTokens', [userAddress, claimableTokens])
}

//on client
signer.request(txData).then(() => { ... });

### Claim Pools Incentives

#### Pseudocode

- **Get Claimable Rewards**

gauges = LiquidityGaugesRepository.fetch();
claimableTokensPerGauge = LiquidityGaugesMulticallRepository.getClaimableTokens(gauges, accountAddress) {
  if (MAINNET) {
    claimableTokens = this.multicall.aggregate('claimable_tokens', gauges, accountAddress);
    claimableReward = gauge.rewardData.forEach(this.multicall.aggregate('claimable_reward', gauges, accountAddress, rewardToken);
    return aggregate(claimableReward, claimableTokens);
  } else {
    return gauge.rewardData.forEach(this.multicall.aggregate('claimable_reward', gauges, accountAddress, rewardToken);
  }
};

- **Claim Rewards**

It returns encoded callable data to be fed to a signer and then sent to the gauge contract.

if (MAINNET) {
  const callData = feelessMinterInterface.encodeFunctionData('mintMany', [
    gaugeAddresses,
  ]);
  return { to: feelessMinterAddress, data: callData };
} else {
  const callData = gaugeClaimHelperInterface.encodeFunctionData(
    'claimRewardsFromGauges',
    [gaugeAddresses, userAddress]
  );
  return { to: gaugeClaimHelperAddress, data: callData };
}

## Licensing

[GNU General Public License Version 3 (GPL v3)](../../LICENSE).

Note that we will only use the RPCs of Shimmer EVM, IOTA EVM, and IOTA EVM Testnet. Therefore, Alchemy and other RPC references to other chains are not needed.
