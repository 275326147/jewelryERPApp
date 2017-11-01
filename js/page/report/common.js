import { callService, handleResult } from '../../utils/service';

export function clickHandler(item, dataList, field) {
    let list = [];
    let all = true;
    if (!field) {
        field = 'shopName';
    }
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

export function showDept(master) {
    if (master.state.deptList[0].shopName !== '全部') {
        master.setState({
            deptList: [{
                key: 0,
                shopName: '全部',
                hidden: false
            }].concat(master.state.deptList),
            deptVisible: true
        });
        return;
    }
    master.setState({
        deptVisible: true
    });
}