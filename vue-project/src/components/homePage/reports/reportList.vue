<template>
    <div class="reports-container">
        <Report v-for="report in filteredReports" :report-id="report._id" :key="report._id"/>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import Report from './report.vue';

const SERVERURL = "/";

let reports = ref([]);

let props = defineProps(["state", "kind", "category", "text", "order"]);

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
        reports.value = sortReports(reports.value);
    });
}

function sortReports(reportsArray) {
    if (!Array.isArray(reportsArray)) return [];
    
    if (props.order === 'votes-up') {
        return [...reportsArray].sort(compareReportsByVotesUp);
    } else if (props.order === 'votes-down') {
        return [...reportsArray].sort(compareReportsByVotesDown);
    }

    return reportsArray;
}


function compareReportsByVotesUp(reportA, reportB) {
    return reportB.votes - reportA.votes;
}

function compareReportsByVotesDown(reportA, reportB) {
    return reportA.votes - reportB.votes;
}

const filteredReports = computed(() => {
    if (!props.text) {
        return reports.value;
    }
    return reports.value.filter(report =>
        report.content.toLowerCase().includes(props.text.toLowerCase()) ||
        report.title.toLowerCase().includes(props.text.toLowerCase())
    );
});

watch(props, async () => {
    await fetchReports(props.state, props.kind, props.category, props.text, props.order);
});

onMounted(async () => {
    await fetchReports(props.state, props.kind, props.category);
    reports.value = sortReports(reports.value);
});

</script>