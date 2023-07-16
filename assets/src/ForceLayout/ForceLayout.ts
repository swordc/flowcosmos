import { _decorator, Component, Node, 
    Vec3, Prefab, find, instantiate, Label, Color,
    Sprite, Graphics, UITransform } from 'cc';
const { ccclass, property } = _decorator;

import {forceSimulation, forceLink, forceManyBody, forceCenter, forceX, forceY, forceCollide} from 'd3-force';
import {Game} from '../Game';
import G from '../global-data.js';
import {Coin} from './Coin';

@ccclass('ForceLayout')
export class ForceLayout extends Component {
    @property([Node])
    public nodeObjs: Node[] = [];

    @property({ type: Prefab })
    public coinPrefab: Prefab = null;
    @property({ type: Prefab })
    public splitPoolPrefab: Prefab = null;

    private GameObj: Game;

    onLoad() {
        this.GameObj = find("Game").getComponent('Game') as Game;
    }

    onEnable () {
        this.GameObj.relinkForceMap.on('relinkForceMap', this.recreateForceMapNodeAndLink, this);
    }

    onDisable () {
        this.GameObj.relinkForceMap.off('relinkForceMap', this.recreateForceMapNodeAndLink, this);
    }
    start() {
        G.G_CoinNodeInfos = [];
        
        let collides = [];
        // token node
        for (let token of G.G_Tokens) {
            let tokenName = token.name;

            let coinNode = instantiate(this.coinPrefab);
            let coinScript = coinNode.getComponent(Coin);
            // name label
            let coinNameLaber = coinNode.getChildByName('CoinName').getComponent(Label);
            coinNameLaber.string = tokenName;
            // icon
            let coinIconSprite = coinNode.getChildByName('CoinIcon').getComponent(Sprite);
            coinIconSprite.spriteFrame = this.GameObj.tokenPlanetImgs[token.index];
            // resize
            coinIconSprite.getComponent(UITransform).setContentSize(token.width, token.height);
            
            let nodeInfo = {
                nodeObj: coinNode,
                id: token.key,
                group: 1,
                radius: token.collide,
                fx: null,
                fy: null,
                forceYLevel: -1,
                forceYStrength: 0,
            };
            coinScript.nodeInfo = nodeInfo;
            G.G_CoinNodeInfos.push(nodeInfo);
            collides.push(token.collide);

            this.node.addChild(coinNode);
        }
        G.G_forceMapSimulation = forceSimulation(G.G_CoinNodeInfos);
        this.relinkForceMap();
        //G.G_forceMapSimulation.force("x", forceX());
        //G.G_forceMapSimulation.force("y", forceY());
        G.G_forceMapSimulation.force("charge", forceManyBody().strength(-10).distanceMin(100));
        G.G_forceMapSimulation.force("collide", forceCollide().radius(d => d.radius).iterations(2));
        G.G_forceMapSimulation.on('tick', this.updateForceMap.bind(this));
    }

