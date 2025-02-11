<template>
    <div class="user-info-container">
        <div class="info-header">
            <h1 class="username">{{ props.username }}</h1>
            <div class="nav-container">
                <div @click="clearJWT" class="logout-button">Logout</div>
                <a href="#/" class="back-anchor">
                    <div class="logout-button">Indietro</div>
                </a>
            </div>
        </div>

        <div class="info-content">
            <p class="email">Email: {{ props.email }}</p>
            <p class="creation-date">Data apertura account: </p>
            <p class="voted-reports">Segnalazioni votate: {{ props.votedReportsNum }}</p>
            <p class="created-reports">Segnalazioni pubblicate: {{ props.createdReportsNum }} </p>
        </div>
    </div>
</template>

<script setup>

const props = defineProps(["username", "email", "createdReportsNum", "votedReportsNum"]);

function clearJWT() {
    localStorage.removeItem("JWT");
    localStorage.removeItem("userId");
    window.location.hash = "#/";
}
</script>

<style lang="css" scoped>
.back-anchor {
    text-decoration: none;
}

.nav-container {
    display: flex;
}

.nav-container>* {
    margin-left: 10px;
}

.user-info-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.info-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.username {
    font-size: 40px;
}

.logout-button {
    background-color: #00483A;
    color: white;
    font-weight: 400;
    padding: 10px;
    border-radius: 10px;
}

.info-content {
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    margin-top: 20px;
    width: 400px;
    height: 200px;
    font-size: 20px;
}

.logout-button {
    cursor: pointer;
}
</style>