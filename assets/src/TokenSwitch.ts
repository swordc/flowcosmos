import { _decorator, Component, Label, find } from 'cc';
import G from './global-data.js';
import {Game} from './Game';
import Router from './router/router.js';


const { ccclass, property } = _decorator;

@ccclass('TokenSwitch')
export class TokenSwitch extends Component {

    private GameObj: Game;
    
    onLoad() {
        this.GameObj = find("Game").getComponent('Game') as Game;
}

    update(deltaTime: number) {

    }

    click() {
        let tmp = G.G_TokenInKey;
        G.G_TokenInKey = G.G_TokenOutKey;
        G.G_TokenOutKey = tmp;

        tmp = G.G_TokenInName;
        G.G_TokenInName = G.G_TokenOutName;
        G.G_TokenOutName = tmp;

        if (G.G_TokenInKey.indexOf('A.') == 0 && G.G_TokenOutKey.indexOf('A.') == 0) {
            let innerPairAddrArr = Router.SelectStartEndToken(G.G_TokenInKey, G.G_TokenOutKey, G.G_CenterTokens);
            //
            this.GameObj.evalSwap();
        }
        
        this.GameObj.updateAllUIData.emit('updateAllUIData');
    }
}

