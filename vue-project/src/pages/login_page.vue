<template>
    <div class="page-container">
        <div class="login-container">
            <h1 class="login-title">Treport</h1>
            <div class="form-container">
                <input class="login-input shaded" v-model="email" type="email" placeholder="Email">
                <input class="login-input shaded" v-model="password" type="password" placeholder="Password">
                <button class= "confirm-login" @click="login">Accedi</button>
            </div>
            <div class="links-container">
                <a class="link" href="#/">Torna indietro</a>
                <a class="link" href="#/signup">Registrati</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"

const email = ref("riccardo@gmail.com");
const password = ref("riccardo1");

const emit = defineEmits(["successfullLogin"]);

async function login() {
    if (email.value === "") {
        loginFailed();
        return;
    }
    let POSTbody = {
        email: email.value,
        password: password.value
    };

    fetch("api/authentication", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(POSTbody)
    }).then(async res => {
        if (res.status != 200) {
            loginFailed();
        } else {
            let resJSON = await res.json();
            successfullLogin(resJSON.id, resJSON.token);
        }
    })
}

function successfullLogin(userID, token) {
    localStorage.setItem("userId", userID);
    localStorage.setItem("JWT", token);
    emit("successfullLogin");
}

function loginFailed() {
    console.log("Login failed");
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

.shaded {
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.2);
}

.login-container {
    width: 50%;
    margin: auto;
}

.login-title {
    text-align: center;
    color: #00483A;
    font-size: 50px;
}

.form-container {
    margin-top: 30px;
    display: flex;
    flex-direction: column;

    width: 50%;
    margin: auto;
}

.form-container>* {
    margin-top: 15px;
}

.login-input {
    background-color: #D8D8D8;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid transparent;
}

.confirm-login {
    background-color: #00483A;
    padding: 10px 30px 10px 30px;
    width: 40%;
    margin: 30px auto 0 auto;
    color: white;
    font-size: 20px;
    border: 3px solid transparent;
    border-radius: 5px;
    cursor: pointer;
    transition-duration: 0.1s;
}

.confirm-login:hover {
    border: 3px solid black;
    letter-spacing: 0.2px;
}

.links-container {
    margin-top: 20px;
    text-align: center;
}

.link {
    margin-left: 10px;
    margin-right: 10px;
    text-decoration: none;
    transition-duration: 0.2s;
}

.link:hover {
    letter-spacing: 0.2px;
}
</style>