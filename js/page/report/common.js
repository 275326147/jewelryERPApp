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
    } else if (list[0][field] === '全部') {
        list[0].hidden = true;
    }
    return list;
}

export function getShopList(master, callback) {
    callService(master, 'getShopList.do', new FormData(), function (response) {
        if (response.shopList && response.shopList.length > 0) {
            master.setState({
                deptList: handleResult(response.shopList)
            }, function () {
                if (callback) {
                    callback.call(master);
                }
            });
        }
    });
}

export function show(master, list, field, visible, flag) {
    let state = {};
    let first = master.state[list][0];
    if (first && first[field] !== '全部') {
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

export function getDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? "0".concat(month) : month;
    let day = date.getDate();
    day = day < 10 ? "0".concat(day) : day;
    return `${year}-${month}-${day}`;
}

export function setDate(master, rowID, callback) {
    let date = new Date();
    let beginDate = '';
    let endDate = '';
    switch (rowID) {
        case '1':
            date = new Date(date.getTime() - 24 * 60 * 60 * 1000);
            date = getDate(date);
            beginDate = date;
            endDate = date;
            break;
        case '2':
            beginDate = getDate(new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000));
            endDate = getDate(date);
            date = `${beginDate}至${endDate}`;
            break;
        case '3':
            beginDate = getDate(new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000));
            endDate = getDate(date);
            date = `${beginDate}至${endDate}`;
            break;
        case '4':
            break;
        default:
            date = getDate(date);
            beginDate = date;
            endDate = date;
            break;
    }
    master.setState({
        date: date,
        beginDate: beginDate,
        endDate: endDate
    }, function () {
        if (callback) {
            callback.call(master);
        }
    });
}

export function sort(list, key) {
    let temp;
    for (let i = 0; i < list.length - 1; i++) {
        for (let j = 0; j < list.length - 1 - i; j++) {
            let front = list[j];
            let back = list[j + 1];
            if (front[front.length - 1][key] > back[back.length - 1][key]) {
                temp = front;
                front = back;
                back = temp;
            }
        }
    }
}