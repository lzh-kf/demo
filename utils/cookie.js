function parseCookie () {
    const { cookie } = document;
    let result = {}
    cookie && cookie.split("; ").map((item) => {
        const [key, value] = item.split("=");
        result[key] = JSON.parse(value)
    });
    return result;
}

function getGMTString (days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    return d.toGMTString();
}

export default {
    get (key) {
        const cookie = parseCookie();
        return cookie[key];
    },
    set (key, value, exdays = 7) {
        if (key && value) {
            const expires = "expires=" + getGMTString(exdays);
            document.cookie = `${key}=${JSON.stringify(value)};${expires}`;
        } else {
            throw "key or value is noVaild";
        }
    },
    remove (key) {
        if (key) {
            const expires = "expires=" + getGMTString(-1);
            document.cookie = `${key}=; ${expires}`;
            return true
        }
    }
}