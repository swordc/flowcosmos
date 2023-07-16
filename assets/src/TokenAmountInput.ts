import { _decorator, Component, Node, EditBox, find } from 'cc';
const { ccclass, property } = _decorator;

import G from './global-data.js';
import {Game} from './Game';

@ccclass('TokenAmountInput')
export class TokenAmountInput extends Component {
    
    private tokenAmountEditBox: EditBox;
    private GameObj: Game;


    @property({ type: Number })
    public tokenBagType: Number;

    onLoad() {
        this.GameObj = find("Game").getComponent('Game') as Game;
        this.tokenAmountEditBox = this.node.getComponent('cc.EditBox') as EditBox;
    }

    start () {
        //this.tokenAmountEditBox.string = "0";
        this.tokenAmountEditBox.node.on('text-changed', this.onTextChanged, this);
        this.node['autocomplete'] = 'off';
    }


    onTextChanged(editbox: EditBox) {
        let tokenInputAmount = editbox.string;
        
        if (tokenInputAmount == '') {
            G.G_TokenInAmount = '0';
            G.G_TokenOutAmount = '0';
            G.G_EvalSwapResp = null;
            this.GameObj.updateAllUIData.emit('updateAllUIData');
            return;
        }
        
        if (!this.isFloat(tokenInputAmount)) {
            tokenInputAmount = tokenInputAmount.slice(0, -1);
            editbox.string = tokenInputAmount;
            editbox.focus();
            return;
        }
        let decimalIndex = tokenInputAmount.indexOf(".");
        if (decimalIndex !== -1 && tokenInputAmount.slice(decimalIndex+1).length > 6) {
            tokenInputAmount = tokenInputAmount.slice(0, decimalIndex + 7);
            editbox.string = tokenInputAmount;
            editbox.focus();
            return;
        }

        if (this.tokenBagType == 1) {
            G.G_TokenInAmount = tokenInputAmount;

            this.GameObj.evalSwap();
            this.GameObj.updateAllUIData.emit('updateAllUIData');

        }
        if (this.tokenBagType == 2) {
            G.G_TokenOutAmount = tokenInputAmount;
        }
        
    }

    private isFloat(val: string): boolean {
        return !isNaN(parseFloat(val)) && val.match(/^-?[0-9]*(\.[0-9]*)?$/) !== null;
    }
}

