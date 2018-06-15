<template>
    <div id="app" v-cloak>
        <div v-if="data.activityId">
            <div class="banner" @click="getRule">
                <img :src="data.mainImage">
            </div>
            <div class="prize-list clearfix" v-if="prizeList">
                <div>
                    <p class="list-content" v-for="(item, index) in prizeList" :key="index" :class="{'prev': prevIndex===index, 'current': currentIndex===index}">
                        <span class="nick-name">{{item.nickName}}</span>
                        <span>获得了</span>
                        <span class="prize-name">{{item.prizeName}}</span>
                    </p>
                </div>
            </div>
            <div class="draw-main clearfix">
                <p class="draw-title">
                    <span>  
                        <span class="title-left" @click="getRule"><img src="http://app.h5.ihaozhuo.com/newnative/draw/images/rule.png" alt="rule">规则</span>
                        <span class="title-right" @click="getMyLotteryList">中奖记录</span>
                    </span>
                </p>
                <div class="draw-box clearfix" v-if="data.showType === 1">
                    <div class="main-image" @click="getDraw">
                        <img :src="data.lotteryImage" alt="">
                    </div>
                    <div class="draw-turntable " :style="{transform:rotate_angle,transition:rotate_transition,webkitTransform:rotate_angle,webkitTransition:rotate_transition}">
                        <div v-for="(item, index) in oddsList" :key="index" class="prize">
                            <img :src="item.image" alt="">
                        </div>
                    </div>
                </div>
                <div class="draw-turntable2" ref="draw2" v-if="data.showType === 2">
                    <div><img :src="oddsList[7].image" alt=""></div>
                    <div><img :src="oddsList[0].image" alt=""></div>
                    <div><img :src="oddsList[1].image" alt=""></div>
                    <div><img :src="oddsList[6].image" alt=""></div>
                    <p @click="getDraw" class="price-image"><img :src="data.lotteryImage" alt=""> </p>
                    <div><img :src="oddsList[2].image" alt=""></div>
                    <div><img :src="oddsList[5].image" alt=""></div>
                    <div><img :src="oddsList[4].image" alt=""></div>
                    <div><img :src="oddsList[3].image" alt=""></div>
                </div>
                <p class="draw-num" v-if="data.participateType === 1">今日还可参与<span>{{num}}</span>次</p>
                <p class="draw-num" v-if="data.participateType === 2">还可参与<span>{{num}}</span>次</p>
            </div>
            <div class="prize-box" v-show="prizeShow" >
                <div class="prize-main">
                    <img src="http://app.h5.ihaozhuo.com/newnative/draw/images/winning.png" alt="">
                    <div class="prize-des">
                        <p class="top">中奖啦</p>
                        <p class="center">{{prizeName}}</p>
                        <p class="center">你可以到中奖记录进行查看</p>
                        <div @click="getMyLotteryList">确定</div>
                    </div>
                </div>
                <div @click="prizeShow = false" class="prize-bg"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { apiPost, getAppSign, judgeAppEnv, wxPost, getActivityId, prefix, setNavigationBar } from 'common/js/util'
