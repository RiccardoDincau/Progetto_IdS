<template>
    <a class="user-page-anchor" href="#/user-page">
        <div class="user-info-container shaded">
            <p class="username">{{ prop.username }}</p>
        </div>
    </a>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const prop = defineProps(["username"]);
const emit = defineEmits(["logout"]);


</script>

<style scoped>
.user-page-anchor {
    text-decoration: none;
    color: #00483A;
}

.user-info-container {
    width: 75%;
    min-width: 100px;
    min-height: 40px;
    margin: auto;
    margin-top: 10px;
    background-color: white;

    text-align: center;
    align-items: center;
    display: flex;

    padding: 5px;
    border-radius: 15px;
}

.username {
    width: 75%;
    font-size: larger;
}

.logout-button {
    background-color: #00483A;
    color: white;
    padding: 10px;
    border-radius: 15px;

    cursor: pointer;

    border: none;
}
</style>