import { DonorStoreItemManager } from "@/core/managers/DonorStoreItemManager";
import { FormValidator } from "@/core/utils/FormValidator";
import { Responses } from "@/core/utils/Responses";
import { YupUtils } from "@/core/utils/YupUtils";
import { NextRequest } from "next/server";
import * as yup from 'yup';

const donorItemManager = new DonorStoreItemManager();


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
    const donationsResult = await donorItemManager.getItemsOfDonor(formData.donor_id, formData.page, formData.pageSize);

    if (!donationsResult.isOK) {
        return Responses.createValidationErrorResponse(donationsResult.errors);
    }

    return Responses.createSuccessResponse(donationsResult.value);
}