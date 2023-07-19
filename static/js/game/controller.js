//与输入进行交互
//键盘事件：keydown 某个键是否按住，事件会连续触发
//keyup 某个键是否释放
export class Controller{
    constructor($canvas) {
        this.$canvas = $canvas;

        this.pressedKeys = new Set();//被按住的
        this.start();
    }

    start() {
        let outer = this;
        this.$canvas.keydown(function (e) {//触发的函数
            outer.pressedKeys.add(e.key);//e是被按的按键
        })

        this.$canvas.keyup(function (e) {
            outer.pressedKeys.delete(e.key);
        })
    }



}