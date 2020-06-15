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
        <v-flex v-if="checkUpload=='pending'" class="ma-12">
          <v-date-picker full-width  v-model="date" :allowed-dates="allowedDates" @click:date="dateClicked" max="2020-07-03"> 
          </v-date-picker>
          <v-flex class="mt-12">
            <v-textarea solo name="input-7-4" label="변경사유를 작성해주세요" v-model="text">
            </v-textarea>
          </v-flex>
          <v-col>
            <v-file-input v-model="files" color="deep-purple accent-4" counter label="File input" multiple placeholder="Select your files" prepend-icon="mdi-paperclip" outlined :show-size="1000">
              <template v-slot:selection="{ index, text }">
                {{ text }}
              </template>
            </v-file-input>
          </v-col>
        </v-flex>
        <v-flex v-else-if="checkUpload=='success'">
          <v-alert dense type="success"> 
            정상 처리되었습니다.
          </v-alert>
        </v-flex>
        <v-flex v-else-if="checkUpload=='fail'">
          <v-alert dense type="error">
            업로드를 실패했습니다.
          </v-alert>
        </v-flex>
        
        <v-btn class="ma-6 ml-12" @click="send" color="primary">보내기</v-btn>
        <v-btn class="ma-6" @click="back" color="primary">뒤로 가기</v-btn>
      </v-flex>
    </v-card>
    <v-card v-else-if="loading==true">
      <v-img src="../assets/loading.gif" width="160"/>
    </v-card>
    
  </div>
</template>

<script>
var moment = require('vue-moment');
var datestore = "123"
var week = ['일', '월', '화', '수', '목', '금', '토'];

export default {
  name: 'LookUpAttendanceStudent',
  components: {
  },
  data () {
    return {
      isdatePicked:false,
      valueStore:'',
      date:'',
      datePicked:'',
      text:'',

      searchSubj: '',
      searchProf: '',
      modifyDay:"",
      files: [],
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
        { text: '강의 요일', value: 'date'},
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

      lectureID : [],
      lectureInfo:[],

      clickedLectureInfo:[],
      checkUpload:"pending"
    }
  },
  methods:{
    allowedDates: (value) => datestore.indexOf(week[new Date(value).getDay()]) != -1,
    dateClicked:function(valueStore){
      this.datePicked=valueStore
    },

    handleClick:function(value){
      datestore=value.date
      this.clickedLectureInfo = value
      this.isClick=true
      this.detailLoading=false
    },
    back:function(){
      this.isClick=false
      this.detailLoading=true
    },
    send:function(){
      var date = new Date();
      this.$http
        .post("/api/users/fileUpload",{
          user_id:this.$store.state.SetInfo.info.member_id,
          class_id:this.clickedLectureInfo.code,
          request_date: date.format('yyyy-MM-dd'),
          modify_date:this.datePicked,
          contents:this.files[0].name,
          result:"pending",
          reason:this.text,
        })
        .then(response => {
          if(response.data=="upload success"){
            this.checkUpload = "success"
            setTimeout(() => {
              this.checkUpload = "pending"
            }, 3000)
          }
          else{
            this.checkUpload = "fail"
            setTimeout(() => {
              this.checkUpload = "pending"
            }, 3000)
          }
        })
        .catch(err => {
            alert("connection error occured1111");
        });
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
                    time : this.lectureInfo[i].class_starttime,
                    date : this.lectureInfo[i].class_date
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