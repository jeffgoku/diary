import store from './store'

const global = {
   heightNavbar: 45,
}

const AUTHORIZATION_NAME = 'Authorization' // 存储用户信息的 localStorage name，跟 Manager 通用
const BILL_KEYS_NAME = 'BillKeys'
// 设置 authorization
function setAuthorization(nickname, uid, email, phone, avatar, token, group_id, city, geolocation) {
   localStorage.setItem(AUTHORIZATION_NAME, JSON.stringify({
      nickname, uid, email, phone, avatar, token, group_id, city, geolocation
   }))
}

function setAuthorizationToken(token) {
   let auth = getAuthorization()
   auth.token = token
   localStorage.setItem(AUTHORIZATION_NAME, JSON.stringify(auth))
}

/**
 * 保存账单常用项目列表
 * @param keyArray
 */
function saveBillKeys(keyArray){
   localStorage.setItem(BILL_KEYS_NAME, JSON.stringify(keyArray))
}

/**
 * 获取账单常用项目列表
 * @returns {any|*[]}
 */
function getBillKeys(){
   let keysString = localStorage.getItem(BILL_KEYS_NAME)
   if (keysString){
      return JSON.parse(keysString)
   } else {
      return []
   }
}
function removeBillKeys(){
   localStorage.removeItem(BILL_KEYS_NAME)
}

// 获取 authorization
function getAuthorization() {
   return JSON.parse(localStorage.getItem(AUTHORIZATION_NAME))
}

// 删除 authorization
function deleteAuthorization() {
   localStorage.removeItem(AUTHORIZATION_NAME)
   removeBillKeys()
}


/**
 * Prompt 提示
 * @param type default | warning | success | danger
 * @param title
 * @param callback
 * @param timeout
 */
function popMessage(
    type, // default | warning | danger | success
    title,
    callback = () => {},
    timeout = 0.8)
{
   let popClass = 'pop-msg-' + type
   let msgEl = document.createElement('div')
   msgEl.classList.add('pop-msg', 'animated-fast', 'slideInDownPopMessage', popClass)
   let msgTitle = document.createElement('h3')
   msgTitle.innerText = title
   msgEl.append(msgTitle)
   $('body').append(msgEl)

   setTimeout(_=>{
      msgEl.classList.remove('slideInDownPopMessage')
   }, 200)
   setTimeout(() => {

      // msgEl.classList.replace('slideInDown', 'slideOutUp')
      msgEl.classList.add('slideOutUpPopMessage')
      setTimeout(() => {
         msgEl.remove()
      }, 200); // 需要对应 css 中 .animated-fast 的动画过渡时间

      // 为了避免回调方法影响 动画的过程，将其异步处理
      setTimeout(() => {
         callback && callback()
      }, 200)

   }, 1000 * timeout)
}

function $(selector){
   return document.querySelector(selector)
}



// CONST
const WEEKDAY = {0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六',}
const WEEKDAY_SHORT = {0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六',}
const WEATHER = [
    {title : 'sunny' ,        name : '晴'} ,
    {title : 'cloudy' ,       name : '多云'} ,
    {title : 'overcast' ,     name : '阴'} ,
    {title : 'sprinkle' ,     name : '小雨'} ,
    {title : 'rain' ,         name : '雨'} ,
    {title : 'thunderstorm' , name : '暴雨'} ,
    {title : 'snow' ,         name : '雪'} ,
    {title : 'fog' ,          name : '雾'} ,
    {title : 'tornado' ,      name : '龙卷风'} ,
    {title : 'smog' ,         name : '雾霾'} ,
    {title : 'sandstorm' ,    name : '沙尘暴'} ,
]

// 格式化时间，输出字符串
function dateFormatter(date, formatString) {
   formatString = formatString || 'yyyy-MM-dd hh:mm:ss'
   let dateRegArray = {
      "M+": date.getMonth() + 1,                      // 月份
      "d+": date.getDate(),                           // 日
      "h+": date.getHours(),                          // 小时
      "m+": date.getMinutes(),                        // 分
      "s+": date.getSeconds(),                        // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
      "S": date.getMilliseconds()                     // 毫秒
   }
   if (/(y+)/.test(formatString)) {
      formatString = formatString.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
   }
   for (let section in dateRegArray) {
      if (new RegExp("(" + section + ")").test(formatString)) {
         formatString = formatString.replace(RegExp.$1, (RegExp.$1.length === 1) ? (dateRegArray[section]) : (("00" + dateRegArray[section]).substr(("" + dateRegArray[section]).length)))
      }
   }
   return formatString
}

function dateProcess(dateString) {
   let date = new Date(dateString)
   let year = date.getFullYear()
   let month = date.getMonth() + 1
   let day = date.getDate()
   let hour = date.getHours()
   let minutes = date.getMinutes()
   let seconds = date.getSeconds()
   let week = date.getDay()
   let timeLabel = ''
   if (hour >= 23 && hour < 24 || hour <= 3 && hour >= 0) {
      timeLabel = '深夜'
   } else if (hour >= 19 && hour < 23) {
      timeLabel = '晚上'
   } else if (hour >= 14 && hour < 19) {
      timeLabel = '傍晚'
   } else if (hour >= 11 && hour < 14) {
      timeLabel = '中午'
   } else if (hour >= 6 && hour < 11) {
      timeLabel = '早上'
   } else if (hour >= 3 && hour < 6) {
      timeLabel = '凌晨'
   }

   return {
      year,
      day,
      month,
      weekday: WEEKDAY[week],
      weekShort: WEEKDAY_SHORT[week],
      dateShort:`${padNumberWith0(month)}-${padNumberWith0(day)}`,
      date:`${padNumberWith0(month)}月${padNumberWith0(day)}日`,
      dateFull: `${year}年${month}月${day}日`,
      dateFullSlash: `${year}/${month}/${day}`,
      timeLabel: timeLabel,
      time: `${padNumberWith0(hour)}:${padNumberWith0(minutes)}`
   }
}

function padNumberWith0(num){
   return String(num).padStart(2, '0')
}

function temperatureProcessSTC(temperature){
   return temperature === -273 ? '' : String(temperature)
}

function temperatureProcessCTS(temperature){
   return temperature === '' ? -273 : String(temperature)
}


function getDiaryConfig(){
   let diaryConfigString = localStorage.getItem('DiaryConfig')
   if (diaryConfigString){
      return JSON.parse(diaryConfigString)
   } else {
      return {
         isFilterShared: false, // 是否筛选共享日记
         keywords: [], // 关键词
         filteredCategories: store.state.categoryAll.map(item => item.name_en), // 筛选的日记类别
         dateFilter: '' // 日记范围
      }
   }
}

function setDiaryConfig(newValue){
   localStorage.setItem('DiaryConfig', JSON.stringify(newValue))
}
function deleteDiaryConfig(newValue){
   localStorage.removeItem('DiaryConfig')
}


export default {
   WEEKDAY, WEATHER,
   getAuthorization,
   setAuthorization,
   setAuthorizationToken,
   popMessage,
   dateProcess,
   dateFormatter,
   deleteAuthorization,
   global,
   temperatureProcessSTC,
   temperatureProcessCTS,
   getDiaryConfig, setDiaryConfig, deleteDiaryConfig,
   saveBillKeys,getBillKeys
}
