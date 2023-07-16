import { _decorator, Component, Label, find } from 'cc';
//import FCL from '../lib/fcl.umd.min.js';
//import TX from './flow-transaction.js';
import G from './global-data.js';
import { TokenBag } from './TokenBag.js';
import {Game} from './Game';

const { ccclass, property } = _decorator;

@ccclass('TokenInBagOpenButton')
export class TokenInBagOpenButton extends Component {

    private GameObj: Game;


    start() {
        this.GameObj = find("Game").getComponent('Game') as Game;
    }

    update(deltaTime: number) {

    }

    click() {
        let tokenBagNode = this.node.getChildByName('TokenBag');
        let tokenBagNodeScript = tokenBagNode.getChildByName('ScrollView').getComponent('TokenBag') as TokenBag;
        if (tokenBagNode.active == false) {
            
            this.GameObj.closeTokenBagEvent.emit('closeTokenBagEvent');

            tokenBagNodeScript.open();
            tokenBagNode.active = true;
        }
    }

    close() {
        let tokenBagNode = this.node.getChildByName('TokenBag');
        tokenBagNode.active = false;
    }
}

