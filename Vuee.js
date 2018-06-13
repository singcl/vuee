// 极简单，极不完善 类Vue 数据响应式框架探索

class Vuee {
    constructor(options) {
        this.options = options
        this.observe(options.data)
        this.compile(document.querySelector(options.el))
    }

    observe(data) {
        Object.keys(data).forEach((key) => {
            const ob = new Observer()
            let val = data[key]
            Object.defineProperty(data, key, {
                get() {
                    Observer.target && ob.addSubNode(Observer.target)
                    return val
                },
                
                set(newVal) {
                    ob.update(newVal)
                    val = newVal
                }
            })
        })
    }

    compile(node) {
        [].forEach.call(node.childNodes, (child) => {
            if (!child.firstElementNode && /\{\{(.*)\}\}/.test(child.innerHTML)) {
                const key = RegExp.$1.trim()
                child.innerHTML = child.innerHTML.replace(new RegExp('{{\\s*' + key + '\\s*}}', 'gm'), this.options.data[key])
                Observer.target = child
                this.options.data[key]
                Observer.target = null
            } else if (child.firstElementNode) {
                this.compile(child)
            }
        })
    }
}

class Observer {
    constructor() {
        this.subNode = []
    }

    addSubNode(node) {
        this.subNode.push(node)
    }

    update(newVal) {
        this.subNode.forEach((node) => {
            node.innerHTML = newVal
        })
    }
}