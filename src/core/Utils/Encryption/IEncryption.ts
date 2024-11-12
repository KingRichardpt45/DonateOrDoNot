/**
 * Represents an encryption utility interface.
 * The `IEncryption` interface defines methods for encrypting and decrypting data.
 * The constraints on the value parameters are handled by the implementing class.
 */
export interface IEncryption 
{
    /**
     * Encrypts the provided value.
     * 
     * @param value - The data to be encrypted. It can be of any type.
     * @returns The encrypted representation of the input value, typically as a string or encrypted binary.
     * 
     * @example
     * ```typescript
     * const encryptedData = encryptionInstance.encrypt("mySecretData");
     * console.log(encryptedData); // Output: (an encrypted string or binary data)
     * ```
     */
    encrypt(value: any): any;

    /**
     * Decrypts the provided encrypted value.
     * 
     * @param value - The encrypted data to be decrypted. It can be of any type, but typically matches
     * the type returned by the `encrypt` method.
     * @returns The decrypted original value of the input data.
     * 
     * @example
     * ```typescript
     * const decryptedData = encryptionInstance.decrypt(encryptedData);
     * console.log(decryptedData); // Output: "mySecretData" (original data)
     * ```
     */
    decrypt(value: any): any;
}