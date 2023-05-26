export function freeTime(value, g = 'y-m-d') {
  let time = new Date(Number(value))
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let d = time.getDate()
  let h = time.getHours()
  let i = time.getMinutes()
  let s = time.getSeconds()
  return g.replace('y', y).replace('m', m > 9 ? m : '0' + m).replace('d', d > 9 ? d : '0' + d).replace('h', h > 9 ? h :
    '0' + h).replace('i', i > 9 ? i : '0' + i).replace('s', s > 9 ? s : '0' + s)
}

// 在数组中,随机生成多少个 arr,count
export function getRandomArrayElements(arr, count) {
  var shuffled = arr.slice(), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

export function getUrlDomain() {
  return window.location.protocol + '//' + window.location.host
}

//先把中文替换成两个字节的英文，在计算长度,获取字节长得
export function getLength(str) {
  return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
};