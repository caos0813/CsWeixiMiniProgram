
app.json 配置项列表
属性	类型	必填	描述
pages	String Array	是	设置页面路径
window	Object	否	设置默认页面的窗口表现
tabBar	Object	否	设置底部 tab 的表现
networkTimeout	Object	否	设置网络超时时间
debug	Boolean	否	设置是否开启 debug 模式

App()
App() 函数用来注册一个小程序。接受一个 object 参数，其指定小程序的生命周期函数等。

object参数说明：

属性	类型	描述	触发时机
onLaunch	Function	生命周期函数--监听小程序初始化	当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
onShow	Function	生命周期函数--监听小程序显示	当小程序启动，或从后台进入前台显示，会触发 onShow
onHide	Function	生命周期函数--监听小程序隐藏	当小程序从前台进入后台，会触发 onHide
onError	Function	错误监听函数	当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
onPageNotFound	Function	页面不存在监听函数	当小程序出现要打开的页面不存在的情况，会带上页面信息回调该函数，详见下文
其他	Any		开发者可以添加任意的函数或数据到 Object 参数中，用 this 可以访问
前台、后台定义： 当用户点击左上角关闭，或者按了设备 Home 键离开微信，小程序并没有直接销毁，而是进入了后台；当再次进入微信或再次打开小程序，又会从后台进入前台。需要注意的是：只有当小程序进入后台一定时间，或者系统资源占用过高，才会被真正的销毁。

关闭小程序（基础库版本1.1.0开始支持）： 当用户从扫一扫、转发等入口(场景值为1007, 1008, 1011, 1025)进入小程序，且没有置顶小程序的情况下退出，小程序会被销毁。

小程序运行机制在基础库版本 1.4.0 有所改变： 上一条关闭逻辑在新版本已不适用。详情


场景值
基础库 1.1.0 开始支持，低版本需做兼容处理

当前支持的场景值有：

场景值ID	说明
1001	发现栏小程序主入口
1005	顶部搜索框的搜索结果页
1006	发现栏小程序主入口搜索框的搜索结果页
1007	单人聊天会话中的小程序消息卡片
1008	群聊会话中的小程序消息卡片
1011	扫描二维码
1012	长按图片识别二维码
1013	手机相册选取二维码
1014	小程序模版消息
1017	前往体验版的入口页
1019	微信钱包
1020	公众号 profile 页相关小程序列表
1022	聊天顶部置顶小程序入口
1023	安卓系统桌面图标
1024	小程序 profile 页
1025	扫描一维码
1026	附近小程序列表
1027	顶部搜索框搜索结果页“使用过的小程序”列表
1028	我的卡包
1029	卡券详情页
1030	自动化测试下打开小程序
1031	长按图片识别一维码
1032	手机相册选取一维码
1034	微信支付完成页
1035	公众号自定义菜单
1036	App 分享消息卡片
1037	小程序打开小程序
1038	从另一个小程序返回
1039	摇电视
1042	添加好友搜索框的搜索结果页
1043	公众号模板消息
1044	带 shareTicket 的小程序消息卡片（详情)
1047	扫描小程序码
1048	长按图片识别小程序码
1049	手机相册选取小程序码
1052	卡券的适用门店列表
1053	搜一搜的结果页
1054	顶部搜索框小程序快捷入口
1056	音乐播放器菜单
1057	钱包中的银行卡详情页
1058	公众号文章
1059	体验版小程序绑定邀请页
1064	微信连Wi-Fi状态栏
1067	公众号文章广告
1068	附近小程序列表广告
1071	钱包中的银行卡列表页
1072	二维码收款页面
1073	客服消息列表下发的小程序消息卡片
1074	公众号会话下发的小程序消息卡片
1078	连Wi-Fi成功页
1089	微信聊天主界面下拉
1090	长按小程序右上角菜单唤出最近使用历史
1092	城市服务入口
可以在 App 的 onlaunch 和 onshow 中获取上述场景值，部分场景值下还可以获取来源应用、公众号或小程序的appId。详见

Tip: 由于Android系统限制，目前还无法获取到按 Home 键退出到桌面，然后从桌面再次进小程序的场景值，对于这种情况，会保留上一次的场景值。




Page
Page() 函数用来注册一个页面。接受一个 object 参数，其指定页面的初始数据、生命周期函数、事件处理函数等。

object 参数说明：

属性	类型	描述
data	Object	页面的初始数据
onLoad	Function	生命周期函数--监听页面加载
onReady	Function	生命周期函数--监听页面初次渲染完成
onShow	Function	生命周期函数--监听页面显示
onHide	Function	生命周期函数--监听页面隐藏
onUnload	Function	生命周期函数--监听页面卸载
onPullDownRefresh	Function	页面相关事件处理函数--监听用户下拉动作
onReachBottom	Function	页面上拉触底事件的处理函数
onShareAppMessage	Function	用户点击右上角转发
onPageScroll	Function	页面滚动触发事件的处理函数
onTabItemTap	Function	当前是 tab 页时，点击 tab 时触发
其他	Any	开发者可以添加任意的函数或数据到 object 参数中，在页面的函数中用 this 可以访问





页面路由
在小程序中所有页面的路由全部由框架进行管理。

页面栈
框架以栈的形式维护了当前的所有页面。 当发生路由切换的时候，页面栈的表现如下：

路由方式	页面栈表现
初始化	新页面入栈
打开新页面	新页面入栈
页面重定向	当前页面出栈，新页面入栈
页面返回	页面不断出栈，直到目标返回页，新页面入栈
Tab 切换	页面全部出栈，只留下新的 Tab 页面
重加载	页面全部出栈，只留下新的页面
getCurrentPages()
getCurrentPages() 函数用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。

