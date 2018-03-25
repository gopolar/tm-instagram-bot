class Utils {
    /* Sleep */
    sleep(sec) {
        let sleep = require('system-sleep');
        sleep(sec * 1000);
    }

    /* Random number between two numbers */
    random_interval(min, max) {
        return (Math.floor(Math.random() * (max - min + 1)) + min);
    }
}

module.exports = () => {
    return new Utils();
};

