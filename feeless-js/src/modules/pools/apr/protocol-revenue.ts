import { Findable, Price } from '@/types';
import { BaseFeeDistributor } from '@/modules/data';

export interface ProtocolRevenueData {
  lastWeekBalRevenue: number;
  veBalSupply: number;
}

export class ProtocolRevenue {
  constructor(
    private repository: BaseFeeDistributor,
    private tokenPrices: Findable<Price>
  ) {}

  async data(now = Date.now()): Promise<ProtocolRevenueData> {
    const data = await this.repository.multicallData(now);
    const balPrice = await this.tokenPrices.find(data.balAddress.toLowerCase());
    
    if (!balPrice || !balPrice.usd) {
      throw `No wFLS USD price found`;
    }

    return {
      lastWeekBalRevenue: data.balAmount * parseFloat(balPrice.usd),
      veBalSupply: data.veBalSupply,
    };
  }
}
