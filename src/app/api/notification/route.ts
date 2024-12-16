
import {FormValidator} from "@/core/utils/FormValidator";
import {Responses} from "@/core/utils/Responses";
import {Services} from "@/services/Services";
import {NextRequest} from "next/server";
import * as yup from 'yup';
import {IAuthorizationService} from "@/services/session/authorizationService/IAuthorizationService";
import { NotificationManager } from "@/core/managers/NotificationManager";

const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");
const notificationManager = new NotificationManager();

const acknowledgeSchema = yup.object().shape({
    id: yup.number().required().integer().nonNullable().min(0)
});

const searchFormValidator = new FormValidator(acknowledgeSchema);

export async function POST(request: NextRequest) 
{
    
    const bodyData = await request.formData();
    const validatorResult = await searchFormValidator.validate(Object.fromEntries(bodyData.entries()));
    
    if (!validatorResult.isOK) {
        return Responses.createValidationErrorResponse(validatorResult.errors);
    }
    
    const userid = await authorizationService.getId();
    
    if(!userid)
        return Responses.createUnauthorizedResponse();

    const notification = await notificationManager.getById(validatorResult.value!.id);

    if(!notification)
        return Responses.createNotFoundResponse("The notification was not fount");

    if(notification.user_id != userid)
        return Responses.createForbiddenResponse("Only the target of the notification can acknowledge.");

    if ( await notificationManager.delete(notification) ) {
        return Responses.createSuccessResponse();
    } else {
        return Responses.createNotFoundResponse("No item where found with the provided search.");
    }
}
