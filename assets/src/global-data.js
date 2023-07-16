
let G_UserAddr = null;

// {poolAddress: poolInfo}
let G_PoolInfos = {};
let G_UserBalances = {};

//let G_TokenInKey = 'A.7e60df042a9c0868.FlowToken';
let G_TokenInKey = 'A.1654653399040a61.FlowToken';
let G_TokenInName = 'FLOW';
let G_TokenInAmount = '';

let G_TokenOutKey = '';
let G_TokenOutName = 'Select';
let G_TokenOutAmount = '';

let G_Tid = null;
let G_TxStatus = null;
let G_Slippage = 0.01;

let G_EvalSwapResp = null;

// testnet
// let G_Tokens = [
//     {name: 'Flow', index: 0, amount: 0, collide: 50, key: 'A.7e60df042a9c0868.FlowToken' },
//     {name: 'USDC', index: 1, amount: 0, collide: 50, key: 'A.a983fecbed621163.FiatToken' },
//     {name: 'stFlow', index: 2, amount: 0, collide: 30, key: 'A.e45c64ecfe31e465.stFlowToken' },
//     {name: 'tUSDT', index: 3, amount: 0, collide: 30, key: 'A.ab26e0a07d770ec1.TeleportedTetherToken' },
//     {name: 'FUSD', index: 4, amount: 0, collide: 30, key: 'A.e223d8a629e49c68.FUSD' },
//     {name: 'BLT', index: 5, amount: 0, collide: 30, key: 'A.6e0797ac987005f5.BloctoToken' },
//     {name: 'My', index: 6, amount: 0, collide: 30, key: 'A.40212f3e288efd03.MyToken' },
//     {name: 'REVV', index: 7, amount: 0, collide: 30, key: 'A.14ca72fa4d45d2c3.REVV' },
//     {name: 'STARLY', index: 8, amount: 0, collide: 30, key: 'A.f63219072aaddd50.StarlyToken' },
// ];
let G_Tokens = [
    {name: 'FLOW', width: 80, height: 80, index: 0, amount: 0, collide: 40, key: 'A.1654653399040a61.FlowToken', path: 'flowTokenBalance', receiverPath: 'flowTokenReceiver', vaultPath: 'flowTokenVault'},
    {name: 'USDC', width: 70, height: 60, index: 1, amount: 0, collide: 40, key: 'A.b19436aae4d94622.FiatToken', path: 'USDCVaultBalance', receiverPath: 'USDCVaultReceiver', vaultPath: 'USDCVault'},
    {name: 'stFLOW', width: 50, height: 50, index: 2, amount: 0, collide: 30, key: 'A.d6f80565193ad727.stFlowToken', path: 'stFlowTokenBalance', receiverPath: 'stFlowTokenReceiver', vaultPath: 'stFlowTokenVault'},
    {name: 'tUSDT', width: 50, height: 50, index: 3, amount: 0, collide: 30, key: 'A.cfdd90d4a00f7b5b.TeleportedTetherToken', path: 'teleportedTetherTokenBalance', receiverPath: 'teleportedTetherTokenReceiver', vaultPath: 'teleportedTetherTokenVault'},
    {name: 'FUSD', width: 50, height: 50, index: 4, amount: 0, collide: 30, key: 'A.3c5959b568896393.FUSD', path: 'fusdBalance', receiverPath: 'fusdReceiver', vaultPath: 'fusdVault'},
    {name: 'BLT', width: 50, height: 50, index: 5, amount: 0, collide: 30, key: 'A.0f9df91c9121c460.BloctoToken', path: 'bloctoTokenBalance', receiverPath: 'bloctoTokenReceiver', vaultPath: 'bloctoTokenVault'},
    {name: 'MY', width: 50, height: 50, index: 6, amount: 0, collide: 30, key: 'A.348fe2042c8a70d8.MyToken', path: 'mytokenBalance', receiverPath: 'mytokenReceiver', vaultPath: 'mytokenVault'},
    {name: 'REVV', width: 50, height: 50, index: 7, amount: 0, collide: 30, key: 'A.d01e482eb680ec9f.REVV', path: 'revvBalance', receiverPath: 'revvReceiver', vaultPath: 'revvVault'},
    {name: 'STARLY', width: 50, height: 50, index: 8, amount: 0, collide: 30, key: 'A.142fa6570b62fd97.StarlyToken', path: 'starlyTokenBalance', receiverPath: 'starlyTokenReceiver', vaultPath: 'starlyTokenVault'},
    {name: 'ceWETH', width: 50, height: 50, index: 9, amount: 0, collide: 30, key: 'A.231cc0dbbcffc4b7.ceWETH', path: 'ceWETHBalance', receiverPath: 'ceWETHReceiver', vaultPath: 'ceWETHVault'},
    {name: 'ceWBTC', width: 80, height: 75, index: 10, amount: 0, collide: 30, key: 'A.231cc0dbbcffc4b7.ceWBTC', path: 'ceWBTCBalance', receiverPath: 'ceWBTCReceiver', vaultPath: 'ceWBTCVault'},
    {name: 'Sloppy', width: 55, height: 50, index: 11, amount: 0, collide: 30, key: 'A.53f389d96fb4ce5e.SloppyStakes', path: 'SloppyStakesMetadata', receiverPath: 'SloppyStakesReceiver', vaultPath: 'SloppyStakesVault'},
    {name: 'DUCK', width: 50, height: 50, index: 12, amount: 0, collide: 30, key: 'A.48ff88b4ccb47359.Duckcoin', path: 'DuckcoinMetadata', receiverPath: 'DuckcoinReceiver', vaultPath: 'DuckcoinVault'},
    {name: 'SDM', width: 50, height: 50, index: 13, amount: 0, collide: 30, key: 'A.c8c340cebd11f690.SdmToken', path: 'sdmTokenBalance', receiverPath: 'sdmTokenReceiver', vaultPath: 'sdmTokenVault'},
];
// coin nodes in the force map
// {id, group, radius, ...}
let G_ForceMapTokenInOutDis = 400;

