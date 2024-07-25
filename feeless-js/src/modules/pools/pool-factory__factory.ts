import { BalancerNetworkConfig, PoolType } from '@/types';
import { BalancerError, BalancerErrorCode } from '@/balancerErrors';
import { PoolFactory } from '@/modules/pools/factory/pool-factory';
import { ComposableStableFactory } from '@/modules/pools/factory/composable-stable/composable-stable.factory';
import { WeightedFactory } from '@/modules/pools/factory/weighted/weighted.factory';
import {
  ContractInstances,
  Contracts,
} from '@/modules/contracts/contracts.module';

/**
 * Wrapper around pool type specific methods.
 *
 * Returns a class instance of a type specific factory.
 */
export class PoolFactory__factory {
  networkConfig: BalancerNetworkConfig;
  contracts: ContractInstances;

  constructor(
    networkConfig: BalancerNetworkConfig,
    balancerContracts: Contracts
  ) {
    this.networkConfig = networkConfig;
    this.contracts = balancerContracts.contracts;
  }

  of(poolType: PoolType): PoolFactory {
    switch (poolType) {
      case 'Weighted':
        return new WeightedFactory(this.networkConfig, this.contracts);
      case 'Weighted':
          return new WeightedFactory(this.networkConfig, this.contracts);
    
      case 'LiquidityBootstrapping': {
        throw new BalancerError(BalancerErrorCode.UNSUPPORTED_POOL_TYPE);
      }
    
      case 'ComposableStable': {
        return new ComposableStableFactory(this.networkConfig, this.contracts);
      }
      default:
        throw new BalancerError(BalancerErrorCode.UNSUPPORTED_POOL_TYPE);
    }
  }
}
