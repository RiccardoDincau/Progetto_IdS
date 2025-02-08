<template>
    <div class="reports-container">
        <ReportSFC v-for="report in reports" :report-id="report._id" :key="report._id" />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import ReportSFC from "./reportSFC.vue";

const SERVERURL = "/";

let reports = ref([]);

let props = defineProps(["state", "kind", "category"]);

async function fetchReports(stateFilter, kind, category) {
    let queries = "?";
    if (stateFilter) {
        queries += "state=" + stateFilter + "&";
    }
    if (kind) {
        queries += "kind=" + kind + "&";
    }
    if (category) {
        queries += "category=" + category + "&";
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
    await fetchReports(props.state, props.kind, props.category);
})

onMounted(async () => {
    await fetchReports(props.state, props.kind, props.category);
});

</script>