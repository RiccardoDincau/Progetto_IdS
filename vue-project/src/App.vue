<script setup>
import { ref, computed, onUpdated, onMounted } from 'vue'
import LandingPage from './pages/landing_page.vue'
import LoginPage from "./pages/login_page.vue"
import SignupPage from './pages/signup_page.vue'
import NewReportPage from './pages/new_report_page.vue'
import big_report_page from './pages/big_report_page.vue'
import requiredLoginPage from './pages/required_login_page.vue'
import user_page from './pages/user_page.vue'

const routes = {
    '/': LandingPage,
    "/login": LoginPage,
    "/signup": SignupPage,
    "/new-report": NewReportPage,
    "/big-report": big_report_page,
    "/required-login": requiredLoginPage,
    "/user-page": user_page,
}

const currentPath = ref(window.location.hash);

window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash;
});

let currentViewURL = "/";

let URLHistory = ["/", "/"];

const currentView = computed(() => {
    URLHistory.unshift(currentPath.value);
    // console.log(URLHistory);
    const pathWithQuery = currentPath.value.slice(1) || '/';

    // Separare il percorso dalla query string
    const [path] = pathWithQuery.split('?');
    currentViewURL = path;

    return routes[path] || LandingPage;
});

// Funzione per ottenere i parametri query dalla hash
function getQueryParams() {
    const queryString = currentPath.value.split('?')[1] || '';
    const params = new URLSearchParams(queryString);
    return Object.fromEntries(params.entries());
}

function goToLastNotLogin() {
    for (let i = 0; i < URLHistory.length; i++) {
        let possiblePath = URLHistory[i];
        if (possiblePath != "#/login"
            && possiblePath != "#/signup"
            && possiblePath != "#/required-login") {

            if (URLHistory[0] == "#/required-login"
                && possiblePath == "#/new-report") continue
            window.location.hash = possiblePath;
            break;
        }
    }
}

function goToLast() {
    for (let i = 0; i < URLHistory.length; i++) {
        let possiblePath = URLHistory[i];
        if (possiblePath != URLHistory[0]
            && possiblePath != "#/login"
            && possiblePath != "#/signup"
            && possiblePath != "#/required-login") {
            window.location.hash = possiblePath;
            break;
        }
    }
}
</script>


<template>
    <component :is="currentView" v-bind="getQueryParams()" @successfullLogin="goToLastNotLogin"
        @go-back="goToLastNotLogin" @go-to-last-page="goToLast" />
</template>
