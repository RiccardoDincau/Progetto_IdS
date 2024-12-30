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
import { ref } from "vue"

const email = ref("riccardo@gmail.com");
const password = ref("riccardo1");


async function login() {
    if (email.value === "") {
        console.log("Empty email");
        return;
    }
    let POSTbody = {
        email: email.value,
        password: password.value
    };

    await fetch("http://localhost:8080/api/authentication", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(POSTbody)
    }).then(async res => {
        if (res.status != 200) {
            console.log("Connection failed");
        } else {
            let resJSON = await res.json();
            localStorage.setItem("JWT", resJSON.token);
            localStorage.setItem("userId", resJSON.id);
        }
    })
}
</script>