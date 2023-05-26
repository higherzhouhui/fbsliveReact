import React, { useState, useEffect } from "react";
import style from "./weeklyDeposit.module.scss";
import i18n from "../../language/config";
import { getParams } from "../../utils/tools";
import { Table } from "antd";
const { Column, ColumnGroup } = Table;

const WeeklyDeposit = () => {
	const params = getParams(location.href);
    const currentLang = i18n.language
	const [language, setLanguage] = useState(currentLang)
    const data = [
		{
			key: "1",
			c1: 2000,
			lv1: 18,
			lv2: 55,
			lv3: 90,
			lv4: 150,
		},
		{
			key: "2",
			c1: 10000,
			lv1: 55,
			lv2: 130,
			lv3: 200,
			lv4: 400,
		},
		{
			key: "3",
			c1: 20000,
			lv1: 130,
			lv2: 200,
			lv3: 350,
			lv4: 800,
		},
		{
			key: "4",
			c1: 40000,
			lv1: 200,
			lv2: 380,
			lv3: 800,
			lv4: 1200,
		},
		{
			key: "5",
			c1: 80000,
			lv1: 380,
			lv2: 650,
			lv3: 1200,
			lv4: 2000,
		},
		{
			key: "6",
			c1: 200000,
			lv1: 950,
			lv2: 1300,
			lv3: 2000,
			lv4: 4000,
		},
		{
			key: "7",
			c1: 400000,
			lv1: 1300,
			lv2: 2000,
			lv3: 3000,
			lv4: 6000,
		},
		{
			key: "8",
			c1: 800000,
			lv1: 2000,
			lv2: 3000,
			lv3: 5500,
			lv4: 10000,
		},
		{
			key: "9",
			c1: 2000000,
			lv1: 2000,
			lv2: 5500,
			lv3: 9000,
			lv4: 20000,
		},
		{
			key: "10",
			c1: 3000000,
			lv1: 2000,
			lv2: 5500,
			lv3: 13000,
			lv4: 30000,
		},
		{
			key: "11",
			c1: 4000000,
			lv1: 2000,
			lv2: 5500,
			lv3: 13000,
			lv4: 55000,
		},
	];
    useEffect(() => {
        const changeLang = (lang) => {
            setLanguage(lang)
        }
        window.eventBus.addListener('langChange', changeLang)
    }, [])
	return language === "vie" ? (
		<div className={style.container}>
			<div className={style.banner}>
				<img src={params.src} alt="activity" />
			</div>
			<div className={style.main}>
				<div className={style.hintContainer}>
					<div className={style.title}>Chi tiết hoạt động</div>
					<div className={style.divide}></div>
					<div className={style.desc}>
						1.Khi số tiền nạp tích lũy hàng tuần của người dùng đạt
						đến giá trị quy định, phần thưởng tiền vàng sẽ được phát
						theo số tiền nạp và cấp độ người dùng trong tuần tiếp
						theo.
					</div>
					<div className={style.desc}>
						2.Sau 3 vòng cược có thể rút tiền
					</div>
					<div className={style.desc}>3.1 xu = 1000VND</div>
					<img
						src={require("../../assets/images/activity/redBag.png")}
						alt="redBag"
						className={style.redBag}
					/>
				</div>
				<div
					className={`${style.hintContainer} ${style.tableContainer}`}
				>
					<div className={style.title}>Chi tiết tiền thưởng</div>
					<div className={style.divide}></div>
					<Table
						dataSource={data}
						pagination={false}
						bordered
						className={style.table}
						rowClassName={style.columnClass}
					>
						<Column
							title="Tổng tiết kiệm mỗi tuần(xu)"
							dataIndex="c1"
							key="c1"
							align="center"
						/>
						<ColumnGroup title="Số xu thưởng">
							<Column
								title="LV1-30"
								dataIndex="lv1"
								key="lv1"
								align="center"
							/>
							<Column
								title="LV31-60"
								dataIndex="lv2"
								key="lv2"
								align="center"
							/>
							<Column
								title="LV61-90"
								dataIndex="lv3"
								key="lv3"
								align="center"
							/>
							<Column
								title="LV91+"
								dataIndex="lv4"
								key="lv4"
								align="center"
							/>
						</ColumnGroup>
					</Table>
				</div>
				<div className={style.hintContainer}>
					<div className={style.title}>Hình thức phát</div>
					<div className={style.divide}></div>
					<div className={style.desc}>
						Vào 19h30' thứ 7 hàng tuần, hệ thống sẽ tự động phát
						thưởng
					</div>
				</div>
				<div className={`${style.hintContainer} ${style.quyContainer}`}>
					<div className={style.title}>Quy tắc hoạt động</div>
					<div className={style.divide}></div>
					<div className={style.desc}>
						1.Mỗi thành viên hợp lệ chỉ được đăng ký 1 lần cho mỗi
						hoạt động ưu đãi với 1 số điện thoại, 1 email, 1 thẻ
						ngân hàng, 1 địa chỉ IP, 1 thiết bị đăng nhập(Trừ trường
						hợp đặc biệt được hệ thống thông báo). Nếu thành viên
						nào vi phạm, công ty sẽ khấu trừ lợi nhuận và quyền lợi
						được nhận thưởng của tài khoản đó
					</div>
					<div className={style.desc}>
						2.Công ty không chấp nhận bất kỳ hành vi lạm dụng trực
						lợi. Nếu phát hiện cá nhân hay tổ chức nào vi phạm hoặc
						lợi dụng quy tắc hoạt động để trục lợi, công ty sẽ chấm
						dứt quyền sử dụng web của thành viên đó, đồng thời thu
						hồi toàn bộ lợi nhuận và quyền lợi được nhận thưởng của
						tài khoản.
					</div>
					<div className={style.desc}>
						3.Nền tảng FBSlive có quyền giải thích cuối cùng về sự
						kiện, cũng như có quyền sửa đổi hoặc chấm dứt sự kiện mà
						không cần thông báo trước. Mọi quy tắc, điều khoản và
						quyền giải thích cuối cùng về sự kiện đều thuộc về
						FBSlive.
					</div>
					<div className={style.desc}>
						4.Sau khi đã điều tra xác thực, chúng tôi sẽ có biện
						pháp xử lý đối với những cá nhân hoặc tổ chức có hành vi
						chơi đối nghịch hoặc trục lợi phí pháp từ nền tảng, nếu
						nghiêm trọng sẽ khóa tài khoản vĩnh viễn.
					</div>
					<img
						src={require("../../assets/images/activity/redBag.png")}
						alt="redBag"
						className={style.redBag}
					/>
				</div>
			</div>
		</div>
	) : (
		<div className={style.container}>
			<div className={style.banner}>
				<img src={params.src} alt="activity" />
			</div>
			<div className={style.main}>
				<div className={style.hintContainer}>
					<div className={style.title}>活动说明</div>
					<div className={style.divide}></div>
					<div className={style.desc}>
                    1.用户每周充值累计金额达到指定数值，下周将根据充值金额和用户等级发放奖励金币。
					</div>
					<div className={style.desc}>
                    2.3倍流水即可提现。
					</div>
					<div className={style.desc}>
                    3.1金币=1000越南盾。
                    </div>
					<img
						src={require("../../assets/images/activity/redBag.png")}
						alt="redBag"
						className={style.redBag}
					/>
				</div>
				<div
					className={`${style.hintContainer} ${style.tableContainer}`}
				>
					<div className={style.title}>奖励明细</div>
					<div className={style.divide}></div>
					<Table
						dataSource={data}
						pagination={false}
						bordered
						className={style.table}
						rowClassName={style.columnClass}
					>
						<Column
							title="周存款金额"
							dataIndex="c1"
							key="c1"
							align="center"
						/>
						<ColumnGroup title="奖励金币数">
							<Column
								title="LV1-30"
								dataIndex="lv1"
								key="lv1"
								align="center"
							/>
							<Column
								title="LV31-60"
								dataIndex="lv2"
								key="lv2"
								align="center"
							/>
							<Column
								title="LV61-90"
								dataIndex="lv3"
								key="lv3"
								align="center"
							/>
							<Column
								title="LV91+"
								dataIndex="lv4"
								key="lv4"
								align="center"
							/>
						</ColumnGroup>
					</Table>
				</div>
				<div className={`${style.hintContainer} ${style.quyContainer}`}>
					<div className={style.title}>活动规则</div>
					<div className={style.divide}></div>
					<div className={style.desc}>
                    1.每位真实有效玩家、手机号码、电子邮箱、银行卡、IP地址、登录设备， 除活动特别说明外，仅能申请并享受一次每项优惠活动，若有违规者，本公司将保留扣除账号盈利及红利的权力。
					</div>
					<div className={style.desc}>
                    2.本公司绝不容许任何诈欺行为，若发现有违背或利用规则与条款进行不当获利的会员，本公司将保留终止会员使用本网站 以及没收奖金及盈利的绝对权力。
					</div>
					<div className={style.desc}>
                    3.FBSlive保留对活动的最终解释权和修改或终止活动的权利，恕不另行通知，相关活动规则与条款的最终解释权归FBSlive所有。
					</div>
					<div className={style.desc}>
                    4关于团队套利和其他不法获利行为，经平台查实针对情节严重的会进行封号处理。
					</div>
					<img
						src={require("../../assets/images/activity/redBag.png")}
						alt="redBag"
						className={style.redBag}
					/>
				</div>
			</div>
		</div>
	);
};

export default WeeklyDeposit;
