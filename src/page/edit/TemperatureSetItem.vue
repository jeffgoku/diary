<template>
    <div :class="['temperature-set-item',{active: !!modelValue}]">
        <input placeholder="--"
               @keydown="keyPressed"
               @wheel="mouseWheelScrolled"
               class="temperature"
               name="temperature"
               id="temperature"
               v-model="temperature"
        >
        <div class="unit">{{unit}}</div>
    </div>
</template>

<script>
export default {
    name: "TemperatureSetItem",

    props: {
        label: {
            type: String,
            default: '温度'
        },
        modelValue: {
            type: String,
            default: '20'
        },
        unit: {
            type: String,
            default: '℃'
        }
    },
    emits: ['update:modelValue'],
    /*
    beforeUpdate () {
        console.log(this.modelValue)
    },
    */
    computed: {
        temperature: {
            get() {
                return this.modelValue;
            },
            set(v) {
                if (isNaN(parseInt(v)))
                {
                    return
                }
                this.$emit('update:modelValue', v)
            }
        }
    },
    methods: {
        mouseWheelScrolled(event){
            event.preventDefault()
            let newTemp = this.modelValue
            if (newTemp === ''){
                newTemp = 20 // 数值变化从 20 开始
            }
            else
            {
                newTemp = Number(newTemp)
            }
            if (event.deltaY > 0){
                newTemp += 1
            } else {
                newTemp -= 1
            }
            this.$emit('update:modelValue', String(newTemp))
        },
        keyPressed(event){
            let newTemp = this.modelValue
            switch (event.key){
                case 'ArrowUp':
                    if (newTemp === ''){
                        newTemp = 20 // 数值变化从 20 开始
                    }
                    else
                    {
                        newTemp = Number(newTemp)
                    }
                    if (event.metaKey || event.ctrlKey){
                        newTemp += 10
                    } else {
                        newTemp += 1
                    }
                    event.preventDefault()
                    break;
                case 'ArrowDown':
                    if (newTemp === ''){
                        newTemp = 20 // 数值变化从 20 开始
                    }
                    else
                    {
                        newTemp = Number(newTemp)
                    }
                    if (event.metaKey || event.ctrlKey){
                        newTemp -= 10
                    } else {
                        newTemp -= 1
                    }
                    event.preventDefault()
                    break;
                default:
                    return;
            }
            this.$emit('update:modelValue', String(newTemp))
        }
    },
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";

.temperature-set-item{
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;
    &:hover{
        border-color: $color-border-highlight;
        input{
            color: black;
        }
    }
    &.active{
        input{
            color: $text-content;
        }
        .unit{
            color: $text-content;
        }
    }
    input{
        padding: 0 5px 0 10px;
        color: $text-content;
        text-align: right;
        background-color: transparent;
        display: block;
        width: 100%;
        font-size: $fz-label;
        border-bottom: 1px solid transparent;
        cursor: ns-resize;
        &:hover{
            border-color: $color-border-highlight;
        }
    }
    .unit{
        font-size: $fz-label;
        color: $text-label;
    }
}

@media (prefers-color-scheme: dark) {
    .temperature-set-item{
        input{
            color: $dark-text;
        }
        .unit{
            color: $dark-text;
        }
        &.active{
            input{
                color: $dark-text-title;
            }
            .unit{
                color: $dark-text-title;
            }
        }
    }
}

</style>
