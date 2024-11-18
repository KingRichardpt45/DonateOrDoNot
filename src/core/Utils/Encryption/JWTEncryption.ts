import { IEncryption } from "@/core/utils/encryption/IEncryption";
import {SignJWT, jwtVerify, JWTPayload} from "jose"

export class JWTEncryption implements IEncryption
{
    private readonly encryptionKey : Uint8Array;

    constructor()
    {
        this.encryptionKey = new TextEncoder().encode(process.env.COOKIE_SECRET);
    }

    async encrypt(value: any) : Promise<string>
    {
        return await new SignJWT( value )
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime("1day")
            .sign(this.encryptionKey);
    }

    async decrypt(value: string | null): Promise<JWTPayload | null>
    {
        if (!value)
            return null;

        try 
        {
            const { payload } = await jwtVerify( value , this.encryptionKey , { algorithms : ["HS256"]} );

            return payload;
        } 
        catch (error) 
        {
            console.error(error);
            return null;
        }
    }

}