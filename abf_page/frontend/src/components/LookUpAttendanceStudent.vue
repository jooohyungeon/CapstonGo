<template>
  <div class="LookUpAttendence">
    <v-card class="ma-12" max-width="1000" outlined v-if="loading==false">
      <v-flex v-if="isClick==false">
        <v-layout row>
          <v-flex style="padding-left:12px">
            <v-text-field v-model="searchSubj" append-icon="mdi-magnify" label="교과목명" style="width:75%;" class="ml-3"></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field v-model="searchProf" append-icon="mdi-magnify" label="담당교수" style="width:75%;" class="ml-3"></v-text-field>
          </v-flex>
          <v-flex>
          </v-flex>
        </v-layout>
        <v-data-table :headers="headers" :items="dataTable" :items-per-page="5" :search="searchSubj||searchProf" class="elevation-1" @click:row="handleClick">
        </v-data-table>
      </v-flex>
      <v-flex v-else-if="isClick==true&&detailLoading==false">
        <v-text-field v-model="searchDetail" append-icon="mdi-magnify" label="Search" style="width:50%;" class="ml-3"></v-text-field>
        <v-data-table :headers="detailHeaders" :items="dataDetailTable" :items-per-page="5" :search="searchDetail" class="elevation-2">
        </v-data-table>
        <v-btn class="ma-6" @click="back" color="primary">뒤로 가기</v-btn>
      </v-flex>
    </v-card>
    <v-card v-else-if="loading==true">
      <v-img src="../assets/loading.gif" width="160"/>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'LookUpAttendanceStudent',
  components: {
  },
  data () {
    return {
      searchSubj: '',
      searchProf: '',
      searchDetail:'',
      temp:0,
      headers: [
        {
          text: '교과목명',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: '과목코드', value: 'code' },
        { text: '담당교수', value: 'prof' },
        { text: '강의실', value: 'room' },
        { text: '강의시간', value: 'time' },
      ],
      dataTable: [],
      loading:true,

      isClick:false,
      detailHeaders: [
        {
          text: '과목코드',
          align: 'start',
          sortable: false,
          value: 'code',
        },
        { text: '이름', value: 'name' },
        { text: '학번', value: 'student' },
        { text: '날짜', value: 'date' },
        { text: '출석 시간', value: 'time' },
        { text: '출석 여부', value: 'check' },
      ],
      dataDetailTable:[],
      detailLoading:true,

      lectureID : [],
      lectureInfo:[],
    }
  },
  methods:{
    handleClick:function(value){
      this.isClick=true
      this.$http
      .get("http://203.233.111.7:5050/get_ledger")
      .then(response => {
        this.$http
        .get("/api/users/apply")
        .then(responseApply => {
          var index = 0;
          this.temp = 0;
          for(var i=0; i<response.data.length; i++){
            if(value.code==response.data[i].Record.verifier){
              if(response.data[i].Record.user == this.$store.state.SetInfo.info.member_id){
                for(index=0; index<responseApply.data.length; index++){
                  if(this.$store.state.SetInfo.info.member_id==responseApply.data[index].member_id){
                    break;
                  }
                }

                this.dataDetailTable[this.temp] = {
                  code : response.data[i].Record.verifier,
                  student : response.data[i].Record.user,
                  name : responseApply.data[index].name,
                  date : response.data[i].Record.date,
                  time : response.data[i].Record.timestamp,
                  check : response.data[i].Record.result
                }
                this.temp=this.temp+1
              }  
            }
            if(i==response.data.length-1){
              this.detailLoading=false
            }
          }
        })
        .catch(err => {
          alert("connection error occured1111")
        });
      })
      .catch(err => {
        alert("connection error occured2222");
      });
    },
    
    back:function(){
      this.isClick=false
      this.detailLoading=true
      this.dataDetailTable=[]
    },
  },
  beforeCreate(){
    this.$http
      .get("/api/users/attendance_check_administer")
      .then(responseAttendance => {
        this.$http
        .get("/api/users/apply")
        .then(responseApply => {
            var temp = 0;
            for(var i=0; i<responseApply.data.length; i++){
                if(this.$store.state.SetInfo.info.member_id==responseApply.data[i].member_id){
                    this.lectureID[temp] = responseApply.data[i].class_id
                    temp = temp + 1
                }
            }
            temp = 0
            for(var i=0; i<this.lectureID.length; i++){
              for(var j=0; j<responseAttendance.data.length; j++){                
                if(responseAttendance.data[j].class_id==this.lectureID[i]){
                  this.lectureInfo[temp] = responseAttendance.data[j]
                  temp = temp + 1
                }
              }
            }
            for(var i=0; i<this.lectureInfo.length; i++){
                this.dataTable[i] = {
                    name : this.lectureInfo[i].class_name,
                    code : this.lectureInfo[i].class_id,
                    prof : this.lectureInfo[i].prof_id,
                    room : this.lectureInfo[i].class_room,
                    time : this.lectureInfo[i].class_starttime
                }
            }
            this.loading=false
        })
        .catch(err => {
            alert("connection error occured1111");
        });
      })
      .catch(err => {
        alert("connection error occured2222");
      });
  },
  created(){
    
  },
  mounted(){
    
  }
}

</script>



