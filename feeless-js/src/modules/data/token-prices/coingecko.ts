/* eslint-disable @typescript-eslint/no-empty-function */
import {
  CoingeckoConfig,
  Findable,
  Network,
  Price,
  TokenPrices,
} from '@/types';
import axios, { AxiosError } from 'axios';
import { TOKENS } from '@/lib/constants/tokens';
import { Debouncer, tokenAddressForPricing } from '@/lib/utils';
import {
  getCoingeckoApiBaseUrl,
  getCoingeckoApiKeyHeaderName,
} from '@/lib/utils/coingecko-api';

/**
 * Simple coingecko price source implementation. Configurable by network and token addresses.
 */
export class CoingeckoPriceRepository implements Findable<Price> {
  prices: { [key: string]: Promise<Price> } = {};
  nativePrice?: Promise<Price>;
  private readonly url: string;
  private readonly urlNative: string;
  private readonly coingeckoApiKeyHeaderName: string;
  baseTokenAddresses: string[];
  debouncer: Debouncer<TokenPrices, string>;
  apiKey?: string;

  constructor(
    tokenAddresses: string[],
    private chainId: Network = Network.MAINNET,
    coingecko?: CoingeckoConfig
  ) {
    this.baseTokenAddresses = tokenAddresses.map(tokenAddressForPricing);
    this.url = `${getCoingeckoApiBaseUrl(
      coingecko?.isDemoApiKey
    )}simple/token_price/${this.platform(chainId)}?vs_currencies=usd,eth`;
    this.urlNative = `${getCoingeckoApiBaseUrl(
      coingecko?.isDemoApiKey
    )}simple/price/?vs_currencies=eth,usd&ids=`;
    this.coingeckoApiKeyHeaderName = getCoingeckoApiKeyHeaderName(
      coingecko?.isDemoApiKey
    );
    this.apiKey = coingecko?.coingeckoApiKey;
    this.debouncer = new Debouncer<TokenPrices, string>(
      this.fetch.bind(this),
      200,
      coingecko?.tokensPerPriceRequest ?? 10
    );
  }

  private async fetch(
    addresses: string[],
    { signal }: { signal?: AbortSignal } = {}
  ): Promise<TokenPrices> {
    try {
      const { data } = await axios.get<TokenPrices>(
        `${this.url}&contract_addresses=${addresses.join(',')}`,
        {
          signal,
          headers: {
            [this.coingeckoApiKeyHeaderName]: this.apiKey ?? '',
          },
        }
      );
      return data;
    } catch (error) {
      const message = ['Error fetching token prices from coingecko'];
      if ((error as AxiosError).isAxiosError) {
        if ((error as AxiosError).response?.status !== undefined) {
          message.push(`with status ${(error as AxiosError).response?.status}`);
        }
      } else {
        message.push(error as string);
      }
      return Promise.reject(message.join(' '));
    }
  }

  private fetchNative({
    signal,
  }: { signal?: AbortSignal } = {}): Promise<Price> {
    console.time(`fetching coingecko for native token`);
    enum Assets {
      ETH = 'ethereum',
    }
    let assetId: Assets = Assets.ETH;
    
    return axios
      .get<{ [key in Assets]: Price }>(`${this.urlNative}${assetId}`, {
        signal,
        headers: {
          [this.coingeckoApiKeyHeaderName]: this.apiKey ?? '',
        },
      })
      .then(({ data }) => {
        return data[assetId];
      })
      .catch((error) => {
        const message = ['Error fetching native token from coingecko'];
        if (error.isAxiosError) {
          if (error.response?.status) {
            message.push(`with status ${error.response.status}`);
          }
        } else {
          message.push(error);
        }
        return Promise.reject(message.join(' '));
      })
      .finally(() => {
        console.timeEnd(`fetching coingecko for native token`);
      });
  }

  find(inputAddress: string): Promise<Price | undefined> {
    const address = tokenAddressForPricing(inputAddress, this.chainId);
    if (!this.prices[address]) {
      // Make initial call with all the tokens we want to preload
      if (Object.keys(this.prices).length === 0) {
        for (const baseAddress of this.baseTokenAddresses) {
          this.prices[baseAddress] = this.debouncer
            .fetch(baseAddress)
            .then((prices) => prices[baseAddress]);
        }
      }

      // Handle native asset special case
      if (
        address === TOKENS(this.chainId).Addresses.nativeAsset.toLowerCase()
      ) {
        if (!this.nativePrice) {
          this.prices[address] = this.fetchNative();
        }

        return this.prices[address];
      }

      this.prices[address] = this.debouncer
        .fetch(address)
        .then((prices) => prices[address]);
    }

    return this.prices[address];
  }

  async findBy(attribute: string, value: string): Promise<Price | undefined> {
    if (attribute != 'address') {
      return undefined;
    }

    return this.find(value);
  }

  private platform(chainId: number): string {
    switch (chainId) {
      case Network.MAINNET:
        return 'iotaevm';
    }
    return '2';
  }
}
