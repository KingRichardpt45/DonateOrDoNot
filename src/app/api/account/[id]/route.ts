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

const userManager = new UserManager();
const addressManager = new EntityManager<Address>(Address);

const fileService = Services.getInstance().get<FileService>("FileService");
const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");
const fileManager = new FileManager();

const updateAccountSchema = yup.object().shape({
    name: yup.string().trim().nullable().min(1),
    first_name: yup.string().trim().nullable().min(1),
    middle_names: yup.string().trim().nullable().min(1),
    last_name: yup.string().trim().nullable().min(1),
    email: yup.string().trim().nullable().min(1),
    password: yup.string().trim().nullable().min(1),
    passwordConfirm: yup.string().trim().nullable().min(1),
    postalCode: yup.string().trim().nullable().min(1),
    city: yup.string().trim().nullable().min(1),
    address: yup.string().trim().nullable().min(1),
    addressSpecification: yup.string().trim().nullable().min(1),
    type: yup.number().nullable().min(0).max(1),
});
const updateAccountValidator = new FormValidator(updateAccountSchema);

const managerFormSchema = yup.object().shape({
    contactEmail: yup.string().trim().nullable().min(1),
    description: yup.string().trim().nullable().min(1).max(200),
    managerType: yup.number().nullable().min(0).max(Object.keys(CampaignManagerTypes).length / 2 - 1),
});
const managerFormValidator = new FormValidator(managerFormSchema);

const fileFormSchema = yup.object().shape({
    identificationFile: fileService.filesSchema.nullable(),
});
const fileFormValidator = new FormValidator(fileFormSchema);

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

    if (!validatorResult.isOK) {
        return Responses.createValidationErrorResponse(validatorResult.errors);
    }

    const formData = validatorResult.value;

    if (formData == null) {
        return Responses.createBadRequestResponse();
    }

    const user = await userManager.getById(params.id);
    if (!user) {
        return Responses.createNotFoundResponse();
    }

    console.log(bodyData)
    const updatedFields: string[] = [];

    if (bodyData.has("identificationFile")) {
        const fileValidatorResult = await fileFormValidator.validate(Object.fromEntries(bodyData.entries()));

        if (!fileValidatorResult.isOK) {
            return Responses.createValidationErrorResponse(fileValidatorResult.errors);
        }

        const fileFormData = fileValidatorResult.value;

        if (fileFormData == null) {
            return Responses.createBadRequestResponse();
        }

        if (fileFormData.identificationFile) {
            const uploadedFile = fileFormData.identificationFile as File;
            console.log(uploadedFile)
            const fileResult = await fileManager.create(uploadedFile.name, fileService.savePath, uploadedFile.type, FileTypes.Identification, uploadedFile.size, user.id!);
            console.log(fileResult)
            if (!fileResult || !fileResult.isOK) {
                return Responses.createValidationErrorResponse(fileResult.errors);
            }

            user.profile_image_id = fileResult.value!.id;
            updatedFields.push("profile_image_id")
        }
    }


    if (formData.address || formData.addressSpecification || formData.city || formData.postalCode) {
        if (user.address_id == null || user.address_id == 0) {
            console.log("Creating new address")
            const newAddress = new Address();
            newAddress.address = formData.address ?? null;
            newAddress.addressSpecification = formData.addressSpecification;
            newAddress.city = formData.city ?? null;
            newAddress.postalCode = formData.postalCode;

            const newAddressId = (await addressManager.add(newAddress)).id;
            user.address_id = newAddressId;
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
                console.log("Creating new addressa")
                user.address_id = newAddressId;
            }
        }
        formData.address = null;
        formData.addressSpecification = null;
        formData.city = null;
        formData.postalCode = null;
    }

    if (formData.name) {
        const names = formData.name.split(" ");
        formData.first_name = names[0].trim();
        if (names.length > 1) {
            formData.middle_names = mergeMiddleNames(names);
            formData.last_name = names[names.length - 1].trim();
        }
        formData.name = null;
    }

    for (const key in formData) {
        if (key == "identificationFile") continue
        if (formData[key as keyof typeof formData] == null) continue;

        user[key] = formData[key as keyof typeof formData];
        updatedFields.push(key);
    }

    if (user.type == UserRoleTypes.CampaignManager || formData.type == UserRoleTypes.CampaignManager) {
        const managerValidatorResult = await managerFormValidator.validate(Object.fromEntries(bodyData.entries()));
        if (!managerValidatorResult.isOK) {
            return Responses.createValidationErrorResponse(managerValidatorResult.errors);
        }

        const formDataManager = managerValidatorResult.value;

        if (formDataManager == null) {
            return Responses.createBadRequestResponse();
        }

        for (const key in formDataManager) {
            if (key == "identificationFile") continue
            if (formDataManager[key as keyof typeof formDataManager] == null) continue;

            user[key] = formDataManager[key as keyof typeof formDataManager];
            updatedFields.push(key);
        }
    }

    if (updatedFields.length === 0) {
        return Responses.createValidationErrorResponse(["Id cannot be updated.", "No other fields to update."], "No fields for update.");
    }

    console.log(updatedFields)

    const result = await userManager.updateField(user, updatedFields);

    if (!result) {
        return Responses.createServerErrorResponse();
    }

    return Responses.createSuccessResponse({}, "Account Updated.");
}

export async function DELETE(context: any) {
    const {params} = context;

    if (!params?.id) {
        return Responses.createNotFoundResponse();
    }

    const userId = await authorizationService.getId();
    if (userId == null) return Responses.createUnauthorizedResponse();

    const isAdmin = await authorizationService.hasRole(UserRoleTypes.Admin);

    if (!isAdmin && userId != params.id) return Responses.createForbiddenResponse();

    if (await userManager.deleteById(params.id)) return Responses.createSuccessResponse(); else return Responses.createNotFoundResponse();
}
