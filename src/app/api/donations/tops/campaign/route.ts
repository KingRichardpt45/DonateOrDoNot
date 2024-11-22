import { DonationCampaignManager } from "@/core/managers/DonationCampaignManager";
import { FormObjectValidator } from "@/core/utils/FormObjectValidator";
import { FormValidator } from "@/core/utils/FormValidator";
import { Responses } from "@/core/utils/Responses";
import { YupUtils } from "@/core/utils/YupUtils";
import { NextRequest } from "next/server";
import * as yup from 'yup';

const donationCampaignManager = new DonationCampaignManager();

const getFormSchema = yup.object().shape(
    {
        id: yup.number().transform(YupUtils.convertToNumber).required().nonNullable().positive().integer(),
        page: yup.number().transform(YupUtils.convertToNumber).required().nonNullable().positive().integer(),
        pageSize: yup.number().transform(YupUtils.convertToNumber).required().nonNullable().positive().integer()
    }
);
const getFormValidator = new FormValidator(getFormSchema);

export async function GET( request : NextRequest )
{
    const {searchParams} = await request.nextUrl;
    const validatorResult = await getFormValidator.validate( Object.fromEntries( searchParams.entries() ) );
    if(! validatorResult.isOK )
        return Responses.createValidationErrorResponse(validatorResult.errors);
    
    const formData = validatorResult.value!;
    let donors = await donationCampaignManager.getTopDonors(formData.id,formData.page,formData.pageSize);
    
    if(!donors.isOK)
        return Responses.createNotFoundResponse();

    return Responses.createSuccessResponse(donors);
}