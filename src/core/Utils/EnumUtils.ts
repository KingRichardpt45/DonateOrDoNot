/**
 * Class containing methods to validate and interact with Enum values.
 */
export class EnumUtils {
    /**
     * Checks if a field exists in the given enumeration and returns its value.
     * @param enumeration The enumeration object to check.
     * @param field The field (key) name to look for within the enumeration.
     * @returns The value of the field if it exists, or `null` if the field is not found.
     *
     * @example
     * enum MyEnum {
     *     FIELD_ONE = "value1",
     *     FIELD_TWO = "value2",
     * }
     * const result = EnumFieldValidation.hasField(MyEnum, "FIELD_ONE"); // returns "value1"
     * const missingResult = EnumFieldValidation.hasField(MyEnum, "FIELD_THREE"); // returns null
     */
    static getEnumValue<T>(enumType: T, value: string): number | null {
        const array = Object.values(enumType as object) as string[];
        for (let index = 0; index < array.length; index++) {
            if ((enumType as [])[index] == value) {
                return index;
            }
        }

        return null;
    }
}