import { _decorator, Component, Label, find } from 'cc';
import G from './global-data.js';
import {Game} from './Game';
import Router from './router/router.js';


const { ccclass, property } = _decorator;

@ccclass('TokenBagItemButton')
export class TokenBagItemButton extends Component {

    public tokenNameRef: Label;
    public tokenAmountRef: Label;
    
    public tokenBagType: Number;
    public tokenKey: String; // Assigned in TokenBag
    public tokenName: String;

    private GameObj: Game;
    
    onLoad() {
        this.GameObj = find("Game").getComponent('Game') as Game;

        this.tokenNameRef = this.node.getChildByName('TokenName').getComponent(Label);
        this.tokenAmountRef = this.node.getChildByName('TokenAmount').getComponent(Label);
    }

    update(deltaTime: number) {

    }

    onEnable () {
        this.GameObj.updateAllUIData.on('updateAllUIData', this.updateUIData, this);
        this.updateUIData();
    }

    onDisable () {
        this.GameObj.updateAllUIData.off('updateAllUIData', this.updateUIData, this);
    }

    click() {
        console.log('Click token in bag item', this.tokenKey, this.tokenAmountRef.string, this.tokenBagType);
        this.GameObj.closeTokenBagEvent.emit('closeTokenBagEvent');

        if (this.tokenBagType == 1) {
            G.G_TokenInKey = this.tokenKey;
            G.G_TokenInName = this.tokenName;
            //G.G_G_TokenInAmount = '0';
            // Move tokenIn coin to the position

            if (G.G_TokenOutKey == G.G_TokenInKey) {
                G.G_TokenOutKey = '';
                G.G_TokenOutName = 'Select';
                G.G_EvalSwapResp = null;
                this.GameObj.relinkForceMap.emit('relinkForceMap', true);
            }
        }
        if (this.tokenBagType == 2) {
            G.G_TokenOutKey = this.tokenKey;
            G.G_TokenOutName = this.tokenName;

            if (G.G_TokenOutKey == G.G_TokenInKey) {
                G.G_TokenInKey = '';
                G.G_TokenInName = 'Select';
                G.G_EvalSwapResp = null;
                this.GameObj.relinkForceMap.emit('relinkForceMap', true);
            }
        }
        
        if (G.G_TokenInKey.indexOf('A.') == 0 && G.G_TokenOutKey.indexOf('A.') == 0) {
            let innerPairAddrArr = Router.SelectStartEndToken(G.G_TokenInKey, G.G_TokenOutKey, G.G_CenterTokens);
            //
            this.GameObj.evalSwap();
            //console.log('innerPairAddrArr', innerPairAddrArr);
        }
        
        this.GameObj.updateAllUIData.emit('updateAllUIData');
    }

    updateUIData() {
        let nameLabel = this.tokenNameRef.string;
        if (nameLabel in G.G_UserBalances) {
            let balance = Number(G.G_UserBalances[nameLabel]);
            if (balance == 0) {
                this.tokenAmountRef.string = '0';
            } else {
                this.tokenAmountRef.string = balance.toFixed(8);
            }
        }
    }
}

