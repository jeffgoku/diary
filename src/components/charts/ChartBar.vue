<template>
    <div ref="BarDom"
         class="charts"
         :style="`height: 300px; width: ${width}`"
    />
</template>

<script>
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    BarChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
]);

import {mapGetters, mapState} from "vuex";

const COLORS =  [
    '#FFA41C',
    '#2F3037',
    '#9FE080',
    '#5C7BD9',
    '#7ED3F4',
    '#EE6666',
    '#c7c7c7',
    '#FFDC60'
]

export default {
    name: "ChartBar",
    props: {
        data: {
            type: Array,
            default: [],
            // {value: 1048, name: '搜索引擎'},
        },
        title: {
            type: String,
            default: ''
        },
        subTitle: {
            type: String,
            default: ''
        },
        widthInit: {
            type: String,
            default: '100%'
        },
    },
    watch: {
        data(newValue) {
            if (newValue) {
                this.resetData(newValue)
            }
        },
    },
    data() {
        return {
            chart: null,
            option: null,
            width: '500px' // 图表宽度 500
        }
    },
    mounted() {
        if (window.innerWidth< 400){
            this.width = '100%'
        } else {
            this.width = this.widthInit
        }
        this.$nextTick(() => {
            this.initChart()
            this.resetData(this.data)
        })
    },
    computed: {
        ...mapGetters(['categoryNameMap', 'categoryObjectMap']),
        xAxisData() {
            return this.data
        }
    },
    methods: {
        resetData(newValue) {
            let xAxisData = []
            let seriesData = []
            let colorArray = []
            newValue.forEach(item => {
                seriesData.push(item.value)
                xAxisData.push(item.name)
                let color = this.categoryNameMap.get(item.key) && this.categoryObjectMap.get(item.key).color
                if (color){
                    colorArray.push(color)
                }
            })

            // 如果有类别颜色，colorBy: data
            if (colorArray.length > 0){
                this.option.color = colorArray
            } else {
                this.option.color = COLORS
            }

            this.option.colorBy = 'data'
            this.option.xAxis[0].data = xAxisData
            this.option.series[0].data = seriesData
            this.chart.setOption(this.option)
        },
        initChart() {
            this.option = {
                grid: {
                    bottom: 40,
                    right: 20,
                    top: 30,
                    left: 30
                },
                title: {
                    text: '',
                    left: 'center',
                    textStyle:{
                        color: '#666666'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                xAxis: [{
                    type: 'category',
                    data: [],
                    axisLabel: {
                        fontSize: 11,
                        color: '#666666',
                        rotate: -45
                    }
                }],
                yAxis: [{
                    type: 'value',
                    axisLabel:{
                        formatter: (value, index) => {
                            let k = value / 1000
                            let b = value % 1000
                            if (k >= 1){
                                return `${k}k`
                            } else {
                                return b
                            }
                        }
                    }
                }],
                series: [{
                    name: '到访人员类型',
                    type: 'bar',
                    data: [],
                    // barWidth: 20, //柱子宽度
                    label: {
                        show: true,
                        position: 'top',
                        fontSize: 12,
                    },
                }]
            }

            if (window.innerWidth< 400){
            }

            this.option.title.text = this.title
            this.chart = echarts.init(this.$refs.BarDom)
            this.chart.setOption(this.option)
            this.option.series[0].name = this.title
        },
        resize () {
            this.chart.resize()
        }
    },
}

</script>

<style scoped>

</style>
