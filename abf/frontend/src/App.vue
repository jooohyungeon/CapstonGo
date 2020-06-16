<template>
<v-flex class="ma-0 pa-0">
  <v-app v-if="IsLogin">

    <v-app-bar app color="#FFF">
      <v-flex>
        <v-img src="./assets/ajou.png" width="160"/>
      </v-flex>
      <v-spacer></v-spacer>
      {{member_id}} {{name}} 님
      <!-- <v-select :items="IdentityItems" v-model="Identity"></v-select> -->
      <div>
        <notifications group='notifyApp' position='top center' ignoreDuplicates></notifications>
        <v-btn @click="onClick" icon color='primary'>
          <v-badge color="red">
          <v-icon>mdi-bell</v-icon>
          <span slot="badge">{{this.notiNum}}</span>
          </v-badge>
          </v-btn>  
      </div>
      <v-btn class="ml-4" color='primary' @click="LogOut" > 로그 아웃</v-btn>
    </v-app-bar>

    <v-content v-if="Identity=='student'">
      <Student></Student>
    </v-content>
    <v-content v-else-if="Identity=='professor'">
      <Professor></Professor>
    </v-content>
    <v-content v-else-if="Identity=='administer'">
      <Administer></Administer>
    </v-content>

  </v-app>
  <v-app v-else-if="!IsLogin">
    <LogIn @childs-event="parentsMethod"></LogIn>
  </v-app>
</v-flex>
</template>

<script>
import LogIn from './views/LogIn';
import Student from './views/Student';
import Professor from './views/Professor';
import Administer from './views/Administer';
export default {
  name: 'App',

  components: {
    LogIn,
    Student,
    Professor,
    Administer,
  },

  data: () => ({
    tab: null,
    IsLogin:false,
    Identity:"administer",
    notiNum:0,
    IdentityItems: ['student', 'professor','administer'],

    name:'',
    member_id:'',

  }),
  methods:{
    LogOut: function(){
      this.IsLogin=false
    },
    parentsMethod: function(message){
      // console.log(message)
      this.name = message.name
      this.member_id = message.member_id
      this.Identity = message.type
      this.IsLogin=true
      this.type= message.type
      this.$http
      .get("api/users/modify_attendance")
      .then(response => {
        // console.log(response)
        var count=0
        if(this.Identity == "administer"){
        for(var i=0; i<response.data.length; i++)
        {
          if(response.data[i].result == 'pending' )
          {
            count +=1
          }
          this.notiNum=count
        }
  
        }
        else if(this.Identity == "student"){
          var count=0
        for(var i=0; i<response.data.length; i++)
        {
          if(response.data[i].user_id == message.member_id )
          {
            if(response.data[i].result == 'apporve')
            {
              count += 1
            }
          }
          this.notiNum=count
        }
        }
        else{
          var count=0
          var test=0;
          this.$http
          .get("api/users/attendance_check_administer")
          .then(responseClass=> {
            // console.log(responseClass)
            // console.log(response)
            // console.log(responseClass.data[i].prof_id)
            // console.log(message.name)
            for(var i=0; i<responseClass.data.length; i++)
            {
              if(responseClass.data[i].prof_id == message.name)
              {
                for(var j=0; j<response.data.length; j++)
                {
                  if(responseClass.data[i].class_id == response.data[j].class_id)
                  {
                    if(response.data[j].result =="pending")
                    {
                      count += 1
                    } 
                  }
                }
              }
            }
             this.notiNum=count
          })
        }
      })
      .catch(err => {
        alert("connection error occured2222");
      });
    },
    onClick(){
      if(this.Identity == "administer"){
      this.$notify({
        group: 'notifyApp',
        type: 'default',
        duration: 5000,
        width:'300px',
        text: "승인하지 않은" + this.notiNum +"건의 출결 변경 요청이 있습니다."
      })
      }
      else if(this.Identity == "student")
      {
        this.$notify({
        group: 'notifyApp',
        type: 'default',
        duration: 5000,
        width:'300px',
        text:+this.notiNum +"건의 출결 변경 요청이 승인되었습니다."
      })
      }
      else{
        this.$notify({
        group: 'notifyApp',
        type: 'default',
        duration: 5000,
        width:'300px',
        text: "승인하지 않은" + this.notiNum +"건의 출결 변경 요청이 있습니다."
      })
      }
    }
  }
};
</script>
<style>
#App{
  margin:20px
  }
</style>>