Tip：不要尝试修改页面栈，会导致路由以及页面状态错误。

路由方式
对于路由的触发方式以及页面生命周期函数如下：

路由方式	触发时机	路由前页面	路由后页面
初始化	小程序打开的第一个页面		onLoad, onShow
打开新页面	调用 API wx.navigateTo 或使用组件 <navigator open-type="navigateTo"/>	onHide	onLoad, onShow
页面重定向	调用 API wx.redirectTo 或使用组件 <navigator open-type="redirectTo"/>	onUnload	onLoad, onShow
页面返回	调用 API wx.navigateBack 或使用组件<navigator open-type="navigateBack">或用户按左上角返回按钮	onUnload	onShow
Tab 切换	调用 API wx.switchTab 或使用组件 <navigator open-type="switchTab"/> 或用户切换 Tab		各种情况请参考下表
重启动	调用 API wx.reLaunch 或使用组件 <navigator open-type="reLaunch"/>	onUnload	onLoad, onShow
Tab 切换对应的生命周期（以 A、B 页面为 Tabbar 页面，C 是从 A 页面打开的页面，D 页面是从 C 页面打开的页面为例）：

当前页面	路由后页面	触发的生命周期（按顺序）
A	A	Nothing happend (什么也没有发生)
A	B	A.onHide(), B.onLoad(), B.onShow()
A	B（再次打开）	A.onHide(), B.onShow()
C	A	C.onUnload(), A.onShow()
C	B	C.onUnload(), B.onLoad(), B.onShow()
D	B	D.onUnload(), C.onUnload(), B.onLoad(), B.onShow()
D（从转发进入）	A	D.onUnload(), A.onLoad(), A.onShow()
D（从转发进入）	B	D.onUnload(), B.onLoad(), B.onShow()
Tips:

navigateTo, redirectTo 只能打开非 tabBar 页面。
switchTab 只能打开 tabBar 页面。
reLaunch 可以打开任意页面。
页面底部的 tabBar 由页面决定，即只要是定义为 tabBar 的页面，底部都有 tabBar。
调用页面路由带的参数可以在目标页面的onLoad中获取。


navigator
页面链接。

属性名	类型	默认值	说明	最低版本
url	String		应用内的跳转链接	
open-type	String	navigate	跳转方式	
delta	Number		当 open-type 为 'navigateBack' 时有效，表示回退的层数	
hover-class	String	navigator-hover	指定点击时的样式类，当hover-class="none"时，没有点击态效果	
hover-stop-propagation	Boolean	false	指定是否阻止本节点的祖先节点出现点击态	1.5.0
hover-start-time	Number	50	按住后多久出现点击态，单位毫秒	
hover-stay-time	Number	600	手指松开后点击态保留时间，单位毫秒
open-type 有效值：

值	说明	最低版本
navigate	对应 wx.navigateTo 的功能	
redirect	对应 wx.redirectTo 的功能	
switchTab	对应 wx.switchTab 的功能	
reLaunch	对应 wx.reLaunch 的功能	1.1.0
navigateBack	对应 wx.navigateBack 的功能

注：navigator-hover 默认为 {background-color: rgba(0, 0, 0, 0.1); opacity: 0.7;}, <navigator/> 的子节点背景色应为透明色



项目配置文件
可以在项目根目录使用 project.config.json 文件对项目进行配置。

字段名	类型	说明
miniprogramRoot	Path String	指定小程序源码的目录(需为相对路径)
qcloudRoot	Path String	指定腾讯云项目的目录(需为相对路径)
pluginRoot	Path String	指定插件项目的目录(需为相对路径)
compileType	String	编译类型
setting	Object	项目设置
libVersion	String	基础库版本
appid	String	项目的 appid，只在新建项目时读取
projectname	String	项目名字，只在新建项目时读取
packOptions	Object	打包配置选项
scripts	Object	自定义预处理
compileType 有效值

名字	说明
miniprogram	当前为普通小程序项目
plugin	当前为小程序插件项目
setting 中可以指定以下设置

字段名	类型	说明
es6	Boolean	是否启用 es5 转 es6
postcss	Boolean	上传代码时样式是否自动补全
minified	Boolean	上传代码时是否自动压缩
urlCheck	Boolean	是否检查安全域名和 TLS 版本
scripts 中指定自定义预处理的命令

名字	说明
beforeCompile	预览前预处理命令
beforePreview	预览前预处理命令
beforeUpload	上传前预处理命令
packOptions
packOptions 用以配置项目在打包过程中的选项。打包是预览 、上传时对项目进行的必须步骤。

目前可以指定 packOptions.ignore 字段，用以配置打包时对符合指定规则的文件或文件夹进行忽略，以跳过打包的过程，这些文件或文件夹将不会出现在预览或上传的结果内。

packOptions.ignore 为一对象数组，对象元素类型如下：

字段名	类型	说明
value	string	路径或取值
type	string	类型
其中，type 可以取的值为 folder、file、suffix、prefix，分别对应文件夹、文件、后缀、前缀。

示例配置如下。

{
  "packOptions": {
    "ignore": [{
      "type": "file",
      "value": "test/test.js"
    }, {
      "type": "folder",
      "value": "test"
    }, {
      "type": "suffix",
      "value": ".webp"
    }, {
      "type": "prefix",
      "value": "test-"
    }]
  }
}
注: value 字段的值不支持通配符、正则表达式。若表示文件或文件夹路径，以小程序目录 (miniprogramRoot) 为根目录。

项目配置示例：

{
  "miniprogramRoot": "./src",
  "qcloudRoot": "./svr",
  "setting": {
    "postcss": true,
    "es6": true,
    "minified": true,
    "urlCheck": false
  },
  "packOptions": {}
}



Component构造器
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