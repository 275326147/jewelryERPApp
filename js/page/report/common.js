import { callService, handleResult } from '../../utils/service';

export function clickHandler(item, dataList, field) {
    let list = [];
    let all = true;
    dataList.forEach(function (el) {
        if (el[field] === item[field]) {
            el.hidden = !el.hidden;
        }
        if (el[field] !== '全部' && item[field] === '全部' && !item.hidden) {
            el.hidden = false;
        } else if (el[field] !== '全部' && item[field] === '全部' && item.hidden) {
            el.hidden = true;
        }
        if (el[field] !== '全部' && el.hidden) {
            all = false;
        }
        list.push(el);
    });
    if (all) {
        list[0].hidden = false;
    } else {
        list[0].hidden = true;
    }
    return list;
}

export function getShopList(master) {
    callService(master, 'getShopList.do', new FormData(), function (response) {
        if (response.shopList) {
            master.setState({
                deptList: handleResult(response.shopList)
            });
        }
    });
}

export function show(master, list, field, visible, flag) {
    let state = {};
    if (master.state[list][0][field] !== '全部') {
        let all = {
            key: 0,
            hidden: flag ? true : false
        };
        all[field] = '全部';
        state[list] = [all].concat(master.state[list]);
        state[visible] = true;
        master.setState(state);
        return;
    }
    state[visible] = true;
    master.setState(state);
}

export function reloadTable(master, data) {
    if (!data) data = master.state.data;
    let newData = [];
    data.forEach(function (item) {
        newData.push(item);
    });
    master.setState({
        data: newData
    });
}