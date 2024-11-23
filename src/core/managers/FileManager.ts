import {File} from "@/models/File";
import {EntityManager} from "./EntityManager";
import {OperationResult} from "../utils/operation_result/OperationResult";
import {FormError} from "../utils/operation_result/FormError";
import { FileTypes } from "@/models/types/FileTypes";

export class FileManager extends EntityManager<File>
{
    constructor()
    {
        super(File);
    }

    public async create(
        originalName:string,
        filePath:string,
        fileSuffix:string,
        file_type:FileTypes,
        size:number,
        user_id:number,
        campaign_id:number | null = null,
    ): Promise<OperationResult<File | null, FormError>>
    {   

        const fileToCreate = new File();
        fileToCreate.original_name = originalName;
        fileToCreate.file_path = filePath;
        fileToCreate.file_suffix = fileSuffix;
        fileToCreate.file_type = file_type;
        fileToCreate.size = size;
        fileToCreate.timestamp = new Date();
        fileToCreate.campaign_id = campaign_id? campaign_id: null;
        fileToCreate.user_id = user_id;

        const errors : FormError[] = [];

        if( !fileToCreate.file_path || !fileToCreate.file_suffix || !fileToCreate.file_type || !fileToCreate.original_name || fileToCreate.size == null )
            throw new Error("Trying to create an invalid File. With has null fields.");
        
        const suffix = fileToCreate.file_suffix.toLocaleLowerCase();
        if( !["jpeg","png", "pdf"].find( (v) => suffix.includes(v) ) )
            errors.push( new FormError( "fileType" , [ "Invalid file type, only is allowed jpeg, png and pdf." ] ) );

        if ( fileToCreate.file_suffix.toLocaleLowerCase() in ["jpeg","png"] && fileToCreate.size > 52428800 )
            errors.push( new FormError( "fileSize" , [ "The maxim upload size of an image is 50MB." ] ) );
        
        if ( fileToCreate.file_suffix == "pdf" && fileToCreate.size > 31457280 )
            errors.push( new FormError( "fileSize" , [ "The maxim upload size of a document in pdf is 30MB." ] ) );

        if(errors.length > 0)
            return new OperationResult(null,errors);
        
        const createdFile = await this.repository.create(fileToCreate);
        return new OperationResult(createdFile,errors);
    } 
}