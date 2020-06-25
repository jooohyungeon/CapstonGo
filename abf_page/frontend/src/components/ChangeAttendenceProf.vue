<template>
  <div class="LookUpAttendence">
    <v-card class="ma-12" max-width="1000" outlined v-if="loading==false">
      <v-flex v-if="isClick==false">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="교과목명" style="width:50%;" class="ml-3"></v-text-field>
        <v-data-table :headers="headers" :items="dataTable" :items-per-page="5" :search="search" class="elevation-1" @click:row="handleClick">
        </v-data-table>
      </v-flex>
      <v-flex v-else-if="isClick==true&&detailLoading==false">
        <v-text-field v-model="searchDetail" append-icon="mdi-magnify" label="Search" style="width:50%;" class="ml-3"></v-text-field>
        <v-data-table :headers="detailHeaders" :items="dataDetailTable" :items-per-page="5" :search="searchDetail" :single-expand="singleExpand" :expand.sync="expanded" item-key="id" show-expand class="elevation-2">
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">{{ item.reason }}</td>
          </template>
          <template v-slot:item.download="{ item }">
            <v-btn @click="download(item)" min-width="54px">
              <v-img src="../assets/down.png" width="10px"/>
            </v-btn>
          </template>
          <template v-slot:item.confirm="{ item }">
            <v-btn @click="confirm(item)" min-width="54px">
              <v-img src="../assets/approve.png" width="10px"/>
            </v-btn>
          </template>
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
      expanded: [],
      singleExpand: true,

      search:'',
      searchDetail:'',
      temp:0,
      headers: [
        {
          text: '교과목명',
          align: 'center',
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
          text: '요청 날짜',
          align: 'start',
          sortable: true,
          value: 'request',
        },
        { text: '이름', value: 'name' },
        { text: '학번', value: 'student' },
        { text: '변경 날짜', value: 'modify' },
        { text: '승인 날짜', value: 'confirm_date' },
        { text: '사유', value: 'data-table-expand' },
        { text: '증빙자료', value: 'content' },
        { text: '결과', value: 'result' },
        { text: '다운', value: 'download' },
        { text: '승인', value: 'confirm' },
      ],
      dataDetailTable:[],
      detailLoading:true,
    }
  },
  methods:{
    handleClick:function(value){
      this.isClick=true
      this.$http
      .get("api/users/modify_attendance")
      .then(response => {
        this.$http
        .get("/api/users/apply")
        .then(responseApply => {
          var index = 0;
          this.temp = 0;
          for(var i=0; i<response.data.length; i++){
            if(value.code==response.data[i].class_id){
              for(index=0;index<responseApply.data.length; index++){
                if(responseApply.data[index].member_id==response.data[i].user_id){
                  break;
                }
              }

              this.dataDetailTable[this.temp] = {
                id : this.temp,
                code : response.data[i].class_id,
                student : response.data[i].user_id,
                name : responseApply.data[index].name,
                request : response.data[i].request_date,
                modify : response.data[i].modify_date,
                confirm_date : response.data[i].confirm_date,
                content : response.data[i].contents,
                result : response.data[i].result,
                confirmer : response.data[i].confirmer_id,
                reason : response.data[i].reason
              }
              this.temp=this.temp+1
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
    download:function(item){
      this.$http
      .post("/api/users/download_file", {
        filename: item.content
      })
      .then(response => {
        if(response.data=="success"){
          alert("다운로드 완료")
        }
      })
      .catch(err => {
        alert("connection error occured2222");
      });
    },
    confirm:function(item){
      var date = new Date();
      this.$http
      .post("/api/users/confirm", {
        class_id: item.code,
        user_id:item.student,
        modify_date:item.modify,
        confirm_date:date.format('yyyy-MM-dd'),
      })
      .then(response => {
        if(response.data=="success"){
          alert("승인 완료")
        }
      })
      .catch(err => {
        alert("connection error occured2222");
      });
    }
  },
  beforeCreate(){
    this.$http
      .get("/api/users/attendance_check_administer")
      .then(response => {
        var temp = 0
        for(var i=0; i<response.data.length; i++){
          if (this.$store.state.SetInfo.info.name==response.data[i].prof_id) {
            this.dataTable[temp] = {
              name : response.data[i].class_name,
              code : response.data[i].class_id,
              prof : response.data[i].prof_id,
              room : response.data[i].class_room,
              time : response.data[i].class_starttime
            }
            temp = temp + 1
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

Date.prototype.format = function (f) {
    if (!this.valueOf()) return " ";
    var weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];
    var weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var d = this;
    return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear(); // 년 (4자리)
            case "yy": return (d.getFullYear() % 1000).zf(2); // 년 (2자리)
            case "MM": return (d.getMonth() + 1).zf(2); // 월 (2자리)
            case "dd": return d.getDate().zf(2); // 일 (2자리)
            case "KS": return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)
            case "KL": return weekKorName[d.getDay()]; // 요일 (긴 한글)
            case "ES": return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)
            case "EL": return weekEngName[d.getDay()]; // 요일 (긴 영어)
            case "HH": return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)
            case "mm": return d.getMinutes().zf(2); // 분 (2자리)
            case "ss": return d.getSeconds().zf(2); // 초 (2자리)
            case "a/p": return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분
            default: return $1;
        }
    });
};
String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };
Number.prototype.zf = function (len) { return this.toString().zf(len); };
</script>