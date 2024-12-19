import * as yup from 'yup';
import fs, {FileReadResult} from "node:fs/promises";
import {File as ModelFile} from '@/models/File';
import path from "node:path";

/**
 * Service class to handle file operations such as save, load, update, and delete.
 * Ensures that file operations are properly validated and performed in a server-side context.
 */
export class FileService
{   
    /**
     * Yup schema for validating files. It checks the file size (should not exceed 50MB)
     * and file type (only JPEG and PNG images are allowed).
     */
    readonly filesSchema  =  yup.mixed().required()
                                    .test('name', 'The file is too large', (value) => {
                                        return value != null && (value as File).name != undefined;
                                    })
                                    .test('fileSize', 'The file is too large', (value) => {
                                        return value != null && (value as File).type != undefined;
                                    })
                                    .test('fileType', 'Unsupported file type', (value) => {
                                        return value != null && (value as File).type != undefined;
                                    })
                                    .test('arrayBytes', 'Unsupported file type', (value) => {
                                        return value != null && typeof (value as File).arrayBuffer === 'function';
                                    })

    readonly filesSchemaNotRequire  =  yup.mixed().notRequired()
                                    .test('name', 'The file is too large', (value) => {
                                        return value == null || (value as File).name != undefined;
                                    })
                                    .test('fileSize', 'The file is too large', (value) => {
                                        return value == null || (value as File).type != undefined;
                                    })
                                    .test('fileType', 'Unsupported file type', (value) => {
                                        return value == null || (value as File).type != undefined;
                                    })
                                    .test('arrayBytes', 'Unsupported file type', (value) => {
                                        return value == null || typeof (value as File).arrayBuffer === 'function';
                                    })

    readonly savePath : string;
    
    /**
     * Constructor to initialize the FileService with a directory path.
     * The directory path is resolved to an absolute path relative to the current working directory.
     * @param savePath - The relative path where files should be stored.
     */
    constructor(savePath:string)
    {
        this.savePath = path.resolve(process.cwd(), savePath);
    }

    /**
     * Initialize the FileService by checking if the directory exists.
     * If the directory does not exist, an error is thrown.
     * @throws {FileServiceError} - Throws error if directory does not exist.
     */
    async init(): Promise<void> 
    {
        try {
            await fs.access(this.savePath); 
        } catch (error) {
            throw new Error(`Directory does not exist: ${this.savePath}.`);
        }
    }

    /**
     * Save a file to the disk. This method converts the file to a buffer and writes it to the specified directory.
     * @param dbFile - The file model containing metadata for the file.
     * @param file - The actual file object to be saved.
     */
    async save(dbFile:ModelFile,file: File) : Promise<boolean>
    {
        try {
            const buffer = new Uint8Array( await file.arrayBuffer() );
                await fs.writeFile(`${this.savePath}/${dbFile.id}_${dbFile.original_name}`, buffer);
            return true;
        }
        catch(error)
        {
            console.error(`File Service: ${error}`);
            return false;
        }
    }

    
    /**
     * Load a file from the disk by reading its contents and returning a File object.
     * @param file - The model file containing the file's metadata.
     * @returns {File} - The File object representing the file read from disk.
     */
    async load(file:ModelFile) : Promise<File| null>
    {
        try {
            const byteArray = await fs.readFile(`${this.savePath}/${file.id}_${file.original_name}`);
            const uint8Array = new Uint8Array(byteArray);
            return new File ( [uint8Array] ,file.original_name!, { type:file.file_suffix! } );
        } catch (error) {
            console.error(`File Service: ${error}`);
            return null;
        }
    }

    /**
     * Create a readable stream for the file stored on disk.
     * @param file - The model file containing the file's metadata.
     * @returns {ReadableStream | null} - Returns a readable stream for the file, or null if the file does not exist.
     */
    async createStream(file: ModelFile): Promise<ReadableStream | null> 
    {
        try {
            const fileHandle = await fs.open(`${this.savePath}/${file.id}_${file.original_name}`, "r");
    
            return new ReadableStream(
                {
                    async start(controller) {
                        try {
                            const buffer = new Uint8Array(64 * 1024); // Read in 64KB chunks
                            let bytesRead: FileReadResult<Uint8Array>;
                            do
                            {
                                bytesRead = await fileHandle.read(buffer, 0, buffer.length);
                                controller.enqueue(buffer.subarray(0, bytesRead.bytesRead));
                            }
                            while(bytesRead.bytesRead > 0);

                            controller.close(); 
                            
                        } catch (error) 
                        {
                            console.error(`Error while streaming file: ${error}`);
                            controller.error(error); // Propagate error to the web stream
                        } finally {
                            await fileHandle.close();
                        }
                    },
                }
            );
        } catch (error) {
            console.error(`Failed to create stream for file: ${error}`);
            return null;
        }
    } 

    /**
     * Delete a file from the disk.
     * @param dbFile - The model file containing metadata of the file to be deleted.
     * @returns {boolean} - Returns true if the file was deleted successfully, false otherwise.
     */
    async delete(dbFile:ModelFile) : Promise<boolean>
    {
        try {
            await fs.unlink(`${this.savePath}/${dbFile.id}_${dbFile.original_name}`);
            return true;
        } 
        catch ( error ) 
        {
            console.error(`Failed to delete file: ${error}`);
            return false;
        }
    }

    /**
     * Update a file by deleting the old file and saving the new file in the same location.
     * @param oldDbFile - The old model file to be deleted.
     * @param newDbFile - The new model file with updated metadata.
     * @param file - The new file object to be saved.
     * @returns {boolean} - Returns true if the file was updated successfully, false otherwise.
     */
    async update( oldDbFile:ModelFile, newDbFile:ModelFile, file: File ) : Promise<boolean>
    {
        if ( !await this.delete(oldDbFile) )
            return false;

        return await this.save(newDbFile,file);
    }
}