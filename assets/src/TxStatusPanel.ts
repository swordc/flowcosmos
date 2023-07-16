import { _decorator, Component, Label, find, Sprite, ProgressBar, Color } from 'cc';
import G from './global-data.js';
import {Game} from './Game.js';
import SCRIPT from './flow-script.js';


const { ccclass, property } = _decorator;

@ccclass('TxStatusPanel')
export class TxStatusPanel extends Component {

    private GameObj: Game;

    private TokenInIcon: Sprite;
    private TokenOutIcon: Sprite;
    private ProgressBar: ProgressBar;
    private StatusLabel: Label;

    private txStatus: Number = 0;
    private txDuration: number = 0;

    private callback;

    private normalColor: Color = new Color('#75FBFB');
    private errorColor: Color = new Color('#CE4E40');

    
    onLoad() {
        this.GameObj = find("Game").getComponent('Game') as Game;

        this.TokenInIcon = this.node.getChildByName('tokenInIcon').getComponent(Sprite);
        this.TokenOutIcon = this.node.getChildByName('tokenOutIcon').getComponent(Sprite);
        this.ProgressBar = this.node.getChildByName('TxProgress').getComponent(ProgressBar);
        this.StatusLabel = this.node.getChildByName('Sucess').getComponent(Label);
        this.StatusLabel.string = '';
        this.GameObj.updateAllUIData.on('updateAllUIData', this.updateUIData, this);

        this.node.active = false;
    }

    update(deltaTime: number) {
        this.txDuration += deltaTime;

        if (this.txStatus == 1) {
            if (this.txDuration > 13.0) this.ProgressBar.progress = 1.0
            else this.ProgressBar.progress = (this.txDuration) / 13.0;
        }

        if (G.G_TxStatus != null) {
            if ('status' in G.G_TxStatus) {
                if (G.G_TxStatus.status == 4) {
                    console.log('tx complete', G.G_TxStatus);
                    if (G.G_TxStatus.statusCode == 0) {
                        this.StatusLabel.string = 'Tx Success';
                        this.StatusLabel.color = this.normalColor;
                    } else {
                        this.StatusLabel.string = 'Tx Error';
                        this.StatusLabel.color = this.errorColor;
                    }

                    this.txStatus = 2;
                    this.txDuration = 0;
                    G.G_Tid = null;
                    G.G_TxStatus = null;
                    this.unschedule(this.callback);

                    this.GameObj.updateUserBalance();
                }
            }
        }

        if (this.txStatus == 2 && this.txDuration > 8.0) {
            this.txStatus = 0;
            this.node.active = false;
        }
    }

    
    updateUIData() {
        if (G.G_Tid == null && this.txStatus == 0) {
            this.ProgressBar.progress = 0;
            this.txStatus = 0;
            this.txDuration = 0;
            G.G_TxStatus = null;
            this.node.active = false;
            this.StatusLabel.string = '';
            return;
        }

        // start tx status
        if (G.G_Tid != null && (this.txStatus == 0 || this.txStatus == 2)) {
            this.txStatus = 1;
            this.txDuration = 0;
            this.StatusLabel.string = '';
            this.node.active = true;

            let tokenKey2Index = {};
            for (let token of G.G_Tokens) {
                tokenKey2Index[token.key] = token.index;
            }
            this.TokenInIcon.spriteFrame = this.GameObj.tokenImgs[tokenKey2Index[G.G_TokenInKey]];
            this.TokenOutIcon.spriteFrame = this.GameObj.tokenImgs[tokenKey2Index[G.G_TokenOutKey]];

            this.callback = function () {
                SCRIPT.QueryTxStatus(G.G_Tid).then(res => {
                    G.G_TxStatus = res;
                }).catch(error => {
                    console.log(error);
                });
            }

            this.schedule(this.callback, 1);
        }
    }
}

