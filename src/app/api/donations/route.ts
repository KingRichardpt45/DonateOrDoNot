import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {Services} from "@/services/Services";
import {IAuthorizationService} from "@/services/session/authorizationService/IAuthorizationService";
import {NextRequest} from "next/server";
import {DonationManager} from "@/core/managers/DonationManager";
import {FormValidator} from "@/core/utils/FormValidator";
import * as yup from 'yup';
import {Responses} from "@/core/utils/Responses";
import {YupUtils} from "@/core/utils/YupUtils";
import { NotificationManager } from "@/core/managers/NotificationManager";
import { ReceivedDonacoins } from "@/models/notifications/ReceivedDonacoins";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { DonationCampaignManager } from "@/core/managers/DonationCampaignManager";
import { NewDonationTargetReachedNotification } from "@/models/notifications/NewDonationTargetReachedNotification";
import { RetransmissionEvent } from "@/services/hubs/events/RetransmissionEvent";
import { RoomIdGenerator } from "@/services/hubs/notificationHub/RoomIdGenerator";
import { CampaignNewDonation } from "@/services/hubs/events/CampaignNewDonation";

const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");
const iUserProvider = Services.getInstance().get<IUserProvider>("IUserProvider");
const donationManager = new DonationManager();

const donationCampaignManager = new DonationCampaignManager();

const putFormSchema = yup.object().shape({
    campaign_id: yup.number().required().nonNullable().positive().integer(),
    donor_id: yup.number().required().nonNullable().positive().integer(),
    comment: yup.string().required().nonNullable().trim().min(1).max(2000),
    value: yup.number().required().nonNullable().positive(),
    nameHidden: yup.boolean().required().nonNullable(),
});

const putFormValidator = new FormValidator(putFormSchema);

export async function PUT(request: NextRequest) 
{
    const notificationManager = new NotificationManager();

    const user = await iUserProvider.getUser()
    if (!user) 
        return Responses.createForbiddenResponse();

    if(user.type != UserRoleTypes.Donor)
        return Responses.createUnauthorizedResponse();

    const formBody = await request.formData();
    const validatorResult = await putFormValidator.validate(Object.fromEntries(formBody.entries()));
    if (!validatorResult.isOK) {
        return Responses.createValidationErrorResponse(validatorResult.errors);
    }

    const formData = validatorResult.value!;

    const campaign = await donationCampaignManager.getById(formData.campaign_id);
    if(!campaign)
        return Responses.createNotFoundResponse("No campaign found with id" + formData.campaign_id.toString() )

    const result = await donationManager.create(formData.campaign_id, formData.donor_id, formData.comment, formData.value, formData.nameHidden);
    campaign.current_donation_value! += formData.value;

    if (!result.isOK) 
        return Responses.createValidationErrorResponse(result.errors);

    
    
    await notificationManager.hubConnection.addAfterConnectionHandler(  async ()=> {

        await notificationManager.sendNotification(
            new ReceivedDonacoins( 
                user.id!,
                result.value!.value! * donationManager.getDonacoinsPerDonationFactor(),
                "donating") 
        )
        
        if( campaign.last_notified_value! - campaign.current_donation_value! >= campaign.interval_notification_value! )
        {
            console.log("test");
            await notificationManager.sendNotification(
                new NewDonationTargetReachedNotification( 
                    campaign.campaign_manager_id!,
                    campaign.id!,
                    campaign.current_donation_value! / campaign.objective_value!, 
                    campaign.title!) 
            )
        }
        
        console.log("sended");
            await notificationManager.hubConnection.emitEvent(
                new RetransmissionEvent( { 
                    toConnection:null,
                    toRom:RoomIdGenerator.generateCampaignRoom(campaign.id!),
                    originalEvent:new CampaignNewDonation(campaign)
                })
            )

        notificationManager.hubConnection.disconnect();
    } 
    )

    return Responses.createSuccessResponse(result.value);
}


const getFormSchema = yup.object().shape({
    donor_id: yup.number().transform(YupUtils.convertToNumber).required().nonNullable().positive().integer(),
    pageSize: yup.number().transform(YupUtils.convertToNumber).required().nonNullable().integer().positive(),
    page: yup.number().transform(YupUtils.convertToNumber).required().nonNullable().integer().positive().min(0),
});

const getFormValidator = new FormValidator(getFormSchema);

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const validatorResult = await getFormValidator.validate(Object.fromEntries(searchParams.entries()), false);
    if (!validatorResult.isOK) {
        return Responses.createValidationErrorResponse(validatorResult.errors);
    }

    const formData = validatorResult.value!;
    const donationsResult = await donationManager.getDonationsOfDonor(formData.donor_id, formData.page, formData.pageSize);

    if (!donationsResult.isOK) {
        return Responses.createValidationErrorResponse(donationsResult.errors);
    }

    return Responses.createSuccessResponse(donationsResult.value);
}