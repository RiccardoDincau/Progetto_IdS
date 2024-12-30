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

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash
})

const currentView = computed(() => {
    return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
    <component :is="currentView" />
</template>