import * as Yup from 'yup';
import { IPasswordValidation } from './IPasswordValidation';

export class PasswordValidation implements IPasswordValidation
{

    readonly passwordSchema = Yup.string()
        .min(8, 'Password must be at least 8 characters long.')
        .max(64,'Password must be at most 64 characters long.')
        .matches(/[A-Z]/, 'Password must contain an uppercase letter')
        .matches(/[a-z]/, 'Password must contain a lowercase letter')
        .matches(/\d/, 'Password must contain a number')
        .matches(/(?=.*[^\w\s])/, 'Password must contain a special character')
        .required('Password is required');
        
    async validate(password: string | null): Promise<string[]>
    {
        if (password === null) {
            return ["Password is required"];
        }
        try {
            await this.passwordSchema.validate( password );
            return [];
        } 
        catch (error)
        {
            if (error instanceof Yup.ValidationError) {
                return error.errors; 
            }
            else
            {
                console.error(error);
                return ["server error."]
            }
        }   
    }
}