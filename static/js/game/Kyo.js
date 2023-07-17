import {Player} from "./player.js";
import {GIF} from "./utils/gif.js";


export class Kyo extends Player{
    constructor(root, info) {
        super(root, info);
        this.initAnimations();
    }

    initAnimations(){
        let outer = this;
        let offsets = [0, -22, -22, -140, 0, 0, 0];
        for(let i = 0;i < 7;i++){
            let gif = new GIF;
            gif.load(`static/images/kof_heroes/kyo/${i}.gif`);
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,//初始帧
                frame_rate: 5,//每五帧渲染一次
                offset_y: offsets[i],//y向偏移量
                loaded: false,
                scale: 2,//缩放比例
            })
            gif.onload = function (){//加载完之后
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frame.length;
                obj.loaded = true;//已加载

                if(i === 3){
                    obj.frame_rate = 4;
                }
            }
        }
    }


}