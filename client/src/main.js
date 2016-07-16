import Vue from 'vue';
import VueRouter from 'vue-router';
import VueValidator from 'vue-validator';
import VueSocketIO from 'vue-socket.io';

import Layout from './components/Layout';

import Index from './components/Index';
import Game from './components/Game';

Vue.use(VueRouter);
Vue.use(VueValidator);
Vue.use(VueSocketIO, 'http://localhost:8888');

const router = new VueRouter({
    history: true,
    saveScrollPosition: true,
    linkActiveClass: 'active'
});

router.map({
    '/': {
        name: 'index',
        component: Index
    },
    '/game': {
        name: 'game',
        component: Game
    }
});

router.start(Layout, 'app');