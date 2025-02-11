<template>
    <input class="search-bar" type="text" placeholder="Cerca..." v-model="searchedValue" @input="emit('inFocus', searchedValue)">
</template>

<script setup>
import { ref } from 'vue';

let searchedValue = ref("");
let emit = defineEmits(['inFocus']);

</script>

<style>

</style>