let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);

        this.timeDelta = 0;//存储当前一帧距离上一帧的时间间隔
        this.hasCallStart = false;//存储当前对象有无被使用
    }

    start() {//初始化

    }

    update() {//每一帧执行一次

    }

    destroy() {//删除当前对象
        for(let i in AC_GAME_OBJECTS){//in枚举下标
            if(AC_GAME_OBJECTS[i] === this){
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;//计算相邻两帧的时间间隔
let AC_GAME_OBJECTS_FRAME = (timestamp) =>{//是requestAnimationFrame函数的接口，即timestamp函数
    for(let obj of AC_GAME_OBJECTS){//for-of枚举值
        if(!obj.hasCallStart){
            obj.start();
            obj.hasCallStart = true;
        } else {
            obj.timeDelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_OBJECTS_FRAME);
}//注意requestAnimationFrame是递归

requestAnimationFrame(AC_GAME_OBJECTS_FRAME);

export {AcGameObject};