<template>
    <server-error v-if="isServerError" :error-msg="isServerError"/>
    <router-view v-else/>
</template>
<script>
import { mapMutations } from "vuex"
import ServerError from "./fundation/ServerError.vue";
export default {
    components: {ServerError},
    data(){
        return {
            isServerError: '', // 服务器无法请求时
        }
    },
    created() {
        if(window.matchMedia)
        {
            let colorSchemeMatch = window.matchMedia('(prefers-color-scheme: dark)')

            if (colorSchemeMatch.matches) {
                this.SET_COLOR_MODE('dark')
            } else {
                this.SET_COLOR_MODE('light')
            }

            // 颜色模式监听
            colorSchemeMatch.addEventListener('change', event => {
                this.SET_COLOR_MODE(event.matches ? "dark" : "light")
            })
        }
    },
    methods: {
        ...mapMutations(['SET_COLOR_MODE'])
    },
    errorCaptured(err, component, info) {
        if(this.$route.name != 'Index')
        {
            this.$router.replace('/');
            return false;
        }
        this.isServerError = 'unhandled error'
        console.log(`err ${err} happen for ${component?.name ?? "Unknown component"} : ${info}`)
        return false
    }
}
</script>

<style lang="scss">
@import "scss/diary";
</style>

