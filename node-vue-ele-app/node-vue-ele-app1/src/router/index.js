import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/index.vue'
import Register from '../views/register.vue'
import NoFind from '../views/404.vue'
import Login from '../views/login.vue'
import Home from '../views/home.vue'
import Infoshow from '../views/infoshow.vue'
import fundlist from '../views/fundlist.vue'
Vue.use(Router)

 const router=new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children:[{
      	path:'',component:Home
      },
      {
      	path:'/home',name:'Home',component:Home
      },
      {
      	path:'/infoshow',name:'Infoshow',component:Infoshow
      },
      ,
      {
      	path:'/fundlist',name:'fundlist',component:fundlist
      }
      ]
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },{
    	path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '*',
      name: '/404',
      component: NoFind
    }
  ]
});

//路由守卫

router.beforeEach((to,from,next)=>{
	const isLogin=localStorage.eleToken?true:false;
	if(to.path=='/login' || to.path=='/register' ){
		next();
	}else{
		isLogin ? next() : next('/login');
	}
})

export default router