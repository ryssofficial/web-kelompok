import cookie from 'cookie';

export default class BaseCookies {
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this.maxAge = null;
        this.secure = false;
        this.httpOnly = false;
        this.sameSite = "Lax";
        this.domain = "";
    }
}

export class CookieBuilder {
    constructor(name, value) {
        this.cookie = new BaseCookies(name, value);
    }

    setDuration(days) {
        this.cookie.maxAge = days * 24 * 60 * 60;
        return this;
    }

    makeSecure() {
        this.cookie.secure = true;
        return this;
    }

    setHttpOnly() {
        this.cookie.httpOnly = true;
        return this;
    }

    setSameSite(policy) {
        this.cookie.sameSite = policy;
        return this;
    }

    setDomain(domain) {
        this.cookie.domain = domain;
        return this;
    }

    build() {
        return this.cookie;
    }
}

export class CookieManager {
    constructor() {
        if (CookieManager.instance) {
            return CookieManager.instance;
        }
        CookieManager.instance = this;
    }

    save(cookieObject) {
        const cookieString = cookie.serialize(cookieObject.name, cookieObject.value, {
            maxAge: cookieObject.maxAge || undefined,
            domain: cookieObject.domain || undefined,
            sameSite: cookieObject.sameSite,
            secure: cookieObject.secure,
            httpOnly: cookieObject.httpOnly,
        });

        if (typeof document !== 'undefined') {
            document.cookie = cookieString;
        }
        
        console.log(`[Cookie Saved]: ${cookieString}`);
    }

    get(name) {
        if (typeof document === 'undefined') return null;
        const cookies = cookie.parse(document.cookie);
        
        console.log(`[Cookie Fetch]: Mencari cookie ${name}`);
        return cookies[name] || null;
    }
}