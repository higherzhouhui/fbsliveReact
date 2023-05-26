import React, { useCallback, useEffect, useState } from "react";
import { Avatar, Card, Empty, Space, Tabs } from "antd-mobile";
import { useTranslation } from "react-i18next";
import style from "./roomMan.module.scss";
import { GetRoomPeople, GetRoomVip } from "../../../server/live";

export default function RoomMan(props) {
  const { t } = useTranslation();

  const [manList, setManList] = useState([]);
  const [vipList, setVipList] = useState([]);

  const getList = useCallback(() => {
    getManList();
    getVipList();
  }, []);

  useEffect(() => {
    getList();
  }, [getList]);

  const getManList = async () => {
    const res = await GetRoomPeople(props);
    if (!(res instanceof Error)) {
      setManList(res);
    }
  };

  const getVipList = async () => {
    const res = await GetRoomVip(props);
    if (!(res instanceof Error)) {
      setVipList(res);
    }
  };

  const listBody = (type) => {
    let list;
    if (type === "man") list = manList;
    if (type === "vip") list = vipList;
    return (
      <div className={style.list}>
        {list.length > 0 ? (
          list.map((item) => {
            return (
              <Card
                key={item.uid}
                title={
                  <Space>
                    <Avatar src={item?.avatar} style={{ "--border-radius": "100%" }} fallback={<img src={require("../../../assets/image/join/logo.png")} />} />
                    <Space direction="vertical">
                      {item.nickname}
                      <img src={require(`../../../assets/image/live/level_${item.userLevel}.png`)} className={style.bimg} />
                    </Space>
                  </Space>
                }
                extra={
                  <p className={style.right}>
                    <img src={require("../../../assets/image/live/id-tag.png")} className={style.idTag} />
                    {item.uid}
                  </p>
                }
              />
            );
          })
        ) : (
          <Empty className={style.manEmpty} description={t("noData")} />
        )}
      </div>
    );
  };

  const handleChange = (status) => {
    switch (status) {
      case "man":
        getManList();
        break;
      case "vip":
        getVipList();
        break;
    }
  };
  return (
    <>
      <Tabs onChange={handleChange} className="zdyTab">
        <Tabs.Tab title={t("guanzong")} key="man">
          {listBody("man")}
        </Tabs.Tab>
        <Tabs.Tab title={t("ui_vip_levels")} key="vip">
          {listBody("vip")}
        </Tabs.Tab>
      </Tabs>
    </>
  );
}
