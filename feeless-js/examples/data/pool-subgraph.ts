import { PoolsSubgraphRepository } from '@/modules/data/pool/subgraph';
import { Network } from '@/types';

const pools = new PoolsSubgraphRepository({
  url: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
  chainId: Network.MAINNET,
  query: {
    args: {
      where: {
        isInRecoveryMode: {
          eq: true,
        },
        isPaused: {
          eq: true,
        },
      },
    },
    attrs: {},
  },
});

async function main() {
  const results = await pools.fetch();
  console.log('Filter pools by attributes', results[0]);
}

main();

// yarn run examples:run ./examples/data/pool-subgraph.ts
