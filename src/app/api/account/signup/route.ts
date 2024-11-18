import {FormError} from "@/core/managers/FormError";
import {UserManager} from "@/core/managers/UserManager";
import {EnumFieldValidation as EnumUtils} from "@/core/utils/EnumFieldValidation";
import {FormObjectValidator} from "@/core/utils/FormObjectValidator";
import {Address} from "@/models/Address";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {User} from "@/models/User";
import {Services} from "@/services/Services";
import {SessionService} from "@/services/session/SessionService";
import {NextRequest, NextResponse} from "next/server";

const validatorUserForm = new FormObjectValidator(
    "name",
    "email",
    "password",
    "passwordConfirm",
    "postalCode",
    "city",
    "address",
    "addressSpecification",
    "type"
);

const validatorDonorForm = new FormObjectValidator(

);

const validatorCampaignManagerForm = new FormObjectValidator(

);

const userManager = new UserManager();
const sessionService = Services.getInstance().get<SessionService>("SessionService")

export async function POST(request: NextRequest) {
    if (await sessionService.verify())
        await sessionService.delete();

    const formData = await request.formData();
    const errors = validatorUserForm.validate(formData);

    if (errors.length > 0)
        return NextResponse.json({errors: errors}, {status: 422, statusText: "Invalid form fields."});

    const typeValue = EnumUtils.getEnumValue(UserRoleTypes, formData.get("type")!.toString());
    if (typeValue == null)
        return NextResponse.json({errors: [{errorMessage: "Invalid type for user."}]},
            {status: 400, statusText: "Invalid type for user."}
        );

    if (formData.get("password")!.toString() !== formData.get("passwordConfirm")!.toString())
        return NextResponse.json({errors: [new FormError("passwordConfirm", ["Password Confirmation doesn't match with password."])]},
            {status: 422, statusText: "Invalid form data."}
        );

    const user = setUserInfo(formData, typeValue as number);
    const result = await userManager.singUp(user);

    if (!result.isOK)
        return NextResponse.json({errors: result.errors}, {status: 422, statusText: "Invalid form data."});

    return NextResponse.json({}, {status: 200});
}

function mergeMiddleNames(names: string[]): string {
    if (names.length > 3) {
        let middle_names = "";
        for (let i = 1; i < names.length - 2; i++) {
            middle_names += names[i].trim() + " ";
        }
        middle_names += names[names.length - 2];
        return middle_names;
    } else
        return names[1];
}

function setUserInfo(formData: FormData, type: number): User {
    const user = new User();

    user.address.value = new Address();
    user.address.value.address = formData.get("address")!.toString().trim();
    user.address.value.specification = formData.get("addressSpecification")!.toString().trim();
    user.address.value.city = formData.get("city")!.toString().trim();
    user.address.value.postal_code = formData.get("postalCode")!.toString().trim();

    const names = formData.get("name")!.toString().split(" ");

    user.first_name = names[0].trim();
    if (names.length > 1) {
        user.middle_names = mergeMiddleNames(names);
        user.last_name = names[names.length - 1].trim();
    }

    user.email = (formData.get("email") as string).trim();
    user.type = type;
    user.password = (formData.get("password") as string).trim();

    return user;
}