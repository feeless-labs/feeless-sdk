import dotenv from 'dotenv';
import { Network } from '@/lib/constants/network';
import { AddressZero } from '@ethersproject/constants';
dotenv.config();
export const TEST_BLOCK = {
  [Network.MAINNET]: 17473802
};
export const PROVIDER_URLS = {
  [Network.MAINNET]: `https://mainnet.infura.io/v3/${process.env.INFURA}`
};
export type TestAddress = {
  id?: string;
  address: string;
  decimals: number;
  symbol?: string;
  slot?: number;
};
export type TestAddresses = {
  [key: string]: TestAddress;
};
export const ADDRESSES = {
  [Network.MAINNET]: {
    APE: {
      address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
      decimals: 18,
      slot: 0,
    },
    sAPE: {
      address: '0x7966C5BAe631294D7cFFcEA5430b78C2F76DB6Fa',
      decimals: 18,
      slot: 3,
    },
    ETH: {
      address: AddressZero,
      decimals: 18,
      symbol: 'ETH',
    },
    BAL: {
      address: '0xba100000625a3754423978a60c9317c58a424e3d',
      decimals: 18,
      symbol: 'BAL',
      slot: 1,
    },
    USDC: {
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      decimals: 6,
      symbol: 'USDC',
      slot: 9,
    },
    USDT: {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6,
      symbol: 'USDT',
      slot: 2,
    },
    WBTC: {
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      decimals: 8,
      symbol: 'WBTC',
      slot: 0,
    },
    renBTC: {
      address: '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
      decimals: 8,
      symbol: 'renBTC',
      slot: 102,
    },
    WETH: {
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      decimals: 18,
      symbol: 'WETH',
      slot: 3,
    },
    DAI: {
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      decimals: 18,
      symbol: 'DAI',
      slot: 2,
    },
    aDAI: {
      address: '0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d',
      decimals: 18,
      symbol: 'aDAI',
      slot: 0,
    },
    eDAI: {
      address: '0xe025e3ca2be02316033184551d4d3aa22024d9dc',
      decimals: 18,
      symbol: 'eDAI',
      slot: 0,
    },
    STETH: {
      address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
      decimals: 18,
      symbol: 'STETH',
      slot: 0,
    },
    wSTETH: {
      address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
      decimals: 18,
      symbol: 'wSTETH',
      slot: 0,
    },
    bbausd: {
      id: '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb20000000000000000000000fe',
      address: '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb2',
      decimals: 18,
      symbol: 'bbausd',
      slot: 0,
    },
    bbausdcV1: {
      address: '0x9210F1204b5a24742Eba12f710636D76240dF3d0',
      decimals: 18,
      symbol: 'bbausdc',
      slot: 0,
    },
    bbausdtV1: {
      address: '0x2BBf681cC4eb09218BEe85EA2a5d3D13Fa40fC0C',
      decimals: 18,
      symbol: 'bbausdt',
      slot: 0,
    },
    bbadaiV1: {
      address: '0x804CdB9116a10bB78768D3252355a1b18067bF8f',
      decimals: 18,
      symbol: 'bbadai',
      slot: 0,
    },
    bbausd2: {
      id: '0xa13a9247ea42d743238089903570127dda72fe4400000000000000000000035d',
      address: '0xa13a9247ea42d743238089903570127dda72fe44',
      decimals: 18,
      symbol: 'bbausd2',
      slot: 0,
    },
    bbausd3: {
      id: '0xfebb0bbf162e64fb9d0dfe186e517d84c395f016000000000000000000000502',
      address: '0xfebb0bbf162e64fb9d0dfe186e517d84c395f016',
      decimals: 18,
      symbol: 'bbausd3',
      slot: 0,
    },
    bbausdcOld: {
      address: '0x9210F1204b5a24742Eba12f710636D76240dF3d0',
      decimals: 18,
      symbol: 'bbausdcOld',
    },
    waDAI: {
      address: '0x02d60b84491589974263d922d9cc7a3152618ef6',
      decimals: 18,
      symbol: 'waDAI',
      slot: 52,
    },
    waUSDC: {
      address: '0xd093fa4fb80d09bb30817fdcd442d4d02ed3e5de',
      decimals: 6,
      symbol: 'waUSDC',
      slot: 52,
    },
    waUSDT: {
      address: '0xf8Fd466F12e236f4c96F7Cce6c79EAdB819abF58',
      decimals: 6,
      symbol: 'waUSDT',
      slot: 52,
    },
    WBTCWETH: {
      id: '0xa6f548df93de924d73be7d25dc02554c6bd66db500020000000000000000000e',
      address: '0xa6f548df93de924d73be7d25dc02554c6bd66db5',
      decimals: 18,
      symbol: 'B-50WBTC-50WETH',
      slot: 0,
    },
    auraBal: {
      address: '0x616e8bfa43f920657b3497dbf40d6b1a02d4608d',
      decimals: 18,
      symbol: 'auraBal',
      slot: 0,
    },
    BAL8020BPT: {
      address: '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56',
      decimals: 18,
      symbol: 'BAL8020BPT',
      slot: 0,
    },
    bbausdc: {
      address: '0x82698aeCc9E28e9Bb27608Bd52cF57f704BD1B83'.toLowerCase(),
      decimals: 18,
      symbol: 'bbausdc',
      slot: 0,
    },
    bbausdt: {
      address: '0x2F4eb100552ef93840d5aDC30560E5513DFfFACb'.toLowerCase(),
      decimals: 18,
      symbol: 'bbausdt',
    },
    bbadai: {
      address: '0xae37D54Ae477268B9997d4161B96b8200755935c'.toLowerCase(),
      decimals: 18,
      symbol: 'bbadai',
      slot: 0,
    },
    bbausdc3: {
      address: '0xcbfa4532d8b2ade2c261d3dd5ef2a2284f792692'.toLowerCase(),
      decimals: 18,
      symbol: 'bbausdc',
      slot: 0,
    },
    bbausdt3: {
      address: '0xa1697f9af0875b63ddc472d6eebada8c1fab8568'.toLowerCase(),
      decimals: 18,
      symbol: 'bbausdt',
    },
    bbadai3: {
      address: '0x6667c6fa9f2b3fc1cc8d85320b62703d938e4385'.toLowerCase(),
      decimals: 18,
      symbol: 'bbadai',
      slot: 0,
    },
    wstETH_bbaUSD: {
      id: '0x25accb7943fd73dda5e23ba6329085a3c24bfb6a000200000000000000000387',
      address: '0x25accb7943fd73dda5e23ba6329085a3c24bfb6a',
      decimals: 18,
      symbol: 'wstETH_bbaUSD',
      slot: 0,
    },
    wstETH_bbeUSD: {
      id: '0x4fd4687ec38220f805b6363c3c1e52d0df3b5023000200000000000000000473',
      address: '0x4fd4687ec38220f805b6363c3c1e52d0df3b5023',
      decimals: 18,
      symbol: '50wstETH-50bb-euler-USD',
      slot: 0,
    },
    bbeUSD: {
      id: '0x50cf90b954958480b8df7958a9e965752f62712400000000000000000000046f',
      address: '0x50cf90b954958480b8df7958a9e965752f627124',
      decimals: 18,
      symbol: 'bb-e-USD',
      slot: 0,
    },
    bbeUSDT: {
      id: '0x3c640f0d3036ad85afa2d5a9e32be651657b874f00000000000000000000046b',
      address: '0x3C640f0d3036Ad85Afa2D5A9E32bE651657B874F',
      decimals: 18,
      symbol: 'bb-e-USDT',
      slot: 0,
    },
    bbeUSDC: {
      id: '0xd4e7c1f3da1144c9e2cfd1b015eda7652b4a439900000000000000000000046a',
      address: '0xD4e7C1F3DA1144c9E2CfD1b015eDA7652b4a4399',
      decimals: 18,
      symbol: 'bb-e-USDC',
      slot: 0,
    },
    bbeDAI: {
      id: '0xeb486af868aeb3b6e53066abc9623b1041b42bc000000000000000000000046c',
      address: '0xeB486AF868AeB3b6e53066abc9623b1041b42bc0',
      decimals: 18,
      symbol: 'bb-e-DAI',
    },
    temple_bbeusd: {
      id: '0xa718042e5622099e5f0ace4e7122058ab39e1bbe000200000000000000000475',
      address: '0xa718042e5622099e5f0ace4e7122058ab39e1bbe',
      decimals: 18,
      symbol: 'temple_bbeusd',
      slot: 0,
    },
    bbeusd: {
      id: '0x50cf90b954958480b8df7958a9e965752f62712400000000000000000000046f',
      address: '0x50cf90b954958480b8df7958a9e965752f627124',
      decimals: 18,
      symbol: 'bbeusd',
      slot: 0,
    },
    bbeusdt: {
      id: '0x3c640f0d3036ad85afa2d5a9e32be651657b874f00000000000000000000046b',
      address: '0x3c640f0d3036ad85afa2d5a9e32be651657b874f',
      decimals: 18,
      symbol: 'bbeusdt',
      slot: 0,
    },
    bbeusdc: {
      id: '0xd4e7c1f3da1144c9e2cfd1b015eda7652b4a439900000000000000000000046a',
      address: '0xd4e7c1f3da1144c9e2cfd1b015eda7652b4a4399',
      decimals: 18,
      symbol: 'bbeusdc',
      slot: 0,
    },
    bbedai: {
      id: '0xeb486af868aeb3b6e53066abc9623b1041b42bc000000000000000000000046c',
      address: '0xeb486af868aeb3b6e53066abc9623b1041b42bc0',
      decimals: 18,
      symbol: 'bbedai',
      slot: 0,
    },
    wstETH_rETH_sfrxETH: {
      id: '0x5aee1e99fe86960377de9f88689616916d5dcabe000000000000000000000467',
      address: '0x5aee1e99fe86960377de9f88689616916d5dcabe',
      decimals: 18,
      symbol: 'wstETH-rETH-sfrxETH-BPT',
      slot: 0,
    },
    rETH: {
      id: '',
      address: '0xac3e018457b222d93114458476f3e3416abbe38f',
      decimals: 18,
      symbol: 'rETH',
      slot: 0,
    },
    sfrxETH: {
      id: '',
      address: '0xae78736cd615f374d3085123a210448e74fc6393',
      decimals: 18,
      symbol: 'sfrxETH',
      slot: 0,
    },
    bbgusd: {
      id: '0x99c88ad7dc566616548adde8ed3effa730eb6c3400000000000000000000049a',
      address: '0x99c88ad7dc566616548adde8ed3effa730eb6c34',
      decimals: 18,
      symbol: 'bb-g-USD',
      slot: 0,
    },
    bbgusdc: {
      id: '0x4a82b580365cff9b146281ab72500957a849abdc000000000000000000000494',
      address: '0x4a82b580365cff9b146281ab72500957a849abdc',
      decimals: 18,
      symbol: 'bb-g-USDC',
      slot: 0,
    },
    bbgdai: {
      id: '0xe03af00fabe8401560c1ff7d242d622a5b601573000000000000000000000493',
      address: '0xe03af00fabe8401560c1ff7d242d622a5b601573',
      decimals: 18,
      symbol: 'bb-g-DAI',
      slot: 0,
    },
    STG_BBAUSD: {
      id: '0x639883476960a23b38579acfd7d71561a0f408cf000200000000000000000505',
      address: '0x639883476960a23b38579acfd7d71561a0f408cf',
      decimals: 18,
      symbol: 'stg-bbausd',
      slot: 0,
    },
    STG: {
      address: '0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6'.toLowerCase(),
      decimals: 18,
      symbol: 'STG',
      slot: 0,
    },
    wstEthBoostedApe: {
      id: '0x959216bb492b2efa72b15b7aacea5b5c984c3cca000200000000000000000472',
      address: '0x959216BB492B2efa72b15B7AAcEa5B5C984c3ccA',
      decimals: 18,
      symbol: '50wstETH-50stk-APE',
      slot: 0,
    },
    bbtape: {
      id: '0x126e7643235ec0ab9c103c507642dc3f4ca23c66000000000000000000000468',
      address: '0x126e7643235ec0ab9c103c507642dC3F4cA23C66',
      decimals: 18,
      symbol: 'bb-t-stkAPE',
      slot: 0,
    },
    swEth_bbaweth: {
      id: '0x02d928e68d8f10c0358566152677db51e1e2dc8c00000000000000000000051e',
      address: '0x02d928e68d8f10c0358566152677db51e1e2dc8c',
      decimals: 18,
      symbol: 'swETH-bbawETH-BPT',
      slot: 0,
    },
    bbaweth: {
      id: '0x60d604890feaa0b5460b28a424407c24fe89374a0000000000000000000004fc',
      address: '0x60d604890feaa0b5460b28a424407c24fe89374a',
      decimals: 18,
      symbol: 'bbaweth',
      slot: 0,
    },
    swETH: {
      address: '0xf951e335afb289353dc249e82926178eac7ded78',
      decimals: 18,
      symbol: 'swETH',
      slot: 98,
    },
    vETH: {
      address: '0x4bc3263eb5bb2ef7ad9ab6fb68be80e43b43801f',
      decimals: 18,
      symbol: 'vETH',
      slot: 0,
    },
    bveth: {
      id: '0x793f2d5cd52dfafe7a1a1b0b3988940ba2d6a63d0000000000000000000004f8',
      address: '0x793f2d5cd52dfafe7a1a1b0b3988940ba2d6a63d',
      decimals: 18,
      symbol: 'bveth',
      slot: 0,
    },
  },
}