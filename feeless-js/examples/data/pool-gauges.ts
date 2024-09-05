import { BalancerSDK, Network } from '@feeless/sdk';

const sdk = new BalancerSDK({
  network: Network.MAINNET,
  rpcUrl: 'https://iota-testnet-evm.public.blastapi.io',
});
const { poolGauges } = sdk.data;

(async function () {
  if (!poolGauges) throw 'Gauge Subgraph must be initialized';

  const POOL_ADDRESS = '0x0c3861100485C118f63e50D615E75daD491e19c2';

  const result = await poolGauges.find(POOL_ADDRESS);

  if (result) {
    console.log('All gauges of this pool', result.gauges);
    console.log('Preferential gauge', result.preferentialGauge);
  }
})();

// yarn run example ./examples/data/pool-gauges.ts
