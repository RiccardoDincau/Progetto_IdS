<template>
    <div class="tags-bar">
        <div :class="props.category + '-type-tag'" class="report-tag">
            <p>{{ props.category }}</p>
        </div>
        <div :class="props.kind + '-type-tag'" class="report-tag">
            <p>{{ props.kind }}</p>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps(['kind', 'category']);
</script>

<style>
.tags-bar {
    display: flex;
    padding-right: 0;
    justify-content: right;
    padding-right: 20px;
}

.report-tag {
    margin-left: 10px;
    color: black;
    padding: 5px 20px 2px 20px;
    background-color: red;
    border-radius: 10px 10px 0 0;
    margin-top: 5px;
    transition-duration: 0.2s;
    /* box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.2); */
}

.report-tag:hover {
    padding-bottom: 5px;
    margin-top: 0;
    cursor: pointer;
}

.report-type-tag {
    background-color: #CA4B2E;
}

.lights-type-tag {
    background-color: #E6A704;
}

.complaint-type-tag {
    background-color: #d84f05;
}

.road-type-tag {
    background-color: #8490F9;
}
</style>