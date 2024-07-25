import { ManagedPoolEncoder, WeightedPoolEncoder } from '@/pool-weighted/encoder';
import { StablePoolEncoder } from '@/pool-stable/encoder';
import { ComposableStablePoolEncoder } from '@/pool-composable-stable';
import { PoolType } from '@/types';
import { isLinearish } from '@/lib/utils';

export const getEncoder = (
  poolType: PoolType
):
  | typeof WeightedPoolEncoder
  | typeof ComposableStablePoolEncoder
  | typeof ManagedPoolEncoder
  | undefined => {
  switch (poolType) {
    case PoolType.Weighted:
      return WeightedPoolEncoder;
    case PoolType.Managed:
        return ManagedPoolEncoder;

    case PoolType.ComposableStable:
      return ComposableStablePoolEncoder;

    default: {
      return WeightedPoolEncoder;
      break;
    }
  }
};
