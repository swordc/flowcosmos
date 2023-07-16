import { _decorator, Component, Node } from 'cc';
import FCL from '../lib/fcl.umd.min.js';

const { ccclass, property } = _decorator;

@ccclass('SettingButton')
export class SettingButton extends Component {

    @property(Node)
    public panel: Node = null;


    start() {
    }


    
    click() {
        this.panel.active = true;
    }
}

