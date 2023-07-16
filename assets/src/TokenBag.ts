import { _decorator, Component, find,
    Node, Prefab, instantiate, ScrollView, Label, EventHandler, EventTarget, Sprite } from 'cc';
const { ccclass, property } = _decorator;
import {Game} from './Game';

import G from './global-data.js';
import {TokenBagItemButton} from './TokenBagItemButton';

@ccclass('TokenBag')
export class TokenBag extends Component {
    @property({ type: Prefab })
    public tokenItemPrefab: Prefab = null;

    @property({ type: ScrollView })
    public scrollView: ScrollView = null;

    @property({ type: Number })
    public bagType: Number = 0; // 0: normalBag 1: tokenInBag 2: tokenOutBag

    private GameObj: Game;

    // Replace this with your real token list
    private tokens = G.G_Tokens;

    onLoad() {
        this.GameObj = find("Game").getComponent('Game') as Game;
    }

    start () {
        this.initTokenItems();
    }

    onEnable () {
        this.GameObj.closeTokenBagEvent.on('closeTokenBagEvent', this.close, this);
    }

    onDisable () {
        this.GameObj.closeTokenBagEvent.off('closeTokenBagEvent', this.close, this);
    }

    open() {
        let curSelectTokenInKey = G.G_TokenInKey;
        let curSelectTokenOutKey = G.G_TokenOutKey;
        
        const content = this.scrollView.content;
        for (let tokenBagItem of content.children) {
            let tokenBagItemScript = tokenBagItem.getComponent('TokenBagItemButton') as TokenBagItemButton;
            let buttonComp = tokenBagItem.getComponent('cc.Button');
            if ((this.bagType == 1 && tokenBagItemScript.tokenKey == G.G_TokenInKey) ||
                (this.bagType == 2 && tokenBagItemScript.tokenKey == G.G_TokenOutKey)
             ) {
                tokenBagItem.active = false;
            } else {
                tokenBagItem.active = true;
            }
        }
    }

    close() {
        this.node.parent.active = false;
    }

    initTokenItems() {
        const content = this.scrollView.content;
        content.removeAllChildren();

        // token item order
        let displayTokenList = [];
        let displayTokenListEmpty = [];
        for (let token of this.tokens) {
            let tokenInfo = {...token};
            let balance = 0.0;
            if (token.name in G.G_UserBalances) {
                balance = G.G_UserBalances[token.name];
                tokenInfo.amount = balance;
            }
            if (balance > 0) {
                displayTokenList.push(tokenInfo);
            } else {
                displayTokenListEmpty.push(tokenInfo);
            }
        }
        displayTokenListEmpty = displayTokenList.concat(displayTokenListEmpty)
        for (let token of displayTokenListEmpty) {
            let item = instantiate(this.tokenItemPrefab);
            let nameLabelRef = item.getChildByName('TokenName').getComponent(Label);
            let amountLabelRef = item.getChildByName('TokenAmount').getComponent(Label);
            let iconRef = item.getChildByName('TokenIcon').getComponent(Sprite);
            if (nameLabelRef) {
                nameLabelRef.string = token.name;
            }
            if (amountLabelRef) {
                amountLabelRef.string = token.amount.toString();
            }
            if (iconRef) {
                iconRef.spriteFrame = this.GameObj.tokenImgs[token.index];
            }
            
            let tokenBagItemScript = item.getComponent('TokenBagItemButton') as TokenBagItemButton;
            tokenBagItemScript.tokenBagType = this.bagType;
            tokenBagItemScript.tokenKey = token.key;
            tokenBagItemScript.tokenName = token.name;

            content.addChild(item);
        }

        this.scrollView.scrollToTop();

        this.open();
    }
}
