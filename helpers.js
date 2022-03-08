const helpers = {
    createNumber(min = 1, max = 6, dec = 0) {
        dec = 10 ** dec;
        let z = Math.random() * (max - min + (1 / dec)) + min;
        z *= dec;
        z = Math.floor(z);
        z /= dec;
        return z;
    },
    createColor() {
        return `hsl(${helpers.createNumber(0, 360)},70%,70%)`;
    }
}

export default helpers;