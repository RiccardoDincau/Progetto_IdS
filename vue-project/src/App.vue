<script setup>
import { ref, computed } from 'vue'
import LandingPage from './components/pages/landing_page.vue'
import LoginPage from "./components/pages/login_page.vue"
import SignupPage from './components/pages/signup_page.vue'

const routes = {
    '/': LandingPage,
    "/login": LoginPage,
    "/signup": SignupPage
}

const currentPath = ref(window.location.hash);

window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash;
});

let lastViewURL = "/";
let currentViewURL = "/";

const currentView = computed(() => {
    lastViewURL = currentViewURL;
    if (currentPath.value) {
        currentViewURL = currentPath.value.slice(1);
    } else {
        currentViewURL = '/';
    }
    return routes[currentPath.value.slice(1) || '/'] || NotFound;
});

function goToLastPage() {
    window.location.hash = lastViewURL;
}


</script>

<template>
    <component :is="currentView" @successfullLogin="goToLastPage" />
</template>