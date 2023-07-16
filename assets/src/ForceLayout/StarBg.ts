import { _decorator, Component, Node, 
    Vec3, Prefab, find, instantiate, Label,
    resources, SpriteFrame, Sprite, Graphics, UITransform } from 'cc';
const { ccclass, property } = _decorator;

import {forceSimulation, forceLink, forceManyBody, forceCenter, forceX, forceY, forceCollide} from 'd3-force';
import {Game} from '../Game';
import G from '../global-data.js';
import {Coin} from './Coin';
import {SplitPool} from './SplitPool';

@ccclass('StarBg')
export class StarBg extends Component {
    @property({ type: Prefab })
    public starPrefab: Prefab = null;
    
    private GameObj: Game;

    private dynamicStarNode: Node[] = [];

    onLoad() {
        this.GameObj = find("Game").getComponent('Game') as Game;
    }

    start() {
        for (let i = 0; i < 80; ++i) {
            let starNode = this.addStar();
            this.node.addChild(starNode);
        }
    }

    addStar() {
        let starNode = instantiate(this.starPrefab);
        let x = Math.random() * 700 - 350;
        let y = Math.random() * 800 - 400;
        starNode.setPosition( new Vec3(x, y, 0) );

        let starTrans = starNode.getComponent(UITransform);

        let starType = Number((Math.random()*10%4).toFixed(0));
        
        starNode.getComponent(Sprite).spriteFrame = this.GameObj.starImgs[starType];

        if (starType == 0) {
            let size = Math.random()*15+5;
            starTrans.setContentSize(size, size);
        }
        if (starType == 1) starTrans.setContentSize(6, 6);
        if (starType == 2) starTrans.setContentSize(4, 6);
        if (starType == 3) starTrans.setContentSize(5, 5);
        return starNode;
    }

    update() {
        let ifAddStar  = Math.random() < 0.1;
        if (ifAddStar) {
            let starNode = this.addStar();
            this.node.addChild(starNode);

            this.dynamicStarNode.push(starNode);

            if (this.dynamicStarNode.length >= 10) {
                let deleteStarNode = this.dynamicStarNode.shift();
                this.node.removeChild(deleteStarNode)
            }
        }
    }
}