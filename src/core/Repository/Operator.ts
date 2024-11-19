/**
 * Enum representing comparison and pattern-matching operators.
 */
export enum Operator {
    /**
     * Represents the "less than" operator (`<`).
     * Used to check if the left operand is smaller than the right operand.
     */
    LESS = "<",

    /**
     * Represents the "less than or equal to" operator (`<=`).
     * Used to check if the left operand is smaller than or equal to the right operand.
     */
    LESS_EQUALS= "<=",

    /**
     * Represents the "greater than" operator (`>`).
     * Used to check if the left operand is greater than the right operand.
     */
    GREATER = ">",

    /**
     * Represents the "greater than or equal to" operator (`>=`).
     * Used to check if the left operand is greater than or equal to the right operand.
     */
    GREATER_EQUALS = ">=",

    /**
     * Represents the equality operator (`=`).
     * Used to check if the left operand is equal to the right operand.
     */
    EQUALS = "=",

    /**
     * Represents the inequality operator (`!=`).
     * Used to check if the left operand is not equal to the right operand.
     */
    NOT_EQUALS = "!=",

    /**
     * Represents the pattern-matching operator (`like`).
     * Used to check if the left operand matches a pattern defined by the right operand.
     */
    LIKE = "like"
}
