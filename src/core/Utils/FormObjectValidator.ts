import {FormError} from "@/core/managers/FormError";
import {StringUtils} from "./StringUtils";

/**
 * Class for validating form object.
 */
export class FormObjectValidator {
    private requiredFields: string[];

    /**
     * Constructor to initialize the required fields.
     * @param requiredFields Array of required field names.
     */
    constructor(...requiredFields: string[]) {
        this.requiredFields = requiredFields;
    }

    /**
     * Validates if the provided field are empty and if they exist.
     * @param data The object containing request data.
     * @param fields
     * @returns An array of missing values;
     */
    validateFormParams(data: FormData): FormError[] 
    {
        return this.validateParams(data);
    }

    validateSearchParams(searchparams:URLSearchParams)
    {
       return this.validateParams(searchparams);
    }

    private validateParams( data:{ get: (value:string) => any} ) : FormError[]
    {
        const missingFields: FormError[] = [];

        for (const field of this.requiredFields) {
            if (StringUtils.stringIsNullOrEmpty(data!.get(field)?.toString())) {
                missingFields.push(new FormError(field, [`The field can not be empty.`]));
            }
        }

        return missingFields;
    }

    /**
     * Checks if a value matches the expected type.
     * @param value The value to validate.
     * @param type The expected type ('string', 'number', or 'boolean').
     * @returns True if the value matches the type, otherwise false.
     */
   //private isValidType(value: any): boolean {
        // switch (type) {
        //     case 'string':
        //         return typeof value === 'string';
        //     case 'number':
        //         return !isNaN(Number(value));
        //     case 'boolean':
        //         return value === 'true' || value === 'false';
        //     default:
        //         return false; // Unknown types are invalid
        // }
   // }
}