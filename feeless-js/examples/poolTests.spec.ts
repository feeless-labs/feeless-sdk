import { PoolsSubgraphRepository } from '@/modules/data/pool/subgraph';
import { Network } from '@/types';
import { expect } from 'chai';

describe('PoolsSubgraphRepository', () => {
  const subgraphUrl = 'https://subgraph.feeless.finance/subgraphs/name/feeless-labs/feeless-v2';
  const chainId = Network.MAINNET; // Use appropriate network ID
  let repository: PoolsSubgraphRepository;


  before(() => {
    repository = new PoolsSubgraphRepository({
      url: subgraphUrl,
      chainId: chainId,
    });
  });

  it('should fetch all pools', async () => {
    const pools = await repository.all();
    expect(pools).to.be.an('array');
    console.log('Number pools:', pools.length);
    expect(pools.length).to.be.greaterThan(0);
    console.log('Fetched pools:', pools);
  });


});