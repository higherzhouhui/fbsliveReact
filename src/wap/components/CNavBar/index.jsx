import React from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "antd-mobile";
import leftImg from "../../assets/image/kf/left.png";
import style from "./index.module.scss";

const CNavBar = (props) => {
  const history = useNavigate();
  // left 是否显示返回按钮
  // leftStyles 返回按钮样式
  // title 标题
  // styles 标题样式
  // leftClick 左点击
  const { left, leftStyles, title, styles, leftClick } = props;
  return (
    <NavBar className={style.wbg} back={null} left={left ? <img src={leftImg} style={leftStyles} className={style.leftImg} onClick={() => (leftClick ? leftClick() : history(-1))} /> : null} onBack={() => history(-1)} style={styles}>
      <div className={style.title}>{title}</div>
    </NavBar>
  );
};
export default CNavBar;
