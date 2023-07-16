import { _decorator, Component, Label, find, Button, Color } from 'cc';
import FCL from '../lib/fcl.umd.min.js';
import TX from './flow-transaction.js';
import G from './global-data.js';
import {Game} from './Game';


const { ccclass, property } = _decorator;

@ccclass('SwapButton')
export class SwapButton extends Component {
    @property(Label)
    public buttonLabel: Label = null;
    @property(Button)
    public swapButton: Label = null;

    private GameObj: Game;
    private ButtonState: Number = 0;

    private normalColor: Color = new Color('#75FBFB');
    private disableColor: Color = new Color('#458282');

    private swapingChangeDuration: number = 0;
    private swapingChangeDotNumber: number = 1;
    
    onLoad() {
      this.GameObj = find("Game").getComponent('Game') as Game;
    }
  
    onEnable () {
        this.GameObj.updateAllUIData.on('updateAllUIData', this.updateAllUIData, this);
    }

    onDisable () {
        this.GameObj.updateAllUIData.off('updateAllUIData', this.updateAllUIData, this);
    }

    update(deltaTime: number) {
        if (G.G_Tid != null) {
            this.swapingChangeDuration += deltaTime;
            if (this.swapingChangeDuration > 0.8) {
                this.swapingChangeDotNumber++;
                this.swapingChangeDuration = 0;
            }
            if (this.swapingChangeDotNumber >= 5) this.swapingChangeDotNumber = 1;
            if (this.swapingChangeDotNumber == 1) this.buttonLabel.string = 'Swap';
            else if (this.swapingChangeDotNumber == 2) this.buttonLabel.string = 'pSwa';
            else if (this.swapingChangeDotNumber == 3) this.buttonLabel.string = 'apSw';
            else if (this.swapingChangeDotNumber == 4) this.buttonLabel.string = 'wapS';
        }
    }

    start() {
        this.updateAllUIData();    
    }
    updateAllUIData() {
        this.swapButton.enabled = true;
        let userAddr = G.getUserAddr();
        
        this.buttonLabel.color = this.normalColor;
        this.ButtonState = 1;
        if (userAddr == null || userAddr == undefined) {
            this.buttonLabel.string = 'Connect Wallet';
            this.ButtonState = 2;

        } else if (G.G_TokenInKey.length < 10 || G.G_TokenOutKey.length < 10) {

            this.buttonLabel.string = 'Select a token';
            this.swapButton.enabled = false;
            this.buttonLabel.color = this.disableColor;

        } else if (G.G_TokenInKey.indexOf('A.') == 0 || G.G_TokenOutKey.indexOf('A.') == 0) {
            let tokenBalance = 0;
            if (G.G_TokenInName in G.G_UserBalances) tokenBalance = Number(G.G_UserBalances[G.G_TokenInName]);
            let inputAmount = Number(G.G_TokenInAmount);
            if (inputAmount > tokenBalance || tokenBalance == 0) {

                this.buttonLabel.string = 'Insufficient balance';
                this.swapButton.enabled = false;
                this.buttonLabel.color = this.disableColor;

            } else if (inputAmount == 0 && tokenBalance > 0) {

                this.buttonLabel.string = 'Enter ' + G.G_TokenInName + ' amount';
                this.swapButton.enabled = false;
                this.buttonLabel.color = this.disableColor;
            } else {
                this.buttonLabel.string = 'Swap';
            }
        }
    }

    click() {
        // swap
        if (this.ButtonState == 1) {
            let userAddr = G.getUserAddr();
            
            if (G.G_Tid == null && G.G_EvalSwapResp != null && G.G_EvalSwapResp != undefined) {
                (async ()=> {
                    try {
                        let tokenInInfo = null;
                        let tokenOutInfo = null;
                        for (let token of G.G_Tokens) {
                            if (token.key == G.G_TokenInKey) tokenInInfo = token;
                            if (token.key == G.G_TokenOutKey) tokenOutInfo = token;
                        }

                        this.ButtonState = 3;

                        let slippage = (1.0-G.G_Slippage) * Number(G.G_EvalSwapResp.tokenOutAmount);
                        if (slippage < 0.00001) slippage = 0.0;
                        let tid = await TX.swap(
                            G.G_EvalSwapResp,
                            slippage.toFixed(8),
                            tokenInInfo.vaultPath,
                            tokenOutInfo.vaultPath,
                            tokenOutInfo.receiverPath,
                            tokenOutInfo.path
                        );
                        // let tid = await TX.test(1.0, 1.0);
                        console.log('swap tid', tid);
                        G.G_Tid = tid;

                        this.GameObj.updateAllUIData.emit('updateAllUIData');
                    } catch (error) {
                        this.ButtonState = 1;
                        console.log('swap tx error', error);
                    }
                })();    
            }


        } else if (this.ButtonState == 2) {
            // connect wallet
            if (G.getUserAddr() == '' || G.getUserAddr() == null) {
                FCL.authenticate();
            }
        }
    }
}

