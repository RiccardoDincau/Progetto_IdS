<template>
    <div class="user-info-container shaded">
        <p class="username">{{ prop.username }}</p>
        <button @click="clearJWT" class="logout-button">esci</button>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const prop = defineProps(["username"]);
const emit = defineEmits(["logout"]);

function clearJWT() {
    emit("logout");
    localStorage.removeItem("JWT");
    localStorage.removeItem("userId");
    location.reload()
}
</script>

<style>
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