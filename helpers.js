const helpers = {
    createNumber(min = 1, max = 6, dec = 0) {
        dec = 10 ** dec;
        let z = Math.random() * (max - min + (1 / dec)) + min;
        z *= dec;
        z = Math.floor(z);
        z /= dec;
        return z;
    },
    createColor(hueMin = 0, hueMax = 360, sat = 100, light = 50) {
        return `hsl(${helpers.createNumber(hueMin, hueMax)},${sat}%,${light}%)`;
    }
}

export default helpers;