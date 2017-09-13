'use strict';
import React from 'react';

/**
 * 所有 component 整个框架内只有此处引入
 * navigator 统一进行路由显示
 * 将全部 component 的引用从老式的层级式改为统一入口的扁平式
 */
import Home from '../page/home/home';
import Member from '../page/member';
import Message from '../page/message';
import UserInfo from '../page/userInfo';
import Follow from '../page/follow';
import Check from '../page/check/check';
import Todo from '../page/todo/todo';

/*
 * 路由配置项
 * 可配置默认参数 props: params ，配合 this.props 的限制可使代码更严谨
 * component 默认和 key 、component 文件夹名称一致，首字母大写，component 文件夹内强制 index.js 为入口文件
 */
const RouteMap = {
    '首页': { index: 0, component: Home, params: {} },
    '会员查询': { index: 1, component: Member, params: {} },
    '商品跟踪': { index: 2, component: Follow, params: {} },
    '盘点': { index: 3, component: Check, params: {} },
    '消息': { index: 4, component: Message, params: {} },
    '用户信息': { index: 5, component: UserInfo, params: {} },
    '待审核': { index: 6, component: Todo, params: {} },
    '审核驳回': { index: 7, component: Todo, params: {} },
    '待接收在途': { index: 8, component: Todo, params: {} },
    '调拨驳回': { index: 9, component: Todo, params: {} }
};

export default class Route {

    /**
     * 获取 ID 对应的 Component
     * @param {any} id 页面的 ID 
     *              有严格的映射关系，会根据传入 ID 同名的文件夹去取路由对应的页面
     * @param {any} params Component 用到的参数
     */
    static getRoutePage(route, navigator) {
        let id = route.id,
            params = route.params,
            routeObj = RouteMap[id],
            Component;
        if (routeObj) {
            Component = routeObj.component;
            //合并默认参数
            Object.assign(params, routeObj.params);
        } else {
            Component = Error;
            params = { message: '当前页面没有找到：' + id };
        }
        return <Component navigator={navigator} {...params} />;
    }

}