import {User} from "@/models/User";
import {Constrain} from "../repository/Constrain";
import {IncludeNavigation} from "../repository/IncludeNavigation";
import {IPasswordValidation} from "@/services/IPasswordValidation";
import {Services} from "@/services/Services";
import {IEncryption} from "@/core/utils/encryption/IEncryption";
import {StringUtils} from "../utils/StringUtils";
import {AccountStatus} from "@/models/types/AccountStatus";
import {EntityManager} from "@/core/managers/EntityManager";
import {OperationResult} from "@/core/utils/operation_result/OperationResult";
import {FormError} from "@/core/utils/operation_result/FormError";
import {SimpleError} from "@/core/utils/operation_result/SimpleError";
import {Operator} from "@/core/repository/Operator";

export class UserManager extends EntityManager<User> {

    readonly passwordValidator: IPasswordValidation;
    readonly passwordEncryption: IEncryption;

    /**
     * Manages user-related operations such as registration (sign-up), authentication (sign-in),
     * and retrieval of user data. This class handles password validation, encryption,
     * and form error handling during user operations.
     */
    constructor() 
    {
        super(User);
        this.passwordValidator = Services.getInstance().get<IPasswordValidation>("IPasswordValidation");
        this.passwordEncryption = Services.getInstance().get<IEncryption>("PasswordEncryption");
    }

    /**
     * Registers a new user. Validates the user data (name, email, password) and encrypts the password.
     * If validation fails, errors are returned. If validation passes, the user is created.
     *
     * @param user - The User object to be created (must include at least name, email, and password).
     * @returns A promise that resolves to an OperationResult containing the created user or null, and any validation errors.
     */
    async signUp(user: User): Promise<OperationResult<User | null, FormError>> 
    {
        const errors: FormError[] = [];

        if (StringUtils.stringIsNullOrEmpty(user.first_name))
            errors.push(new FormError("name", ["A name must be provided!"]));

        if (StringUtils.stringIsNullOrEmpty(user.email))
            errors.push(new FormError("email", ["A email must be provided!"]));
        else 
        {
            const existingUserWithEmail = await this.getFirstByCondition([new Constrain("email", Operator.EQUALS, user.email)],(user) => [], [], 0, 0);

            if (existingUserWithEmail != null)
                errors.push(new FormError("email", ["A user with this email already exists!"]));
        }

        if (StringUtils.stringIsNullOrEmpty(user.password))
            errors.push( new FormError("password", ["A name must be provided!"]));
        else {
            const validationResult = await this.passwordValidator.validate(user.password);
            if (validationResult.length > 0)
                errors.push(new FormError("password", validationResult));
            else
                user.password = await this.passwordEncryption.encrypt(user.password);
        }

        user.status = AccountStatus.Pending;

        if (errors.length == 0) {
            user = await this.repository.create(user);
            return new OperationResult(user, errors);
        } else
            return new OperationResult(null, errors)
    }

    /**
     * Authenticates a user based on the provided email and password.
     *
     * @param email - The email of the user trying to sign in.
     * @param password - The plain-text password entered by the user.
     * @returns A promise that resolves to an OperationResult containing the authenticated user or null, and any errors.
     */
    async signIn(email: string, password: string): Promise<OperationResult<User | null, SimpleError>> 
    {
        const user = await this.repository.getFirstByCondition([new Constrain("email", Operator.EQUALS, email)],
            (user) => [new IncludeNavigation(user.address, 0)],
            [], 0, 0
        );

        if (user != null && await this.passwordEncryption.decrypt(user.password) === password)
            return new OperationResult(user, []);
        else
            return new OperationResult(null, [new SimpleError("Invalid Credentials.")]);
    }
}