const objMap = {
    key1: {},
    key2: {}
};

// 监听属性变化
const listenDataChange = (obj, containerKey) => {
    return new Proxy(obj, {
        get: (target, key, receiver)=>{
            if(key == "sum"){
                return Object.keys(receiver).reduce((sum, item)=>{
                    sum += parseFloat(receiver[item]);

                    return sum;
                }, 0);
            }

            return target[key];
        },
        set: (target, key, value, receiver)=>{
            if(target[key] === value){
                return;
            }

            target[key] = value;
            agent(containerKey, [...Object.keys(target), "sum"], receiver);
        }
    });
};

// 监听视图变化
const binderFactory = (keys)=>{
    const binder = (container, obj) => {
        const elems = container.querySelectorAll('[bd-name]');
        elems.forEach((elem)=>{
            elem.onchange = ()=>{
                const name = elem.getAttribute('bd-name');
                obj[name] = elem.value;
            }
        });
    };

    keys.forEach((key)=>{
        const obj = objMap[key];
        const container = document.querySelector(`[key=${key}]`);
        binder(container, listenDataChange(obj, key));
    });     
}

// 数据变化状态同步给视图
const agent = (containerKey, keys, receiver)=>{
    Promise.resolve().then(()=>{
        const container = document.querySelector(`[key=${containerKey}]`);
        
        keys.map((key)=>{
            const elem = container.querySelector(`[bd-name=${key}]`);
            const data = receiver[key];

            if(elem.tagName.toLowerCase() === "input"){
                elem.value = data;
            }else{
                elem.innerHTML = data;
            }
        });
    });
}

const init = () => {
    binderFactory(["key1", "key2"]);
};

// 初始化
init();