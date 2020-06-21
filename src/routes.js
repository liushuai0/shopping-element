import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

import Welcome from './components/Welcome/Welcome.vue'
import userManager  from "./views/user/userManager";
import perUser from "./views/permission/perUser";
import perList from "./views/permission/perList";
//商品分类
import list from "./views/goods/list";
import typeParam from "./views/goods/typeParam";  //分类参数
import shopType from "./views/goods/shopType";   //商品类型
import listAdd from "./views/goods/listAdd";   //商品类型

//订单列表
import orderList from "./views/order/orderList";

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '',
        hidden: true
    },

    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            {path: '/welcome', component: Welcome},
            {path: '/users', component: userManager},
            {path: '/rights', component: perList},
            {path: '/roles', component: perUser},
            {path: '/categories', component: shopType},
            {path: '/params', component: typeParam},
            {path: '/goods', component: list},
            {path: '/goods/add', component: listAdd},
            {path: '/orders', component: orderList},
            {path: '/reports', component: echarts}
        ]
    }

    // {
    //     path: '/',
    //     component: Home,
    //     name: '用户管理',
    //     iconCls: 'fa fa-user-plus',//图标样式class
    //     children: [
    //         { path: '/users', component: userManager, name: '用户列表' },
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '权限管理',
    //     iconCls: 'fa fa-id-card-o',
    //     children: [
    //         { path: "/roles", component: perUser, name: '角色列表' },
    //         { path: '/rights', component: perList, name: '权限列表' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '商品管理',
    //     iconCls: 'fa fa-laptop',
    //     // leaf: true,//只有一个节点
    //     children: [
    //         { path: '/goods', component: list, name: '商品列表'},
    //         { path: '/list/add', component: listAdd,hidden:'true', name: '添加商品' },
    //         { path: '/params', component: typeParam, name: '分类参数' },
    //         { path: '/categories', component: shopType, name: '商品分类' },
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '订单管理',
    //     iconCls: 'fa fa-tasks',
    //     // leaf: true,//只有一个节点
    //     children: [
    //         { path: '/orders', component: orderList, name: '订单列表' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '数据统计',
    //     iconCls: 'fa fa-bar-chart',
    //     children: [
    //         { path: '/reports', component: echarts, name: '数据报表' }
    //     ]
    // },

];

export default routes;
