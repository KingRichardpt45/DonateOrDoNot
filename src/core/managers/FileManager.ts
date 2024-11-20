import {File} from "@/models/File";
import {EntityManager} from "./EntityManager";
import {OperationResult} from "./OperationResult";
import {FormError} from "./FormError";

export class FileManager extends EntityManager<File>
{
    constructor()
    {
        super(File);
    }

    public async createWithValidation( file : File ): Promise<OperationResult<File | null, FormError>>
    {   
        const errors : FormError[] = [];
        
        if( !file.file_path || !file.file_suffix || !file.file_type || !file.original_name || file.size == null )
            throw new Error("Trying to create an invalid File. With has null fields.");
        
        const suffix = file.file_suffix.toLocaleLowerCase();
        if( !["jpeg","png", "pdf"].find( (v) => suffix.includes(v) ) )
            errors.push( new FormError( "fileType" , [ "Invalid file type, only is allowed jpeg, png and pdf." ] ) );

        if ( file.file_suffix.toLocaleLowerCase() in ["jpeg","png"] && file.size > 52428800 )
            errors.push( new FormError( "fileSize" , [ "The maxim upload size of an image is 50MB." ] ) );
        
        if ( file.file_suffix == "pdf" && file.size > 31457280 )
            errors.push( new FormError( "fileSize" , [ "The maxim upload size of a document in pdf is 30MB." ] ) );

        if(errors.length > 0)
            return new OperationResult(null,errors);
        
        const createdFile = await this.repository.create(file);
        return new OperationResult(createdFile,errors);
    } 
}