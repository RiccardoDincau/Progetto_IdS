<!-- <script setup>
import { ref, computed } from 'vue'
import LandingPage from './pages/landing_page.vue'
import LoginPage from "./pages/login_page.vue"
import SignupPage from './pages/signup_page.vue'
import NewReportPage from './pages/new_report_page.vue'
import BigReportPage from './components/landing_page_center/bigReportPage.vue'

const routes = {
    '/': LandingPage,
    "/login": LoginPage,
    "/signup": SignupPage,
    "/new-report": NewReportPage,
    "/big-report": BigReportPage
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
</template> -->
<script setup>
import { ref, computed } from 'vue'
import LandingPage from './pages/landing_page.vue'
import LoginPage from "./pages/login_page.vue"
import SignupPage from './pages/signup_page.vue'
import NewReportPage from './pages/new_report_page.vue'
import big_report_page from './pages/big_report_page.vue'

const routes = {
    '/': LandingPage,
    "/login": LoginPage,
    "/signup": SignupPage,
    "/new-report": NewReportPage,
    "/big-report": big_report_page
}

const currentPath = ref(window.location.hash);

window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash;
});

let lastViewURL = "/";
let currentViewURL = "/";

const currentView = computed(() => {
    lastViewURL = currentViewURL;
    const pathWithQuery = currentPath.value.slice(1) || '/';

    // Separare il percorso dalla query string
    const [path] = pathWithQuery.split('?');
    currentViewURL = path;

    return routes[path] || NotFound;
});

// Funzione per ottenere i parametri query dalla hash
function getQueryParams() {
    const queryString = currentPath.value.split('?')[1] || '';
    const params = new URLSearchParams(queryString);
    return Object.fromEntries(params.entries());
}

function goToLastPage() {
    window.location.hash = lastViewURL;
}

</script>


<template>
    <component 
        :is="currentView" 
        v-bind="getQueryParams()" 
        @successfullLogin="goToLastPage" 
    />
</template>
