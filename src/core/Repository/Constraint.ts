import {Operator} from "@/core/repository/Operator";

/**
 * Represents a constraint used in a query, typically for filtering data.
 *
 * This class is used to store the details of a constraint, including the key (column name),
 * the operator (e.g., "=", ">", "<"), and the value used for the comparison.
 */
export class Constraint {
    /** The name of the key or column (e.g., "age", "status", "userId"). */
    readonly key: string;

    /** The operator used for comparison (e.g., "=", ">", "<", ">=", "<=", "LIKE" , "!="). */
    readonly op: Operator;

    /** The value to be compared against the key using the specified operator. */
    readonly value: any;

    /**
     * Constructs a `Constraint` instance.
     *
     * @param key - The name of the key or column (e.g., "age", "status", "userId").
     * @param op - The operator to be used for comparison (e.g., "=", ">", "<", ">=", "<=", "LIKE" , "!=").
     * @param value - The value to compare the key against (e.g., a number, string, or boolean).
     */
    constructor(key: string, op: Operator, value: any) {
        this.key = key;
        this.op = op;
        this.value = value;
    }
}
