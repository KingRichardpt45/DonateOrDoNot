import {UserManager} from "@/core/managers/UserManager";
import {FormValidator} from "@/core/utils/FormValidator";
import {Responses} from "@/core/utils/Responses";
import {Services} from "@/services/Services";
import {SessionService} from "@/services/session/SessionService";
import {NextRequest} from "next/server";
import * as yup from 'yup';


const sessionService = Services.getInstance().get<SessionService>("SessionService")
const userManager = new UserManager();

const redirectOnSuccessLogin = "/"

const postFormSchema = yup.object().shape(
    {
        email: yup.string().trim().required().nonNullable().min(1),
        password: yup.string().trim().required().nonNullable().min(1)
    }
);
const postFormValidator = new FormValidator(postFormSchema);

export async function POST(request: NextRequest) {
    const session = await sessionService.verify()
    if (session != null && session.expires >= new Date())
        return Responses.createRedirectResponse(redirectOnSuccessLogin, request);

    const formBody = await request.formData();
    const validatorResult = await postFormValidator.validate(Object.fromEntries(formBody.entries()));

    if (!validatorResult.isOK)
        return Responses.createValidationErrorResponse(validatorResult.errors);

    const formData = validatorResult.value!;
    const result = await userManager.signIn(formData.email, formData.password);

    if (!result.isOK)
        return Responses.createValidationErrorResponse(result.errors);

    const newSession = await sessionService.create(result.value!.id!);

    return Responses.createSuccessResponse();
}