<template>
    <div class="indicator-list">
        <div class="indicator-list-item"
             v-for="(item, index) in categoryAll" :key="index"
             :style="`border-color: ${item.color}; ${indicatorItemStyle(item)}`"
        />
        <div class="indicator-list-item" :style="isFilterShared? 'background-color: white':''"/>
    </div>
</template>

<script>
import {mapGetters, mapState} from "vuex"
import utility from "../../utility"

export default {
    name: "MenuCategoryIndicator",
    data() {
        return {
            categories: [], // category
        }
    },
    props: {
        menuName:{
            type: String,
            default: '菜单'
        },
        addOnText:{
            type: String,
            default: ''
        },
    },
    mounted() {
        this.filterShared = utility.getDiaryConfig().isFilterShared
        this.categories = utility.getDiaryConfig().filteredCategories
    },
    methods: {
        indicatorItemStyle(category){
            if (this.categories.indexOf(category.name_en) > -1){
                return `background-color: ${category.color};`
                // return `border-bottom: 1px solid ${category.color};`
            } else {
                return ``
            }
        },
    },
    computed: {
        ...mapState([
            'isFilterShared',
            'filteredCategories',
            'categoryAll'
        ])
    },
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import "../../scss/plugin";

$height-indicator: 8px;
.indicator-list{
    width: $height-indicator * (8+3);
    cursor: pointer;
    @extend .btn-like;
    height: $height-navbar;
    padding: math.div($height-navbar - $height-indicator * 2 - 3, 2) 0;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-flow: row wrap;
    .indicator-list-item{
        margin-right: 3px;
        margin-bottom: 3px;
        flex-shrink: 0;
        border: 1px dotted white;
        height: $height-indicator;
        width: $height-indicator;
        @include border-radius(2px);
        &:nth-child(2n){
            margin-bottom: 0;
        }
    }
}


</style>
