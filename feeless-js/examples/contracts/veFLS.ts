/**
 * Shows how to interact with the veBAL contract
 *
 * How to run:
 * yarn run example examples/contracts/veBAL.ts
 */
import { BalancerSDK, Network } from '@feeless/sdk';

const sdk = new BalancerSDK({
  network: Network.MAINNET,
  rpcUrl: 'https://iota-testnet-evm.public.blastapi.io'
});

const  veFLS  = sdk.contracts.veFLS;

async function main() {
  if (!veFLS) throw new Error('veFLS address must be defined');

  console.assert(JSON.stringify(sdk.contracts));


  const USER = '0x91F450602455564A64207414c7Fbd1F1F0EbB425';

  const lockInfo = await veFLS.getLockInfo(USER);
  console.log('veFLS lock info for user', lockInfo);
}

main();
