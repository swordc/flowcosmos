import { _decorator, Component, Node, Vec3, UITransform, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

import G from '../global-data.js';

@ccclass('Coin')
export class Coin extends Component {
    // Will be signed in the froceLayout
    public nodeInfo;
    
    private offset: Vec3 = new Vec3();

    public inTouch: Boolean = false;

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    update() {
        if (this.inTouch == false) {
            if (this.nodeInfo.id == G.G_TokenInKey) {
                let targetX = -200;
                let targetY = 0;
                this.nodeInfo.fx = (this.nodeInfo.x + targetX) * 0.95;
                this.nodeInfo.fy = (this.nodeInfo.y + targetY) * 0.95;
            } else if(this.nodeInfo.id == G.G_TokenOutKey) {
                let targetX = 200;
                let targetY = 0;
                this.nodeInfo.fx = (this.nodeInfo.x + targetX) * 0.95;
                this.nodeInfo.fy = (this.nodeInfo.y + targetY) * 0.95;
            } else {
                this.nodeInfo.fx = null;
                this.nodeInfo.fy = null;
            }
        }
    }

    onTouchStart(touch: EventTouch) {
        let touchP = touch.getUILocation();
        let touchP3 = new Vec3(touchP.x, touchP.y)
        Vec3.subtract(this.offset, this.node.position, touchP3);

        G.G_forceMapSimulation.alphaTarget(0.3).restart();

        this.nodeInfo.fx = this.node.position.x;
        this.nodeInfo.fy = this.node.position.y;
        this.inTouch = true;
    }

    onTouchMove(touch: EventTouch) {
        const touchP = touch.getUILocation();
        const globalPosition = new Vec3(touchP.x, touchP.y, 0);
        let newPos = Vec3.add(new Vec3(), globalPosition, this.offset);
        
        this.nodeInfo.fx = newPos.x;
        this.nodeInfo.fy = newPos.y;
    }

    onTouchEnd(touch: EventTouch) {
        G.G_forceMapSimulation.alphaTarget(0);
        this.nodeInfo.fx = null;
        this.nodeInfo.fy = null;
        this.inTouch = false;
    }
}

