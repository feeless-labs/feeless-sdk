import { Network } from './network';
import type { BalancerNetworkConfig } from '@/types';
export const balancerVault = '0x4d25b0729901DD546cb5c042c8D63B792960DE4D';
// Info fetched using npm package slot20
export const BPT_SLOT = 0;
export const BPT_DECIMALS = 18;

export interface BalancerTenderlyConfig {
  accessKey: string;
  user: string;
  project: string;
  blockNumber?: number;
}

export interface BalancerSdkSorConfig {
  //use a TokenPriceServicebuilt-in service or provide a custom implementation of a TokenPriceService
  //defaults to coingecko
  tokenPriceService: 'api' | 'coingecko' | 'subgraph';
  //use a built-in service or provide a custom implementation of a PoolDataService
  //defaults to subgraph
  poolDataService: 'subgraph';
  //if a custom PoolDataService is provided, on chain balance fetching needs to be handled externally
  //default to true.
  fetchOnChainBalances: boolean;
}

export const BALANCER_NETWORK_CONFIG: Record<Network, BalancerNetworkConfig> = {
  [Network.MAINNET]: {
    chainId: Network.MAINNET, //1075
    addresses: 
    {
      tokens: {
        wFLS: '0x1D148Eb4C213e560a6bad71536b96AC5D6F1cDE3',
        wrappedNativeAsset: '0xB2E0DfC4820cc55829C71529598530E177968613',
        lbpRaisingTokens: [
          '0xCa2DBF6Ba5f3252Fd758C113A8c48D6D77406CaC', // DAI
          '0xc4FA42632fea08274ACDB5c0d9331285C01717Ba', // USDC
          '0xCa2DBF6Ba5f3252Fd758C113A8c48D6D77406CaC', // USDT
        ],
        WETH: '0xd8058dA2dF3FBaBC03Ad8Ca51cAB4AAa3614B209',
        wBTC: '0x553D8A5927FBA1c3eC05DdA667D6Cda3F5543d3a',
        veFLS: '0xC128a9954e6c874eA3d62ce62B468bA073093F25',
        FUSDC : "0xc4FA42632fea08274ACDB5c0d9331285C01717Ba",
        FUSDT : "0xCa2DBF6Ba5f3252Fd758C113A8c48D6D77406CaC",
        wDai : "0x68EA743120BaCf2C277910700116Eb4b1C0643AA"
      },
      contracts: {
        multicall: "0x149450A58AF0b489B13B984D4486BefFA6545C0B",
        vault: "0x2C8dFD4b93aD661d569D3262E537E8Daf040260f",
        poolDataQueries: "",
        gaugeClaimHelper: "",
        balancerHelpers: "0x70213c0F6e0f358C32c63ea902048c278e9632Bb",
        balancerMinter: "0x654Fa7B23b19B384E39606A5760077fE44Fa48B3",
        balancerRelayer: "",
        gaugeController: "0x7E3Ae4148a021e7597f7D2A2f87aB5E3177E82D1",
        feeDistributor: "0xd9c6dd6B6ab7A88650102a6F0E4fe997FEf0e3f3",
        veFls: "",
        veFlsProxy: "",
        protocolFeePercentagesProvider: "0x101a83d167a907ae8Ea8EFaC48B2B8269FACB4EF",
        weightedPoolFactory: "0x14C4F1e47793e60b25083bc7d3a88B08cF7774E3",
        composableStablePoolFactory: "0x880843314b08750963120A1A92028729b17bEa9f",
        managedPoolFactory: "0x88d87fdA64837aB6323f48ce898a0648dc29789f",
        authorizer: "0x2C8dFD4b93aD661d569D3262E537E8Daf040260f",
        authorizerAdaptor: "0x820cFb05755D3316556Ef4F1049CF07e0b102DcC",
        authorizerAdaptorEntrypoint: "0x932257e6D5927f64DbF96d2C2CA5D1c47abc7d6e",
        authorizerWithAdaptorValidation: "0x3fA7Bd2622bCb69d53b15c667Ffac8c8972050C8",
        managedPoolAddRemoveTokenLib: "0x5c47b5c4EF4606268c51985d44b41c612ADFA12b",
        managedPoolAmmLib: "0xEb904cB3854F9E98Fd6fd487693D2d3613788A7F",
        noProtocolFeeLiquidityBootstrappingPoolFactory: "0xd0ca61fe288B591A9E70fC5058297d39Cc3bE458",
        nullVotingEscrow: "0x3b730976728Cf14E2bD95416ac79f8d83fb3AE4A",
        poolRecoveryHelper: "0x60AcB1aE821fC8F63EACe810Bf7C14C05EAdF76B",
        protocolFeesCollector: "0xD1434b84FF32e50CF816b1f67c53648F6df9E2F8",
        protocolFeesWithdrawer: "0x9fe5997cfB84957b7Ff2c330E826959609D98357",
        queryProcessor: "0x6783995f91A3D7f7C24B523669488F96cCa88d31",
        votingEscrowDelegationProxy: "0xCbE2d6510ff1E16E658FABF68C3Da80C31A79cf1",
        weightedPool2TokensFactory: "0xCF0a32Bbef8F064969F21f7e02328FB577382018",
        doubleEntrypointFixRelayer: "0x9f39b47FB71525762dBDBb271B8c200dd9Bc230f",
        l2BalancerPseudoMinter: "0xD3e63cA183a7F207869186501ec880A15db9043c",
        l2LayerZeroBridgeForwarder: "0xBA1F1615E93ae53E158e8474CDf7E6Ab9Cf11394",
        circuitBreakerLib: "0x90096b8b2C27143FC3Cda3cdb5A33fb82371B69c",
        externalWeightedMath: "0x9187e6f6ffe711E34477f5a69E534CAA19C35047",
        recoveryModeHelper: "0x312Da6594b75b7b733c904715edc47b97776b45E",
        balancerQueries: "0x2d43E17168383299183eA66a530FE378F1537b01",
        protocolIdRegistry: "0xfF527907500eF74988c4513aBBFfF684c741222d",
        gaugeAdder: "0x71a37747D8B213b7e451104cDa1f92Fbeca6AEf8",
        balancerTokenAdmin: "0x3ABA8015584E22A577Cd112C55219409B68E0753",
        liquidityGaugeV5: "0x729869F43d1Fc737127d2B4E045aD4b3Ba888eBB",
        liquidityGaugeFactory: "0xbD250F194338F7237DFE5438Ee58c7F2F8DA092F"
      }
    },
    urls: {
      subgraph:
        'http://127.0.0.1:8000/subgraphs/name/balancer-labs/balancer-v2',
      gaugesSubgraph:
        'http://127.0.0.1:8000/subgraphs/name/balancer-labs/balancer-gauges',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'iota',
        platformId: 'iotaevm',
      },
    },
    pools: {
      FLSIOTA: {
        id: '0x0c3861100485c118f63e50d615e75dad491e19c200020000000000000000000a',
        address: '0x0c3861100485C118f63e50D615E75daD491e19c2',
      },
      ETHBTC: {
        id: '0xff8e14b5a4be62434c7759d339a6e7c4a586ab31000200000000000000000004',
        address: '0xff8E14b5a4be62434c7759d339A6E7C4A586aB31',
      },
      FLSDAI: {
        id: '0x6b2b40c5c0d9d9cd4b82f05e756a4e513faa7e2f000200000000000000000005',
        address: '0x6b2B40c5C0d9D9Cd4B82f05E756A4e513faA7e2f',
      },
      IOTABTC: {
        id: '0x230fbc50a0db76f3f9e85e20907e1fe4e9b387d7000200000000000000000006',
        address: '0x230fbC50A0db76F3f9E85e20907e1Fe4E9B387d7',
      },
      IOTAETH: {
        id: '0x567f9830e839e40e6d83e6aeedc4aeb433aa6b96000200000000000000000007',
        address: '0x567f9830e839e40E6D83e6aeedC4AeB433aA6B96',
      },
      USDCDAI: {
        id: '0x696466e31293dc94362f0adbfdda043dd5f3896b000000000000000000000009',
        address: '0x696466e31293DC94362f0ADBfDDa043Dd5f3896b',
      },
      USDTUSDC: {
        id: '0x1dd3158ae7e459108710b736ad61154a1c65eb0e000000000000000000000008',
        address: '0x1dD3158AE7E459108710B736ad61154a1c65EB0e',
      }
    },
    poolsToIgnore: [
     
    ]
  }
};

export const networkAddresses = (
  chainId: number
): BalancerNetworkConfig['addresses'] =>
  BALANCER_NETWORK_CONFIG[chainId as Network].addresses;
