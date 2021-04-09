# 帮助文档

通过该组件，可以快速完成阿里云函数计算相关项目的构建。

## 参数

|  参数   |  必填  |  类型  | 取值  |  描述  |  备注  |    
|  ----  | ----  |  ----  | ----  |  ----  |  ----  |
| region  | true |  string |  cn-beijing、cn-hangzhou、cn-shanghai、cn-qingdao、cn-zhangjiakou、cn-huhehaote、cn-shenzhen、cn-chengdu、 cn-hongkong、ap-southeast-1、 ap-southeast-2、ap-southeast-3、 ap-southeast-5、ap-northeast-1、eu-central-1、eu-west-1、us-west-1、us-east-1、ap-south-1  |  地域 |   |
| service  | true | struct  | - | 服务  |  -  |
| function  | true | struct  | - | 函数  |  -  |


### service

|  参数   |  必填  |  类型  | 取值  |  描述  |  备注  |    
|  ----  | ----  |  ----  | ----  |  ----  |  ----  |
| name  | true | string  | - | 服务名称  |  -  |

### function

|  参数   |  必填  |  类型  | 取值  |  描述  |  备注  |    
|  ----  | ----  |  ----  | ----  |  ----  |  ----  |
| name  | true | string  | - | 函数名称  |  -  |
| runtime  | true | string  | nodejs6、nodejs8、nodejs10、nodejs12、python2.7、python3、dotnetcore2.1、php7.2、java8、python3、python2.7、custom-container | 运行时  |  -  |
| codeUri  | false | string  | - | 代码路径  |  如果runtime不为custom-container则必填  |
| customContainer  | false | struct  | - | 自定义镜像  |   如果runtime为custom-container则必填  |

#### customContainer

|  参数   |  必填  |  类型  | 取值  |  描述  |  备注  |    
|  ----  | ----  |  ----  | ----  |  ----  |  ----  |
| image  | true | string  | - | 仓库地址  | 例如`'registry.cn-hongkong.aliyuncs.com/s-devs-generate/fc-com-test-build-image:v0.1'`  |
| command  | true | string  | - | 命令  |  例如`'["node"]'`  |
| args  | true | string  | - | 参数  |  例如 `'["index.js"]'`  |



------- 

# 其它

组件开发者：项目编译

````
$ npm i

$ npm run build:ts
````
