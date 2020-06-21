<template>
  <div>
    <el-form :model="ruleForm2" :rules="rules2" @submit.native.prevent ref="ruleForm2" label-position="left"
             label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录
        </el-button>
        <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      </el-form-item>
    </el-form>

  </div>


</template>

<script>
  import { requestLogin } from '../api/index';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: 'admin',
          checkPass: '123456'
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    created() {
      var _self = this;
      document.onkeydown = function (e) {
        if (window.event == undefined) {
          var key = e.keyCode;
        } else {
          var key = window.event.keyCode;
        }
        if (key == 13) {
          _self.handleSubmit2('loginData');
        }
      }
    },

    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
       handleSubmit2() {
        var _this = this;
        this.$refs.ruleForm2.validate(async valid => {
          if (valid) {
            this.logining = true;
            //NProgress.start();
            var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
            var result= await requestLogin(loginParams)
            console.log(result)
            // this.postAxios('/login12',loginParams).then(res=>{
            //   console.log(res)
              if(result.meta.status===200){
                this.$message.success('登录成功')
                window.sessionStorage.setItem('token', JSON.stringify(result.data.token) )
                this.$router.push({ path: '/home' });
              }else{
                this.$message.error('登录失败')
                this.logining = false;
                return false
              }
            // }).catch(err=>{})



          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: auto;

    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
  .demo-ruleForm{
    position: absolute;
    top:50%;
    left: 50%;
    margin-left: -211px;
    margin-top: -250px;
  }
</style>
