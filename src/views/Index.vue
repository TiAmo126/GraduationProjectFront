<template>
  <a-layout id="components-layout-demo-top-side" style="height: 100%;">
    <a-layout class="height-100-per">
      <a-layout-header class="layout-side" :style="{ position: 'fixed', zIndex: 1, width: '100%', minWidth:'1000px' }">
        <div class="layout-side">
          <img :src="logo2" style="width: 50px;height: 50px;border-radius: 50%;text-align: center;line-height: 50px">
          <span class="margin-left-10-px text-size-24px text-bold-normal color-blue">仁和药店管理系统</span>
        </div>
        <div class="layout-right-center margin-right-10-px">
          <public-menu></public-menu>
          <a-dropdown>
            <img :src="formData.avatarBase" class="avatarBase"/>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="showDrawer">个人资料</a>
                <a-drawer
                  width="300px"
                  title="个人资料"
                  placement="right"
                  :closable="false"
                  @close="onClose"
                  :visible="visible">
                  <div style="margin-bottom: 10px;text-align: center">
                    <a-upload
                      name="avatar"
                      listType="picture"
                      :showUploadList="false"
                      :action="newAvatarBase === '' ? formData.avatarBase : newAvatarBase"
                      @change="uploadPic"
                      accept="image/jpg,image/jpeg,image/png">
                      <a-avatar shape="square" icon="user" :size="120" :src="newAvatarBase === '' ? formData.avatarBase : newAvatarBase"/>
                    </a-upload>
                  </div>
                  <div class="layout-center">
                    <p class="formLeft">姓名：</p>
                    <p class="formRight">{{formData.name}}</p>
                  </div>
                  <div class="layout-center">
                    <p class="formLeft">身份证号：</p>
                    <p class="formRight">{{formData.idCard}}</p>
                  </div>
                  <div class="layout-center">
                    <p class="formLeft">性别：</p>
                    <p class="formRight">{{formData.gender === '0' ? '男' : '女'}}</p>
                  </div>
                  <div class="layout-center">
                    <p class="formLeft">员工卡号：</p>
                    <p class="formRight">{{formData.cardNumber}}</p>
                  </div>
                  <div class="layout-center">
                    <p class="formLeft">角色：</p>
                    <p class="formRight">{{formData.role === '0' ? '管理员' : '店员'}}</p>
                  </div>
                  <div class="layout-center">
                    <p class="formLeft">出生日期：</p>
                    <p class="formRight">{{formData.birthday}}</p>
                  </div>
                  <template v-if="updateP">
                    <div class="layout-center">
                      <span></span>
                      <a-button @click="updatePassward">修改密码</a-button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="layout-center">
                      <p class="formLeft">新密码：</p>
                      <p class="formRight">
                        <a-input aria-placeholder="请输入新密码" v-model="newPassword"></a-input>
                      </p>
                    </div>
                    <div class="layout-center">
                      <p class="formLeft">确认密码：</p>
                      <p class="formRight">
                        <a-input aria-placeholder="再次输入新密码" v-model="rePassword"></a-input>
                      </p>
                    </div>
                  </template>
                  <div :style="{
                  position: 'absolute',
                  bottom: 0,width: '100%',
                  borderTop: '1px solid #e8e8e8',
                  padding: '10px 16px',
                  textAlign: 'right',
                  left: 0,
                  background: '#fff',
                  borderRadius: '0 0 4px 4px',}">
                    <a-button style="marginRight: 8px" @click="onClose">
                      取消
                    </a-button>
                    <a-button @click="updateSure" type="primary">
                      修改
                    </a-button>
                  </div>
                </a-drawer>
              </a-menu-item>
              <a-menu-item>
                <router-link to="/login">退出登陆</router-link>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-layout-header>
      <public-breadcrumb :style="{marginTop: '64px'}"></public-breadcrumb>
      <a-layout-content class="height-100-per" style="margin: 0 0 5px; padding: 0 10px 5px; overflow-y:auto;">
        <transition name="slide-fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </a-layout-content>
      <a-layout-footer class="layout-side" style="font-weight: bold;padding: 5px 10px;">
        <div></div>
        <div>@重庆工程学院 软件工程系 1690010班 刘翔宇</div>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
  import {Layout, Dropdown, Menu, Drawer, Upload, Avatar, Button, Input} from 'ant-design-vue'
  import PublicMenu from "@/components/PublicMenu";
  import PublicBreadcrumb from "@/components/PublicBreadcrumb";
  import {pic2Base64} from '../lib/utils'

  export default {
    name: 'Index',
    props: {
      msg: String
    },
    components: {
      PublicBreadcrumb,
      PublicMenu,
      ALayout: Layout,
      ALayoutHeader: Layout.Header,
      ALayoutContent: Layout.Content,
      ALayoutFooter: Layout.Footer,
      ADropdown: Dropdown,
      ADrawer: Drawer,
      AUpload: Upload,
      AAvatar: Avatar,
      AButton: Button,
      AInput: Input,
      AMenu: Menu,
      AMenuItem: Menu.Item,
    },
    computed: {},
    data() {
      return {
        type: 'dog',
        current: ['mail'],
        formData: null,
        visible: false,
        logo: require('../assets/logo.png'),
        logo2: require('../assets/logo2.png'),
        updateP: true,
        newPassword: '',
        rePassword: '',
        newAvatarBase: '',
        isMessCount: 1,
      }
    },
    created() {
      this.formData = JSON.parse(this.$store.getters.currentUser);
      if (this.formData === null) {
        this.$router.push('/login')
      }
    },
    methods: {
      // 打开个人资料面板
      showDrawer() {
        this.visible = true;
      },
      // 关闭面板
      onClose() {
        this.updateP = true;
        this.newAvatarBase = '';
        this.newPassword = '';
        this.rePassword = '';
        this.visible = false;
      },
      // 上传图片
      uploadPic(e) {
        const that = this;
        let files = e.file.originFileObj;
        let size = e.file.size;
        if (size < 1024 * 1024) {
          pic2Base64(files).then(function (result) {
            that.newAvatarBase = result;
            // that.formData.avatarBase = result;
          });
        } else {
          if (that.isMessCount === 1) {
            that.$message.error("图片大小不能大于1M")
          }
          if (that.isMessCount === 3) {
            that.isMessCount = 0;
          }
        }
        that.isMessCount++;
      },
      // 点击修改密码
      updatePassward() {
        this.updateP = false
      },
      // 确认修改
      updateSure() {
        const that = this;
        if (that.newPassword === '' && that.newAvatarBase === '') {
          that.$message.warning("请做有效修改");
          return
        }
        if (that.rePassword !== that.newPassword) {
          that.$message.warning("两次密码不一致");
          return
        }
        let newFormData = {
          id: that.formData.id,
          avatarBase: that.newAvatarBase === '' ? that.formData.avatarBase : that.newAvatarBase,
          name: that.formData.name,
          gender: that.formData.gender,
          role: that.formData.role,
          cardNumber: that.formData.cardNumber,
          birthday: that.formData.birthday,
          idCard: that.formData.idCard,
          password: that.newPassword === '' ? that.formData.password : that.newPassword,
        };
        that.$apollo.mutate({
          mutation: require('../graphql/workers/mutation/saveStaff.gql'),
          variables: {entity: newFormData}
        }).then(data => {
          if (data.data.saveStaff.code === "CODE_200") {
            that.$message.success("修改成功,请重新登录");
            setTimeout(() => {
              that.$router.push('/login')
            },1000)
          } else {
            that.$message.error("修改失败")
          }
        }).catch(error => {
          console.log(error)
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #components-layout-demo-top-side .logo {
    width: 120px;
    height: 31px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px 28px 16px 0;
    float: left;
  }

  .avatarBase {
    width: 40px;
    height: 40px;
    border-radius: 50%
  }

  .formLeft {
    width: 70px;
    text-align: right
  }

  .formRight {
    width: 150px;
  }
</style>
