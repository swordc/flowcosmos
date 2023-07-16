import { _decorator, Component, Node, Label, find, Color, EditBox, tween,
    Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import G from './global-data.js';
import {Game} from './Game';

@ccclass('TokenInBalanceLabel')
export class TokenInBalanceLabel extends Component {
    @property({ type: EditBox })
    public inputBox: EditBox = null;

    @property({ type: Number })
    public bagType: Number = 1;

    private label: Label = null;
    private GameObj: Game;
    
    onLoad() {
        this.GameObj = find("Game").getComponent('Game') as Game;
        this.label = this.node.getChildByName('BalanceLabel').getComponent(Label);
    }

    onEnable () {
        this.GameObj.updateAllUIData.on('updateAllUIData', this.updateUIData, this);
    }

    onDisable () {
        this.GameObj.updateAllUIData.off('updateAllUIData', this.updateUIData, this);
    }

    start () {
        if (this.bagType == 1) {
            this.node.on(Node.EventType.MOUSE_ENTER, this.onTouchEnter, this);
            this.node.on(Node.EventType.MOUSE_LEAVE, this.onTouchLeave, this);
            this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
        }
    }

    updateUIData() {
        let preLabelString = this.label.string;
        if (this.bagType == 1) {
            if (G.G_TokenInName in G.G_UserBalances) {
                let balance = G.G_UserBalances[G.G_TokenInName];
                if(Number(balance) == 0) {
                    this.label.string = 'Balance: 0';
                } else {
                    this.label.string = 'Balance: '+ Number(balance).toFixed(8);
                }
                
            } else {
                this.label.string = '';
            }
        } else if (this.bagType == 2) {
            if (G.G_TokenOutName in G.G_UserBalances) {
                let balance = G.G_UserBalances[G.G_TokenOutName];
                if(Number(balance) == 0) {
                    this.label.string = 'Balance: 0';
                } else {
                    this.label.string = 'Balance: '+ Number(balance).toFixed(8);
                }
                
            } else {
                this.label.string = '';
            }
        }
        if (this.label.string != preLabelString) {
            tween(this.node)
            .to(0.1, {scale: new Vec3(1.2, 1.2, 0)})
            .to(0.1, {scale: new Vec3(1.0, 1.0, 0)})
            .start();
        }
    }

    onTouchEnter() {
        this.label.color = new Color("#75FBFB");
    }
    onTouchLeave() {
        this.label.color = new Color("#75FBFBAA");
    }
    onClick() {
        if (this.bagType == 1) {
            if (G.G_TokenInName in G.G_UserBalances) {
                let balance = G.G_UserBalances[G.G_TokenInName];
                if (Number(balance) > 0 && G.G_TokenInAmount != balance) {

                    G.G_TokenInAmount = balance;
                    this.inputBox.string = balance;

                    // 计算router结果
                    this.GameObj.evalSwap();
                    this.GameObj.updateAllUIData.emit('updateAllUIData');
                }
            }
        }
    }

}

