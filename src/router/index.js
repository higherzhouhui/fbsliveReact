import { Routes, Route } from "react-router-dom";
import Home from '../view/home/index'
import Download from '../view/download/index'
import SaveMoney from "../view/activityBox/saveMoney";
import WeeklyDeposit from "../view/activityBox/weeklyDeposit";
import SendLottery from "../view/activityBox/sendLottery";
import ActiveDetail from "../view/activityBox/detail";
import LiveList from '../view/newLive/list'
import LiveDetail from "../view/newLive/detail2";
import WayBill from "@/view/WayBill";

import User from "../view/user";
import Info from "../view/user/components/info";//个人信息
import Record from "../view/user/components/record";//交易&投注&消费记录
import Invite from "../view/user/components/invite"//邀请好友
import Message from "../view/user/components/message"//消息中心
import Deposit from '../view/user/components/deposit'//存款
import Opinion from "../view/user/components/opinion";//已经反馈
import Wallet from "../view/user/components/wallet";//我的钱包
import Transfer from "../view/user/components/transfer";//转账
import Withdraw from "../view/user/components/withdraw";//提现

import React from "react";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user" element={<User />} >
        <Route path="info" element={<Info />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="withdraw" element={<Withdraw />} />
        <Route path="transfer" element={<Transfer />} />
        <Route path="record" element={<Record />} />
        <Route path="invite" element={<Invite />} />
        <Route path="message" element={<Message />} />
        <Route path="deposit" element={<Deposit />} />
        <Route path="opinion" element={<Opinion />} />
      </Route>

      <Route path="/saveMoney" element={<SaveMoney />} />
      <Route path="/weeklyDeposit" element={<WeeklyDeposit />} />
      <Route path="/wayBill" element={<WayBill />} />
      <Route path="/sendLottery" element={<SendLottery />} />
      <Route path="/activeDetail" element={<ActiveDetail />} />
      <Route path="/live" element={<LiveList />} />
      <Route path="/live/list" element={<LiveList />} />
      <Route path="/live/detail" element={<LiveDetail />} extra />
      <Route path="/download" element={<Download />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
export default App