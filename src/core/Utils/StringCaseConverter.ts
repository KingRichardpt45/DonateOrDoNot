/**
 * A utility class for converting string cases.
 * The `StringCaseConverter` provides methods to convert strings to different cases,
 * such as snake_case.
 */
export class StringCaseConverter {
    /**
     * Converts a given string from camelCase or PascalCase to snake_case.
     *
     * @param str - The input string in camelCase or PascalCase format.
     * @returns The converted string in snake_case format.
     *
     * @example
     * ```typescript
     * const snakeCase = StringCaseConverter.convertToSnakeCase("myVariableName");
     * console.log(snakeCase); // Output: "my_variable_name"
     * ```
     */
    static convertCamelToSnake(str: string): string {
        return str
            .replace(/([a-z])([A-Z])/g, "$1_$2")
            .toLowerCase();
    }

    /**
     * Converts a given string from snake_case to camelCase.
     *
     * @param str - The input string in snake_case format.
     * @returns The converted string in camelCase format.
     *
     * @example
     * ```typescript
     * const camelCase = StringCaseConverter.convertSnakeToCamel("my_variable_name");
     * console.log(camelCase); // Output: "myVariableName"
     * ```
     */
    static convertSnakeToCamel(str: string): string {
        return str
            .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    }
}