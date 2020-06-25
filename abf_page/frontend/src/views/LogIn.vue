<template>
  <v-container>
    <div class="form" v-if="isSignUp==false">
      <div class="form-panel one">
        <div class="form-header">
            <h1>Account Login</h1>
        </div>
        <div class="form-content">
            <div class="form-group">
              <label for="username">ID</label>
              <input @keyup.enter="LogIn" v-model="ID"/>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" @keyup.enter="LogIn" v-model="password"/>
            </div>
            <div class="form-group">
              <button @click="LogIn"  >Log In</button>
            </div>
            <div class="form-group">
              <button @click="SignUp">Sign Up</button>
            </div>
        </div>
      </div>
    </div>
    <div class="form" v-else-if="isSignUp==true">
      <div class="form-panel one">
        <div class="form-header">
            <h1>Sign Up</h1>
        </div>
        <div class="form-content">
            <div class="form-group">
              <label for="user_id">user_id</label>
              <input v-model="user_id"/>
            </div>
            <div class="form-group">
              <label for="passwd">passwd</label>
              <input v-model="passwd"/>
            </div>
            <div class="form-group">
              <label for="name">name</label>
              <input v-model="name"/>
            </div>
            <div class="form-group">
              <label for="type">type</label>
              <input v-model="type"/>
            </div>
            <div class="form-group">
              <label for="member_id">member_id</label>
              <input v-model="member_id"/>
            </div>
            <div class="form-group">
              <label for="grade">grade</label>
              <input v-model="grade"/>
            </div>
            <div class="form-group">
              <label for="dept">dept</label>
              <input v-model="dept"/>
            </div>
            <div class="form-group">
              <label for="major">major</label>
              <input v-model="major"/>
            </div>
            <div class="form-group">
              <label for="phone_num">phone_num</label>
              <input v-model="phone_num"/>
            </div>
            <div class="form-group">
              <label for="e_mail">e_mail</label>
              <input v-model="e_mail"/>
            </div>
            <div class="form-group">
              <button @click="SendSignInfo">SendSignInfo</button>
            </div>
            <div class="form-group">
              <button @click="Back">Back</button>
            </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'LogIn',
  components: {
  },

  data: () => ({
    ID:"",
    password:"",

    user_id:"",
    passwd:"",
    name:"",
    type:"",
    member_id:"",
    grade:"",
    dept:"",
    major:"",
    phone_num:"",
    e_mail:"",

    isSignUp:false,
  }),
  methods:{
    LogIn:function(){
      this.$http
        .post("/api/users/LogIn", {
          ID:this.ID,
          password:this.password,
        })
        .then(response => {
          this.$store.commit("SetInfo", response.data);
          if(response.data.result=="Success"){
            this.$emit('childs-event', response.data.info)
          }
          else if(response.data.result=="NoID"){
            alert("아이디 없음")
          }
          else if(response.data.result=="NoPassword"){
            alert("비밀번호 틀림")
          }
        })
        .catch(err => {
          alert("connection error occured:LogIn/login");
        });
      
    },
    SignUp:function(){
      this.isSignUp=true
    },

    SendSignInfo:function(){
      this.$http
        .post("/api/users/SignUp", {
          user_id:this.user_id,
          passwd:this.passwd,
          name:this.name,
          type:this.type,
          member_id:this.member_id,
          grade:this.grade,
          dept:this.dept,
          major:this.major,
          phone_num:this.phone_num,
          e_mail:this.e_mail,
        })
        .then(response => {
          this.isSignUp=false
        })
        .catch(err => {
          alert("connection error occured:LogIn/sign");
        });
    },
    Back:function(){
      this.isSignUp=false
    }
  },
};
</script>












<style rel="stylesheet">

.form {
  z-index: 15;
  position: relative;
  background: #FFFFFF;
  width: 600px;
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin: 100px auto 10px;
  overflow: hidden;
}

