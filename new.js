
const observer = (obj) => {
    const dep = new Dep();
    return new Proxy(obj, {
        get: (target, key, receiver)=>{
            if(Dep.target){
                dep.addSub(key, Dep.target);
            }

            return target[key];
        },
        set: (target, key, value, receiver)=>{
            if(target[key] === value){
                return;
            }

            target[key] = value;
            dep.notify(key);

            return true;
        }
    });
};

class Dep{
    constructor(){
        this.subs = new Map();
    }

    addSub(key, sub){
        let currentSub = this.subs.get(key);

        if(currentSub){
            currentSub.add(sub);
        }else{
            this.subs.set(key, new Set([sub]));
        }
    }

    notify(key){
        const currentSub = this.subs.get(key);

        if(!currentSub){
            return;
        }

        currentSub.forEach((sub)=>{
            sub.update(key);
        });
    }
}

class Render{
    constructor(container, keys){
        this.keys = new Set(keys);
        this.container = container;
    }

    static nextTick(handler){
        Promise.resolve().then(handler);
    }

    refresh(data){
        this.keys.forEach((key)=>{
            const elems = this.container.querySelectorAll(`[bd-name=${key}]`);

            if(elems.length){
                const itemValue = data[key];
                elems.forEach((elem)=>{
                    if(elem.tagName.toLowerCase() === "input"){
                        elem.value = itemValue;
                    }else{
                        elem.innerHTML = itemValue;
                    }
                });
            }
        });
        
        this.keys = new Set(); // 清空
    }

    pushQuene(keys, data){
        if(Array.isArray(keys)){
            keys.forEach((key)=>{
                this.keys.add(key);
            });
        }

        Render.nextTick(this.refresh.bind(this, data));
    }
}


class AddComponent{
    constructor({id, data}){
        this.data = observer(data);
        this.container = document.querySelector(`#${id}`);
        this.render = new Render( this.container, Object.keys(this.data) );

        this.binder();
        this.init(); // 组件初始化
    }

    init(){
        Dep.target = this;
        this.render.refresh(this.data);
        Dep.target = null;    
    }

    updateAll(){
        const keys = Object.keys(this.data);
        this.render.pushQuene(keys, this.data);
    }

    updateDom(key){
        this.render.pushQuene([key], this.data);
    }

    update(key){
        // 更新视图
        if(key){
            this.updateDom(key);
        }else{
            this.updateAll();
        }
    }

    // 绑定事件
    binder(){
        const elems = this.container.querySelectorAll('[bd-name]');
        elems.forEach((elem)=>{
            elem.onchange = ()=>{
                const name = elem.getAttribute('bd-name');
                this.data[name] = elem.value;
            }
        });
    }
}

// 想要的一个效果
const v1 = new AddComponent({
    id: "add1",
    data: {
        b: 2
    }
});

// 想要的一个效果
const v2 = new AddComponent({
    id: "add2",
    data: {
        a: 3
    }
});

setTimeout(()=>{
    v1.data.b = 300;
}, 1000);

setTimeout(()=>{
    v2.data.a = 200;
}, 1000);