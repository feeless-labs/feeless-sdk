import { TokenPriceService } from '@balancer-labs/sor';

export class CustomTokenPriceProvider implements TokenPriceService {
  private tokenPrices: Map<string, bigint>;
  
  constructor(tokenPrices: Map<string, bigint>) {
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

    // Multiply by scaling factor to simulate decimals, then divide
    const tokenPriceInNativeAsset = (tokenPrice ) / nativeAssetPrice;

    // Convert the result to a floating-point string with 18 decimals
    return tokenPriceInNativeAsset.toString;
  }
}

enum NativeAssetAddress {
  MAINNET = '0xB2E0DfC4820cc55829C71529598530E177968613'
}