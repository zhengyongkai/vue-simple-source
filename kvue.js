function defineReactive(obj, key, val) {
  //递归
  observe(val);
  //对传入的obj进行访问拦截
  //每一次执行这个方法都是一个闭包  将这个值放在内存里
  Object.defineProperty(obj, key, {
    get() {
      console.log("get ", key);
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        console.log("set " + key + " :" + newVal);
        // 如果传入的newVal如果是obj， 需要做响应式处理
        observe(newVal);
        val = newVal;
      }
    },
  });
}
function observe(obj) {
  if (typeof obj !== "object" || obj == null) {
    return;
  }
  //Observer  创建实例 分辨Object数组
  new Observer(obj);
}

//代理函数 , 方便用户直接访问$data的函数
function proxy(vm, sourcekey) {
  Object.keys(vm[sourcekey]).forEach((key) => {
      //vm设置属性  vm是this 即this.$data
    Object.defineProperty(vm, key, {
      get() {
        return vm[sourcekey][key];
      },
      set(newVal){
        vm[sourcekey][key] = newVal
      }
    });
  });
}

function set(obj, key, val) {
  defineReactive(obj, key, val);
}
class KVue {
  constructor(options) {
    //保存选项
    this.$options = options;
    this.$data = options.data;
    //响应式处理
    observe(this.$data);
    proxy(this,'$data')
  }
}
//根据对象类型决定如何做相应
class Observer {
  constructor(value) {
    this.value = value;
    if (typeof value === "object") {
      this.walk(value);
    }
  }
  walk(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key]);
    });
  }
}