let G_CoinNodeInfos = [];
let G_CoinNodeIdInCurrentLink = {};

let G_forceMapSimulation = null;
// [{source, target}]
let G_forceMapLinks = [
    // {source: 'A.1654653399040a61.FlowToken', target: 'A.b19436aae4d94622.FiatToken'},
    // {source: 'A.1654653399040a61.FlowToken', target: 'A.d6f80565193ad727.stFlowToken'},
    // {source: 'A.1654653399040a61.FlowToken', target: 'A.cfdd90d4a00f7b5b.TeleportedTetherToken'},
    // {source: 'A.1654653399040a61.FlowToken', target: 'A.3c5959b568896393.FUSD'},
    // {source: 'A.1654653399040a61.FlowToken', target: 'A.0f9df91c9121c460.BloctoToken'},
    // {source: 'A.1654653399040a61.FlowToken', target: 'A.348fe2042c8a70d8.MyToken'},
    // {source: 'A.1654653399040a61.FlowToken', target: 'A.d01e482eb680ec9f.REVV'},
    // {source: 'A.1654653399040a61.FlowToken', target: 'A.142fa6570b62fd97.StarlyToken'},
    // {source: 'A.1654653399040a61.FlowToken', target: 'A.231cc0dbbcffc4b7.ceWETH'},
    // {source: 'A.1654653399040a61.FlowToken', target: 'A.231cc0dbbcffc4b7.ceWBTC'},
    // {source: 'A.1654653399040a61.FlowToken', target: 'A.53f389d96fb4ce5e.SloppyStakes'},
    // {source: 'A.1654653399040a61.FlowToken', target: 'A.48ff88b4ccb47359.Duckcoin'},
    // {source: 'A.1654653399040a61.FlowToken', target: 'A.c8c340cebd11f690.SdmToken'},
    
    // {source: 'A.b19436aae4d94622.FiatToken', target: 'A.d6f80565193ad727.stFlowToken'},
    // {source: 'A.b19436aae4d94622.FiatToken', target: 'A.cfdd90d4a00f7b5b.TeleportedTetherToken'},
    // {source: 'A.b19436aae4d94622.FiatToken', target: 'A.d01e482eb680ec9f.REVV'},
    // {source: 'A.b19436aae4d94622.FiatToken', target: 'A.231cc0dbbcffc4b7.ceWETH'},
    // {source: 'A.b19436aae4d94622.FiatToken', target: 'A.231cc0dbbcffc4b7.ceWBTC'},

    // {source: 'A.cfdd90d4a00f7b5b.TeleportedTetherToken', target: 'A.3c5959b568896393.FUSD'},
    // {source: 'A.cfdd90d4a00f7b5b.TeleportedTetherToken', target: 'A.0f9df91c9121c460.BloctoToken'},
    // {source: 'A.cfdd90d4a00f7b5b.TeleportedTetherToken', target: 'A.142fa6570b62fd97.StarlyToken'},
    // {source: 'A.cfdd90d4a00f7b5b.TeleportedTetherToken', target: 'A.d01e482eb680ec9f.REVV'},
    
];

// testnet
// let G_CenterTokens = [
//     "A.7e60df042a9c0868.FlowToken",
//     "A.e45c64ecfe31e465.stFlowToken",
//     "A.ab26e0a07d770ec1.TeleportedTetherToken",
//     "A.e223d8a629e49c68.FUSD",
//     "A.a983fecbed621163.FiatToken"
// ];
let G_CenterTokens = [
    "A.1654653399040a61.FlowToken",
    "A.3c5959b568896393.FUSD",
    "A.b19436aae4d94622.FiatToken",
    "A.cfdd90d4a00f7b5b.TeleportedTetherToken",
    "A.231cc0dbbcffc4b7.ceWETH",
    "A.231cc0dbbcffc4b7.ceWBTC"
];

function setUserAddr(addr) { G_UserAddr = addr; }
function getUserAddr() { return G_UserAddr; }
function getAllPoolInfosArray() { return Object.values(G_PoolInfos); }
module.exports = {
    setUserAddr,
    getUserAddr,

    G_PoolInfos,
    getAllPoolInfosArray,

    G_UserBalances,
    G_TokenInKey,
    G_TokenInName,
    G_TokenInAmount,
    G_TokenOutKey,
    G_TokenOutName,
    G_TokenOutAmount,
    G_Tokens,
    G_CenterTokens,
    G_EvalSwapResp,
    G_forceMapSimulation,
    G_CoinNodeInfos,
    G_forceMapLinks,
    G_ForceMapTokenInOutDis,
    G_CoinNodeIdInCurrentLink,
    G_Tid,
    G_TxStatus,
    G_Slippage,
};