/**
 * Represents a part of a composite primary key, consisting of a key name and its corresponding value.
 *
 * This class is used to store individual components (key-value pairs) of a composite primary key.
 * A composite primary key consists of multiple parts that together uniquely identify an entity.
 */
export class PrimaryKeyPart {
    /** The name of the key (e.g., "id", "userId", etc.). */
    readonly key: string;

    /** The value associated with the key (e.g., an ID value). */
    readonly value: any;

    /**
     * Constructs a `PrimaryKeyPart` instance.
     *
     * @param key - The name of the primary key (e.g., "id", "userId").
     * @param value - The value associated with the key (e.g., a unique identifier).
     */
    constructor(key: string, value: any) {
        this.key = key;
        this.value = value;
    }
}