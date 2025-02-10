<template>
    <div class="page-container">
        <div class="redirect-content">
            <h1>Per continuare con quest'azione devi autenticarti</h1>
            <div class="buttons-container">
                <div @click="goBack" class="go-back">
                    <p>Torna indietro</p>
                </div>
                <a class="continue-a" href="#/login">
                    <div class="continue">
                        Continua
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>
<script setup>
const emits = defineEmits(["goBack"]);

function goBack() {
    emits("goBack");
}
</script>

<style lang="css" scoped>
.page-container {
    width: 100vw;
    height: 100vh;

    background-color: white;

    font-family: "Raleway", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;

    display: flex;
}

.redirect-content {
    margin: auto;
}

.buttons-container {
    display: flex;
    width: 300px;
    margin: auto;
    margin-top: 20px;
    justify-content: space-between;
}

.go-back {
    border: 3px solid lightgray;
    background-color: white;
    cursor: pointer;
    padding: 10px;
    font-size: 20px;
}

.continue {
    border: 2px solid black;
    background-color: #00483A;
    padding: 10px;
    font-size: 20px;
}

.continue-a {
    text-decoration: none;
    color: white;
}
</style>