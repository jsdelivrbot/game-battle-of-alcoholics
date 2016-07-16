const Random = require('random-js');
const crypto = require('crypto');

const random = new Random(Random.engines.mt19937().autoSeed());
const io = require('socket.io')(8888);

const config = {
    initialHP: 10,
    randomMax: 3
};

const games = {};

io.on('connection', socket => {
    const id = crypto.createHash('md5').update(socket.id).digest('hex');

    var currentGame = games[id] = {
        computer: {},
        player: {}
    };

    socket.on('startOrRestart', () => {
        currentGame.computer.hp = config.initialHP;
        currentGame.computer.history = [];

        currentGame.player.hp = config.initialHP;
        currentGame.player.history = [];

        socket.emit('data', currentGame);
        socket.emit('config', config);
    });

    socket.on('data', number => {
        number = parseInt(number);

        if (typeof number === 'number' && number >= 1 && number <= config.randomMax) {
            const randomInt = random.integer(1, config.randomMax);
            const hp = random.integer(1, config.randomMax);

            if (randomInt === number) {
                currentGame.player.hp -= hp;

                currentGame.computer.history.push(0);
                currentGame.player.history.push(number);
            } else {
                currentGame.computer.hp -= hp;

                currentGame.computer.history.push(number);
                currentGame.player.history.push(0);
            }

            if (currentGame.player.hp <= 0) {
                socket.emit('end', 0);
            } else if (currentGame.computer.hp <= 0) {
                socket.emit('end', 1);
            } else {
                socket.emit('data', currentGame);
            }
        }
    });

    socket.on('disconnect', () => {
        delete currentGame;
    });
});