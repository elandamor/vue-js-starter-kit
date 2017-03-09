'use strict';

import Vue from './framework/vue'
import { Toast } from './components/toast';

let initialized = false;

export function init() {
    if (initialized) {
        return;
    }

    initialized = true;

    class App {
        constructor() {
            Vue.component('app-nav', {
                template: '<nav></nav>'
            });

            Vue.component('nav-item', {
                props: ['nav'],
                template: '<li><a :href="nav.route">{{ nav.text }}</a></li>'
            });

            Vue.component('app-view', {
                template: '<main></main>'
            });

            Vue.component('app-content', {
                template: '<section></section>'
            });

            const app = new Vue({
                el : '#app',
                data : {
                    message : 'Hello...',
                    navLinks: [
                        { text: 'Home', route: '/' },
                        { text: 'About', route: '/about' },
                        { text: 'Contact', route: '/contact' }
                    ]
                }
            });
        }
    }

    new App();
}
