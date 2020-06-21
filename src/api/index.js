/*
与后台交互模块 （依赖已封装的ajax函数）
 */
import ajax from './axios'
// const BASE_URL = 'http://local:4000'
// const BASE_URL = '/api'
import axios from './axios'
import Vue from 'vue'

var that=Vue.prototype
// // 远程后台地址
export const baseURL = 'http://localhost:8888/api/private/v1/'


//export const baseURL = 'https://www.liulongbin.top:8888/api/private/v1';

// export const requestLogin = params => ajax(base + '/login',params,'POST')

export const requestLogin = params =>{return that.postAxios('/login', params)}
//获取左侧菜单
export const getMenuList = () => {
    return that.getAxios('/menus')
};
//获取用户列表
export const reqUserList = params => { return that.getAxios('/users', params)};
//修改用户状态
export const updateUserStatus = params => { return that.putAxios(`/users/${params.uId}/state/${params.mg_state}`, '')};
//获取用户详细信息
export const reqUserInfo = params => { return that.getAxios(`/users/${params}`, )};
//编辑信息保存
export const updateUserInfo= params =>{return that.putAxios(`/users/${params.id}` , {email:params.email,mobile:params.mobile}) }
//新增用户
export const addUserInfo = params => { return that.postAxios('/users', params)};
//删除用户
export const delUserInfo = params => { return that.deleteAxios(`/users/${params}`)};
//获取角色列表
export const reqJueSeList = () => { return that.getAxios('/roles')};
//添加角色
export const addJueSe = params => { return that.postAxios('/roles',params)};
//根据 ID 查询角色
export const queryJueSeById = params => { return that.getAxios(`/roles/${params}`,)};
//编辑角色
export const editJueSe = params => { return that.putAxios(`/roles/${params.roleId}`,{roleName:params.roleName,roleDesc:params.roleDesc})};
//删除角色
export const delJueSe = params => { return that.deleteAxios(`/roles/${params}`)};
//編輯提交角色
export const updateRoleInfo = params => {
    return that.putAxios(`/users/${params.id}/role`, {rid: params.rid})
};



//获取权限
export const reqQuanXianTree = type => { return that.getAxios(`/rights/${type}`)};

//角色授权
export const savePms = (roleId,rids) => { return that.postAxios(`/roles/${roleId}/rights`,{rids:rids})};

//商品分类数据列表
export const getShopList = params => { return that.getAxios('/goods',params)};

//删除商品列表
export const delShopList = params => { return that.deleteAxios(`/goods/${params}`)};

//添加商品列表
export const addShopList = params => { return that.postAxios('/goods',params)};

//获取商品分类列表
export const getGoodsList = params => { return that.getAxios('/categories',params)};

//编辑提交商品
export const editShopList = (params) => {
    return that.putAxios(`/goods/${params.id}`, params)
};

// 根据 ID 查询商品
export const getShopListById = params => {
    return that.getAxios(`/goods/${params}`)
};

//订单数据列表
export const getOrderList = params => {
    return that.getAxios('/orders', params)
};

//查看订单详情
export const getOrderInfo = params => {
    return that.getAxios(`/orders/${params}`)
};

//查看订单详情
export const getOrderLogistics = params => {
    return that.getAxios(`/kuaidi/${params}`)
};


export const getUserListPage = params => { return ajax(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return ajax(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return ajax(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return ajax(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return ajax(`${base}/user/add`, { params: params }); };








