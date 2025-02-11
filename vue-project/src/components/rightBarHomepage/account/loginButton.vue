<template>
    <a href="#/login" class="login-link">
        <div class="login-button-container">
            <h3>Login</h3>
        </div>
    </a>

</template>


<style>
.login-button-container {
    width: 80%;
    margin: auto;
    padding: 10px;
    background-color: #00483A;
    margin: 5%;
    border-radius: 8px;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.2);
}

.login-button-container:hover {
    transform: scale(1.1);
    transition-duration: 0.1;
}

.login-link {
    color: white;
    font-size: 30px;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
}
</style>