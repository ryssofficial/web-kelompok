// backend/Services/BaseRoutes.js
import express from 'express';
import { AuthToken } from './AuthToken.js'; // Pastikan ekstensi .js ditambahkan jika menggunakan ESM

export default class BaseRoutes {
    // 1. Deklarasi bidang privat yang legal di dalam class
    #method;
    #route;
    #handler;
    #expressRouter;

    /**
     * @param {string} method - "get" | "post" | "put" | "delete"
     * @param {string} route - Path url, contoh: "/login"
     * @param {Function} handler - Controller / Middleware penangan rute
     * @param {Object} expressRouter - Instance router dari Express luar
     */
    constructor(method, route, handler, expressRouter) {
        this.#method = method.toLowerCase();
        this.#route = route;
        this.#handler = handler; // Menyimpan fungsi controller ke properti privat #handler
        this.#expressRouter = expressRouter;

        // Mengembalikan fungsi closure agar instance bisa dipanggil langsung sebagai fungsi: rute(expressRouter)
        return (router) => { 
            return this.#execute(router); 
        };
    }

    /**
     * Mengeksekusi pendaftaran rute ke router Express
     * @param {Object} router - Instance router dari Express luar
     */
    #execute(router) {
        // Deteksi otomatis apakah rute ini boleh diakses tanpa token (Public Route)
        const isPublicRoute = this.#route.includes('/login') || this.#route.includes('/register');

        switch (this.#method) {
            case "post": 
                if (isPublicRoute) {
                    return router.post(this.#route, this.#handler); // 🌟 FIX: Gunakan #handler, bukan #data
                } else {
                    return router.post(this.#route, AuthToken, this.#handler);
                }
            
            case "get": 
                if (isPublicRoute) {
                    return router.get(this.#route, this.#handler);
                } else {
                    return router.get(this.#route, AuthToken, this.#handler);
                }
                
            case "put": 
                if (isPublicRoute) {
                    return router.put(this.#route, this.#handler);
                } else {
                    return router.put(this.#route, AuthToken, this.#handler);
                }
                
            case "delete": 
                if (isPublicRoute) {
                    return router.delete(this.#route, this.#handler);
                } else {
                    return router.delete(this.#route, AuthToken, this.#handler);
                }
                
            default: 
                throw new Error(`Tolak Akses Method HTTP: [${this.#method}].`);
        }
    }

    /**
     * Method static pembantu pembentukan rute cepat
     */
    static generate(method, route, handler) { 
        return new BaseRoutes(method, route, handler); 
    }
}