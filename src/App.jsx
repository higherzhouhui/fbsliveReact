import React, { useEffect } from "react";
import Index from './router/index'
import Header from './components/header';
import ContextReducer from './state/useContextReducer'
import EventStore from './state/event';
import './App.scss';
import './assets/style/base.scss'
import 'animate.css';
import './language/config';
// import './wap/util/finger'
export default () => {
  useEffect(() => {
    // window.eventBus.emit("store", { type: "handleLogin" });
  }, []);
  return <ContextReducer.Provider>
    <div className="App">
      <Header />
      <Index />
    </div>
    <EventStore />
  </ContextReducer.Provider>
}
