<template>
    <div class="reports-container">
        <UserReport v-for="report in props.reports" :reportId="report" :key="report" />
    </div>
</template>

<script setup>
import { onUpdated } from 'vue';
import UserReport from './userReport.vue';

const props = defineProps(["reports"]);

</script>
<style lang="css" scoped></style>