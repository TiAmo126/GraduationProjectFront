<template>
  <div>
    <a-menu
      theme="dark"
      mode="horizontal"
      @click="handleClick"
      :defaultSelectedKeys="defaultSelectedKeys"
      :style="{lineHeight: '64px'}"
    >
      <template v-if="formData.role === '0'" >
        <template v-for="m in menuList">
          <a-menu-item :key="m.path">
            <a-icon :type="m.meta.icon" style="font-size: 16px"></a-icon>
            <span>{{m.meta.name}}</span>
          </a-menu-item>
        </template>
      </template>

      <template v-else>
        <template v-for="m in menuList">
          <template v-if="m.meta.isShow!==undefined"></template>
          <template v-else>
            <a-menu-item :key="m.path">
              <a-icon :type="m.meta.icon" style="font-size: 16px"></a-icon>
              <span>{{m.meta.name}}</span>
            </a-menu-item>
          </template>
        </template>
      </template>

    </a-menu>
  </div>
</template>

<script>
  import {Menu,Icon} from 'ant-design-vue'

  export default {
    name: "PublicMenu",
    components: {
      AIcon: Icon,
      AMenu: Menu,
      AMenuItem: Menu.Item,
    },
    data() {
      return {
        defaultSelectedKeys:[],
        menuList:null,
        menuRoutes:null,
        formData: null,
      }
    },
    created() {
      this.formData = JSON.parse(this.$store.getters.currentUser);
    },
    mounted() {
      this.menuRoutes = this.$router.options.routes;
      this.menuList = this.menuRoutes[0].children;
      this.defaultSelectedKeys.push(this.$route.path);
    },
    methods: {
      handleClick(e) {
        this.$router.push(e.key)
      }
    }
  }
</script>

<style scoped>

</style>
