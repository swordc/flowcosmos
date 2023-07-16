import { _decorator, 
    Component, Node, find, Label, Sprite } from 'cc';
const { ccclass, property } = _decorator;

import G from './global-data.js';
import {Game} from './Game';


@ccclass('UIDataLayer')
export class UIDataLayer extends Component {
    private GameObj: Game;

    @property({ type: Label })
    public tokenInNameLabel: Label = null;
    @property({ type: Label })
    public tokenInAmountLabel: Label = null;
    @property({ type: Sprite })
    public tokenInIcon: Sprite = null;
    @property({ type: Label })
    public tokenOutNameLabel: Label = null;
    @property({ type: Label })
    public tokenOutAmountLabel: Label = null;
    @property({ type: Sprite })
    public tokenOutIcon: Sprite = null;
    @property({ type: Label })
    public swapButtonLabel: Label = null;

    @property({ type: Label })
    public quoteI: Label = null;
    @property({ type: Label })
    public quoteB: Label = null;
    @property({ type: Label })
    public quoteM: Label = null;




    onLoad() {
        this.GameObj = find("Game").getComponent('Game') as Game;
    }
    
    onEnable () {
        this.GameObj.updateAllUIData.on('updateAllUIData', this.updateAllUIData, this);
    }

    onDisable () {
        this.GameObj.updateAllUIData.off('updateAllUIData', this.updateAllUIData, this);
    }

    start() {
        this.updateAllUIData();    
    }

    update(deltaTime: number) {
    }

    updateAllUIData() {
        let tokenKey2Index = {};
        for (let token of G.G_Tokens) {
            tokenKey2Index[token.key] = token.index;
        }

        if (G.G_TokenInName != this.tokenInNameLabel.string) {
            this.tokenInNameLabel.string = G.G_TokenInName;
            if (G.G_TokenInKey in tokenKey2Index) {
                this.tokenInIcon.spriteFrame = this.GameObj.tokenImgs[tokenKey2Index[G.G_TokenInKey]]
            } else {
                this.tokenInIcon.spriteFrame = this.GameObj.tokenSelectImg;
            }
            
        }
        if (G.G_TokenOutName != this.tokenOutNameLabel.string) {
            this.tokenOutNameLabel.string = G.G_TokenOutName;
            if (G.G_TokenOutKey in tokenKey2Index) {
                this.tokenOutIcon.spriteFrame = this.GameObj.tokenImgs[tokenKey2Index[G.G_TokenOutKey]]
            } else {
                this.tokenOutIcon.spriteFrame = this.GameObj.tokenSelectImg;
            }
        }
        if (G.G_TokenInAmount != this.tokenInAmountLabel.string) {
            this.tokenInAmountLabel.string = G.G_TokenInAmount;
        }
        if (G.G_TokenOutAmount != this.tokenOutAmountLabel.string) {
            if (G.G_TokenOutAmount == '') {
                this.tokenOutAmountLabel.string = '0';
            } else {
                this.tokenOutAmountLabel.string = G.G_TokenOutAmount;
            }
        }

        if (G.G_EvalSwapResp != null && G.G_EvalSwapResp != undefined && G.G_EvalSwapResp != null) {
            {
                let n = Number(G.G_EvalSwapResp.incrementOut);
                let s = n.toFixed(8);
                if (n == 0) s = '0';
                this.quoteI.string = '- ' + s;
            }
            {
                let n = Number(G.G_EvalSwapResp.bloctoOut);
                let s = n.toFixed(8);
                if (n == 0) s = '0';
                this.quoteB.string = '- ' + s;
            }
            {
                let n = Number(G.G_EvalSwapResp.metapierOut);
                let s = n.toFixed(8);
                if (n == 0) s = '0';
                this.quoteM.string = '- ' + s;
            }
        } else {
            this.quoteI.string = '';
            this.quoteB.string = '';
            this.quoteM.string = '';
        }
    }
}

