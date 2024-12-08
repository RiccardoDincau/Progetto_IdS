<template>
    <div class="reports-container">
        <ReportSFC v-for="report in reports" :report-id="report._id" :key="report._id" />
    </div>
</template>

<script setup>
import { ref, onMounted, watch} from 'vue';
import ReportSFC from "./reportSFC.vue";

const SERVERURL = "https://bpjwkxhm-8080.euw.devtunnels.ms/";

let reports = ref([]);

let props = defineProps(["state"]);

async function fetchReports(stateFilter) {
    let queries = "?";
    if (stateFilter) {
        queries += "state=" + stateFilter;
    }

    await fetch(SERVERURL + "api/reports/" + queries).then(async (res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const resData = await res.json();
        reports.value = resData;
    });
}

watch(props, async () => {
    await fetchReports(props.state);
})

onMounted(async () => {
    await fetchReports(props.state);
});

</script>