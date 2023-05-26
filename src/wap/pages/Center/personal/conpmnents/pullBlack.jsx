import React, { useEffect, useState } from "react";
import { Button, Skeleton } from "antd-mobile";
import { useTranslation } from "react-i18next";
import { rejectList, userReject } from '../../../../server/live'
import { CNavBar, CEmpty } from '../../../../components'
import style from "./pullBlack.module.scss";
const PullBlack = () => {
    const { t } = useTranslation();
    const [list, setList] = useState([]);
    const [Loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        getRejectList();
    }, []);

    const getRejectList = async () => {
        const res = await rejectList({ page: 0 })
        if (!(res instanceof Error)) {
            setList(res || []);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };
    const removeItem = async (item) => {
        const res = await userReject({ isReject: false, uid: item.uid })
        if (!(res instanceof Error)) {
            getRejectList()
        }
    };
    const pullBlackSK = () => {
        return <div className={style.itemSk}>
            {Array(4).fill('').map((value, index) => {
                return <Skeleton animated key={index} className={style.itemSK} />;
            })}
        </div>
    }
    const listDom = () => {
        return list.map((item, index) => {
            return <div key={index} className={style.item}>
                <div className={style.info}>
                    <img className={style.avatar} src={item?.avatar || require('../../../../assets/image/login/logoz.png')} alt="" />
                    <span className={style.nickname}>{item.nickname}</span>
                    <img src={item?.sex == 1 ? require("../../../../assets/image/center/man.png") : require("../../../../assets/image/center/woman.png")} alt="" className={style.sex} style={{ "--size": "15.65px", "--border-radius": "100%" }} />
                </div>
                <Button
                    className={style.removeBtn}
                    loading="auto"
                    onClick={() => removeItem(item)}>
                    {t("pullBlack6")}
                </Button>
            </div>
        })
    }

    return <div>
        <CNavBar title={t('pullBlack5')} left={true} />
        <div className={style.pullBlackContent}>
            {Loading ? pullBlackSK() : list.length > 0 ? listDom() : <CEmpty className={style.liveList} description={t("noData")} />}
        </div>
    </div >
};

export default PullBlack;
