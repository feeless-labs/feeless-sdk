/**
 * How to build a swap and send it using ethers.js
 *
 * How to run:
 * yarn example examples/swaps/swap.ts
 */
import { BalancerSDK, Network } from '@feeless/sdk';
import { formatFixed } from '@ethersproject/bignumber';

const tokenIn = "0x553D8A5927FBA1c3eC05DdA667D6Cda3F5543d3a"; // wBTC
const tokenOut = '0xd8058dA2dF3FBaBC03Ad8Ca51cAB4AAa3614B209'; // wETH

const amount = String(BigInt(1e12)); // 1 wBTC

const sdk = new BalancerSDK({
  network: Network.MAINNET,
  rpcUrl: `https://json-rpc.evm.testnet.iotaledger.net`, // Uses a local fork for simulating transaction sending.
});

const { swaps } = sdk;

const erc20Out = sdk.contracts.ERC20(tokenOut, sdk.provider);

async function swap() {


  const signer = sdk.provider.getSigner();
  const account = await signer.getAddress();

  // Finding a trading route rely on on-chain data.
  // fetchPools will fetch the current data from the subgraph.
  // Let's fetch just 5 pools with highest liquidity of tokenOut.
  await swaps.fetchPools({
    first: 5,
    where: {
      swapEnabled: {
        eq: true,
      },
      tokensList: {
        contains: [tokenOut],
      },
    },
    orderBy: 'totalLiquidity',
    orderDirection: 'desc',
  });

  // Set exectution deadline to 60 seconds from now
  const deadline = String(Math.ceil(Date.now() / 1000) + 60);

  // Avoid getting rekt by setting low slippage from expected amounts out, 10 bsp = 0.1%
  const maxSlippage = 10;

  // Building the route payload
  const payload = await swaps.buildRouteExactIn(
    account,
    account,
    tokenIn, // eth
    tokenOut, // wBTC
    amount,
    {
      maxSlippage,
      deadline,
    }
  );

  // Extract parameters required for sendTransaction
  const { to, data, value } = payload;

  // Execution with ethers.js
  try {
    const balanceBefore = await erc20Out.balanceOf(account);

    await (
      await signer.sendTransaction({
        to,
        data,
        value,
      })
    ).wait();

    // check delta
    const balanceAfter = await erc20Out.balanceOf(account);

    console.log(
      `Amount of BTC received: ${formatFixed(
        balanceAfter.sub(balanceBefore),
        8
      )}`
    );
  } catch (err) {
    console.log(err);
  }
}

swap();
