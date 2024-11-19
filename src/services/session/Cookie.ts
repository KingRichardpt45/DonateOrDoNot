/**
 * Represents a Cookie with a name, options, and duration.
 */
export class Cookie {
    /**
     * The name of the cookie.
     */
    readonly name: string;

    /**
     * The options of the cookie, such as path, domain, secure flag, etc.
     */
    readonly options: any[];

    /**
     * The duration (in milliseconds) for which the cookie is valid.
     */
    readonly duration: number;

    /**
     * Creates an instance of the Cookie class.
     * @param {string} name - The name of the cookie.
     * @param {number} duration - The duration (in milliseconds) for which the cookie is valid.
     * @param {any} options - Additional options for the cookie (e.g., path, domain, secure).
     */
    constructor(name: string, duration: number, options: any) {
        this.name = name;
        this.options = options;
        this.duration = duration;
    }
}