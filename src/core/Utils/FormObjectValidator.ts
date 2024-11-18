import { FormError } from "../Managers/FormError";
import { StringUtils } from "./StringUtils";

/**
 * Class for validating form object.
 */
export class FormObjectValidator 
{
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
    validate( data : FormData ): FormError[]
    {
        const missingFields: FormError[] = [];

        for (const field of this.requiredFields ) 
        {
            if ( StringUtils.stringIsNullOrEmpty( data.get(field)?.toString() ) ) 
            {
                missingFields.push(new FormError(field,[`The field can not be empty.`]));
            }
        }

        return missingFields;
    }
}