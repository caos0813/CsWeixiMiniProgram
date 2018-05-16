// components/test/test.js

/**
 * Component构造器
Component构造器可用于定义组件，调用Component构造器时可以指定组件的属性、数据、方法等。

定义段	类型	是否必填	描述
properties	Object Map	否	组件的对外属性，是属性名到属性设置的映射表，属性设置中可包含三个字段， type 表示属性类型、 value 表示属性初始值、 observer 表示属性值被更改时的响应函数
data	Object	否	组件的内部数据，和 properties 一同用于组件的模版渲染
methods	Object	否	组件的方法，包括事件响应函数和任意的自定义方法，关于事件响应函数的使用，参见 组件事件
behaviors	String Array	否	类似于mixins和traits的组件间代码复用机制，参见 behaviors
created	Function	否	组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
attached	Function	否	组件生命周期函数，在组件实例进入页面节点树时执行
ready	Function	否	组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
moved	Function	否	组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
detached	Function	否	组件生命周期函数，在组件实例被从页面节点树移除时执行
relations	Object	否	组件间关系定义，参见 组件间关系
externalClasses	String Array	否	组件接受的外部样式类，参见 外部样式类
options	Object Map	否	一些组件选项，请参见文档其他部分的说明
生成的组件实例可以在组件的方法、生命周期函数和属性 observer 中通过 this 访问。组件包含一些通用属性和方法。

属性名	类型	描述
is	String	组件的文件路径
id	String	节点id
dataset	String	节点dataset
data	Object	组件数据，包括内部数据和属性值
方法名	参数	描述
setData	Object newData	设置data并执行视图层渲染
hasBehavior	Object behavior	检查组件是否具有 behavior （检查时会递归检查被直接或间接引入的所有behavior）
triggerEvent	String name, Object detail, Object options	触发事件，参见 组件事件
createSelectorQuery		创建一个 SelectorQuery 对象，选择器选取范围为这个组件实例内
selectComponent	String selector	使用选择器选择组件实例节点，返回匹配到的第一个组件实例对象
selectAllComponents	String selector	使用选择器选择组件实例节点，返回匹配到的全部组件实例对象组成的数组
getRelationNodes	String relationKey	获取所有这个关系对应的所有关联节点，参见 组件间关系
代码示例：

在开发者工具中预览效果

Component({

  behaviors: [],

  properties: {
    myProperty: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal){} // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    myProperty2: String // 简化的定义方式
  },
  data: {}, // 私有数据，可用于模版渲染

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function(){},
  moved: function(){},
  detached: function(){},

  methods: {
    onMyButtonTap: function(){
      this.setData({
        // 更新属性和数据的方法与更新页面数据的方法类似
      })
    },
    _myPrivateMethod: function(){
      // 内部方法建议以下划线开头
      this.replaceDataOnPath(['A', 0, 'B'], 'myPrivateData') // 这里将 data.A[0].B 设为 'myPrivateData'
      this.applyDataUpdates()
    },
    _propertyChange: function(newVal, oldVal) {

    }
  }

})
注意：在 properties 定义段中，属性名采用驼峰写法（propertyName）；在 wxml 中，指定属性值时则对应使用连字符写法（component-tag-name property-name="attr value"），应用于数据绑定时采用驼峰写法（attr="{{propertyName}}"）。

Tips:

Component 构造器构造的组件也可以作为页面使用。
使用 this.data 可以获取内部数据和属性值，但不要直接修改它们，应使用 setData 修改。
生命周期函数无法在组件方法中通过 this 访问到。
属性名应避免以 data 开头，即不要命名成 dataXyz 这样的形式，因为在 WXML 中， data-xyz="" 会被作为节点 dataset 来处理，而不是组件属性。
在一个组件的定义和使用时，组件的属性名和data字段相互间都不能冲突（尽管它们位于不同的定义段中）。
 * 
*/
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    name:'test components'
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
