<template>
    <div class="page-container">
        <div class="signup-container">
            <div class="image-container">
                <img src="../assets/imgs/logo_treport.png" class="logo-login">
            </div>
            <h1 class="signup-title">Treport</h1>
            <div class="form-container">
                <input :class="{ 'red-border': emptyFields.name }" v-model="signupName" class="signup-input shaded"
                    type="text" placeholder="Nome">
                <input :class="{ 'red-border': emptyFields.email }" v-model="signupEmail" class="signup-input shaded"
                    type="email" placeholder="Email">
                <input :class="{ 'red-border': emptyFields.password }" v-model="signupPassword"
                    class="signup-input shaded" type="password" placeholder="Password">
                <button @click="signup" class="confirm-signup">Registrati</button>
            </div>
            <div class="links-container">
                <a class="link" href="#/">Torna alla home page</a>
                <p>Se hai gia un account <a href="#/login">accedi qua.</a> </p>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref } from 'vue';

const signupName = ref("");
const signupEmail = ref("");
const signupPassword = ref("");

const emit = defineEmits(["successfullLogin"]);

const emptyFields = ref({
    name: false,
    email: false,
    password: false
})

async function signup() {
    let valid = true;

    if (signupName.value == "") {
        valid = false;
        emptyFields.value.name = true;
    }

    if (signupEmail.value == "") {
        valid = false;
        emptyFields.value.email = true;
    }

    if (signupPassword.value == "") {
        valid = false;
        emptyFields.value.password = true;
    }

    if (!valid) {
        alert("Completa tutti i campi!");
        return;
    }

    let user = {
        name: signupName.value,
        email: signupEmail.value,
        password: signupPassword.value,
        user_level: "citizen"
    };

    let signupResp = await fetch("/api/users", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if (signupResp.status != 201) {
        alert("Registrazione non completata (Forse la email è gia stata usata)");
        return;
    }

    let authResp = await fetch("/api/authentication", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: signupEmail.value,
            password: signupPassword.value
        })
    });

    if (authResp.status != 200) {
        loginFailed();
    } else {
        let resJSON = await authResp.json();
        successfullLogin(resJSON.id, resJSON.token);
    }
}

function loginFailed() {
    console.log("Login failed");
}

function successfullLogin(userID, token) {
    localStorage.setItem("userId", userID);
    localStorage.setItem("JWT", token);
    emit("successfullLogin");
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

.image-container {
    margin: auto;
    width: 200px;
    height: 200px;
}


.logo-login {
    width: 100%;
    height: 100%;
}

.signup-container {
    width: 50%;
    margin: auto;
}

.signup-title {
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

.signup-input {
    background-color: #D8D8D8;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid transparent;
}

.confirm-signup {
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

.confirm-signup:hover {
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

.red-border {
    border: 3px solid red;
}
</style>