import { Network } from '@/lib/constants/network';

/**
 * TYPES
 */
type CommonTokens = {
  nativeAsset: string;
  wNativeAsset: string;
  WETH: string;
  wFLS: string;
  wDAI?: string;
  FUSDT?: string;
  FUSDC?: string;
  wBTC? : string;
};

type TokenConstants = {
  Popular: {
    Symbols: string[];
  };
  Addresses: CommonTokens;
  PriceChainMap?: Record<string, string>;
};

/**
 * CONSTANTS
 */
export const DEFAULT_TOKEN_DECIMALS = 18;

export const TOKENS_MAINNET: TokenConstants = {
  Popular: {
    Symbols: ['wIOTA', 'wDAI', 'FUSDC', 'wFLS', 'FUSDT', 'WETH','wBTC'],
  },
  Addresses: {
    nativeAsset: '0xB2E0DfC4820cc55829C71529598530E177968613',
    wNativeAsset: '0xB2E0DfC4820cc55829C71529598530E177968613',
    WETH: '0xd8058dA2dF3FBaBC03Ad8Ca51cAB4AAa3614B209',
    wFLS: '0x1D148Eb4C213e560a6bad71536b96AC5D6F1cDE3',
    wDAI: '0x68EA743120BaCf2C277910700116Eb4b1C0643AA',
    FUSDT: '0xCa2DBF6Ba5f3252Fd758C113A8c48D6D77406CaC',
    FUSDC: '0xc4FA42632fea08274ACDB5c0d9331285C01717Ba',
    wBTC: '0x553D8A5927FBA1c3eC05DdA667D6Cda3F5543d3a',
  },
};

export const TOKENS_GENERIC: TokenConstants = {
  Popular: {
    Symbols: ['wIOTA', 'wDAI', 'FUSDC', 'wFLS', 'FUSDT', 'WETH','wBTC'],
  },
  Addresses: {
    nativeAsset: '0xB2E0DfC4820cc55829C71529598530E177968613',
    wNativeAsset: '0xB2E0DfC4820cc55829C71529598530E177968613',
    WETH: '0x0000000000000000000000000000000000000000',
    wFLS: '0x0000000000000000000000000000000000000000',
  },
};

export const TOKENS_MAP = {
  [Network.MAINNET]: TOKENS_MAINNET
};

export function TOKENS(networkId: Network): TokenConstants {
  const id = networkId as keyof typeof TOKENS_MAP;
  return TOKENS_MAP[id] ? TOKENS_MAP[id] : TOKENS_GENERIC;
}
