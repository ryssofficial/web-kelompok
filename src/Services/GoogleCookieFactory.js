import { CookieBuilder } from './CookiesFactory/BaseCookies.js';

export class GoogleCookieFactory {
    static createCookie(purpose, name, value) {
        switch (purpose.toLowerCase()) {
            case "auth":
                return new CookieBuilder(name, value)
                    .setDuration(30)
                    .makeSecure()
                    .setHttpOnly()
                    .setSameSite("Strict")
                    .build();

            case "analytics":
                return new CookieBuilder(name, value)
                    .setDuration(365)
                    .setSameSite("Lax")
                    .build();

            case "preference":
                return new CookieBuilder(name, value)
                    .setDuration(90)
                    .setSameSite("Lax")
                    .build();

            default:
                return new CookieBuilder(name, value).build();
        }
    }
}