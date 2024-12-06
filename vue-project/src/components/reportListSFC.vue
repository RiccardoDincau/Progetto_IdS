<template>
    <div class="reports-container">
        <ReportSFC v-for="report in reports" :report-id="report._id" :key="report._id" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ReportSFC from "./reportSFC.vue";

const SERVERURL = "https://bpjwkxhm-8080.euw.devtunnels.ms/";

let reports = ref([]);

async function fetchReports(stateFilter) {
    await fetch(SERVERURL + "api/reports/").then(async (res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const resData = await res.json();
        reports.value = resData;
    });
}

onMounted(async () => {
    await fetchReports("active");
});

</script>