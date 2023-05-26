const Local = (name, value, time) => {
  try {
    let date = Date.parse(new Date()) / 1000;
    if (value === null) {
      localStorage.removeItem(name);
    } else if (value !== undefined) {
      if (time) {
        localStorage.setItem(name, JSON.stringify({ value, time: date + time }));
      } else {
        localStorage.setItem(name, JSON.stringify({ value }));
      }
    } else {
      const v = localStorage.getItem(name);
      if (v) {
        if (JSON.parse(v) && JSON.parse(v).time) {
          if (JSON.parse(v).time - date > 0) {
            return JSON.parse(v).value;
          } else {
            localStorage.removeItem(name);
            return undefined;
          }
        } else return JSON.parse(v).value;
      } else return undefined;
    }
  } catch (error) {
    console.log(error);
  }
};
const initLang = () => {
  return Local('lang') || ((navigator.language || navigator.browserLanguage).toLowerCase().indexOf('zh') !== -1 ? 'zh' : 'en');
}
const Session = (name, value, time) => {
  let date = Date.parse(new Date()) / 1000;
  if (value === null) {
    sessionStorage.removeItem(name);
  } else if (value !== undefined) {
    if (time) {
      sessionStorage.setItem(
        name,
        JSON.stringify({ value, time: date + time })
      );
    } else {
      sessionStorage.setItem(name, JSON.stringify({ value }));
    }
  } else {
    const v = sessionStorage.getItem(name);
    if (v) {
      if (JSON.parse(v).time) {
        if (JSON.parse(v).time - date > 0) {
          return JSON.parse(v).value;
        } else {
          sessionStorage.removeItem(name);
          return undefined;
        }
      } else return JSON.parse(v).value;
    } else return undefined;
  }
};
const getSearchData = (str) => {
  if (!str || str.indexOf('?') == -1) return '';
  let url = str.split('?')[1]
  let urlArr = url.split('&');
  let data = {}
  urlArr.forEach(item => {
    if (item && item.indexOf('=') != -1) {
      let valArr = item.split('=');
      data[valArr[0]] = valArr[1]
    }
  })
  return data;
}
const FreeTime = (value, g = "y-m-d") => {
  let time = new Date(value);

  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  let d = time.getDate();
  let h = time.getHours();
  let i = time.getMinutes();
  let s = time.getSeconds();
  return g
    .replace("y", y)
    .replace("m", m > 9 ? m : "0" + m)
    .replace("d", d > 9 ? d : "0" + d)
    .replace("h", h > 9 ? h : "0" + h)
    .replace("i", i > 9 ? i : "0" + i)
    .replace("s", s > 9 ? s : "0" + s);
};

// 金钱格式
const moneyType = text => {
  text = Math.floor(parseFloat(String(text)) * 100) / 100;
  return !isNaN(text) ? text.toLocaleString() : "0.00";
};
const loadScript = (src, cb) => {
  const head = document.head || document.getElementsByTagName('head')[0]
  const script = document.createElement('script')

  cb = cb || function () {
  }

  script.type = 'text/javascript'
  script.src = src

  if (!('onload' in script)) {
    script.onreadystatechange = function () {
      if (this.readyState !== 'complete' && this.readyState !== 'loaded') return
      this.onreadystatechange = null
      cb(script)
    }
  }

  script.onload = function () {
    this.onload = null
    cb(script)
  }

  head.appendChild(script)
}

export { Local, moneyType, FreeTime, Session, initLang, loadScript, getSearchData };
