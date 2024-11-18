import { IEncryption } from "./IEncryption";
import crypto from 'crypto';

/**
 * Class that implements encryption and decryption of values using AES-256-CBC.
 * This class is responsible for securely encrypting and decrypting data, typically used for storing sensitive information such as passwords.
 */
export class PasswordEncryption implements IEncryption
{
    // AES encryption algorithm
    private readonly algorithm = 'aes-256-cbc';

    // Buffer to store the encryption key
    private readonly key: Buffer;

    // Length of the initialization vector (IV) used for AES encryption (16 bytes for AES-256-CBC)
    private readonly ivLength = 16;

     /**
     * Constructor for PasswordEncryption class.
     * 
     * @param {string} encryptionKey  The key to use in encryption and decryption
     * 
     * @throws Throws an error if the key is not set or is not exactly 32 characters long.
     */
    constructor(encryptionKey:string) 
    {
        if (!encryptionKey || encryptionKey.length !== 32) {
            throw new Error('ENCRYPTION_KEY must be set in environment variables and be 32 characters long.');
        }

        this.key = Buffer.from(encryptionKey, 'utf8');
    }

    async encrypt(value: any): Promise<string> 
    {
        const iv = crypto.randomBytes(this.ivLength); // Generate a random IV
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

        let encrypted = cipher.update(JSON.stringify(value), 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return `${iv.toString('hex')}:${encrypted}`;
    }

    async decrypt(encrypted: any): Promise<any> 
    {
        const [ivHex, cipherText] = encrypted.split(':');
        if (!ivHex || !cipherText) {
            throw new Error('Invalid encrypted value format.');
        }

        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);

        let decrypted = decipher.update(cipherText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return JSON.parse(decrypted);
    }
}