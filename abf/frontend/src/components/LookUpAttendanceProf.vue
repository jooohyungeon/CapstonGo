<template>
  <div class="LookUpAttendence">
    <v-card class="ma-12" max-width="1000" outlined v-if="loading==false">
      <v-flex v-if="isClick==false">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" style="width:50%;" class="ml-3"></v-text-field>
        <v-data-table :headers="headers" :items="dataTable" :items-per-page="5" :search="search" class="elevation-1" @click:row="handleClick">
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
      search: '',
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
        { text: '강의실', value: 'room' },
        { text: '학생', value: 'student' },
        { text: '날짜', value: 'date' },
        { text: '출석 시간', value: 'time' },
        { text: '출석 여부', value: 'check' },
      ],
      dataDetailTable:[],
      detailLoading:true,

      lectureInfo:[],
    }
  },
  methods:{
    handleClick:function(value){
      this.isClick=true
      this.$http
      .get("http://203.233.111.7:5050/get_ledger")
      .then(response => {
        this.temp = 0;
        for(var i=0; i<response.data.length; i++){
          if(value.code==response.data[i].Record.verifier){
            this.dataDetailTable[this.temp] = {
              code : response.data[i].Record.verifier,
              room : response.data[i].Record.device,
              student : response.data[i].Record.user,
              date : response.data[i].Record.date,
              time : response.data[i].Record.timestamp,
              check : response.data[i].Record.result
            }
            this.temp=this.temp+1
          }
          if(i==response.data.length-1){
            this.detailLoading=false
          }
        }
      })
      .catch(err => {
        alert("connection error occured");
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
        var temp = 0
        for(var i=0; i<responseAttendance.data.length; i++){
            if(this.$store.state.SetInfo.info.name==responseAttendance.data[i].prof_id){
                this.lectureInfo[temp] = responseAttendance.data[i]
                temp = temp + 1
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
        alert("connection error occured2222");
      });
  },
  created(){
    
  },
  mounted(){
    
  }
}
</script>