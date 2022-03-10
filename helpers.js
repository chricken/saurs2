const helpers = {
    createNumber(min = 1, max = 6, dec = 0) {
        dec = 10 ** dec;
        let z = Math.random() * (max - min + (1 / dec)) + min;
        z *= dec;
        z = Math.floor(z);
        z /= dec;
        return z;
    },
    createColor({
        hueMin = 0,
        hueMax = 360,
        satMin = 0,
        satMax = 100,
        lightMin = 0,
        lightMax = 100
    }) {
        let z = helpers.createNumber;
        //if ( )
        return `hsl(${z(hueMin, hueMax)},${z(satMin, satMax)}%,${z(lightMin, lightMax)}%)`;
    },
    createColorTrans({
        hueMin = 0,
        hueMax = 360,
        satMin = 0,
        satMax = 100,
        lightMin = 0,
        lightMax = 100,
        alphaMin = 0,
        alphaMax = 1
    }) {
        let z = helpers.createNumber;
        return `hsla(${z(hueMin, hueMax)},${z(satMin, satMax)}%,${z(lightMin, lightMax)}%,${z(alphaMin * 100, alphaMax * 100) / 100})`;
    },
    crop(value, min = 0, max = 1) {
        value = Math.max(value, min);
        value = Math.min(value, max);
        return value;
    }
}

export default helpers;