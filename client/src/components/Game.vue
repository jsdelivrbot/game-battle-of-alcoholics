<template>
    <div class="well">
        <button class="btn btn-primary btn-lg btn-block" type="button"
                v-bind:class="[(player.history.length === 0 && computer.history.length === 0) ? 'hide' : '']"
                v-on:click="restart">
            Новая игра
        </button>
        <div v-if="!endGame.status">
            <validator name="validation">
                <form v-on:submit.prevent="send(number)" novalidate>
                    <p>
                        <div class="form-group">
                            <div class="input-group">
                                <input class="form-control input-lg" placeholder="Число от 1 до 3" type="text"
                                       v-model="number" v-validate:number="{min: 1, max: config.randomMax }">
                                <span class="input-group-btn">
                                    <button class="btn btn-warning btn-lg" type="submit" :disabled="!$validation.valid">Выпить</button>
                                </span>
                            </div>
                            <p class="help-block" v-if="$validation.number.min || $validation.number.max">
                                <span class="text-danger">Число  должо быть от 1 и до {{ config.randomMax }}</span>
                            </p>
                        </div>
                    </p>
                </form>
            </validator>
        </div>
    </div>
    <div class="row" v-if="!endGame.status">
        <div class="col-md-6">
            <div class="panel panel-success">
                <div class="panel-heading">
                    <div class="text-center text-uppercase">
                        <h3 class="panel-title">Вы</h3>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="progress">
                        <div class="progress-bar progress-bar-success"
                             v-bind:style="{width: (player.hp * 100) / config.initialHP + '%'}">
                            {{ player.hp }} HP
                        </div>
                    </div>
                </div>
                <ul class="list-group">
                    <li class="list-group-item" v-bind:class="[hp > 0 ? 'list-group-item-danger' : '']"
                        v-for="hp in player.history" track-by="$index">
                        {{ hp }} HP
                    </li>
                </ul>
            </div>
        </div>
        <div class="col-md-6">
            <div class="panel panel-danger">
                <div class="panel-heading">
                    <div class="text-center text-uppercase">
                        <h3 class="panel-title">Противник</h3>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="progress">
                        <div class="progress-bar progress-bar-danger"
                             v-bind:style="{width: (computer.hp * 100) / config.initialHP + '%'}">
                            {{ computer.hp }} HP
                        </div>
                    </div>
                </div>
                <ul class="list-group">
                    <li class="list-group-item" v-bind:class="[hp > 0 ? 'list-group-item-success' : '']"
                        v-for="hp in computer.history" track-by="$index">
                        {{ hp }} HP
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="jumbotron">
            <div class="text-center">
                <h1>{{ endGame. message }}</h1>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .progress {
        margin-bottom: 0;
    }
</style>

<script>
    export default {
        data() {
            return {
                number: null,
                config: {},

                endGame: {
                    status: false,
                    message: null
                },

                player: {
                    hp: 0,
                    history: []
                },

                computer: {
                    hp: 0,
                    history: []
                }
            };
        },

        methods: {
            restart() {
                this.$socket.emit('startOrRestart');
                this.$set('endGame.status', false);
            },

            send(number) {
                this.$socket.emit('data', number);
                this.$set('number', null);
            }
        },

        ready() {
            this.$socket.emit('startOrRestart');
        },

        sockets: {
            config(data) {
                this.$set('config', data);
            },

            data(data) {
                if (data.initialHP) {
                    this.$set('initialHP', data.initialHP);
                }

                this.$set('computer', data.computer);
                this.$set('player', data.player);
            },

            end(type) {
                switch (parseInt(type)) {
                    case 0:
                        this.$set('endGame.message', 'Вы проиграли');
                        break;
                    case 1:
                        this.$set('endGame.message', 'Вы выиграли');
                        break;
                }

                this.$set('endGame.status', true);
            }
        }
    }
</script>