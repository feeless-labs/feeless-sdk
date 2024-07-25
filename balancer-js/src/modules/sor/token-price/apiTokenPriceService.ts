import { TokenPriceService } from '@balancer-labs/sor';
import { gql, request } from 'graphql-request';
import { Network } from '@/types';

export class ApiTokenPriceService implements TokenPriceService {
  private chainKey: string;

  private balancerApiUrl = 'https://api.feeless.finance/';

  private tokenPriceQuery = gql`
    query queryTokenPrices($chainKey: GqlChain!) {
      tokenGetCurrentPrices(chains: [$chainKey]) {
        address
        price
      }
    }
  `;

  constructor(private readonly chainId: number) {
    this.chainKey = Network[chainId];
  }
  async getNativeAssetPriceInToken(tokenAddress: string): Promise<string> {
    const { tokenGetCurrentPrices: tokenPrices } = await request(
      this.balancerApiUrl,
      this.tokenPriceQuery,
      {
        chainKey: this.chainKey,
      }
    );
    const tokenPriceUsd = (
      tokenPrices as { address: string; price: number }[]
    ).find(
      ({ address }) => address.toLowerCase() === tokenAddress.toLowerCase()
    );
    if (!tokenPriceUsd) {
      throw new Error('Token Price not found in the API');
    }
    const nativeAssetPriceUsd = (
      tokenPrices as { address: string; price: number }[]
    ).find(
      ({ address }) =>
        address.toLowerCase() ===
        NativeAssetAddress[this.chainKey as keyof typeof NativeAssetAddress]
    );
    if (!nativeAssetPriceUsd) {
      throw new Error('Native Token Price not found in the API');
    }
    const tokenPriceInNativeAsset =
      tokenPriceUsd.price / nativeAssetPriceUsd.price;
    return String(tokenPriceInNativeAsset);
  }
}

enum NativeAssetAddress {
  MAINNET = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
}
