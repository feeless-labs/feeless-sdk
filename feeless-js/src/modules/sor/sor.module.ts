import { SOR, SorConfig, TokenPriceService } from '@balancer-labs/sor';
import { Provider, JsonRpcProvider } from '@ethersproject/providers';
import { SubgraphPoolDataService } from './pool-data/subgraphPoolDataService';
import {
  SubgraphClient,
  createSubgraphClient,
} from '@/modules/subgraph/subgraph';
import {
  BalancerNetworkConfig,
  BalancerSdkConfig,
  BalancerSdkSorConfig,
  CoingeckoConfig,
} from '@/types';
import { SubgraphTokenPriceService } from './token-price/subgraphTokenPriceService';
import { getNetworkConfig } from '@/modules/sdk.helpers';
import { POOLS_TO_IGNORE } from '@/lib/constants/poolsToIgnore';
import { ApiTokenPriceService } from '@/modules/sor/token-price/apiTokenPriceService';
import { CoingeckoTokenPriceService } from '@/modules/sor/token-price/coingeckoTokenPriceService';
import { CustomTokenPriceProvider } from './token-price/CustomTokenPriceService';

export class Sor extends SOR {
  constructor(sdkConfig: BalancerSdkConfig) {
    const network = getNetworkConfig(sdkConfig);
    const sorConfig = Sor.getSorConfig(sdkConfig);
    const sorNetworkConfig = Sor.getSorNetworkConfig(network);

    const provider = new JsonRpcProvider(
      sdkConfig.rpcUrl,
      sdkConfig.network as number
    );
    const subgraphClient = createSubgraphClient(network.urls.subgraph);

    const poolDataService = Sor.getPoolDataService(
      network,
      sorConfig,
      provider,
      subgraphClient
    );

    const tokenPriceService = Sor.getTokenPriceService(
      network,
      sorConfig,
      subgraphClient,
      sdkConfig.coingecko
    );

    super(provider, sorNetworkConfig, poolDataService, tokenPriceService);
  }

  private static getSorConfig(config: BalancerSdkConfig): BalancerSdkSorConfig {
    return {
      tokenPriceService: 'static',
      poolDataService: 'subgraph',
      fetchOnChainBalances: true,
      ...config.sor,
    };
  }

  private static getSorNetworkConfig(
    network: BalancerNetworkConfig
  ): SorConfig {
    return {
      ...network,
      vault: network.addresses.contracts.vault,
      weth: network.addresses.tokens.wrappedNativeAsset,
      lbpRaisingTokens: network.addresses.tokens?.lbpRaisingTokens,
      connectingTokens: network.sorConnectingTokens,
      triPathMidPoolIds: network.sorTriPathMidPoolIds,
    };
  }

  private static getPoolDataService(
    network: BalancerNetworkConfig,
    sorConfig: BalancerSdkSorConfig,
    provider: Provider,
    subgraphClient: SubgraphClient
  ) {
    // For SOR we want to ignore all configured pools (for Vault/Simulation we don't)
    const allPoolsToIgnore = [
      ...(network.poolsToIgnore ?? []),
      ...POOLS_TO_IGNORE,
    ];

    return typeof sorConfig.poolDataService === 'object'
      ? sorConfig.poolDataService
      : new SubgraphPoolDataService(
          subgraphClient,
          provider,
          { ...network, poolsToIgnore: allPoolsToIgnore },
          sorConfig
        );
  }
  private static getTokenPriceService(
    network: BalancerNetworkConfig,
    sorConfig: BalancerSdkSorConfig,
    subgraphClient: SubgraphClient,
    coingeckoConfig?: CoingeckoConfig
  ): TokenPriceService {
    if (sorConfig.tokenPriceService === 'coingecko' && coingeckoConfig) {
      return new CoingeckoTokenPriceService(network.chainId, coingeckoConfig);
    }
    if (typeof sorConfig.tokenPriceService === 'object') {
      return sorConfig.tokenPriceService;
    } else if (sorConfig.tokenPriceService === 'subgraph') {
      return new SubgraphTokenPriceService(
        subgraphClient,
        network.addresses.tokens.wrappedNativeAsset
      );
    }
    else if(sorConfig.tokenPriceService === 'static')
    {
      const tokenPrices = new Map<string, bigint>([
        ['0xB2E0DfC4820cc55829C71529598530E177968613'.toLowerCase(), BigInt(150000000000)],   // wIOTA
        ['0x1D148Eb4C213e560a6bad71536b96AC5D6F1cDE3'.toLowerCase(), BigInt(20000000000000)],   // wFLS
        ['0xd8058dA2dF3FBaBC03Ad8Ca51cAB4AAa3614B209'.toLowerCase(), BigInt(2500000000000000)],   // WETH
        ['0x553D8A5927FBA1c3eC05DdA667D6Cda3F5543d3a'.toLowerCase(), BigInt(55000000000000000)],  // wBTC
        ['0xB62fe3ed61fa7BA0fc8B8917bd926E1f6EE3eC37'.toLowerCase(), BigInt(10000000000000)],     // veFLS
        ['0xc4FA42632fea08274ACDB5c0d9331285C01717Ba'.toLowerCase(), BigInt(1000000000000)],      // FUSDC
        ['0xCa2DBF6Ba5f3252Fd758C113A8c48D6D77406CaC'.toLowerCase(), BigInt(1000000000000)],      // FUSDT
        ['0x68EA743120BaCf2C277910700116Eb4b1C0643AA'.toLowerCase(), BigInt(1000000000000)]       // wDai
      ]);
      
      return new CustomTokenPriceProvider(tokenPrices);
    }
    return new ApiTokenPriceService(network.chainId);
  }
}
