// 播放音频
function audioCoponent(props) {
    // const mp3Data = require("@/assets/mp3/zk.mp3")
    const audio = new Audio(props)
    audio.play();
}
export { audioCoponent }
