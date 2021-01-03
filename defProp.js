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
  //将所有的值定义响应式
  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key]);
  });
}

function set(obj, key, val) {
  defineReactive(obj, key, val);
}

const obj = { foo: "foo", baz: { a: 1 }, arr: [1, 2, 3] };
observe(obj);
obj.foo;
obj.foo = "new foo";

// obj.baz.a = '222'
// defineReactive(obj, "foo", "foo");
// obj.foo;
// obj.foo = "foooooooo";
obj.baz = { a: 10000 };
obj.baz.a;
obj.baz.a = 20000;

//如果该对象没有这个属性 无法设置
set(obj, "dong", "dong");
obj.dong;
obj.dong = "dongsss";

//object。defineProperty对数组无效
// 分析： 改变数组方法只有7个
obj.arr.push(4);