    createExtraNodeInForceMap() {
        G.G_forceMapLinks = [];
        G.G_CoinNodeIdInCurrentLink = {};
        // Merge link
        let linkDict = {};
        let linkArray = [];
        let nodeGap = G.G_ForceMapTokenInOutDis;
        
        if (G.G_EvalSwapResp != null) {
            for (let routeInfo of G.G_EvalSwapResp.routes) {
                let routeLength = routeInfo.route.length;
                for (let i = 0; i < routeLength-1; ++i) {
                    let fromToken = routeInfo.route[i];
                    let toToken = routeInfo.route[i+1];
                    if ((fromToken in linkDict) == false || (toToken in linkDict[fromToken]) == false) {
                        if (fromToken != G.G_TokenInKey && fromToken != G.G_TokenOutKey) G.G_CoinNodeIdInCurrentLink[fromToken] = true;
                        if (toToken != G.G_TokenInKey && toToken != G.G_TokenOutKey) G.G_CoinNodeIdInCurrentLink[toToken] = true;
                    
                        let dis = -1;
                        if (routeLength == 2) dis = nodeGap;
                        if (routeLength == 3) dis = nodeGap * 0.7;
                        if (routeLength == 4) dis = nodeGap * 0.5;
                        if (routeLength == 5) dis = nodeGap * 0.4;
                        
                        //if (routeLength == 4) dis = nodeGap * 0.6;
                        linkArray.push(
                            {
                                source: fromToken,
                                target: toToken,
                                dis: dis
                            }
                        );
                        if ((fromToken in linkDict) == false) linkDict[fromToken] = {};
                        linkDict[fromToken][toToken] = true;
                    }
                }
            }
        }
        G.G_forceMapLinks = linkArray;


        // split pool node
        let poolInfos = {};
        let poolInTotals = {};
        if (G.G_EvalSwapResp != null) {
            for (let routeInfo of G.G_EvalSwapResp.routes) {
                for (let routeDetailInfo of routeInfo.routeDetail) {
                    let tokenIn = routeDetailInfo.tokenIn;
                    let tokenOut = routeDetailInfo.tokenOut;
                    for (let poolInvolved of routeDetailInfo.poolInvolved) {
                        let poolKey = poolInvolved.poolInfo.poolKey;
                        let poolAddress = poolInvolved.poolInfo.poolAddress;
                        let poolIn = poolInvolved.poolIn;
                        
                        if ((tokenIn in poolInfos) == false) {
                            poolInfos[tokenIn] = {};
                            poolInTotals[tokenIn] = {};
                        }
                        if ((tokenOut in poolInfos[tokenIn]) == false) {
                            poolInfos[tokenIn][tokenOut] = {};
                            poolInTotals[tokenIn][tokenOut] = poolIn;
                        } else {
                            poolInTotals[tokenIn][tokenOut] += poolIn;
                        }
                        if ((poolKey in poolInfos[tokenIn][tokenOut]) == false) {
                            poolInfos[tokenIn][tokenOut][poolKey] = {
                                poolAddress: poolAddress,
                                poolIn: poolIn
                            };
                        } else {
                            poolInfos[tokenIn][tokenOut][poolKey].poolIn += poolIn;
                        }
                    }
                }
            }
        }
        
        G.G_forceMapSimulation.nodes(G.G_CoinNodeInfos);

        //console.log('inner node', G.G_CoinNodeIdInCurrentLink);
        if (G.G_EvalSwapResp != null) {
            G.G_forceMapSimulation.force("y", forceY(d => {
                if (d.id in G.G_CoinNodeIdInCurrentLink) {
                    return 160;
                }
                return -160;
            }).strength(d => {
                if (d.id in G.G_CoinNodeIdInCurrentLink) {
                    return 0.05;
                }
                return 0.1;
            }));
        }
    }

    update(deltaTime: number) {
    }

    recreateForceMapNodeAndLink() {
        this.createExtraNodeInForceMap();
        this.relinkForceMap(false);
        G.G_forceMapSimulation.alpha(1).restart();
    }

    updateForceMap() {
        let nodeDict = {};
        for (let node of G.G_CoinNodeInfos) {
            node.nodeObj.setPosition( new Vec3(node.x, node.y, 0) );

            if (node.x >= 250) node.x = 250;
            if (node.x <= -250) node.x = -250;
            if (node.y >= 250) node.y = 250;
            if (node.y <= -250) node.y = -250;
            
            node.nodeObj.position.x = node.x;
            node.nodeObj.position.y = node.y;
            
            nodeDict[node.id] = node;
        }

        // draw links
        let ctx = this.node.getComponent(Graphics);
        ctx.clear();
        ctx.lineWidth = 3;
        ctx.strokeColor = new Color().fromHEX('#75FBFB');
        for (let link of G.G_forceMapLinks) {
            let fromNode = link['source'];
            let toNode = link['target'];
            ctx.moveTo(fromNode.x, fromNode.y);
            
            ctx.lineTo(toNode.x, toNode.y);
        }
        ctx.stroke();
    }

    relinkForceMap(ifRestart=false) {
        let linksSimulate = forceLink(G.G_forceMapLinks).distance(d => {
            if (d.dis > 0) {
                return d.dis;
            }
            return 200;
        }).id(d => d.id);

        G.G_forceMapSimulation.force('link', linksSimulate);
        if (ifRestart) G.G_forceMapSimulation.alpha(1).restart();
    }
}