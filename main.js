
class UrlMethods {
    constructor() {
        this.hashMap = [];
    }
    isUrl(url) {
        return /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(url)
    }
    getUrl(url) {
        const urls = new URL(url)
        return urls;
    }
    addUrl(urlObj) {
        $('#add').before(`<a href=${urlObj.href}>
        <li>
            <span class="initial">${urlObj.hostname[0].toUpperCase()}</span>
            <span>${urlObj.hostname}</span>
        </li>
        </a>`);
        return this;
    }
    saveUrl(urlObj) {
        this.hashMap.push({ 'href': urlObj.href, 'hostname': urlObj.hostname })
        localStorage.setItem('hashMap', JSON.stringify(this.hashMap));
        return this;
    }
    eachUrl() {
        const hashMapStr = localStorage.getItem('hashMap');
        if (hashMapStr) {
            this.hashMap = JSON.parse(hashMapStr);
            this.hashMap.forEach(urlObj => {
                this.addUrl(urlObj);
            });
        }

    }
    deleteUrl() {

    }
}

const urlMethod = new UrlMethods()
urlMethod.eachUrl()

$('#add').on('click', () => {
    let url = window.prompt('请输入要添加的网址');
    url = url.indexOf('http') === -1 ? `https://${url}` : url;
    const isUrl = urlMethod.isUrl(url);
    if (isUrl === false) {
        alert('请输入正确的网址')
        return;
    }
    const urlObj = urlMethod.getUrl(url);
    urlMethod.addUrl(urlObj).saveUrl(urlObj);
});
