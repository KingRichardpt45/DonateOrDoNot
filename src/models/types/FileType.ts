/**
 * Enum representing the types of files or media used for identification or documentation purposes.
 *
 * @enum {number}
 */
export enum FileType {
    /**
     * Represents an unknown file type.
     */
    Unknown = 0,

    /**
     * Represents an image file, such as a photo or picture.
     */
    Image = 1,

    /**
     * Represents an identification document, such as an ID card or passport.
     */
    Identification = 2,

    /**
     * Represents a general document, such as a PDF, Word file, etc.
     */
    Document = 3,

    /**
     * Represents the main image file.
     */
    MainImage = 4,

    /**
     * Represents a video file.
     */
    Video = 5,
}