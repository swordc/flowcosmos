import { _decorator, Component, Node, EventTarget, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

import FCL from '../lib/fcl.umd.min.js';
import SCRIPT from './flow-script.js';
import G from './global-data.js';
import Router from './router/router.js';

@ccclass('Game')
export class Game extends Component {
    @property([SpriteFrame])
    public tokenImgs: SpriteFrame[]= [];
    @property(SpriteFrame)
    public tokenSelectImg: SpriteFrame= null;
    @property([SpriteFrame])
    public tokenPlanetImgs: SpriteFrame[]= [];

    @property([SpriteFrame])
    public poolSourceImgs: SpriteFrame[]= [];
    @property([SpriteFrame])
    public starImgs: SpriteFrame[]= [];


    private _queryInterval_userBalance = 20.0;
    private _queryDuration_userBalance = 20.0;

    public closeTokenBagEvent = new EventTarget();
    //public tokenInSelectEvent = new EventTarget();
    public updateAllUIData = new EventTarget();
    public relinkForceMap = new EventTarget();

    onLoad() {
        FCL.config().put('accessNode.api', 'https://access-mainnet-beta.onflow.org');
        FCL.config({'discovery.wallet': 'https://fcl-discovery.onflow.org/authn'});
        //FCL.config().put('accessNode.api', 'https://access-testnet.onflow.org');
        //FCL.config({'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn'});
        
        // FCL.config().put('0xFungibleToken', '0x9a0766d93b6608b7');
        // FCL.config().put('0xFlowToken', '0x7e60df042a9c0868');
        
        // FCL.config().put('0xSwapFactory', '0xcbed4c301441ded2');
        // FCL.config().put('0xStableSwapFactory', '0xcbed4c301441ded2');

        // FCL.config().put('0xFlowSwapPair', '0xd9854329b7edf136');
        // FCL.config().put('0xBltUsdtSwapPair', '0xc59604d4e65f14b3');
        // FCL.config().put('0xRevvFlowSwapPair', '0xd017f81bffc9aa05');
        // FCL.config().put('0xStarlyUsdtSwapPair', '0x22d84efc93a8b21a');
        // FCL.config().put('0xUsdcUsdtSwapPair', '0x481744401ea249c0');
        // FCL.config().put('0xFusdUsdtSwapPair', '0x3502a5dacaf350bb');

        // FCL.config().put('0xIPierPair', '0x86da006e3633da86');
        // FCL.config().put('0xPierPair', '0x86da006e3633da86');
        // FCL.config().put('0xPierSwapFactory', '0x86da006e3633da86');
        // FCL.config().put('0xPierSwapSettings', '0x74e9dc80becdd038');
        // FCL.config().put('0xPierRouter', '0x908e655daf37d0e7');
        // FCL.config().put('0xPierRouterLib', '0x908e655daf37d0e7');
        ///////////////////////////////////////////////////////////
        FCL.config().put('0xFungibleToken', '0xf233dcee88fe0abe');
        FCL.config().put('0xFlowToken', '0x1654653399040a61');
        FCL.config().put('0xTeleportedTetherToken', '0xcfdd90d4a00f7b5b');
        FCL.config().put('0xFiatToken', '0xb19436aae4d94622');
        FCL.config().put('0xFUSD', '0x3c5959b568896393');
        FCL.config().put('0xBloctoToken', '0x0f9df91c9121c460');
        FCL.config().put('0xStarlyToken', '0x142fa6570b62fd97');
        FCL.config().put('0xREVV', '0xd01e482eb680ec9f');

        
        FCL.config().put('0xSwapFactory', '0xb063c16cac85dbd1');
        FCL.config().put('0xSwapInterfaces', '0xb78ef7afa52ff906');
        FCL.config().put('0xSwapConfig', '0xb78ef7afa52ff906');
        FCL.config().put('0xSwapError', '0xb78ef7afa52ff906');
        FCL.config().put('0xStableSwapFactory', '0xb063c16cac85dbd1');

        FCL.config().put('0xFlowSwapPair', '0xc6c77b9f5c7a378f');
        FCL.config().put('0xBltUsdtSwapPair', '0xfcb06a5ae5b21a2d');
        FCL.config().put('0xRevvFlowSwapPair', '0x5e284fb7cff23a3f');
        FCL.config().put('0xStarlyUsdtSwapPair', '0x6efab66df92c37e4');
        FCL.config().put('0xUsdcUsdtSwapPair', '0x9c6f94adf47904b5');
        FCL.config().put('0xFusdUsdtSwapPair', '0x87f3f233f34b0733');

        FCL.config().put('0xIPierPair', '0x609e10301860b683');
        FCL.config().put('0xPierPair', '0x609e10301860b683');
        FCL.config().put('0xPierSwapFactory', '0x609e10301860b683');
        FCL.config().put('0xPierSwapSettings', '0x066a74dfb4da0306');
        FCL.config().put('0xPierRouter', '0xa0ebe96eb1366be6');
        FCL.config().put('0xPierRouterLib', '0xa0ebe96eb1366be6');

        FCL.config().put("app.detail.title", "FlowCosmos Aggregator");
        FCL.config().put("app.detail.icon", "https://i.pinimg.com/originals/98/ae/df/98aedf80e528da970209425e255e23f4.png");
        
        

        this.updateAllPoolInfos();
    }

    start() {
    }

    update(deltaTime: number) {
        this._queryDuration_userBalance += deltaTime;

        // let userAddr = G.getUserAddr();
        // if (this._queryDuration_userBalance > this._queryInterval_userBalance) {    
        //     if (userAddr != null) {
        //         let tokenNames = ['FLOW', 'USDC', 'USDT'];
        //         let tokenPaths = ['flowTokenBalance', 'USDCVaultBalance', 'teleportedTetherTokenBalance'];
        //         SCRIPT.QueryUserBalance(userAddr, tokenNames, tokenPaths);
        //         this._queryDuration_userBalance = 0.0;
        //     }
        // }
    }

    queryUserBalance() {
        let userAddr = G.getUserAddr();
        if (userAddr != null) {
            // https://github.com/FlowFans/flow-token-list/blob/main/src/tokens/flow-testnet.tokenlist.json
            
            let tokenNames = [];
            let tokenPaths = [];
            for (let token of G.G_Tokens) {
                tokenNames.push(token.name);
                tokenPaths.push(token.path);
            }
            return SCRIPT.QueryUserBalance(userAddr, tokenNames, tokenPaths);
        }
    }
    updateUserBalance() {
        let userAddr = G.getUserAddr();

        if (userAddr != null) {
            this.queryUserBalance().then(res => {
                for (let tokenName in res) {
                    G.G_UserBalances[tokenName] = res[tokenName];
                }

                // TODO
                this.updateAllUIData.emit('updateAllUIData');
        
            }).catch(error => {
                console.log(error);
            });
        }
        
        //setTimeout(this.updateUserBalance.bind(this), 5000);
    }

    queryAllPoolInfos() {
        let query1 = SCRIPT.QueryPoolInfo(0, 42, ['increment-v1']).then(res => {
            return res;
        });
        let query2 = SCRIPT.QueryPoolInfo(44, 9999, ['increment-v1']).then(res => {
            return res;
        });
        let query3 = SCRIPT.QueryPoolInfo(0, 9999, ['increment-stable', 'blocto', 'metapier']).then(res => {
            return res;
        })
        return Promise.all([query1, query2, query3]).then(values => {
            console.log('Complete fetching new prices.');
            for (let i = 0; i < values[0].length; ++i) {
                let poolInfo = values[0][i];
                let poolAddr = poolInfo[4];
                G.G_PoolInfos[poolAddr] = poolInfo;
            }
            for (let i = 0; i < values[1].length; ++i) {
                let poolInfo = values[1][i];
                let poolAddr = poolInfo[4];
                G.G_PoolInfos[poolAddr] = poolInfo;
            }
            for (let i = 0; i < values[2].length; ++i) {
                let poolInfo = values[2][i];
                let poolAddr = poolInfo[4];
                G.G_PoolInfos[poolAddr] = poolInfo;
            }

            if (G.G_TokenInKey.indexOf('A.')==0 && G.G_TokenOutKey.indexOf('A.')==0 &&
                G.G_TokenInAmount != '' && Number(G.G_TokenInAmount) > 0
            ) {
                this.evalSwap();
                this.updateAllUIData.emit('updateAllUIData');
            }
        }).catch(error => {
            throw error;
        });
    }
    updateAllPoolInfos() {
        this.queryAllPoolInfos().then(res => {
            // 
            Router.InitRouter(G.getAllPoolInfosArray());

            setTimeout(this.updateAllPoolInfos.bind(this), 10*1000);
        }).catch(error => {
            console.log(error);
            setTimeout(this.updateAllPoolInfos.bind(this), 1*1000);
        });
    }

    evalSwap() {
        let tokenInAmount = Number(G.G_TokenInAmount);
        if (tokenInAmount > 0 && G.G_TokenInKey.indexOf('A.') == 0 && G.G_TokenOutKey.indexOf('A.') == 0) {
            let resJson = Router.EvaSwap(G.G_TokenInKey, G.G_TokenOutKey, tokenInAmount, 0.0);
            G.G_TokenOutAmount = resJson.tokenOutAmount.toFixed(8);

            G.G_EvalSwapResp = resJson;
            console.log(resJson);

            // emit relink force map
            this.relinkForceMap.emit('relinkForceMap', true);
        } else {
            G.G_forceMapSimulation.alphaTarget(0.3).restart();
        }
    }

    

}

