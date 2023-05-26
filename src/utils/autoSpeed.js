export function autoSpeed(url = "http://uwzsun.cn/live/3014125851_live2.flv") {
    return new Promise((resolve, project) => {
        try {
            let size = 0
            let startTime = Date.now();
            let xhr = new XMLHttpRequest();
            xhr.open("GET", url + "?t=" + Date.parse(new Date()));
            xhr.responseType = 'ArrayBuffer';
            xhr.onload = function (res) {
            }
            xhr.onloadstart = function (res) {
                setTimeout(() => {
                    resolve('SD')
                }, 6000);
            }
            xhr.onprogress = function (res) {
                let result = res.loaded / 1024
                if (result > size) size = result
                setTimeout(() => {
                    xhr.abort()
                }, 3000)
            }
            xhr.onerror = function (err) {
                resolve('SD')
            }
            xhr.onabort = function (err) {
                if (size / 3 > 256) {
                    resolve('BD')
                } else if (size / 3 > 128) {
                    resolve('HD')
                } else if (size / 3 > 64) {
                    resolve('SD')
                }
            }
            xhr.ontimeout = function (err) {
                resolve('SD')
            }
            xhr.send();
        } catch (error) {
            resolve(error);
        }
    })
}