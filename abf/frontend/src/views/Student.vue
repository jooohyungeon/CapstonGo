<template>
    <v-container class="ma-0 pa-0" row style="height:100%;">
    <v-container class="ma-0 pa-0" style="width:15%; height:100%;">
        <v-tabs v-model="tab" background-color="primary" dark vertical style="height:100%;">
        <v-tab v-for="item in items" :key="item.tab">
            {{ item.tab }}
        </v-tab>
        </v-tabs>
    </v-container>
    <v-container class="ma-0 pa-0" style="width:85%">
    <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in items" :key="item.tab">
            <v-card flat>
            <v-container v-if="item.tab=='출결 현황 조회'" class="ma-0 pa-0">
                <LookUpAttendanceStudent></LookUpAttendanceStudent>
            </v-container>
            <v-container v-else-if="item.tab=='출결 변경 신청'" class="ma-0 pa-0">
                <RequestChangeAttendence></RequestChangeAttendence>
            </v-container>
            <v-container v-else-if="item.tab=='출결 변경 신청 내역'" class="ma-0 pa-0">
                <RequestChangeAttendenceInfo></RequestChangeAttendenceInfo>
            </v-container>
            </v-card>
        </v-tab-item>
        </v-tabs-items>
    </v-container>
    </v-container>
</template>

<script>
import LookUpAttendanceStudent from '../components/LookUpAttendanceStudent';
import RequestChangeAttendence from '../components/RequestChangeAttendence';
import RequestChangeAttendenceInfo from '../components/RequestChangeAttendenceInfo';

export default {
  name: 'Student',

  components: {
    LookUpAttendanceStudent,
    RequestChangeAttendence,
    RequestChangeAttendenceInfo,
  },

  data: () => ({
    tab: null,
    items: [
      { tab: '출결 현황 조회', content: 'Tab 2 Content' },
      { tab: '출결 변경 신청', content: 'Tab 5 Content' },
      { tab: '출결 변경 신청 내역', content: 'Tab 6 Content' },
    ],
  }),
  created(){
    
  }
};
</script>
