<template>
  <div class="LookUpAttendence">
    <v-card class="ma-12" max-width="1000" outlined>
      <v-container fluid>
        <v-row align="center">
          <v-col class="d-flex" cols="12" sm="6">
            <v-select
              :items="items"
              label="학기 선택"
            ></v-select>
          </v-col>
        </v-row>
      </v-container>
      <v-data-table :headers="headers" :items="desserts" :items-per-page="5" class="elevation-1"></v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'LookUpLectureInfo',
  components: {
  },
  data () {
    return {
      items: ['2019학년도 2학기', '2020학년도 1학기'],
      headers: [
        {
          text: '교과목번호/분반',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: '교과목명', value: 'calories' },
        { text: '학점', value: 'fat' },
        { text: '주담당교수', value: 'carbs' },
        { text: '강의실', value: 'protein' },
        { text: '강의시간', value: 'iron' },
      ],
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%',
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%',
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%',
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%',
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%',
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%',
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%',
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: '45%',
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: '22%',
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: '6%',
        },
      ],
    }
  },
}
</script>