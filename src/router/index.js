import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authstore.js'

import AdminPage from '@/pages/AdminPage.vue'
import HomePage from '@/pages/HomePage.vue'
import SignupPage from '@/pages/SignupPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import CartPage from '@/pages/CartPage.vue'
import CheckoutPage from '@/pages/CheckoutPage.vue'
import SearchPage from '@/pages/SearchPage.vue'
import UnauthorizedPage from '@/pages/UnauthorizedPage.vue'

import AdminDashboard from '@/components/admin/DashBoard.vue'
import AdminUserManagement from '@/components/admin/UserManagement.vue'
import AdminSectionManagement from '@/components/admin/SectionManagement.vue'
import AdminBookManagement from '@/components/admin/BookManagement.vue'
import AdminRequestManagement from '@/components/admin/RequestManagement.vue'
import AdminIssueManagement from '@/components/admin/IssueManagement.vue'



const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupPage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: {
      title: 'Profile',
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPage,
    redirect: { name: 'admindashboard' },
    children: [
      {
        path: 'dashboard',
        name: 'admindashboard',
        component: AdminDashboard
      },
      {
        path: 'users',
        name: 'adminusers',
        component: AdminUserManagement
      },
      {
        path: 'sections',
        name: 'adminsections',
        component: AdminSectionManagement
      },
      {
        path: 'books',
        name: 'adminbooks',
        component: AdminBookManagement
      },
      {
        path: 'requests',
        name: 'adminrequests',
        component: AdminRequestManagement
      },
      {
        path: 'issue',
        name: 'adminissues',
        component: AdminIssueManagement
      }
    ],
    meta: {
      title: 'Admin',
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartPage,
    meta: {
      title: 'Cart',
      requiresAuth: true
    }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutPage,
    meta: {
      title: 'Checkout',
      requiresAuth: true
    }
  },
  {
    path: '/search/:query',
    name: 'search',
    component: SearchPage,
    props: true
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    component: UnauthorizedPage,
    meta: {
      title: 'Unauthorized'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'error',
    component: () => import('@/pages/ErrorPage.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeResolve((to, from, next) => {
  // console.log('Coming from:', from.path)
  // console.log('Going to:', to.path)
  const auth = useAuthStore()
  if (to.meta.requiresAuth) {
    if (auth.authenticated) {
      // console.log('authenticated', to.meta.role, auth.user.role, to.path)
      if (to.meta.role && auth.user.role && auth.user.role !== to.meta.role) {
        console.log('not authorized')
        router.push('/forbidden')
      } else {
        next()
      }
    } else {
      // console.log('to login page')
      auth.returnURL = to.fullPath
      next({ path: '/login', query: { redirect: to.fullPath } })
    }
  } else {
    next()
    // console.log('Going to:', to.path)
  }
})

export default router
