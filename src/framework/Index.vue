<template>
    <ServerError v-if="haveErr" :errorMsg="haveErr"/>
    <div v-else-if="authorized">
        <navbar/>

        <!-- 竖屏时 -->
        <div class="diary" v-if="isInMobileMode" :style="`height:${insets.heightPanel}px`">
            <div ref="diaryList" class="diary-list-container diary-list-container-mobile"
                 :style="`height:${insets.heightPanel}px`">
                <router-view/>
            </div>
        </div>

        <!-- 横屏时 -->
        <div class="diary" v-else>
            <div ref="diaryList" class="diary-list-container" :style="`height:${insets.heightPanel}px`">
                <List/>
            </div>
            <div class="diary-container" :style="`height:${insets.heightPanel}px`">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
import List from "@/page/list/List"
import Navbar from "./navbar/Navbar"
import {mapGetters, mapMutations, mapState} from 'vuex'
import statisticApi from "@/api/statisticApi"
import ServerError from "@/fundation/ServerError.vue"
import utility from "@/utility"
import diaryApi from "@/api/diaryApi"

export default {
    name: 'Index',
    components: {
        Navbar,
        List,
        ServerError,
    },
    data() {
        return {
            haveErr: '',
            authorized: false,
        }
    },
    computed: {
        ...mapState(['insets', 'isShowSearchBar']),
        ...mapGetters(['isInMobileMode', 'categoryNameMap'])
    },
    mounted() {
        diaryApi
            .categoryAllGet()
            .then(res => {
                this.authorized = true;
                if (res == null)
                {
                    return;
                }
                this.SET_CATEGORY_ALL(res.data)
                // 日记项目载入后，隐藏 preloading
                document.querySelector('.preloading').style.display = 'none'

                // 初始化 LocalStorage 存储对象
                let diaryConfig = utility.getDiaryConfig()
                this.SET_FILTERED_CATEGORIES(diaryConfig.filteredCategories)
                this.SET_KEYWORD(diaryConfig.keywords)
                this.SET_DATE_FILTER(diaryConfig.dateFilter)
                this.SET_IS_FILTER_SHARED(diaryConfig.isFilterShared)

                window.onresize = () => {
                    this.SET_INSETS({
                        windowsHeight: document.documentElement.clientHeight,
                        windowsWidth: document.documentElement.clientWidth,
                        heightPanel: document.documentElement.clientHeight - 45, // 除 navbar 的高度
                    })
                    if (this.isInMobileMode){

                    } else {
                        if (this.$route.name === 'List'){
                            this.$router.push({
                                name: 'EditNew'
                            })
                        }
                    }
                }

                // 旧版本数据清除
                if (diaryConfig.hasOwnProperty('keyword')){ // keyword 是旧版数据，已改为 keywords: []
                    utility.deleteDiaryConfig()
                }
                if(this.$route.path === '/' || this.$route.path === undefined){
                    if (this.isInMobileMode){
                        this.$router.push({name: 'List'})
                    } else {
                        this.$router.push({name: 'EditNew'})
                    }
                }

                this.getStatistic() // 载入统计信息
            })
            .catch(err => {
                this.haveErr = 'error happened'
                console.log(err);
                // 日记项目载入后，隐藏 preloading
                document.querySelector('.preloading').style.display = 'none'
            })

    },
    watch: {
        // 搜索按钮点击时，滚动到最顶部
        isShowSearchBar(newValue){
            if (newValue){
                this.$refs.diaryList.scrollTo(0, 0)
            } else {

            }
        },
    },
    methods: {
        ...mapMutations([
            'SET_STATISTICS_CATEGORY',
            'SET_STATISTICS_YEAR',
            'SET_DATA_ARRAY_CATEGORY',
            'SET_DATA_ARRAY_YEAR',
            'SET_FILTERED_CATEGORIES',

            'SET_INSETS',
            'SET_CATEGORY_ALL',
            'SET_KEYWORD',
            'SET_DATE_FILTER',
            'SET_IS_FILTER_SHARED',
        ]),
        // 获取日记统计信息
        getStatistic() {
            statisticApi
                .category()
                .then(res => {
                    this.SET_STATISTICS_CATEGORY(res.data)
                    this.setDataArrayCategory(res.data)
                })
            statisticApi
                .year()
                .then(res => {
                    this.SET_STATISTICS_YEAR(res.data)
                    this.setDataArrayYear(res.data)
                })
        },
        setDataArrayYear(statisticsYear){
            if (statisticsYear){
                let data = statisticsYear.reverse().map(year => {
                    return {
                        name: year.year,
                        value: year.count
                    }
                })
                this.SET_DATA_ARRAY_YEAR(data)
            }
        },
        setDataArrayCategory(statisticsCategory){
            let keys = Object.keys(statisticsCategory)
            keys = keys.filter(item =>  item !== 'amount' && item !== 'shared')
            let data =  keys.map(key => {
                return {
                    name: this.categoryNameMap.get(key),
                    value: statisticsCategory[key]
                }
            })
            this.SET_DATA_ARRAY_CATEGORY(data)
        },
    }
}

</script>

<style lang="scss" scoped>
.diary-list-container-mobile{
    width: 100%;
}
</style>
