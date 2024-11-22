import {AnyObject, ObjectSchema , ValidationError}  from 'yup';
import { OperationResult } from '../managers/OperationResult';
import { FormError } from '../managers/FormError';

/**
 * Class that validates an object against a Yup schema and processes validation errors.
 * An Adapter class for the result of Yup.
 */
export class FormValidator<T extends AnyObject>
{   
     // The Yup schema that will be used for validation.
    private readonly schema: ObjectSchema<T>;

    /**
     * Creates an instance of FormObjectValidator.
     * @param schema The Yup schema to use for validation.
     */
    constructor( schema:ObjectSchema<T>  )
    {
        this.schema = schema;
    }

    /**
     * Validates the provided object against the Yup schema.
     * @param object The object to be validated.
     * @param abortEarly A flag that determines whether validation should stop at the first error. Default is false.
     * @returns A promise containing an OperationResult, which includes the validated object or null on failure,
     *          and an array of FormError objects if validation fails.
     */
    async validate( object:any ,abortEarly:boolean = false ) : Promise< OperationResult< T | null, FormError > >
    {
        try
        {
            const result = await this.schema.validate(object, {abortEarly} ) as T;
            return new OperationResult( result, []);
        }
        catch( validationError )
        {
            if ( validationError instanceof ValidationError ) 
                return new OperationResult( null , this.convertErrors(validationError.errors) );
            else 
            {
                throw validationError;
            }
        }
    }

    /**
     * Converts an array of validation error messages into a structured array of FormError objects.
     * @param validationErrors An array of error messages returned by Yup validation.
     * @returns An array of FormError objects, each containing a field name and its respective error messages.
     */
    private convertErrors( validationErrors:string[] ): FormError[]
    {
        const formErrors = []
        let field,errorText,lastField;
        let index=0;
        let formFieldErrors :string[] = [];
        let count = 0;
        for (const error of validationErrors) 
        {
            index = error.indexOf(" ");
            field = error.slice(0, index);
            errorText = error.slice( index + 1 );
            formFieldErrors.push(errorText);
            
            if( lastField !== field )
            {
                formErrors.push( new FormError(field,formFieldErrors) );
                formFieldErrors = [];
            }

            lastField = field;
            count++;
        }

        return formErrors;
    }
}