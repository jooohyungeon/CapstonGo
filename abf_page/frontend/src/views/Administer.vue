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
                <LookUpAttendence></LookUpAttendence>
            </v-container>
            <v-container v-else-if="item.tab=='출결 변경'" class="ma-0 pa-0">
                <ChangeAttendenceAdmin></ChangeAttendenceAdmin>
            </v-container>
            <v-container v-else-if="item.tab=='학생 얼굴 등록'" class="ma-0 pa-0">
                <EnrollFace></EnrollFace>
            </v-container>
            </v-card>
        </v-tab-item>
        </v-tabs-items>
    </v-container>
    </v-container>
</template>

<script>
import LookUpAttendence from '../components/LookUpAttendence';
import ChangeAttendenceAdmin from '../components/ChangeAttendenceAdmin';
import EnrollFace from '../components/EnrollFace';

export default {
  name: 'Administer',

  components: {
    LookUpAttendence,
    ChangeAttendenceAdmin,
    EnrollFace
  },

  data: () => ({
    tab: null,
    items: [
      { tab: '출결 현황 조회'},
      { tab: '출결 변경'},
      { tab: '학생 얼굴 등록'},
    ],
  }),
};
</script>
