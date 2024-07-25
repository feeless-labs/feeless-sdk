import { Network } from '@/lib/constants/network';

// Do not display APR values greater than this amount; they are likely to be nonsensical
// These can arise from pools with extremely low balances (e.g., completed LBPs)
export const APR_THRESHOLD = 10_000;

/**
 * For proportional exits from ComposableStable pools the ExactBPTInForTokensOut
 * exit type was removed. Therefore we have to use BPTInForExactTokensOut which
 * makes proportional exits using a user's total BPT balance impossible. In
 * order to 'fix' this we need to subtract a little bit from the bptIn value
 * when calculating the ExactTokensOut. The variable below is that "little bit".
 */
export const SHALLOW_COMPOSABLE_STABLE_BUFFER = 1e6; // EVM scale, so this is 1 Mwei

type FactoryType =
  | 'weightedPool'
  | 'managedPool'
  | 'liquidityBootstrappingPool'
  | 'composableStablePool';

type PoolMetadata = {
  name: string;
  hasIcon: boolean;
};

export type NamedPools = {
  staBAL: string;
  bbAaveUSD: {
    v1: string;
    v2: string;
  };
  xMatic: {
    v1: string;
    v2: string;
  };
  stMatic: {
    v1: string;
    v2: string;
  };
  mai4: {
    mai4: string;
    maiBbaUsd: string;
  };
  veBAL: string;
};

type Pools = {
  IdsMap: Partial<NamedPools>;
  Pagination: {
    PerPage: number;
    PerPool: number;
    PerPoolInitial: number;
  };
  DelegateOwner: string;
  ZeroAddress: string;
  DynamicFees: {
    Gauntlet: string[];
  };
  BlockList: string[];
  ExcludedPoolTypes: string[];
  Stable: {
    AllowList: string[];
  };
  Investment: {
    AllowList: string[];
  };
  Factories: Record<string, FactoryType>;
  Stakable: {
    AllowList: string[];
  };
  Metadata: Record<string, PoolMetadata>;
};

const POOLS_MAINNET: Pools = {
  IdsMap: {
    staBAL:
      '',
    veBAL: '0x0c3861100485c118f63e50d615e75dad491e19c200020000000000000000000a'
  },
  Pagination: {
    PerPage: 10,
    PerPool: 10,
    PerPoolInitial: 5,
  },
  DelegateOwner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
  ZeroAddress: '0x0000000000000000000000000000000000000000',
  DynamicFees: {
    Gauntlet: [],
  },
  BlockList: [''],

  ExcludedPoolTypes : [],
  
  Stable: {
    AllowList: [
      '0x696466e31293dc94362f0adbfdda043dd5f3896b000000000000000000000009',
      '0x1dd3158ae7e459108710b736ad61154a1c65eb0e000000000000000000000008'
    ],
  },
  Investment: {
    AllowList: [
    ],
  },
  Factories: {
    '0x14C4F1e47793e60b25083bc7d3a88B08cF7774E3': 'weightedPool',
    '0xd0ca61fe288B591A9E70fC5058297d39Cc3bE458': 'liquidityBootstrappingPool', // Mainnet LBP (zero protocol fee)
    '0x88d87fdA64837aB6323f48ce898a0648dc29789f': 'managedPool', // Mainnet Managed
    '0x880843314b08750963120A1A92028729b17bEa9f': 'composableStablePool', // ComposableStable v4
  },
  Stakable: {
    AllowList: [
      '0x0c3861100485c118f63e50d615e75dad491e19c200020000000000000000000a', // 80wFLS/20IOTA
    ],
  },
  Metadata: {},
 
};

const POOLS_MAP = {
  [Network.MAINNET]: POOLS_MAINNET
};

export function POOLS(networkId: Network): Pools {
  const id = networkId as keyof typeof POOLS_MAP;
  return POOLS_MAP[id];
}
