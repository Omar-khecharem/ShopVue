import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import ProductDetails from '../pages/ProductDetails.vue';
import Cart from '../pages/Cart.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import AdminLayout from '../admin/AdminLayout.vue';
import auth from '../store/auth.js';

const adminGuard = (to, from, next) => {
  if (!auth.isLoggedIn) return next('/login');
  if (!auth.isAdmin) return next('/');
  next();
};

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/products/:id', name: 'ProductDetails', component: ProductDetails },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },

  {
    path: '/admin',
    component: AdminLayout,
    beforeEnter: adminGuard,
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('../admin/Dashboard.vue') },
      { path: 'products', name: 'AdminProducts', component: () => import('../admin/Products.vue') },
      { path: 'orders', name: 'AdminOrders', component: () => import('../admin/Orders.vue') },
      { path: 'homepage', name: 'AdminHomepage', component: () => import('../admin/HomepageEditor.vue') },
      { path: 'banners', name: 'AdminBanners', component: () => import('../admin/BannerManager.vue') },
      { path: 'categories', name: 'AdminCategories', component: () => import('../admin/CategoryManager.vue') },
      { path: 'users', name: 'AdminUsers', component: () => import('../admin/UserManager.vue') },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
