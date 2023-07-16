import { _decorator, Component, Label, find, Node } from 'cc';
import FCL from '../lib/fcl.umd.min.js';
import T from '@onflow/types';
import G from './global-data.js';
import {Game} from './Game';

const { ccclass, property } = _decorator;

@ccclass('ConnectWalletButton')
export class ConnectWalletButton extends Component {
    @property(Label)
    public buttonLabel: Label = null;

    @property(Node)
    public walletPanel: Node = null;

    private GameObj: Game;

    start() {
        // 
        this.GameObj = find("Game").getComponent('Game') as Game;
        
        FCL.currentUser.subscribe(currentUser => {
            let userAddr = currentUser.addr;
            if (userAddr != null) {
                //
                G.setUserAddr(userAddr);

                // update button label
                this.buttonLabel.string = userAddr.slice(0, 6) + '...' + userAddr.slice(userAddr.length-4, userAddr.length);

                
                this.GameObj.updateUserBalance();
                this.GameObj.updateAllUIData.emit('updateAllUIData');
            } else {
                this.buttonLabel.string = 'Connect Wallet';
            }
        });
    }

    update(deltaTime: number) {
    }

    click() {
        if (G.getUserAddr() == '' || G.getUserAddr() == null) {
            FCL.authenticate();
        } else {
            this.walletPanel.active = true;
        }
    }
}

