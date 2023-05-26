import React, { forwardRef, Suspense, useImperativeHandle, useState } from "react";
import useContextReducer from "../../../../state/useContextReducer";
import style from "./common.module.scss";
import FloatItem from "./floatItem";

const FloatWindow = (props, ref) => {
  const [dataList, setDataList] = useState({ list: [] });
  const {
    state: { baseInfo },
  } = useContextReducer.useContextReducer();

  useImperativeHandle(ref, () => {
    return {
      addList: (data) => {
        let list = dataList.list;
        list.push(data);
        setDataList({ list });
        // console.log('投注开奖数据', list);
      },
    };
  });

  const finish = (index) => {
    let list = dataList.list;
    list.splice(index, 1);
    setDataList({ list });
  };

  return (
    <>
      {Number(baseInfo.isCpStart) === 0 && (
        <div className={style.floorBody}>
          {dataList.list.map((info, index) => {
            return (
              <Suspense key={index}>
                <FloatItem info={info} finish={finish} index={index} />
              </Suspense>
            );
          })}
        </div>
      )}
    </>
  );
};

export default forwardRef(FloatWindow);
