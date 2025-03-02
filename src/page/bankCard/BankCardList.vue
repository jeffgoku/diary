<template>
    <page-header title="银行卡列表" subtitle="点击复制卡号">
        <tab-icon @click="editCardInfo" alt="编辑"/>
    </page-header>
    <div v-if="isLoading" class="pt-8 pb-8">
        <loading :loading="isLoading"/>
    </div>
    <div v-else>
        <div class="bank-card-container"
             v-if="cardListAll.length > 0"
             :style="'height:' + insets.heightPanel + 'px'"
        >
            <h1 class="bank-card-list-header">存储卡</h1>
            <div class="bank-card-list">
                <bank-card
                    :index="index"
                    :card="card"
                    v-for="(card, index) in cardListStore"
                    :key="index"/>
            </div>

            <h1 class="bank-card-list-header">信用卡</h1>
            <div class="bank-card-list">
                <bank-card
                    :index="index"
                    :card="card"
                    v-for="(card, index) in cardListCredit"
                    :key="index"/>
            </div>
        </div>
        <div v-else class="bank-tip">
            <loading v-if="isLoading" :loading="isLoading"/>
            <template v-else>
                <p>您目前没有添加任何银行卡</p>
                <p>------------------------</p>
                <p>请新建名为 "我的银行卡列表" 的日记</p>
                <p>日记内容格式如下，</p>
                <p>之后，将会在此显示银行卡列表</p>
                <p>------------------------</p>
                <div class="bank-card-example">
                    <pre>{{ example }}</pre>
                </div>

                <div class="year-tip">添加后，效果如下，点击卡号即可复制卡号</div>

                <div class="bank-card-list p-0">
                    <bank-card
                        :index="index"
                        :card="card"
                        v-for="(card, index) in cardListExample"
                        :key="index"/>
                </div>
            </template>

        </div>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import bankCardApi from "../../api/bankCardApi"
import Loading from "../../components/Loading"
import utility from "../../utility"
import BankCard from "../../page/bankCard/BankCard"
import ClipboardJS from "clipboard"
import TabIcon from "../../components/TabIcon"
import PageHeader from "../../framework/pageHeader/PageHeader"
import diaryApi from "../../api/diaryApi"

export default {
    name: "BankCardList",
    components: {PageHeader, TabIcon, BankCard, Loading},
    data() {
        return {
            isLoading: false,
            cardListExample: [
                {
                    cardName: '建设银行',
                    cardNo: '6226 2216 3456 0955',
                    cardType: '信用卡',
                    extraInfos: [
                        {key: '地址', value: '山东济南'},
                        {key: '开户行', value: '山东济南财富广场分行'},
                    ]
                },
                {
                    cardName: '中国银行',
                    cardNo: '4567 2216 3456 0955',
                    cardType: '储蓄卡',
                    extraInfos: [
                        {key: '地址', value: '山东济南'},
                        {key: '开户行', value: '山东济南财富广场分行'}
                    ]
                },
            ],

            cardListAll: [],
            cardListStore: [],
            cardListCredit: [],
            clipboard: null, // clipboard obj
            example: `银行：民生银行
卡号：6226 2216 1178 4567
类别：储蓄卡
开户行：山东济南办卡
刷卡次数：5

银行：民生银行
卡号：6226 2216 1178 4567
类别：信用卡
开户行：山东济南办卡
额度：20000
验证码：123/4
到期日：2029-08-10
`
        }
    },
    mounted() {
        this.getBankCards()

    },
    beforeUnmount() {
        this.clipboard && this.clipboard.destroy()
    },

    computed: {
        ...mapState({
            years: 'statisticsYear',
        }),
        ...mapState(['insets', 'categoryAll'])
    },
    methods: {
        // 编辑银行卡信息
        editCardInfo(){
            let params = {
                categories: JSON.stringify(this.categoryAll.map(item => item.name_en)),
                keywords: JSON.stringify(['我的银行卡列表']),
                pageSize: 100,
                pageNo: 1
            }
            diaryApi
                .list(params)
                .then(res => {
                    if (res.data.length === 1){
                        this.$router.push({
                            name: 'Edit',
                            params: {
                                id: res.data[0].id
                            }
                        })
                    } else {
                        utility.popMessage('warning', '未找到对应的日记内容')
                    }
                })
                .catch(err => {

                })
        },

        getBankCards(){
            this.isLoading = true // 请求的时候显示loading
            bankCardApi
                .getBankCard()
                .then(res => {
                    this.isLoading = false
                    if (res.data) {
                        this.processCardInfo(res.data.trim())
                    } else {
                        // 没有设置任何银行卡信息
                    }
                })
                .catch(err => {
                    this.isLoading = false
                })
        },
        processCardInfo(allCardString){
            // card list
            let tempStrArray = allCardString.split('\n\n').filter(item => item.length > 0)
            // card item
            tempStrArray.forEach(cardStr => {
                let cardMap = new Map(
                    cardStr
                        .split('\n')
                        .map(cardItem => cardItem.split('：'))
                )
                let cardInfo = {}
                let extraInfos = []
                cardMap.forEach((value, key) => {
                    switch (key){
                        case '卡号': cardInfo.cardNo = value; break;
                        case '银行': cardInfo.cardName = value; break;
                        case '类别': cardInfo.cardType = value; break;
                        default:
                            extraInfos.push({key, value})
                            break
                    }
                })
                cardInfo['extraInfos'] = extraInfos
                this.cardListAll.push(cardInfo)
                this.cardListStore = this.cardListAll.filter(item => item.cardType.indexOf('储蓄卡') > -1)
                this.cardListCredit = this.cardListAll.filter(item => item.cardType.indexOf('信用卡') > -1)
            })

            // 绑定剪贴板操作方法
            this.clipboard = new ClipboardJS('.bankcard-no', {
                text: trigger => {
                    return trigger.getAttribute('data-clipboard')
                },
            })
            this.clipboard.on('success', ()=>{  // 还可以添加监听事件，如：复制成功后提示
                utility.popMessage('success', '卡号已复制到剪贴板', null)
            })
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";
$bank-card-list-padding: 30px;

.bank-tip{
    background-color: $bg-menu;
    padding: 30px;
    color: $color-main;
}
.bank-card-example{
    padding: 20px 0;
    text-align: left;
    pre{
        font-family: "JetBrainsMonoDiary";
    }
}


.bank-card-container{
    overflow-y: auto;
    background-color: $bg-menu;
}

.bank-card-list-header{
    padding: 20px $bank-card-list-padding 0;
    font-size: $fz-big;
    font-weight: bold;
    color: white;
}
.bank-card-list{
    display: flex;
    justify-content: flex-start;
    flex-flow: row wrap;
    padding: $bank-card-list-padding;
}

// MOBILE
@media (max-width: $grid-separate-width-sm) {
    .bank-card-list{
        padding: 10px;
        flex-flow: column nowrap;
    }
}

// DARK
@media (prefers-color-scheme: dark) {
    .bank-card-container{
        background-color: $dark-bg;
    }
}

</style>
