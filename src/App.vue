<template>
  <div id="app">
    <a-locale-provider :locale="local">
      <router-view></router-view>
    </a-locale-provider>
  </div>
</template>

<script>
  import {LocaleProvider} from 'ant-design-vue'
  import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'

  export default {
    name: 'app',
    components: {
      ALocaleProvider:LocaleProvider
    },
    data() {
      return{
        local:zh_CN
      }
    },
  }
</script>

<style lang="less">
  @import "components/style/common.css";

  #app {
    height: 100%;
  }

</style>
