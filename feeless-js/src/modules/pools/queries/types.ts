import { BigNumberish } from '@ethersproject/bignumber';
import type { PoolType } from '@/.';

export interface Encoder {
   joinExactTokensInForBPTOut(
    amountsIn: BigNumberish[],
    minimumBPT: BigNumberish
  ): string;
  

  joinTokenInForExactBPTOut(
    bptAmountOut: BigNumberish,
    enterTokenIndex: number
  ): string;

  exitExactBPTInForOneTokenOut(
    bptAmountIn: BigNumberish,
    exitTokenIndex: number
  ): string;

  exitExactBPTInForTokensOut?(bptAmountIn: BigNumberish): string;

  exitBPTInForExactTokensOut(
    amountsOut: BigNumberish[],
    maxBPTAmountIn: BigNumberish
  ): string;
}

export interface ParamsBuilder {
  buildQueryJoinExactIn(params: JoinExactInParams): queryJoinParams;

  buildQueryJoinExactOut(params: JoinExactOutParams): queryJoinParams;

  buildQueryExitToSingleToken(params: ExitToSingleTokenParams): queryExitParams;

  buildQueryExitProportionally(
    params: ExitProportionallyParams
  ): queryExitParams;

  buildQueryExitExactOut(params: ExitExactOutParams): queryExitParams;
}

/**
 * Pool model used to build queries
 *
 * @param tokensList is expected to be sorted in ascending order to match ordering used by the Vault.
 */
export interface Pool {
  id: string;
  poolType: PoolType;
  tokensList: string[];
}

export interface JoinExactInParams {
  maxAmountsInByToken: Map<string, BigNumberish>;
  minimumBPT?: BigNumberish;
}

export interface JoinExactOutParams {
  maxAmountIn?: BigNumberish;
  bptOut: BigNumberish;
  tokenIn: string;
}

export interface ExitToSingleTokenParams {
  minAmountOut?: BigNumberish;
  bptIn: BigNumberish;
  tokenOut: string;
}

export interface ExitProportionallyParams {
  minAmountsOut?: BigNumberish[];
  bptIn: BigNumberish;
}

export interface ExitExactOutParams {
  minAmountsOut: BigNumberish[];
  tokensOut: string[];
  maxBptIn?: BigNumberish;
}

export type queryJoinParams = [
  poolId: string,
  sender: string,
  recipient: string,
  request: {
    assets: string[];
    maxAmountsIn: BigNumberish[];
    userData: string;
    fromInternalBalance: boolean;
  }
];

export type queryExitParams = [
  poolId: string,
  sender: string,
  recipient: string,
  request: {
    assets: string[];
    minAmountsOut: BigNumberish[];
    userData: string;
    toInternalBalance: boolean;
  }
];
