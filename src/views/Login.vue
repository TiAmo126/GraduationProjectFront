<template>
  <div class="width-100-per height-100-per loginBg">
    <div class="loginDiv1 padding-10-px">
      <div class="loginDiv padding-10-px loginInside">
        <div class="layout-side">
          <img :src="logo2" class="logo">
          <span class="text-bold-normal text-size-24px">仁和药店管理系统</span>
        </div>
        <a-input placeholder="请输入账号" v-model="userName" ref="userNameInput">
          <a-icon slot="prefix" type="user" />
          <a-tooltip slot="suffix" title="账号为您的员工卡号">
            <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
          </a-tooltip>
        </a-input>
        <a-input-password placeholder="请输入登录密码" v-model="password" ref="userNameInput">
          <a-icon slot="prefix" type="lock" />
        </a-input-password>
        <a-button type="primary" class="width-100-per" @click="login">登录</a-button>
        <a-button class="width-100-per">注册</a-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {Button, Icon, Input, Tooltip} from "ant-design-vue"

  export default {
    name: "Login",
    components: {
      AButton: Button,
      AIcon: Icon,
      AInput: Input,
      AInputPassword: Input.Password,
      ATooltip: Tooltip,
    },
    data() {
      return{
        userName:'',
        password:'',
        logo2: require('../assets/logo2.png'),
      }
    },
    created() {
      const that = this;
      document.onkeydown = (e) => {
        let key = window.event.keyCode;
        if (key === 13) {
          that.login()
        }
      }
    },
    destroyed() {
      document.onkeydown = (e) => {}
    },
    methods: {
      login() {
        const that = this;
        if (that.userName === "") {
          that.$message.error('请输入员工卡号');
          return;
        }
        if (that.password === "") {
          that.$message.error('请输入密码');
          return;
        }
        that.$apollo.query({
          query: require('../graphql/workers/query/loginStaff.gql'),
          variables: {cardNumber:that.userName,password:that.password},
          fetchPolicy: 'no-cache'
        }).then(data => {
          if (data.data.loginStaff.code === "CODE_200") {
            that.$message.success('登录成功');
            //登录用户信息存至入vuex state下的currentUser中
            that.$store.dispatch("setUser",JSON.stringify(data.data.loginStaff.data));
            //路由跳转页面
            that.$router.push('/main')
          } else {
            that.$message.error(data.data.loginStaff.message);
          }
        });
      }
    }
  }
</script>

<style scoped>
  .loginDiv1 {
    width: 370px;
    height: 270px;
    background: rgba(256,256,256,0.5);
    border-radius: 15px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -185px;
    margin-top: -135px;
  }
  /*登录框外部布局*/
  .loginDiv {
    width: 350px;
    height: 250px;
    background: rgba(256,256,256,0.8);
    border-radius: 15px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -175px;
    margin-top: -125px;
  }
  /*登录框内部样式*/
  .loginInside{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .loginBg {
    background: url("../assets/login-bg.jpg") no-repeat!important;
    background-size: cover!important;
  }
  .logo{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    text-align: center;
    line-height: 50px
  }
</style>
