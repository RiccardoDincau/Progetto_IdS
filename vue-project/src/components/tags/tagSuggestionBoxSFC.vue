<template>
    <div class="suggestionContainer">
        <ul class="suggestionList">
            <li v-for="suggestion in suggestionList">
                <tagSuggestionSFC :category="suggestion" :key="suggestion" />
            </li>
        </ul>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import tagSuggestionSFC from './tagSuggestionSFC.vue';

const staticTags = ["lights", "roads", "reports", "via Pio X"];

const suggestionList = ref([]);

function fillSuggestionListRandom() {
    suggestionList.value = staticTags;
}

onMounted(() => {
    fillSuggestionListRandom();
}) 
</script>

<style></style>