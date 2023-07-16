import { _decorator, Component, Node, find } from 'cc';
const { ccclass, property } = _decorator;

import {Game} from './Game';
import {TokenBag} from './TokenBag';

@ccclass('CloseLayer')
export class CloseLayer extends Component {

    private GameObj: Game;

    start() {
        this.GameObj = find("Game").getComponent('Game') as Game;

        this.node.on(Node.EventType.TOUCH_END, () => {
            this.close();
        }, this);
    }

    update(deltaTime: number) {

    }

    close() {
        let tokenBagScript = this.node.parent.active = false;
    }
}