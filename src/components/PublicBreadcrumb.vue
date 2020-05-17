<template>
  <div>
    <a-breadcrumb style="margin-left: 15px;font-size: 12px;line-height: 30px">
      <a-breadcrumb-item>
        <a-icon :type="breadcrumb.icon"></a-icon>
        <span>{{breadcrumb.name}}</span>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script>
  import {Breadcrumb,Icon} from 'ant-design-vue'

  export default {
    name: "PublicBreadcrumb",
    components: {
      ABreadcrumb: Breadcrumb,
      ABreadcrumbItem: Breadcrumb.Item,
      AIcon: Icon,
    },
    data() {
      return {
        breadcrumb: {
          icon: 'home',
          name: '首页'
        }
      }
    },
    watch: {
      $route(val) {
        this.breadcrumb = {
          icon: val.meta.icon,
          name: val.meta.name
        }
      }
    },
    mounted() {
      this.breadcrumb = {
        icon: this.$route.meta.icon,
        name: this.$route.meta.name
      }
    }
  }
</script>

<style scoped>

</style>
