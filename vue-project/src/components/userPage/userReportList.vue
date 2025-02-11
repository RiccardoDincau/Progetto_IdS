<template>
    <div class="reports-container">
        <userReport v-for="report in props.reports" :reportId="report" :key="report" />
    </div>
</template>

<script setup>
import userReport from './userReport.vue';

const props = defineProps(["reports"]);
</script>
<style lang="css" scoped></style>