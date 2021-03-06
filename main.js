
class UrlMethods {
    constructor() {
        this.hashMap = [];
    }
    getUrl(url) {
        if (url === null) {
            return null;
        }
        url = url.indexOf('http') === -1 ? `https://${url}` : url;
        const isUrl = /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(url)
        if (isUrl === false) {
            alert('请输入正确的网址')
            return null;
        }
        const urls = new URL(url)
        urls.hostname = urls.hostname.indexOf('www.') === 0 ? urls.hostname.substring(4) : urls.hostname;
        return urls;
    }
    // 页面添加网址
    addUrl(urlObj) {
        $('#add').before(`
        <li my-href=${urlObj.href}>
            <span class="initial">${urlObj.hostname[0].toUpperCase()}</span>
            <span>${urlObj.hostname}</span>
            <svg class="icon caidan" aria-hidden="true">
                <use xlink:href="#icon-youcecaidan"></use>
            </svg>
        </li>`);
        return this;
    }
    // 在 hashMap 中添加网址信息, 保存 hashMap 到 localStorage
    saveUrl(urlObj) {
        if (urlObj) {
            this.hashMap.push({ 'href': urlObj.href, 'hostname': urlObj.hostname })
        }
        localStorage.setItem('hashMap', JSON.stringify(this.hashMap));
        return this;
    }
    // 遍历 hashMap
    eachUrl() {
        if (localStorage.getItem('hashMap')) {
            const hashMapStr = localStorage.getItem('hashMap');
            this.hashMap = JSON.parse(hashMapStr);
        }
        this.hashMap.forEach((urlObj) => {
            this.addUrl(urlObj);
        });
        return this;
    }
    showEdit(e) {
        $('#edit').remove();
        if ($(e.currentTarget).attr('id') === 'add') {
            return;
        }
        $(e.currentTarget).append(`
            <div id='edit'>
              <span id='alter'>修改</span>
              <span id='remove'>删除</span>
            </div>`)
    }
    deleteUrl(e) {
        const index = $(e.currentTarget).index(); // 获得元素下标
        $(e.currentTarget).remove();
        this.hashMap.splice(index, 1);
        return this;
    }
    alter(e, urlObj) {
        const index = $(e.currentTarget).index(); // 获得元素下标
        $(e.currentTarget).attr('my-href', urlObj.href).children().eq(0).html(urlObj.hostname[0].toUpperCase()).end().eq(1).html(urlObj.hostname);
        Object.assign(this.hashMap[index], { 'href': urlObj.href, 'hostname': urlObj.hostname })
        return this;
    }
    edit(e) {
        if ($(e.target).attr('id') === 'remove') {
            this.deleteUrl(e).saveUrl();
        } else if ($(e.target).attr('id') === 'alter') {
            $('#edit').remove();
            const url = prompt('请输入新网址');
            const urlObj = this.getUrl(url);
            if (urlObj === null) {
                return;
            }
            this.alter(e, urlObj).saveUrl();
        }
    }
}

// 触摸操作的键值对
const touch = {
    touchstart(e) {
        // 长按事件触发  
        timeOutEvent = setTimeout(() => {
            timeOutEvent = 0;
            urlMethod.showEdit(e);
        }, 400);
        //长按400毫秒    
    },
    touchmove() {
        clearTimeout(timeOutEvent);
        timeOutEvent = 0;
    },
    touchend(e) {
        clearTimeout(timeOutEvent);
        if (timeOutEvent != 0) {
            // 点击事件
            if ($(e.currentTarget).attr('id') === 'add') {
                return;
            }

            if ($(e.target).attr('id') !== 'edit' && $(e.target).parents('#edit').length !== 1) {
                $('#edit').remove();
                window.open($(e.currentTarget).attr('my-href'));
            } else {
                urlMethod.edit(e)
            }
        }
        return false;
    }
}

const urlMethod = new UrlMethods();
urlMethod.eachUrl();

$('#blocks').on(touch, 'li');

$('#add').on('click', () => {
    $('#edit').remove();
    const url = window.prompt('请输入要添加的网址');
    const urlObj = urlMethod.getUrl(url);
    if (urlObj === null) {
        return;
    }
    urlMethod.addUrl(urlObj).saveUrl(urlObj);
});
$('#blocks').on('click', 'li', (e) => {
    if ($(e.currentTarget).attr('id') === 'add') {
        return;
    }
    if ($(e.target).attr('class') !== 'icon caidan' && $(e.target).attr('id') !== 'edit' && $(e.target).parents('#edit').length !== 1) {
        window.open($(e.currentTarget).attr('my-href'));
    } else if ($(e.target).attr('class') === 'icon caidan') {
        urlMethod.showEdit(e);
    } else {
        urlMethod.edit(e)
    }
})

$(`*:not(li)`).on('click', (e) => {
    if ($(e.target).attr('class') === 'icon caidan') {
        return;
    }
    $('#edit').remove();
})
let keyArr = [];
$(document).on('keydown', (e) => {
    const { key } = e;
    if (keyArr.length < 2) {
        keyArr.push(key);
    }
    const url = urlMethod.hashMap.filter((value) => {
        if (value.hostname.slice(0, 1) === keyArr[0]) {
            return value;
        }
    })
    if (url.length === 0) {
        keyArr = [];
        return;
    }
    setTimeout(() => {
        if (keyArr.length === 0) {
            return;
        }
        if (keyArr[1] === undefined || isNaN(keyArr[1] - 1)) {
            window.open(url[0].href);
        } else {
            try {
                window.open(url[keyArr[1] - 1].href);
            } catch (error) {
                console.log('没有的标签');
            }
        }
        keyArr = []
    }, 800)
})