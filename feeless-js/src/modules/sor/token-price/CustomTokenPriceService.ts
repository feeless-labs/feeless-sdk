import { TokenPriceService } from '@balancer-labs/sor';

export class CustomTokenPriceProvider implements TokenPriceService {
  private tokenPrices: Map<string, bigint>;
  
  constructor(tokenPrices: Map<string, bigint>) {
    this.tokenPrices = tokenPrices;
  }

  async getNativeAssetPriceInToken(tokenAddress: string): Promise<string> {
   
   
    const tokenPrice = this.tokenPrices.get(tokenAddress);

    if (tokenPrice === undefined) {
      throw new Error('Token Price not found in the provided map...');
    }

    const nativeAssetPrice = this.tokenPrices.get(
      NativeAssetAddress.MAINNET.toLowerCase()
    );

    if (nativeAssetPrice === undefined) {
      throw new Error('Native Token Price not found in the provided map');
    }

    // Multiply by scaling factor to simulate decimals, then divide
    const tokenPriceInNativeAsset = ((tokenPrice ) / nativeAssetPrice).toString();

    // Convert the result to a floating-point string with 18 decimals


    console.debug("token price:" + tokenPrice);
    console.debug("native asset price:" + nativeAssetPrice);
    console.debug("price in wIOTA:" + tokenPriceInNativeAsset);
    return Promise.resolve(tokenPriceInNativeAsset);
  }
}

enum NativeAssetAddress {
  MAINNET = '0xB2E0DfC4820cc55829C71529598530E177968613'
}