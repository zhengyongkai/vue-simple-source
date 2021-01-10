// 编译器
// 递归遍历dom树
// 判断节点类型, 如果是文本 , 则判断是否是插值绑定
// 若果是元素，则遍历起属性判断是否是指令或者时间，然后递归子元素
class Compile{
    constructor(el,vm){
        //el是宿主
        //vm是KVue实例
        this.$vm = vm;
        this.$el = document.querySelector(el)
        if(this.$el){
            this.compile(this.$el)
        }
    }
    compile(el){
        const childNodes = el.childNodes;
        console.log(childNodes)
        Array.from(childNodes).forEach(node=>{
            console.log()
            if(this.isElement(node)){
                console.log('编译元素'+node.nodeName)
                this.compileElement(node)
            }else if(this.isInter(node)){
                console.log('编译插值绑定'+node.textContent)
                this.compileText(node);
            }
            //递归子节点
            if(node.childNodes &&  node.childNodes.length > 0){
                this.compile(node)
            }   
        })
    }

    isElement(node){
        //alert('ss')
        return node.nodeType === 1;
    }
    isInter(node){
        //alert('sss')
        //文本 内容是{{xxxx}}
        return node.nodeType === 3 &&  /\{\{(.*)\}\}/.test(node.textContent);
    }
    compileText(node){
      node.textContent =   this.$vm[RegExp.$1]
    }
    compileElement(node){
        //节点是元素
        //遍历属性集合
        const nodeAttrs = node.attributes;
        Array.from(nodeAttrs).forEach(attr=>{
            //指令一 k-xx 定义
            const attrName = attr.name; //k-xx
            const exp = attr.value // oo
            if(this.isDrective(attrName)){
                const dir = attrName.substring(2) //xx
                // 执行指令
                this[dir] && this[dir](node,exp)
            }
        })
    }
    isDrective(attr){
        return  attr.indexOf('k-') === 0 ;
    }
    text(node,exp){
        node.textContent = this.$vm[exp]
    }
    html(node,exp){
        node.innerHTML = this.$vm[exp]
    }
}

