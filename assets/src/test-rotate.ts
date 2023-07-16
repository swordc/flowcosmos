import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('test_rotate')
export class test_rotate extends Component {
    start() {
        this.node.setRotationFromEuler(new Vec3(0, 0, -90));
    }

    update(deltaTime: number) {
        
    }
}