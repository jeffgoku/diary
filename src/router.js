import { createRouter, createWebHashHistory } from 'vue-router'
import Index from "./framework/Index.vue";
import utility from "./utility";

import List from "@/page/list/List.vue"
import Detail from "@/page/detail/detail.vue"
import Edit from "@/page/edit/Edit.vue"


import Bill from "@/page/bill/Bill.vue"
import NotFound from "@/fundation/NotFound_404.vue"


const routes = [
    {
        name: 'Index',
        path: '/',
        component: Index ,
        children: [
            {name: 'List'   , path: 'list'      ,        component: List}, // mobile
            {name: 'Detail' , path: 'detail/:id',        component: Detail},
            {name: 'EditNew', path: 'edit'      ,        component: Edit},
            {name: 'Edit'   , path: 'edit/:id'  ,        component: Edit}
        ]
    },
    {
        name: 'Hole',
        path: '/hole',
        component: () => import("@/page/bankCard/BankCardList.vue"),
        children: [
            {name: 'ListHole'   , path: 'list'      ,        component: () => import("@/page/listHole/ListHole.vue")}, // mobile
        ]
    },
    {name: 'Register',       path: '/register',          component: () => import("@/page/login&register/Register.vue") },
    {name: 'Share',          path: '/share/:id',         component: () => import("@/page/share/Share.vue") },
    {name: 'ClearDiary',     path: '/clear-diary',       component: () => import("@/page/others/ClearDiary.vue") },
    {name: 'DestroyAccount', path: '/destroy-account',   component: () => import("@/page/others/DestroyAccount.vue") },
    {name: 'ChangePassword', path: '/change-password',   component: () => import("@/page/login&register/ChangePassword.vue") },
    {name: 'ChangeProfile',  path: '/change-profile',    component: () => import("@/page/changeProfile/ChangeProfile.vue") },
    {name: 'Login',          path: '/login',             component: () => import("@/page/login&register/Login.vue") },
    {name: 'Statistics',     path: '/statistics',        component: () => import("@/page/statistics/StatisticsMain.vue")},
    {name: 'FileManager',    path: '/file-manager',      component: () => import("@/page/fileManager/FileManager.vue") },
    {name: 'Bill',           path: '/bill',              component: Bill },
    {name: 'BankCard',       path: '/bank-card',         component: () => import("@/page/bankCard/BankCardList.vue") },
    {name: 'Invitation',     path: '/invitation',        component: () => import("@/page/invitation/InvitationList.vue") },
    {name: 'NotFound',       path: '/:pathMatch(.*)*',   component: NotFound }
]


const router = createRouter({
    history: createWebHashHistory(),
    routes
})



router.beforeEach((to, from) => {
    switch (to.name){
        case 'Login':
        case 'Register':
        case 'Share':
        case 'Invitation':
            break
        default:
            let auth = utility.getAuthorization()
            if (auth && auth.email) {
                if (to.name === 'List'){
                    if (store.getters.isInMobileMode){
                        break
                    } else {
                        return {name:'EditNew'}
                    }
                } else {
                    break
                }
            } else {
                return {name:'Login'}
            }
    }
})


export default router

