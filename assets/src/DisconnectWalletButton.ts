import { _decorator, Component, Label, find, Node } from 'cc';
import FCL from '../lib/fcl.umd.min.js';
import G from './global-data.js';
import {Game} from './Game';

const { ccclass, property } = _decorator;

@ccclass('DisconnectWalletButton')
export class DisconnectWalletButton extends Component {
    private GameObj: Game;

    @property(Node)
    public walletPanel: Node = null;

    start() {
        // 
        this.GameObj = find("Game").getComponent('Game') as Game;
    }


    
    click() {
        FCL.unauthenticate();
        G.setUserAddr(null);
        G.G_UserBalances = {};
        this.walletPanel.active = false;
        this.GameObj.updateAllUIData.emit('updateAllUIData');
    }
}