export default {
    data(){
        return {
            activityId: '',
            data: {},
            currentIndex: 0,
            prevIndex: -1,
            interval:  null,
            prizeList: [],
            oddsList: [],
            prizeShow: false,
            isBegin: null, // 活动是否开始
            num: null,
            prizeName: '',
            start_rotating_degree: 0, //初始旋转角度
            rotate_angle: 0, //将要旋转的角度
            rotate_transition: "transform 6s ease-in-out", //初始化选中的过度属性控制
            click_flag: true //是否可以旋转抽奖
        }
    },
    created() {
        setTimeout(() => {
            this.getActivityInfo();
        }, 300);
    },
    mounted() {
        TDAPP.onEvent('幸运大转盘!');
    },
    methods: {
        getTitle() {
            const dataOrigin = {
                title: '抽奖',
                isShowShareBtn: 'true'
            }
            setNavigationBar(dataOrigin);
        },
        getActivityInfo() {
            if (judgeAppEnv()) {
                this.getTitle(); // 是否隐藏分享
                const activityId = getActivityId(location.search);
                this.activityId = activityId;
                let dataOrigin = { activityId };
                getAppSign(dataOrigin, dataLast => {
                    apiPost('ec/getActivityInfoById', dataLast).then(res => {
                        if (res.code == 200) {
                            this.data = res.data; 
                            this.oddsList = res.data.odds;
                            this.num = res.data.num;  
                            let startTime = res.data.startTime;
                            let endTime = res.data.endTime;
                            this.getActivityTime(startTime, endTime);
                        } else {
                            return this.dialog('', res.msg, '知道了');
                        }
                    });
                    apiPost('ec/getLatestLotteryList', dataLast).then(res => {
                        if (res.code == 200) {
                            this.prizeList = res.data.list;
                            if (this.prizeList.length) this.upScroll();
                        }
                    });
                });
            } else {
                window.location.href = 'http://app.h5.ihaozhuo.com/native01/20180606/index.html';
            };
        },
        getActivityTime(startTime, endTime) {
            const t = new Date();
            const now = `${t.getFullYear()}-${prefix(t.getMonth() + 1)}-${prefix(t.getDate())} ${prefix(t.getHours())}:${prefix(t.getMinutes())}:${prefix(t.getSeconds())}`;
            if (startTime > now) {
                this.isBegin = false;
                return this.dialog('', '此活动未开始,看看其他活动吧!', '知道了');
            }
            if (endTime < now) {
                this.isBegin = true;                
                return this.dialog('', '此活动已结束,看看其他活动吧!', '知道了');
            }
        },
        upScroll() {
            clearInterval(this.interval);
            this.interval = setInterval(() => {
                let len = this.prizeList.length;
                if (this.currentIndex === len - 1) {
                    this.currentIndex = 0
                    this.prevIndex = len - 1
                } else {
                    this.currentIndex++
                    this.prevIndex = this.currentIndex - 1
                }
            }, 2500)
        },
        getRule() {
            return this.dialog('规则说明', this.data.ruleDescription, '确定');
        },
        getMyLotteryList() {
            this.prizeShow = false;
            window.location.href = 'http://app.h5.ihaozhuo.com/native01/20180603/index.html?activityId=' + this.activityId;
        },
        getDraw() {
            if (!this.click_flag) return;
            if (this.isBegin) return this.dialog('', '此活动已结束,看看其他活动吧!', '知道了');
            if (this.isBegin === false) return this.dialog('', '此活动未开始,看看其他活动吧!', '知道了');
            if (this.num == 0) return this.toast('您的抽奖次数已用完');
            this.click_flag = false; // 旋转结束前，不允许再次触发;
            let dataOrigin = { activityId: this.activityId };
            getAppSign(dataOrigin, dataLast => {
                apiPost('ec/getWinningArea', dataLast).then(res => {
                    if (res.code == 200) {
                        this.num = res.data.num;
                        let _index = res.data.areaId; // 最终要旋转到哪一块，对应prize_list的下标
                        if (this.data.showType === 1) { 
                            this.circleRotate(_index);// 大转盘
                        } else { 
                            this.squareRotate(_index);// 九宫格
                        }
                    } else {
                        this.click_flag = true;
                        return this.toast(res.msg);
                    }
                });
            });
        },
        circleRotate(_index) {
            let during_time = 5; // 默认为1s
            let result_angle = [517.5, 472.5, 427.5, 382.5, 337.5, 292.5, 247.5, 202.5]; //最终会旋转到下标的位置所需要的度数
            let rand_circle = 6; // 附加多转几圈，2-3
            // 转动盘子
            let rotate_angle = this.start_rotating_degree + rand_circle * 360 + result_angle[_index-1] - this.start_rotating_degree % 360;
            this.start_rotating_degree = rotate_angle;
            this.rotate_angle = "rotate(" + rotate_angle + "deg)";
            // 旋转结束后，允许再次触发
            setTimeout(() => {
                this.gameOver(_index);
            }, during_time * 1000 + 1500); // 延时，保证转盘转完
        },
        squareRotate(_index) {
            let result  = [1, 2, 4, 7, 6, 5, 3, 0];
            let i = 0;
            let t = 60;
            let round = 4;// 圈数
            let roundNum = round * 8;
            
            let timer = setTimeout(setFreq, t);
            let Odiv = this.$refs.draw2.getElementsByTagName('div');
            var that = this;
            function setFreq() {
                for(var j = 0; j < Odiv.length; j++) {
                    Odiv[j].className = '';
                }
                let index = result[i % 8];
                Odiv[index].className = 'active';
                i++;
              
                if (i < roundNum) {
                    timer = setTimeout(setFreq, t);
                } else if (i >= roundNum - 8 && i < roundNum + _index + 8) {
                    t += (i - roundNum + 8) * 5;
                    timer = setTimeout(setFreq, t);
                }
                if (i >= roundNum + _index + 8) {
                    clearTimeout(timer);
                    that.gameOver(_index);
                }
            }
        },
        gameOver(index) {
            this.click_flag = true;
            let prizeObj = this.oddsList[index-1];
            if (prizeObj.winningFlag == 1) {
                this.prizeShow = true;
                this.prizeName = prizeObj.prizeName;
            } else {
                return this.dialog('', prizeObj.prizeName, '知道了');
            }
        },
        toast(txt) {
            const toast = this.$createToast({
                type: 'warn',          
                time: 1000,
                txt
            })
            toast.show()
        },
        dialog(title, content, text) {
            this.$createDialog({
                type: 'confirm',
                title: title,
                content: content,
                confirmBtn: {
                    text: text,
                    active: true,
                    href: 'javascript:;'
                },
                onConfirm: () => {
                   
                }
            }).show();
        }
    }
}
</script>

<style lang="less">
@import './app.less';
</style>
