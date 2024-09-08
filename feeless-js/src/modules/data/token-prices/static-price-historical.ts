import type { Findable, Price } from '@/types';
import { Logger } from '@/lib/utils/logger';

export class HistoricalPriceProvider implements Findable<Price> {
  constructor(
    private staticPrices: { [address: string]: Price } // Static reference prices
  ) {}

  /**
   * Get the current historical price (at time of call)
   *
   * @param address the token address
   */
  async find(address: string): Promise<Price | undefined> {
    return this.findBy(address, Math.floor(Date.now() / 1000));
  }

  /**
   * Get the historical price at a given timestamp.
   *
   * @param address the token address
   * @param timestamp the UNIX timestamp
   */
  async findBy(address: string, timestamp: number): Promise<Price | undefined> {
    const currentTime = Math.floor(Date.now() / 1000);

    // Get the static reference price
    const referencePrice = this.staticPrices[address];
    if (!referencePrice?.usd) {
      const logger = Logger.getInstance();
      logger.warn(`Price not found for address: ${address}`);
      return undefined;
    }

    // Calculate time difference
    const timeDifference = Math.abs(currentTime - timestamp);

    // Apply random fluctuation based on the time difference
    const fluctuation = this.getTimeBasedFluctuation(timeDifference);
    const adjustedPrice = parseFloat(referencePrice.usd) * (1 + fluctuation / 100);

    return {
      ...referencePrice,
      usd: adjustedPrice.toFixed(2),
    };
  }

  /**
   * Generate a random fluctuation, where the magnitude of the fluctuation increases
   * with the time difference. The fluctuation range grows as the time difference increases.
   *
   * @param timeDifference the difference in seconds between the current time and the timestamp
   * @private
   */
  private getTimeBasedFluctuation(timeDifference: number): number {
    // Define a base fluctuation percentage (±1%) and scale it with time difference
    const baseFluctuation = 1; // Base ±1% for near-current prices
    const maxMultiplier = Math.min(timeDifference / (60 * 60 * 24), 10); // Scale with days, capped at 10%
    
    const fluctuationRange = baseFluctuation * maxMultiplier;
    return this.getRandomFluctuation(-fluctuationRange, fluctuationRange);
  }

  /**
   * Generate a random fluctuation within a range (min% to max%).
   *
   * @param min the minimum percentage (-5% = -0.05)
   * @param max the maximum percentage (5% = 0.05)
   * @private
   */
  private getRandomFluctuation(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
