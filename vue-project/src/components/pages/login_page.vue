<template>
    <h1>LOGIN</h1>
    <a href="#/">Torna indietro</a>
    <a href="#/signup">Registrati</a>
    <div class="form-container">
        <input v-model="email" type="email" placeholder="Email">
        <input v-model="password" type="password" placeholder="Password">
        <button @click="login">Login</button>
    </div>
</template>

<script setup>
import { ref, defineEmits } from "vue"

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

    fetch("http://localhost:8080/api/authentication", {
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