class EventEmitter{
    constructor(maxBindLength = 3){
        this._events = Object.create(null);
        this.maxBindLength = maxBindLength;
    }

    on(type, cb){
        if(!this._events[type]){
            this._events[type] = {
                counter: this.maxBindLength - 1,
                callback: [cb]
            };

            return;
        }

        const temp = this._events[type];
        if(temp.counter > 0){
            temp.counter -= 1;
            temp.callback.push(cb);
        }else{
            console.log("it's enough!");
        }
    }

    getLastBindLength(type){
        return this._events[type] ? this._events[type].counter: this.maxBindLength;
    }

    once(type, cb){
        const fn = (...params) => {
            cb && cb(params);
            this.removeListener(type, fn);
        };

        this.on(type, fn);
    }

    removeListener(type, cb){
        if(!this._events[type]){
            return false;
        }

        const fns = this._events[type].callback;
        this._events[type].callback = fns.filter((fn)=>{
            return !Object.is(fn, cb);
        });

        this._events[type].counter += 1;
    }

    emit(type, ...params){
        if(!this._events[type]){
            return false;
        }

        const fns = this._events[type];
        fns.forEach((fn)=>{
            fn && fn(params);
        });
    }
}

const event = new EventEmitter(4);
event.on("a", ()=>{
    console.log("测试完成");
});
event.on("a", ()=>{
    console.log("开发完成");
});
event.on("a", ()=>{
    console.log("发布上线");
});
event.on("a", ()=>{
    console.log("线上测试");
});
// event.once("a", ()=>{
//     console.log("发布完成！");
// });

// event.emit("a");
// event.emit("a");

