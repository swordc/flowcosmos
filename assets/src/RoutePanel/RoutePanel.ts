import { _decorator, Component, Sprite, Node, find, Prefab, instantiate,
    SpriteFrame, Label, UITransform
 } from 'cc';
const { ccclass, property } = _decorator;

import G from '../global-data.js';
import {Game} from '../Game';

@ccclass('RoutePanel')
export class RoutePanel extends Component {
    
    @property(Sprite)
    public tokenInIconSprite: Sprite = null;
    @property(Sprite)
    public tokenOutIconSprite: Sprite = null;
    @property(Node)
    public RouteBoard: Node = null;

    @property({ type: Prefab })
    public InvolvedPoolPanelPrefab: Prefab = null;
    @property({ type: Prefab })
    public InvolvedPoolItemPrefab: Prefab = null;
    @property({ type: Prefab })
    public InnverTokenItemPrefab: Prefab = null;
    @property({ type: Prefab })
    public RouteItemPrefab: Prefab = null;

    @property({ type: Node })
    public RouteAmountInPanel: Node = null;
    @property({ type: Prefab })
    public RouteItemAmountInRatio: Prefab = null;
    
    private GameObj: Game;

    onLoad() {
        this.GameObj = find("Game").getComponent('Game') as Game;
        this.GameObj.updateAllUIData.on('updateAllUIData', this.updateUIData, this);
    }

    start() {
        this.node.active = false;
    }
    onEnable () {
        
    }

    
    updateUIData() {
        if (G.G_TokenInKey.indexOf('A.') == 0 && G.G_TokenOutKey.indexOf('A.')==0
            && G.G_EvalSwapResp != null
        ) {
            this.node.active = true;
            
            let tokenKey2Index = {};
            for (let token of G.G_Tokens) {
                tokenKey2Index[token.key] = token.index;
            }

            //
            this.tokenInIconSprite.spriteFrame = this.GameObj.tokenImgs[tokenKey2Index[G.G_TokenInKey]];
            this.tokenOutIconSprite.spriteFrame = this.GameObj.tokenImgs[tokenKey2Index[G.G_TokenOutKey]];

            // 
            this.RouteBoard.removeAllChildren();
            this.RouteAmountInPanel.removeAllChildren();
            let totalAmountIn = Number(G.G_EvalSwapResp.tokenInAmount);
            let routeSize = G.G_EvalSwapResp.routes.length;
            for (let routeInfo of G.G_EvalSwapResp.routes) {
                let routeItemNode = instantiate(this.RouteItemPrefab);
                this.RouteBoard.addChild(routeItemNode);

                // amount in ratio in this router
                let routerAmountInRatioNode = instantiate(this.RouteItemAmountInRatio);
                let routerAmountIn = Number(routeInfo.routeAmountIn);
                routerAmountInRatioNode.getComponent(Label).string = (routerAmountIn*100.0/totalAmountIn).toFixed(0)+'%>';
                //routeItemNode.addChild(routerAmountInRatioNode);
                this.RouteAmountInPanel.addChild(routerAmountInRatioNode);

                for (let stepInfo of routeInfo.routeDetail) {
                    // Item: involved pools
                    let poolPanelNode = instantiate(this.InvolvedPoolPanelPrefab);
                    routeItemNode.addChild(poolPanelNode);

                    let tokenFrom = stepInfo.tokenIn;
                    let tokenTo = stepInfo.tokenOut;

                    for (let poolInfo of stepInfo.poolInvolved) {
                        let ratio = (poolInfo.poolInRatio * 100).toFixed(1);
                        let poolResource = poolInfo.poolInfo.poolKey;
                        let poolSourceIndex = -1;
                        if (poolResource == 'increment-v1') poolSourceIndex = 0;
                        else if (poolResource == 'increment-stable') poolSourceIndex = 1;
                        else if (poolResource == 'blocto') poolSourceIndex = 2;
                        else if (poolResource == 'metapier') poolSourceIndex = 3;

                        let poolItemNode = instantiate(this.InvolvedPoolItemPrefab);

                        let poolIcon = poolItemNode.getChildByName('PoolIcon').getComponent(Sprite);
                        poolIcon.spriteFrame = this.GameObj.poolSourceImgs[poolSourceIndex];
                        
                        let poolRatio = poolItemNode.getChildByName('PoolRatio').getComponent(Label);
                        poolRatio.string = ratio + '%';

                        poolPanelNode.addChild(poolItemNode);
                    }

                    // Item: token out
                    if (tokenTo != G.G_TokenOutKey) {
                        let tokenToNode = instantiate(this.InnverTokenItemPrefab);
                        tokenToNode.getChildByName('TokenIcon').getComponent(Sprite).spriteFrame = this.GameObj.tokenImgs[tokenKey2Index[tokenTo]];
                        tokenToNode.getChildByName('TokenName').getComponent(Label).string = G.G_Tokens[tokenKey2Index[tokenTo]].name;
                        routeItemNode.addChild(tokenToNode);
                    }
                }
            }

            let nodeTransform = this.node.getComponent(UITransform);

            let targetHeight = routeSize * 30+30;
            if (routeSize == 1) targetHeight = 40;
            // if (routeSize == 2) targetHeight = 80;
            // if (routeSize == 3) targetHeight = 100;
            this.node.getComponent(UITransform).setContentSize(nodeTransform.width, targetHeight);
        } else {
            this.node.active = false;
        }
    }

}

