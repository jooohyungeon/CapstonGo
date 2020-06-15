<template>
<v-app>
  <div class="form-panel one py-0">
    <div class="form-header">
      <h1>아주대 전자 출결 시스템</h1>
    </div>

    <div class="form-content">
      <v-layout columns class="ml-1 mb-5">
        <v-flex class="grey1form" md="2" style="font-weight:bold">
          교수명
        </v-flex>
        <v-flex class="grey0form mx-3" md="3" style="font-weight:bold">
          {{prof_id}}
        </v-flex>
        <v-flex class="grey1form ml-3" md="2" style="font-weight:bold">
          강의실
        </v-flex>
        <v-flex class="grey0form mx-3" md="3" style="font-weight:bold">
          팔달관 409
        </v-flex>
      </v-layout>

      <v-layout columns class="ml-1">
        <v-flex class="grey1form" md="2" style="font-weight:bold">
          교과목명
        </v-flex>
        <v-flex class="grey0form mx-3" md="3" style="font-weight:bold">
          {{class_name}}
        </v-flex>
        <v-flex class="grey1form ml-3" md="2" style="font-weight:bold">
          과목 코드
        </v-flex>
        <v-flex class="grey0form mx-3" md="3" style="font-weight:bold">
          {{class_id}}
        </v-flex>
      </v-layout>
    </div>
  </div>

  <div class="form-panel one" style="width:100%; height:100px;">
    <v-flex class="grey0form ml-1" md="2" columns>

      <v-flex>
        <v-img src="http://192.168.0.112:8091/?action=stream" style="width:550px;"/>
      </v-flex>

      <v-flex align-self-center v-if="check=='now'">
        <v-flex style="text-align:center;">
          <p style="font-weight:bold">{{$moment(time).format('YYYY년 MM월 DD일 HH시 mm분')}}</p>
        </v-flex>
        <v-flex class="form-group" dark>
          <button @click="Attendance">출석</button>
        </v-flex>
      </v-flex>
      <v-flex align-self-center v-else-if="check=='success'">
        <v-alert dense type="success"> 
          {{member_id}} {{name}} 정상 처리되었습니다.
        </v-alert>
      </v-flex>
      <v-flex align-self-center v-else-if="check=='fail'">
        <v-alert dense type="error">
          출석에 실패하였습니다.
        </v-alert>
      </v-flex>
      <v-flex align-self-center v-else-if="check=='error'">
        <v-alert dense type="error">
          등록되지 않은 얼굴입니다.
        </v-alert>
      </v-flex>


    </v-flex>
  </div>

</v-app>
</template>

<script>
var moment = require('vue-moment');
export default {
  name: 'App',
  components: {
  },
  data: () => ({
    time: '',

    member_id:'',
    name:'',

    check:'now',

    prof_id:'XXX',
    class_name:'XXX',
    class_id:'XXX',
  }),
  methods:{
    Attendance:function(){
      this.$http
        .post("/api/check", {
          class_id:this.class_id,
          date_id:(this.time).format('yyyy-MM-dd'),
        })
        .then(response => {
          console.log(response.data)
          if(response.data.result=='Success'){
            this.check="success"
            this.member_id=response.data.member_id
            this.name=response.data.name
            setTimeout(() => {
              this.check="now"
            }, 4000)
          }
          else if(response.data.result=='Fail'){
            this.check="fail"
            this.member_id=''
            this.name=''
            setTimeout(() => {
              this.check="now"
            }, 4000)
          }
          else{
            this.check="error"
            this.member_id=''
            this.name=''
            setTimeout(() => {
              this.check="now"
            }, 4000)
          }
        })
        .catch(err => {
          alert("connection error occured");
        });
      
      
    }
  },
  created() {
    var date
    setInterval(() => {
      date = new Date();
      this.time = date
    }, 1000)

    date = new Date();
    this.time = date
     this.$http
        .post("/api/check/lecture_info", {
          class_room:'409',
          time:date.format('HH:mm:ss'),
          date:date.format('KS'),
        })
        .then(response => {
          var lecture_info = response.data[0]
          console.log(lecture_info)
          if(lecture_info!=undefined){
            this.prof_id = lecture_info.prof_id
            this.class_name = lecture_info.class_name
            this.class_id = lecture_info.class_id
          }
          else{
            this.prof_id = 'XXX'
            this.class_name = 'XXX'
            this.class_id = 'XXX'
          }
        })
        .catch(err => {
          alert("connection error occured");
        });
    
    setInterval(() => {
      this.$http
        .post("/api/check/lecture_info", {
          class_room:'409',
          time:date.format('HH:mm:ss'),
          date:date.format('KS'),
        })
        .then(response => {
          var lecture_info = response.data[0]
          console.log(lecture_info)
          if(lecture_info!=undefined){
            this.prof_id = lecture_info.prof_id
            this.class_name = lecture_info.class_name
            this.class_id = lecture_info.class_id
          }
          else{
            this.prof_id = 'XXX'
            this.class_name = 'XXX'
            this.class_id = 'XXX'
          }
        })
        .catch(err => {
          alert("connection error occured");
        });
    }, 60000)
  }
};

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

.grey0form {
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

.grey1form {
  outline: none;
  display: block;
  background: rgba(0, 0, 0, 0.3);
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