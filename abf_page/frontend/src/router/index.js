import Vue from 'vue'
import VueRouter from 'vue-router'
import Student from '../views/Student'
import Professor from '../views/Professor'
import Administer from '../views/Administer'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/Student',
    name: 'Student',
    component: Student
  },
  {
    path: '/Professor',
    name: 'Professor',
    component: Professor
  },
  {
    path: '/Administer',
    name: 'Administer',
    component: Administer
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