.form-toggle:before, .form-toggle:after {
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 4px;
  background: #4285F4;
  -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
}
.form-toggle:before {
  -webkit-transform: translate(-50%, -50%) rotate(45deg);
      -ms-transform: translate(-50%, -50%) rotate(45deg);
          transform: translate(-50%, -50%) rotate(45deg);
}
.form-toggle:after {
  -webkit-transform: translate(-50%, -50%) rotate(-45deg);
      -ms-transform: translate(-50%, -50%) rotate(-45deg);
          transform: translate(-50%, -50%) rotate(-45deg);
}
.form-toggle.visible {
  -webkit-transform: translate(0, -25%) scale(1);
      -ms-transform: translate(0, -25%) scale(1);
          transform: translate(0, -25%) scale(1);
  opacity: 1;
}
.form-group {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: wrap;
      -ms-flex-wrap: wrap;
          flex-wrap: wrap;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
      -ms-flex-pack: justify;
          justify-content: space-between;
  margin: 0 0 20px;
}
.form-group:last-child {
  margin: 0;
}
.form-group label {
  display: block;
  margin: 0 0 10px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: .2em;
}
.two .form-group label {
  color: #FFFFFF;
}
.form-group input {
  outline: none;
  display: block;
  background: rgba(0, 0, 0, 0.1);
  width: 100%;
  border: 0;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 12px 20px;
  color: rgba(0, 0, 0, 0.6);
  font-family: inherit;
  font-size: inherit;
  font-weight: 500;
  line-height: inherit;
  -webkit-transition: 0.3s ease;
          transition: 0.3s ease;
}
.form-group input:focus {
  color: rgba(0, 0, 0, 0.8);
}
.two .form-group input {
  color: #FFFFFF;
}
.two .form-group input:focus {
  color: #FFFFFF;
}
.form-group button {
  outline: none;
  background: #4285F4;
  width: 100%;
  border: 0;
  border-radius: 4px;
  padding: 12px 20px;
  color: #FFFFFF;
  font-family: inherit;
  font-size: inherit;
  font-weight: 500;
  line-height: inherit;
  text-transform: uppercase;
  cursor: pointer;
}
.two .form-group button {
  background: #FFFFFF;
  color: #4285F4;
}
.form-group .form-remember {
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
}
.form-group .form-remember input[type='checkbox'] {
  display: inline-block;
  width: auto;
  margin: 0 10px 0 0;
}
.form-group .form-recovery {
  color: #4285F4;
  font-size: 12px;
  text-decoration: none;
}
.form-panel {
  padding: 60px calc(5% + 60px) 60px 60px;
  box-sizing: border-box;
}
.form-panel.one:before {
  content: '';
  display: block;
  opacity: 0;
  visibility: hidden;
  -webkit-transition: 0.3s ease;
          transition: 0.3s ease;
}
.form-panel.one.hidden:before {
  display: block;
  opacity: 1;
  visibility: visible;
}
.form-panel.two {
  z-index: 5;
  position: absolute;
  top: 0;
  left: 95%;
  background: #4285F4;
  width: 100%;
  min-height: 100%;
  padding: 60px calc(10% + 60px) 60px 60px;
  -webkit-transition: 0.3s ease;
          transition: 0.3s ease;
  cursor: pointer;
}
.form-panel.two:before, .form-panel.two:after {
  content: '';
  display: block;
  position: absolute;
  top: 60px;
  left: 1.5%;
  background: rgba(255, 255, 255, 0.2);
  height: 30px;
  width: 2px;
  -webkit-transition: 0.3s ease;
          transition: 0.3s ease;
}
.form-panel.two:after {
  left: 3%;
}
.form-panel.two:hover {
  left: 93%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.form-panel.two:hover:before, .form-panel.two:hover:after {
  opacity: 0;
}
.form-panel.two.active {
  left: 10%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  cursor: default;
}
.form-panel.two.active:before, .form-panel.two.active:after {
  opacity: 0;
}
.form-header {
  margin: 0 0 40px;
}
.form-header h1 {
  padding: 4px 0;
  color: #4285F4;
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
}
.two .form-header h1 {
  position: relative;
  z-index: 40;
  color: #FFFFFF;
}

.pen-footer {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-flex-direction: row;
      -ms-flex-direction: row;
          flex-direction: row;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
      -ms-flex-pack: justify;
          justify-content: space-between;
  width: 600px;
  margin: 20px auto 100px;
}
.pen-footer a {
  color: #FFFFFF;
  font-size: 12px;
  text-decoration: none;
  text-shadow: 1px 2px 0 rgba(0, 0, 0, 0.1);
}
.pen-footer a .material-icons {
  width: 12px;
  margin: 0 5px;
  vertical-align: middle;
  font-size: 12px;
}

.cp-fab {
  background: #FFFFFF !important;
  color: #4285F4 !important;
}

</style>
