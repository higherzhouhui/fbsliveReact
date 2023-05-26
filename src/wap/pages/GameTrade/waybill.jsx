import React, { useMemo } from "react";
import style from "./waybill.module.scss";
import _ from "lodash";

const WayBill = () => {
  const data = [
    { value: "大", x: 0, y: 0 },
    { value: "大", x: 0, y: 1 },
    { value: "大", x: 0, y: 2 },
    { value: "大", x: 0, y: 3 },
    { value: "大", x: 0, y: 4 },
    { value: "大", x: 0, y: 5 },
    { value: "大", x: 1, y: 5 },
    { value: "大", x: 2, y: 5 },
    { value: "大", x: 3, y: 5 },
    { value: "大", x: 4, y: 5 },
    { value: "大", x: 5, y: 5 },
    { value: "大", x: 6, y: 5 },
    { value: "大", x: 7, y: 5 },
    { value: "大", x: 8, y: 5 },
    { value: "小", x: 1, y: 0 },
    { value: "小", x: 1, y: 1 },
    { value: "小", x: 1, y: 2 },
    { value: "小", x: 1, y: 3 },
    { value: "小", x: 1, y: 4 },
    { value: "小", x: 2, y: 4 },
    { value: "小", x: 3, y: 4 },
    { value: "大", x: 2, y: 0 },
    { value: "大", x: 2, y: 1 },
    { value: "大", x: 2, y: 2 },
    { value: "大", x: 2, y: 3 },
  ];
  // console.log(data);
  const layout = useMemo(() => {
    let result = data.reduce((sum, item) => {
      if (!sum[item.x]) sum[item.x] = Array(6).fill("");
      sum[item.x][item.y] = item.value.replace("大", "red").replace("小", "blue");
      return sum;
    }, []);
    return exchangeArray(result);
  }, []);

  function exchangeArray(arr) {
    let newArray = [];
    arr.forEach((item, index) => {
      item.forEach((item, iindex) => {
        if (!newArray[iindex]) newArray[iindex] = [];
        newArray[iindex][index] = item;
      });
    });
    return newArray;
  }
  return (
    <div className={style.wayBody}>
      {layout.map((item, index) => {
        return (
          <div key={index} className={style.grid}>
            {item.map((val, key) => (
              <div className={`${style.box} ${style[val]}`} key={`${index}-${key}`}></div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default WayBill;
