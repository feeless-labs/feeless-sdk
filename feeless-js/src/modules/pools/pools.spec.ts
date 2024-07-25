import { Pools } from './index';
import { getNetworkConfig } from '../sdk.helpers';
import { factories } from '@/test/factories';
import { expect } from 'chai';
import { Contracts } from '@/modules/contracts/contracts.module';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Network } from '@/types';

const networkConfig = getNetworkConfig({ network: Network.MAINNET, rpcUrl: '' });

const pools = new Pools(
  networkConfig,
  factories.data.repositores({}),
  new Contracts(networkConfig.addresses.contracts, new JsonRpcProvider('', 1))
);

describe('Pool services', () => {
  context('proportional amounts', () => {
    it('should expose the service', () => {
      expect(pools.proportionalAmounts).to.be.a('function');
    });
  });
});
