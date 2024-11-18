export interface IPasswordValidation
{
    validate( password:string ) : Promise<string[]>
}