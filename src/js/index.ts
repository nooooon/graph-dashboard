/* index.js */
'use strict'

import Vue from 'vue';
import App from '../components/app.vue';

new Vue({
  el: '#app',
  components: {
    'app': App,
  },
  template: `
    <div>
      <app></app>
    </div>
  `
})
