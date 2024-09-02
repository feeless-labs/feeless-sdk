import { BalancerSDK, Network } from '@feeless/sdk';

const sdk = new BalancerSDK({
  network: Network.MAINNET,
  rpcUrl: 'https://json-rpc.evm.testnet.iotaledger.net',
});

const { pools, poolsOnChain } = sdk.data;

async function main() {
  const POOL_ID1 =
    '0x0c3861100485c118f63e50d615e75dad491e19c200020000000000000000000a';
  const POOL_ID2 =
    '0xff8e14b5a4be62434c7759d339a6e7c4a586ab31000200000000000000000004';
  const POOL_IDs = [POOL_ID1, POOL_ID2];

  let result;

  result = await pools.find(POOL_ID1);
  console.log('Fetch pool by id', result);

  result = await pools.all();
  console.log('Fetch all pools', result);

  result = await pools.where((pool) => POOL_IDs.includes(pool.id));
  console.log('Filter pools by attributes', result);

  // Refetch on-chain balances for a given pool
  const pool = await pools.find(POOL_ID1);
  if (!pool) {
    throw new Error('Pool not found');
  }
  for (const idx in pool.tokens) {
    pool.tokens[idx].balance = '0';
  }
  const onchain = await poolsOnChain.refresh(pool);
  console.log('onchain pool', onchain);
}

main();

// yarn example ./examples/data/pools.ts
