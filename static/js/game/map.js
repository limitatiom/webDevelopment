import {AcGameObject} from '/static/js/game/acgame_object.js';
import {Controller} from "./controller.js";

export class GameMap extends AcGameObject {
    constructor(root) {
        super();
        this.root = root;//root是个game对象
        //为了让画布实现聚焦，需要使用tabindex
        this.$canvas = $(`<canvas id="tutorial" width="1280" height="720" tabindex=0></canvas>`);//绘制地图
        //取出画布
        this.ctx = this.$canvas[0].getContent('2d');
        this.root.$kof.append(this.$canvas);
        this.$canvas.focus();//聚焦后可以输入

        this.controller = new Controller(this.$canvas);

        this.root.$kof.append($(`<div class="kof-head">
        <div class="kof-head-hp-0"><div><div></div></div></div>
        <div class="kof-head-timer">60</div>
        <div class="kof-head-hp-1"><div><div></div></div></div>
        </div>`));

        this.timerLeft = 60000;//60s
        this.$timer = this.root.$kof.find(`.kof-head-timer`);
    }

    start(){

    }

    update() {
        super.update();
        this.timerLeft -= this.timeDelta;
        if(this.timerLeft <= 0) {
            this.timerLeft = 0;
            let [a, b] = this.root.players;
            if(a.status !== 6 && b.status !== 6){
                a.status = b.status = 6;
                a.vx = b.vx = 0;
                a.frameCurCnt = b.frameCurCnt = 0;
            }
        }
        this.$timer.text(this.timerLeft / 1000);
        this.render();//封装的逻辑
    }

    render() {
        this.ctx.clearRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height);
    }//每一帧将上一帧内容清空
}