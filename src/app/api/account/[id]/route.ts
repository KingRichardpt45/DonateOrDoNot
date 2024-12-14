import {Services} from "@/services/Services";
import {IAuthorizationService} from "@/services/session/authorizationService/IAuthorizationService";
import {NextRequest} from "next/server";
import {Responses} from "@/core/utils/Responses";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {UserManager} from "@/core/managers/UserManager";
import * as yup from "yup";
import {FormValidator} from "@/core/utils/FormValidator";
import {CampaignManagerTypes} from "@/models/types/CampaignManagerTypes";
import {FileService} from "@/services/FIleService";
import {EntityManager} from "@/core/managers/EntityManager";
import {Address} from "@/models/Address";
import {mergeMiddleNames} from "@/app/api/account/signup/route";
import {FileTypes} from "@/models/types/FileTypes";
import {FileManager} from "@/core/managers/FileManager";
import { CampaignManagerManager } from "@/core/managers/CampaignManagerManager";

const userManager = new UserManager();
const managersManager = new CampaignManagerManager();
const addressManager = new EntityManager<Address>(Address);

const fileService = Services.getInstance().get<FileService>("FileService");
const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");
const fileManager = new FileManager();

const updateAccountSchema = yup.object().shape({
    first_name: yup.string().trim().notRequired().nonNullable().min(1),
    middle_names: yup.string().trim().notRequired().nonNullable().min(1),
    last_name: yup.string().trim().notRequired().nonNullable().min(1),
    email: yup.string().trim().notRequired().nonNullable().min(1),
    password: yup.string().trim().notRequired().nonNullable().min(1),
    passwordConfirm: yup.string().trim().notRequired().nonNullable().min(1),
    postalCode: yup.string().trim().notRequired().nonNullable().min(1),
    city: yup.string().trim().notRequired().nonNullable().min(1),
    address: yup.string().trim().notRequired().nonNullable().min(1),
    addressSpecification: yup.string().trim().notRequired().nonNullable().min(1),
});
const updateAccountValidator = new FormValidator(updateAccountSchema);

const managerFormSchema = yup.object().shape({
    contactEmail: yup.string().trim().notRequired().nonNullable().min(1),
    description: yup.string().trim().notRequired().nonNullable().min(1).max(200),
    managerType: yup.number().notRequired().nonNullable().min(0).max(Object.keys(CampaignManagerTypes).length / 2 - 1),
    identificationFile: fileService.filesSchemaNotRequire,
});
const managerFormValidator = new FormValidator(managerFormSchema);

