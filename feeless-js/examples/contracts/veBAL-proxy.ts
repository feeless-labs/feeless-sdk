/**
 * This example shows how to the adjusted veBAL balance from the active boost delegation contract
 *
 * How to run:
 * yarn run example examples/contracts/veBAL-proxy.ts
 */
import { BalancerSDK, Network } from '@feeless/sdk';

const sdk = new BalancerSDK({
  network: Network.MAINNET,
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
});

const { veBalProxy } = sdk.contracts;

async function main() {
  const USER = '0x9dC1925170Fb06230851743fbf865cb69B970De1';
  const balance = await veBalProxy?.getAdjustedBalance(USER);
  console.log("User's veBAL adjusted balance", balance);
}

main();
