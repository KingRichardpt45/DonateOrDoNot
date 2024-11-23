import {NextRequest, NextResponse} from "next/server";
import {DonationCampaignManager} from "@/core/managers/DonationCampaignManager";
import {Campaign} from "@/models/Campaign";
import { FormValidator } from "@/core/utils/FormValidator";
import * as yup from 'yup';
import { Responses } from "@/core/utils/Responses";
import { BankAccountManager } from "@/core/managers/BankAccountManager";
import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { CampaignStatus } from "@/models/types/CampaignStatus";
import { YupUtils } from "@/core/utils/YupUtils";
import { Constrain } from "@/core/repository/Constrain";
import { Operator } from "@/core/repository/Operator";

const donationCampaignManager = new DonationCampaignManager();
const bankManager = new BankAccountManager();
const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");

const putFormSchema = yup.object().shape(
    {
        title: yup.string().trim().required().nonNullable().min(1).max(200),
        description: yup.string().trim().required().nonNullable().min(1).max(2000),
        objective_value: yup.number().required().nonNullable().positive().min(0),
        category: yup.string().trim().required().nonNullable(),
        end_date: yup.date().required().nonNullable().min(new Date(),"End date must be in the future"),
        contact_email: yup.string().trim().required().nonNullable(),
        contact_phone_number:  yup.string().trim().required().nonNullable(),
        campaign_manager_id: yup.number().required().nonNullable().positive().integer().min(0),
        bankAccount: yup.object(
                        {
                            iban: yup.string().trim().required().nonNullable().min(1).max(34),
                            account_holder: yup.string().trim().required().nonNullable(),
                            bank_name: yup.string().trim().required().nonNullable(),
                        }
                    ).required().nonNullable(),
    }
);
const putFormValidator = new FormValidator(putFormSchema);

export async function PUT(request: NextRequest) 
{
    const bodyData = await request.formData();
    const validatorResult = await putFormValidator.validate( Object.fromEntries( bodyData.entries() ) );

    if(!validatorResult.isOK)
        return Responses.createValidationErrorResponse(validatorResult.errors);

    const formData = validatorResult.value!;
    const bankAccount = await bankManager.create(formData.bankAccount.iban,formData.bankAccount.account_holder,formData.bankAccount.account_holder);

    const campaignResult = await donationCampaignManager.create(
                                    formData.title,
                                    formData.description,
                                    formData.objective_value,
                                    formData.category,
                                    formData.end_date,
                                    formData.contact_email,
                                    formData.contact_phone_number,
                                    1,
                                    formData.campaign_manager_id,
                                    bankAccount.id
                                );



    if (!campaignResult.isOK)
        return Responses.createValidationErrorResponse(campaignResult.errors);

    return Responses.createSuccessResponse(campaignResult.value);
}

const updateFormSchema = yup.object().shape(
    {
        id: yup.number().required().nonNullable().integer().positive().min(0),
        title: yup.string().trim().nonNullable().min(1).max(200),
        description: yup.string().trim().nonNullable().min(1).max(2000),
        objective_value: yup.number().nonNullable().positive().min(0),
        category: yup.string().trim().nonNullable(),
        end_date: yup.date().nonNullable().min(new Date(),"End date must be in the future"),
        contact_email: yup.string().trim().nonNullable(),
        contact_phone_number:  yup.string().trim().nonNullable(),
        status: yup.number().nonNullable().integer().positive().min(0).max( Object.keys(CampaignStatus).length /2 -1 ),
    }
);
const updateFormValidator = new FormValidator(updateFormSchema);

export async function PATCH( request: NextRequest ) 
{
    const user = await userProvider.getUser();
    if( ! user || ( user.type != UserRoleTypes.Admin && user.type != UserRoleTypes.CampaignManager )  )
        return Responses.createForbiddenResponse();

    const { searchParams } = request.nextUrl;
    const validatorResult = await updateFormValidator.validate( Object.fromEntries(searchParams.entries()) );

    if(!validatorResult.isOK)
        return Responses.createValidationErrorResponse(validatorResult.errors);
    
    const formData = validatorResult.value!;
    const campaign = await donationCampaignManager.getById(formData.id);
    if(campaign == null)
        return Responses.createNotFoundResponse();

    if( campaign.campaign_manager_id !== user.id && user.type != UserRoleTypes.Admin)
        return Responses.createForbiddenResponse("Only the creator of the campaign or the admin can update.");

    if( formData.status && 
        ( formData.status in [CampaignStatus.Approved,CampaignStatus.Reproved,CampaignStatus.InAnalysis] ) &&
        user.type != UserRoleTypes.Admin
    ) 
        return Responses.createForbiddenResponse();

    const updatedFields = [];
    for (const key in formData) 
    {   
        campaign[key] = formData[key as keyof typeof formData];
        updatedFields.push(key);
    }

    if(updatedFields.length == 0)
        return Responses.createValidationErrorResponse(["Id can not be updated.","No other fields to update."],"No fields for updated.");

    const result = await donationCampaignManager.updateField(campaign,updatedFields);

    if ( result )
        return Responses.createServerErrorResponse();

    return Responses.createSuccessResponse();
}

const searchFormSchema = yup.object().shape(
    {
        query: yup.string().lowercase().trim().required().nonNullable().min(1),
        page: yup.number().transform(YupUtils.convertToNumber).required().integer().positive().nonNullable(),
        pageSize: yup.number().transform(YupUtils.convertToNumber).required().integer().positive().nonNullable(),
        category: yup.string().trim().nonNullable().min(1),
        value: yup.number().transform(YupUtils.convertToNumber).positive().nonNullable(),
    }
);
const searchFormValidator = new FormValidator(searchFormSchema);

export async function GET( request:NextRequest )
{
    const { searchParams } = request.nextUrl;
    const validatorResult = await searchFormValidator.validate( Object.fromEntries(searchParams.entries()) );

    if(!validatorResult.isOK)
        return Responses.createValidationErrorResponse(validatorResult.errors);

    const formData = validatorResult.value!;
    const constrains : Constrain[] = []

    if(formData.value)
        constrains.push(new Constrain("objective_value",Operator.GREATER_EQUALS,formData.value));

    if(formData.category)
        constrains.push(new Constrain("category",Operator.EQUALS,formData.category));

    const result = await donationCampaignManager.searchWithConstrains(formData.query,constrains,formData.page,formData.pageSize);

    if(result.isOK)
        return Responses.createSuccessResponse(result.value);
    else
        return Responses.createNotFoundResponse("No item where found with the provided search.");
}