export async function PATCH(request: NextRequest, context: any) {
    const {params} = await context;

    if (!params?.id) {
        return Responses.createNotFoundResponse();
    }

    if (!await authorizationService.hasRoles(UserRoleTypes.Admin, UserRoleTypes.CampaignManager)) {
        return Responses.createForbiddenResponse();
    }

    const bodyData = await request.formData();
    const validatorResult = await updateAccountValidator.validate(Object.fromEntries(bodyData.entries()));

    if (!validatorResult.isOK)
        return Responses.createValidationErrorResponse(validatorResult.errors);

    const formData = validatorResult.value!;

    const user = await userManager.getById(params.id);
    if (!user) 
        return Responses.createNotFoundResponse();

    const updatedFields: string[] = [];

    if (formData.address || formData.addressSpecification || formData.city || formData.postalCode) 
    {
        if (user.address_id == null || user.address_id == 0) {
            console.log("Creating new address")
            const newAddress = new Address();
            newAddress.address = formData.address ?? null;
            newAddress.addressSpecification = formData.addressSpecification;
            newAddress.city = formData.city ?? null;
            newAddress.postalCode = formData.postalCode;

            const newAddressId = (await addressManager.add(newAddress)).id;
            user.address_id = newAddressId;
            updatedFields.push("address_id");
        } else {
            const address = await addressManager.getById(user.address_id)
            if (address != null) {
                address.address = formData.address ?? address.address;
                address.specification = formData.addressSpecification ?? address.specification;
                address.city = formData.city ?? address.city;
                address.postal_code = formData.postalCode ?? address.postal_code;
                await addressManager.update(address)
            } else {
                console.log("Creating new address")
                const newAddress = new Address();
                newAddress.address = formData.address ?? null;
                newAddress.addressSpecification = formData.addressSpecification;
                newAddress.city = formData.city ?? null;
                newAddress.postalCode = formData.postalCode;

                const newAddressId = (await addressManager.add(newAddress)).id;
                console.log("Creating new address")
                user.address_id = newAddressId;
                updatedFields.push("address_id");
            }
        }
    }

    if ( user.type == UserRoleTypes.CampaignManager ) 
    {
        const managerValidatorResult = await managerFormValidator.validate(Object.fromEntries(bodyData.entries()));
        if (!managerValidatorResult.isOK) {
            return Responses.createValidationErrorResponse(managerValidatorResult.errors);
        }

        const manager = await managersManager.getById(user.id!);
        if(!manager)
            return Responses.createServerErrorResponse("Invalid account user is Campaign manager but there is no manger with user id.");

        const formDataManager = managerValidatorResult.value!;
        let updateManagerFields : string[] = []

        for (const key in formDataManager) 
        {
            if (key == "identificationFile" ) 
            {
                const manager = await managersManager.getById(user.id!);
                if(!manager)
                    return Responses.createServerErrorResponse("Invalid account user is Campaign manager but there is no manger with user id.");
        
                const uploadedFile = formDataManager.identificationFile! as File;
                const fileResult = await fileManager.create(uploadedFile.name, fileService.savePath, uploadedFile.type, FileTypes.Identification, uploadedFile.size, user.id!);
                if ( !fileResult.isOK) 
                    return Responses.createValidationErrorResponse(fileResult.errors);
                
                const oldIdentificationFile = await fileManager.getById(manager.identification_file_id!)
                if( oldIdentificationFile )
                {
                    const result = await fileService.update( oldIdentificationFile , fileResult.value!, uploadedFile);
                    if(!result)
                        return Responses.createServerErrorResponse("Could not update the identification file.");
                }
        
                await fileManager.deleteById(manager.identification_file_id!);
                manager.identification_file_id = fileResult.value!.id
                updateManagerFields.push("identification_file_id");
                
            }
            else if (formDataManager[key as keyof typeof formDataManager] == null) continue;
            else
            {
                user[key] = formDataManager[key as keyof typeof formDataManager];
                updateManagerFields.push(key);
            }
            
        }

        if ( ! await managersManager.updateField(manager,updateManagerFields) )
            return Responses.createServerErrorResponse("Could not update file id in manager account.");
    }

    for (const key in formData) 
    {
        if ( user[key] === undefined ) continue;

        user[key] = formData[key as keyof typeof formData];
        updatedFields.push(key);
    }

    if (updatedFields.length === 0) {
        return Responses.createValidationErrorResponse(["Id cannot be updated.", "No other fields to update."], "No fields for update.");
    }

    console.log(updatedFields)

    const result = await userManager.updateField(user, updatedFields);

    if (!result) 
        return Responses.createServerErrorResponse();
    else
        return Responses.createSuccessResponse({}, "Account Updated.");
}

export async function DELETE(req:NextRequest, context: any) {
    const {params} = context;

    if (!params?.id) {
        return Responses.createNotFoundResponse();
    }

    const userId = await authorizationService.getId();
    if (userId == null) return Responses.createUnauthorizedResponse();

    const isAdmin = await authorizationService.hasRole(UserRoleTypes.Admin);

    if (!isAdmin && userId != params.id) return Responses.createForbiddenResponse();

    if (await userManager.deleteById(params.id)) 
        return Responses.createSuccessResponse(); 
    else 
        return Responses.createNotFoundResponse();
}


export async function POST(req:NextRequest,context: any) 
{
    const {params} = await context;

    if( ! await authorizationService.hasRole(UserRoleTypes.Admin) )
        return Responses.createForbiddenResponse("Only admin can change verified State")

    if( !params?.id )
        return Responses.createBadRequestResponse();

    const manager = await managersManager.getById(params.id);

    if(!manager)
        return Responses.createNotFoundResponse("Manager not fount " + params.id);

    manager.verified = true;
    
    if ( await managersManager.updateField(manager,["verified"]) )
        return Responses.createSuccessResponse(`Manager ${manager.id} is now verified.` );
    
    return Responses.createServerErrorResponse(`Could't change ${manager.id} verified state.`)
}