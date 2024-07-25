import { Vault__factory } from '@/contracts/factories/Vault__factory';
import { JsonFragment } from '@ethersproject/abi';
import { networkAddresses } from '@/lib/constants/config';
import { BatchRelayerLibrary__factory } from '@/contracts';

/**
 * Maps SOR data to get the tokenIn used in swaps.
 * Logic related to a relayer wrapping and unwrapping tokens.
 * SOR returns list of already wrapped tokenAddresses used in the swap.
 * However tokenIn defined as an input is the unwrapped token.
 * Note: tokenAddresses are transformed in SOR lib wrapInfo.setWrappedInfo
 * TODO: Once PR is merged, this table can be removed.
 */
type WrappedList = {
  [key: string]: string;
};

const underlyingToWrappedMap: WrappedList = {

};

/**
 * Vault swaps are operating on wrapped tokens. When user is sending an unwrapped token, it's wrapped in a relayer.
 * SOR is returning an array of tokens already wrapped.
 * Converts tokenIn to match tokenIn used in a swap.
 *
 * TODO: add tokenIn and tokenOut addressed used for swap in the SOR results as tokenInForSwap, tokenOutForSwap
 *
 * @param token token address
 * @returns wrapped token address
 */
function tokenForSwaps(token: string): string {
  let wrapped = token;
  // eslint-disable-next-line no-prototype-builtins
  if (underlyingToWrappedMap.hasOwnProperty(token)) {
    wrapped = underlyingToWrappedMap[token as keyof WrappedList];
  }
  return wrapped;
}

export enum Relayers {
  vault = 1,
  lido = 2,
}

export interface SwapRelayer {
  id: Relayers;
  address: string;
}

/**
 * Resolves a contract address for sending swap transaction to.
 * Balancer is using relayers to automatically wrap / unwrap tokens not compatibile with ERC20.
 */
function relayerResolver(
  assetIn: string,
  assetOut: string,
  chainId: number
): SwapRelayer {
  const { tokens, contracts } = networkAddresses(chainId);
  let to = {
    id: Relayers.vault,
    address: contracts.vault,
  };
  return to;
}

function swapFragment(relayer: SwapRelayer): JsonFragment[] {
  if (relayer.id === Relayers.lido)
    return BatchRelayerLibrary__factory.abi.filter(
      (f) =>
        f.type === 'function' &&
        f.name &&
        ['swap', 'batchSwap'].includes(f.name)
    );
  else
    return Vault__factory.abi.filter(
      (f) =>
        f.type === 'function' &&
        f.name &&
        ['swap', 'batchSwap'].includes(f.name)
    );
}

function batchSwapFragment(
  assetIn: string,
  assetOut: string,
  chainId: number
): JsonFragment[] {
  const { tokens, contracts } = networkAddresses(chainId);
  const vaultSignaturesForSwaps = Vault__factory.abi.filter(
    (f) => f.type === 'function' && f.name === 'batchSwap'
  );
  return vaultSignaturesForSwaps;
}

export { tokenForSwaps, relayerResolver, swapFragment, batchSwapFragment };