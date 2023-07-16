import { _decorator, Component, Node, Vec3, UITransform, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

import G from '../global-data.js';

@ccclass('SplitPool')
export class SplitPool extends Component {
    // Will be signed in the froceLayout
    public nodeInfo;
    
    start() {
    }
}

