import {GameMap} from "./map.js";
import { Kyo } from "/static/js/game/Kyo.js";

class KOF {
    constructor(id) {
        //kof是一个选择器
        this.$kof = $("#" + id);//将对应的id选取出来
        //console.log(this.$kof);

        this.gameMap = new GameMap(this);
        this.players = [
            new Kyo(this, {
                //todo
                id: 0,
                x: 200,
                y: 0,
                width: 150,
                height: 200,
                color:'blue',
            }),
            new Kyo(this, {
                //todo
                id: 1,
                x: 900,
                y: 0,
                width: 150,
                height: 200,
                color: 'red',
            }),
        ];
    }
}

export {KOF};