import { DonorManager } from "@/core/managers/DonorManager";
import { FormError } from "@/core/utils/operation_result/FormError";
import { FormValidator } from "@/core/utils/FormValidator";
import { Responses } from "@/core/utils/Responses";
import { YupUtils } from "@/core/utils/YupUtils";
import { TopTypes } from "@/models/types/TopTypes";
import { NextRequest } from "next/server";
import * as yup from 'yup';

const donorManager = new DonorManager();

const getFormSchema = yup.object().shape(
    {
        type: yup.number().transform(YupUtils.convertToNumber).required().integer().positive().nonNullable().min(0).max( Object.keys(TopTypes).length /2 - 1),
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
    let donors;
    switch( formData.type )
    {
        case TopTypes.FREQUENCY_OF_DONATIONS:
            donors = await donorManager.getTopFrequencyOfDonationsDonors(formData.page,formData.pageSize)
            break;
        case TopTypes.TOTAL_VALUE_DONATED:
            donors = await donorManager.getTopTotalValueDonors(formData.page,formData.pageSize)
            break;
        case TopTypes.TOTAL_VALUE_DONATED:
            donors = await donorManager.getTopTotalValueDonors(formData.page,formData.pageSize)
            break;
        default:
            return Responses.createValidationErrorResponse([new FormError("type",["Invalid type of top."])],);
    }

    if(!donors.isOK)
        Responses.createNotFoundResponse();

    return Responses.createSuccessResponse();
}