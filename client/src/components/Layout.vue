<template>
    <div class="container">
        <div class="page-header">
            <div class="text-center">
                <a v-link="{ name: 'index' }">
                    <h1>Битва алкоголиков</h1>
                </a>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>