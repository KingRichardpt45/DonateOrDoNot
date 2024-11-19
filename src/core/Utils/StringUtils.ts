/**
 * This class contains methods for working with strings.
 */
export class StringUtils {
    /**
     * Evaluates a string if is null or empty.
     * @param {string} value the string to evaluate.
     * @returns
     */
    static stringIsNullOrEmpty(value: string | null | undefined) {
        value = value?.replace(" ", "");
        return value === "" || value === null || value === undefined;
    }
}