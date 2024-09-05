import { TokenPriceService } from '@balancer-labs/sor';

export class CustomPriceProvider implements TokenPriceService {
  private tokenPrices: Map<string, number>;

  constructor(tokenPrices: Map<string, number>) {
    this.tokenPrices = tokenPrices;
  }

  async getNativeAssetPriceInToken(tokenAddress: string): Promise<string> {
    const tokenPrice = this.tokenPrices.get(tokenAddress.toLowerCase());

    if (tokenPrice === undefined) {
      throw new Error('Token Price not found in the provided map');
    }

    const nativeAssetPrice = this.tokenPrices.get(
      NativeAssetAddress.MAINNET.toLowerCase()
    );

    if (nativeAssetPrice === undefined) {
      throw new Error('Native Token Price not found in the provided map');
    }

    const tokenPriceInNativeAsset = tokenPrice / nativeAssetPrice;
    return String(tokenPriceInNativeAsset);
  }
}

enum NativeAssetAddress {
  MAINNET = '0xB2E0DfC4820cc55829C71529598530E177968613'
}