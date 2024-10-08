import { JsonRpcProvider } from '@ethersproject/providers';

/**
 * Resets the fork to a given block number
 *
 * @param provider JsonRpcProvider
 * @param blockNumber Block number to reset fork to
 */
export const reset = (
  provider: JsonRpcProvider,
  blockNumber?: number,
  jsonRpcUrl = 'https://json-rpc.evm.testnet.iotaledger.net'
): Promise<void> =>
  provider.send('hardhat_reset', [
    {
      forking: {
        jsonRpcUrl,
        blockNumber,
      },
    },
  ]);
