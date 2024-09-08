import type { Findable, Price } from '@/types';
import { Logger } from '@/lib/utils/logger';

export class StaticTokenPriceProvider implements Findable<Price> {
  constructor(
    private staticPrices: { [address: string]: Price } // Array of static prices
  ) {}

  async find(address: string): Promise<Price | undefined> {
    const logger = Logger.getInstance();

    // Retrieve price from static prices
    const price = this.staticPrices[address];
    if (!price?.usd) {
      logger.warn(`Price not found for address: ${address}`);
      return undefined;
    }

    return price;
  }

  async findBy(attribute: string, value: string): Promise<Price | undefined> {
    if (attribute === 'address') {
      return this.find(value);
    }
    throw `Token price search by ${attribute} not implemented`;
  }
}
