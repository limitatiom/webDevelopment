import {AcGameObject} from "./acgame_object.js";

export class Player extends AcGameObject{
    constructor(root, info) {
        super();

        this.root = root;//root为一个kof对象
        this.ctx = this.root.gameMap;
        //坐标信息
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.vx = 0;
        this.vy = 0;

        this.gravity = 50;

        this.dir = 1;//朝向, 正为右
        this.speedx = 400;//移动水平速度
        this.speedy = -1000;//起跳的初速度
        this.status = 3;//状态, 0不动，1向前，2向后, 3跳跃，4攻击，5受击，6死亡
        //3属性不循环,0,1属性可以循环

        this.pressedKeys = this.root.gameMap.controller.pressedKeys;
        this.animations = new Map();//每个状态存在一个字典中，对应一个动画
        this.frameCurCnt = 0;//一共渲染了多少帧

        this.hp = 100;
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);

        this.$hp_inner = this.$hp.find(`div`);
    }

    start() {

    }

    updateDir() {
        if(this.status === 6) return;
        let players = this.root.players;
        if(players[1] && players[0]){
            let me = this, you = players[1 - this.id];
            if(me.x < you.x) me.dir = 1;
            else me.dir = -1;
        }
    }

    updateAttack() {
        if(this.status === 4 && this.frameCurCnt === 18){//攻击动画播放至18帧时，判断是否打中敌人
            let me = this, you = this.root.players[1 - this.id];
            let r1;
            if(me.dir > 0){
                r1 = {
                    x1: me.x + 120,
                    y1: me.y + 40,
                    x2: me.x + 120 + 100,
                    y2: me.y + 40 + 20,
                };
            } else {
                r1 = {
                    x1: me.x + me.width - 120 - 100,
                    y1: me.y + 40,
                    x2: me.x + me.width - 120,
                    y2: me.y + 40 + 20,
                }
            }
            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            }
            if(this.isHit(r1, r2)) this.isAttack();
        }

    }

    isAttack(){
        if(this.status === 6) return;

        this.status = 5;
        this.frameCurCnt = 0;

        this.hp = Math.max(this.hp - 20, 0);

        this.$hp_inner.animate({
            width:this.$hp.parent().width() * this.hp / 100,
        }, 300);//三百ms

        this.$hp.animate({
            width:this.$hp.parent().width() * this.hp / 100,
        }, 600);//三百ms

        if(this.hp <= 0) {
            this.status = 6;
            this.vx = 0;
        }
    }

    isHit(r1, r2){//左端点的最大值大于右端点的最小值，说明没有交集
        if(Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        return Math.max(r1.y1, r2.y1) <= Math.min(r1.y2, r2.y2);
    }

    update() {
        this.updateControl();
        // this.updateMove();

        this.updateAttack();
        this.move();
        this.updateDir();
        //渲染当前这一帧状态
        this.render();
    }

    render(){
        // this.ctx.fillStyle = this.color;
        // this.ctx.fillRect(this.x, this.y, this.width, this.height);//将每名角色抽象为一个矩形

        // if(this.dir > 0){
        //     this.ctx.fillStyle = 'red';
        //     this.ctx.fillRect(this.x + 120, this.y + 40, 100, 20);
        // } else {
        //     this.ctx.fillStyle = 'red';
        //     this.ctx.fillRect(this.x + this.width - 120 - 100, this.y + 40, 100, 20);
        // }

        let status = this.status;//根据状态来渲染

        if(this.status === 1 && this.dir * this.vx < 0) this.status = 2;

        let obj = this.animations.get(status);
        if (obj && obj.loaded) {
            if(this.dir > 0){
                let k = this.frameCurCnt / obj.frame_rate % obj.frame_cnt;//当前帧数
                let image = obj.gif.frames[k].image;//当前的图片编号
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            } else {//通过反转坐标系来旋转方向,反转x轴的方向
                this.ctx.save();//保存配置

                this.ctx.scale(-1, 1);
                this.translate(-this.root.gameMap.$canvas.width(), 0);
                let k = this.frameCurCnt / obj.frame_rate % obj.frame_cnt;//当前帧数
                let image = obj.gif.frames[k].image;//当前的图片编号
                this.ctx.drawImage(image, this.root.gameMap.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

                this.ctx.restore();//恢复配置
            }
        }
        if(this.status === 4 || this.status === 5 || this.status === 6){
            if (this.frameCurCnt === obj.frame_rate * (obj.frame_cnt - 1)){
                if(this.status === 6){
                    this.frameCurCnt--;
                } else {
                    this.status = 0;
                }
            }
        }
        this.frameCurCnt++;
    }

    move() {//每一帧的移动
        this.vy += this.gravity;
        this.x += this.vx * this.timeDelta / 1000;//乘上偏差值
        this.y += this.vy * this.timeDelta / 1000;

        //增加玩家的碰撞体积
        let [a, b] = this.root.players;

        if(a !== this) [a, b] = [b, a];//使b为对方


        let r1 = {
            x1: a.x,
            y1: a.y,
            x2: a.x + a.width,
            y2: a.y + a.height,
        }
        let r2 = {
            x1: b.x,
            y1: b.y,
            x2: b.x + b.width,
            y2: b.y + b.height,
        }
        if(this.isHit(r1, r2)){
            //抵消上文的操作
            b.x += this.vx * this.timeDelta / 1000 / 2;
            b.y += this.vy * this.timeDelta / 1000 / 2;
            a.x -= this.vx * this.timeDelta / 1000 / 2;
            a.y -= this.vy * this.timeDelta / 1000 / 2;
            if(this.status === 3)
                this.status = 0;//落地后将状态置为静止
        }
        if(this.y > 450){
            //todo
            this.y = 0;
            this.vy = 450;
            if(this.status === 3)
                this.status = 0;//落地后将状态置为静止
        }

        if(this.x < 0){
            this.x = 0;
        } else if (this.x + this.width > this.root.gameMap.$canvas.width()){
            this.x = this.root.gameMap.$canvas.width() - this.width;
        }
    }

    updateControl(){
        let w, a, d, space;
        if(this.id === 0){//玩家一
            w = this.pressedKeys.has('w');
            a = this.pressedKeys.has('a');
            d = this.pressedKeys.has('d');
            space = this.pressedKeys.has(' ');//判断按的按键
        } else {//玩家二
            w = this.pressedKeys.has('ArrowUp');
            a = this.pressedKeys.has('ArrowLeft');
            d = this.pressedKeys.has('ArrowRight');
            space = this.pressedKeys.has('Enter');
        }
        if(this.status === 0 || this.status === 1){//静止或移动
            if (space){
                this.space = 4;
                this.vx = 4;
                this.frameCurCnt = 0;
            } else if(w){
                if(d){
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                }
                this.vy = this.speedy;
            }
        } else if (d){
            this.vx = this.speedx;
            this.status = 1;
        } else if (a){
            this.vx = -this.speedx;
            this.status = 1;
        } else {
            this.vx = 0;//当不进行操作，状态转化为静止
            this.status = 0;
        }
    }
}