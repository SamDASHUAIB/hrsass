// 管理所有的自定义指令

// v-xxx 其中, vue 会自动添上 v-
export const imagerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted(dom, options) {
    /*
      dom 当前指令作用的 dom 对象 此处就是 <img> 元素
      options 指令中的变量的解释, 其中有一个属性叫做 value

      当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 => onerror
    */
    dom.onerror = function () {
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      // dom可以注册error事件
      //
      /*
        <img v-imagerror="默认图片地址">
        options.value 就是默认图片地址
      */
      dom.src = options.value // 这里不能写死
    }
  },
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  },
}
