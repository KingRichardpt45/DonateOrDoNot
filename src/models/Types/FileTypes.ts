/**
 * Enum representing the types of files or media used for identification or documentation purposes.
 *
 * @enum {number}
 */
export enum FileTypes {
    /**
     * Represents an image file, such as a photo or picture.
     */
    Image = 0,

    /**
     * Represents an identification document, such as an ID card or passport.
     */
    Identification = 1,

    /**
     * Represents a general document, such as a PDF, Word file, etc.
     */
    Document = 2,

    /**
     * Represents the main image file.
     */
    MainImage = 3,

    /**
     * Represents a video file.
     */
    Video = 4,
}