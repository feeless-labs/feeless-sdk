import { Interface } from '@ethersproject/abi';
import { formatUnits } from '@ethersproject/units';
import { Multicall } from '@/contracts';
import { Network } from '@/types';

export const yieldTokens = {
  [Network.MAINNET]: {
    // Qui andranno gli indirizzi dei yield tokens per la rete MAINNET
  }
};

export const wrappedTokensMap = {
  [Network.MAINNET]: {
    // Qui andranno gli indirizzi dei wrapped tokens per la rete MAINNET
  }
};

const wrappedATokenInterface = new Interface([
  'function rate() view returns (uint256)',
]);

export interface IAaveRates {
  getRate: (address: string) => Promise<number>;
}

export class AaveRates implements IAaveRates {
  rates?: Promise<{ [wrappedATokenAddress: string]: number }>;

  constructor(private multicall: Multicall, private network: Network) {}

  private async fetch(
    network: Network.MAINNET 
  ): Promise<{ [wrappedATokenAddress: string]: number }> {
    console.time('Fetching aave rates');
    const addresses = Object.values(yieldTokens[network]) as string[]; // Tipizziamo addresses come array di stringhe
    const payload = addresses.map((wrappedATokenAddress) => ({
      target: wrappedATokenAddress,
      callData: wrappedATokenInterface.encodeFunctionData('rate', []),
    }));
    const [, res] = await this.multicall.callStatic.aggregate(payload);

    const rates = addresses.reduce((p: { [key: string]: number }, a, i) => {
      p[a] ||= res[i] == '0x' ? 0 : parseFloat(formatUnits(res[i], 27));
      return p;
    }, {});
    console.timeEnd('Fetching aave rates');

    return rates;
  }

  async getRate(wrappedAToken: string): Promise<number> {
    //To prevent bricked linear pools from effecting this call
    /*if (this.network != Network.MAINNET && this.network != Network.POLYGON) {
      return 1;
    }
    if (!Object.values(yieldTokens[this.network]).includes(wrappedAToken)) {
      return 1;
    }
    if (!this.rates) {
      this.rates = this.fetch(this.network);
    }

    return (await this.rates)[wrappedAToken];*/

    return 1;
  }
}
