import { _decorator, Component, Node, find } from 'cc';
const { ccclass, property } = _decorator;

import {Game} from './Game';
import {TokenBag} from './TokenBag';

@ccclass('TokenInBagCloseLayer')
export class TokenInBagCloseLayer extends Component {

    private GameObj: Game;

    start() {
        this.GameObj = find("Game").getComponent('Game') as Game;

        this.node.on(Node.EventType.TOUCH_END, () => {
            this.close();
        }, this);
    }

    close() {
        let tokenBagScript = this.node.parent.getChildByName('ScrollView').getComponent('TokenBag') as TokenBag;
        tokenBagScript.close();
    }
}