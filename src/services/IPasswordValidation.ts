/**
 * Interface for password validation class
 */
export interface IPasswordValidation {
    /**
     * Verifies if the provided password has the minium requirements.
     *
     * @param {string} password the password to validate;
     */
    validate(password: string | null): Promise<string[]>
}