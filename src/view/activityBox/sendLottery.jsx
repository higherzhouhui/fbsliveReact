import React, { useState, useEffect, useRef } from "react";
import style from "./sendLottery.module.scss";
import i18n from "../../language/config";
import { getParams } from "../../utils/tools";

const SendLottery = () => {
	const params = getParams(location.href);
    const currentLang = i18n.language
	const [language, setLanguage] = useState(currentLang)
	const [results, setResults] = useState([5,2,6,8,9])
	const [allTasks, setAllTasks] = useState([
		{title: '登录FBSLive', done: true},
		{title: '观看30分钟直播', done: false},
		{title: '存款100金币', done: false},
		{title: '投注流水1000金币', done: false},
	])
	const betDownTimeRef = useRef()
	const taskDownTimerRef = useRef()
	const [betDownTime, setBetDownTime] = useState('')
	const [taskDownTime, setTaskDownTime] = useState('')
	const getAllResult = () => {
		const arr = []
		for(let i = 0; i < 100; i++) {
			arr.push({
				checked: false,
				value: i
			})
		}
		return arr
	}
	const [allResults, setAllresults] = useState(getAllResult())

	const handleCheckNumber = (index) => {
		const all = allResults
		const haveCheck = allResults.filter(item => {
			return item.checked
		})
		if (haveCheck.length > 4 && !all[index].checked) {
			return
		}
		all[index].checked = !all[index].checked
		setAllresults([...all])
	}
	const handleBetting = () => {

	}
	const numberFormatDate = (number) => {
		if (!number || isNaN(number)) {
			return number
		}
		let hour = parseInt(number / 3600)
		let min = parseInt((number - hour * 3600) / 60)
		let sec = number - hour * 3600 - min * 60
		if (hour < 10) {
			if (hour === 0) {
				hour = ''
			} else {
				hour = "0" + hour + ':'
			}
		} else {
			hour = hour + ':'
		}
		if (min < 10) {
			if (min === 0) {
				min = ''
			} else {
				min = "0" + min + ':'
			}
		} else {
			min = min + ':'
		}
		if (sec < 10) {
			sec = "0" + sec
		}

		return `${hour}${min}${sec}`
	}

    useEffect(() => {
        const changeLang = (lang) => {
            setLanguage(lang)
        }
		let timerBetDown = ''
		let timerTaskDown = ''
		taskDownTimerRef.current = 6 * 60 * 60
		betDownTimeRef.current = 1500
        window.eventBus.addListener('langChange', changeLang)
		const betDownTimer = () => {
			timerBetDown = setInterval(() => {
				betDownTimeRef.current = betDownTimeRef.current - 1
				setBetDownTime(betDownTimeRef.current)
			}, 1000);
		}
		betDownTimer()
		const TaskDowner = () => {
			timerTaskDown = setInterval(() => {
				taskDownTimerRef.current = taskDownTimerRef.current - 1
				setTaskDownTime(taskDownTimerRef.current)
			}, 1000);
		}
		TaskDowner()
		return () => {
			clearInterval(timerBetDown)
			clearInterval(timerTaskDown)
		}
    }, [])
	return (
		<div className={style.container}>
		<div className={style.banner}>
			<img src={params.src} alt="activity" />
		</div>
		<div className={style.main}>
			<div className={style.hintContainer}>
				<div className={style.title}>Chi tiết hoạt động</div>
				<div className={style.divide}></div>
				<div className={style.desc}>
					1.Hoàn thành nhiệm vụ quy định để có cơ hội đặt cược xổ số miễn phí, nhiệm vụ không được hoàn thành 
					trùng lặp, sau khi hoàn thành tất cả các nhiệm vụ, bạn có thể nhận được một cơ hội đặt cược miễn phí 
					khác, trạng thái hoàn thành nhiệm vụ sẽ được đặt lại vào lúc 0:00 mỗi ngày.
				</div>
				<div className={style.desc}>
					2.Cơ hội cá cược miễn phí sẽ bị xóa trước một ngày sau khi kết thúc sự kiện, hãy sử dụng kịp thời.
				</div>
				<div className={style.desc}>
					3.Thể lệ trúng thưởng: Theo mã kết quả xổ số chính thức, trùng với 2 chữ số cuối của giải đặc biệt là trúng thưởng
				</div>
			</div>
			<div className={style.hintContainer}>
				<div className={style.subTitle}>
					<div className={style.left}>
						开奖结果
					</div>
					<div className={style.right}>
						第20230330期
					</div>
				</div>
				<div className={style.resultContainer}>
					{
						results.map((item, index) => {
							return <div className={style.number} key={index}>{item}</div>
						})
					}
				</div>
				<div className={style.desc}>
					Đã có 513 người trúng thưởng, số tiền thưởng tích lũy phát ra 48352 xu
				</div>
				<div className={style.desc} style={{color: '#E4614B'}}>
					1 xu = 1000VND
				</div>
			</div>
			<div className={style.hintContainer}>
				<div className={style.title}>投注记录</div>
				<div className={style.resultContainer}>
					{/* {
						results.map((item, index) => {
							return <div className={style.number} key={index}>{item}</div>
						})
					} */}
					<div className={style.noChance}>
						<div className={style.youNo}>您还没有投注</div>
						<div className={style.guideChange}>完成任务即可获得投注机会</div>
					</div>
				</div>
			</div>
			<div className={style.hintContainer}>
				<div className={style.subTitle}>
					<div className={style.left}>
						投注
						<span className={style.question}>?</span>
					</div>
					<div className={style.right}>
						投注倒计时 {numberFormatDate(betDownTime)}
					</div>
				</div>
				<div className={`${style.resultContainer} ${style.optionContainer}`}>
					{
						allResults.map((item, index) => {
							return <div 
								className={`${style.option} ${item.checked && style.optionActive}`} 
								key={index}
								onClick={() => handleCheckNumber(index)}>
									{item.value}
								</div>
						})
					}
				</div>
				<div className={style.bettingBtn}>立即投注</div>
				<div className={style.doWork}>
					您还没有免费投注机会，快去完成任务吧
				</div>
			</div>
			<div className={style.hintContainer}>
				<div className={style.title}>做任务</div>
				<div className={style.downTimeContainer}>
					任务重置 {numberFormatDate(taskDownTime)}
				</div>
				{
					allTasks.map((item, index) => {
						return <div className={style.taskItem} key={index}>
							<div className={style.left}>{item.title}</div>
							<div className={`${style.right} ${item.done && style.doneActive}`}>
								{item.done ? '已完成' : '完成'}
							</div>
						</div>
					})
				}
			</div>
			<div className={style.hintContainer}>
				<div className={style.title}>活动规则</div>
				<div className={style.divide} />
				<div className={style.desc}>
				1.Mỗi thành viên hợp lệ chỉ được đăng ký 1 lần  cho mỗi hoạt động ưu đãi với 1 số điện thoại, 1 email, 1 
				thẻ ngân hàng, 1 địa chỉ IP, 1 thiết bị đăng nhập(Trừ trường hợp đặc biệt được hệ thống thông báo). Nếu 
				thành viên nào vi phạm, công ty sẽ khấu trừ lợi nhuận và quyền lợi được nhận thưởng của tài khoản đó
				</div>
				<div className={style.desc}>
				2.Công ty không chấp nhận bất kỳ hành vi lạm dụng trực lợi. Nếu phát hiện cá nhân hay tổ chức nào vi 
				phạm hoặc lợi dụng quy tắc hoạt động để trục lợi, công ty sẽ chấm dứt quyền sử dụng web của thành viên 
				đó, đồng thời thu hồi toàn bộ lợi nhuận và quyền lợi được nhận thưởng của tài khoản.
				</div>
				<div className={style.desc}>
				3.Nền tảng FBSlive có quyền giải thích cuối cùng về sự kiện, cũng như có quyền sửa đổi hoặc chấm dứt 
				sự kiện mà không cần thông báo trước. Mọi quy tắc, điều khoản và quyền giải thích cuối cùng về sự kiện 
				đều thuộc về FBSlive.
				</div>
				<div className={style.desc}>
				4.Sau khi đã điều tra xác thực, chúng tôi sẽ có biện pháp xử lý đối với những cá nhân hoặc tổ chức có 
				hành vi chơi đối nghịch hoặc trục lợi phí pháp từ nền tảng, nếu nghiêm trọng sẽ khóa tài khoản vĩnh viễn.
				</div>
			</div>
		</div>
	</div>
	)
};


export default SendLottery;

