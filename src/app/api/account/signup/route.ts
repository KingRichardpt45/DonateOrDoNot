import {DonorManager} from "@/core/managers/DonorManager";
import {FormError} from "@/core/utils/operation_result/FormError";
import {UserManager} from "@/core/managers/UserManager";
import {Address} from "@/models/Address";
import {CampaignManager} from "@/models/CampaignManager";
import {Donor} from "@/models/Donor";
import {CampaignManagerTypes} from "@/models/types/CampaignManagerTypes";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {User} from "@/models/User";
import {Services} from "@/services/Services";
import {SessionService} from "@/services/session/SessionService";
import {NextRequest, NextResponse} from "next/server";
import {FileTypes} from "@/models/types/FileTypes";
import {FileManager} from "@/core/managers/FileManager";
import {CampaignManagerManager} from "@/core/managers/CampaignManagerManager";
import * as yup from 'yup';
import { FormValidator } from "@/core/utils/FormValidator";
import { Responses } from "@/core/utils/Responses";
import { FileService } from "@/services/FIleService";
import { EntityManager } from "@/core/managers/EntityManager";

interface PostUserObject {
    name: string;
    email: string;
    password: string;
    postalCode: string;
    city: string;
    address: string;
    addressSpecification: string;
    type: number;
}

interface PostManagerObject 
{
    contactEmail: string;
    description: string;
    managerType: number;
    identificationFile: any;
}


const fileService = Services.getInstance().get<FileService>("FileService");
const userManager = new UserManager();
const donorManager = new DonorManager();
const addressManager = new EntityManager(Address);
const fileManager = new FileManager();
const campaignManagerManager = new CampaignManagerManager();
const sessionService = Services.getInstance().get<SessionService>("SessionService");

const postUserFormSchema = yup.object().shape(
    {
        name: yup.string().trim().required().nonNullable().min(1),
        email: yup.string().trim().required().nonNullable().min(1),
        password: yup.string().trim().required().nonNullable().min(1),
        passwordConfirm: yup.string().trim().required().nonNullable().min(1),
        postalCode: yup.string().trim().required().nonNullable().min(1),
        city: yup.string().trim().required().nonNullable().min(1),
        address: yup.string().trim().required().nonNullable().min(1),
        addressSpecification: yup.string().trim().required().nonNullable().min(1),
        type: yup.number().required().nonNullable().min(0).max(1),
    }
);
const postUserFormValidator = new FormValidator(postUserFormSchema);


const postManagerFormSchema = yup.object().shape(
    {
        contactEmail: yup.string().trim().required().nonNullable().min(1),
        description: yup.string().trim().required().nonNullable().min(1).max(200),
        managerType: yup.number().required().nonNullable().min(0).max( Object.keys(CampaignManagerTypes).length/2 -1 ),
        identificationFile: fileService.filesSchema
    }
);
const postManagerFormValidator = new FormValidator(postManagerFormSchema);



export async function POST(request: NextRequest) 
{
    if (await sessionService.verify()) await sessionService.delete();

    const formBody = await request.formData();
    const objectFormBody = Object.fromEntries( formBody.entries() );
    const validatorResult = await postUserFormValidator.validate( objectFormBody );

    if (!validatorResult.isOK) 
        return Responses.createValidationErrorResponse(validatorResult.errors);

    const formData = validatorResult.value!;
    if (formData.password !== formData.passwordConfirm ) 
        return Responses.createValidationErrorResponse([new FormError("passwordConfirm", ["Password Confirmation doesn't match with password."])]);

    const user = setUserInfo(formData as PostUserObject);
    const userResult = await userManager.signUp(user);

    if (!userResult.isOK) 
        return Responses.createValidationErrorResponse(userResult.errors);

    if (formData.type == UserRoleTypes.Donor) 
    {
        const donor = setDonorInfo(user);
        await donorManager.signUp(donor); //doesn't have restrictions
    } 
    else 
    {
        const managerFormValidatorResult = await postManagerFormValidator.validate( objectFormBody );
        if (!managerFormValidatorResult.isOK) 
        {
            await addressManager.delete(user.address.value as Address);
            await userManager.delete(user);
            return Responses.createValidationErrorResponse(managerFormValidatorResult.errors);
        }

        const managerFormData = managerFormValidatorResult.value!;
        const uploadedFile = managerFormData.identificationFile as File;
        const fileResult = await fileManager.create(uploadedFile.name,fileService.savePath,uploadedFile.type,FileTypes.Identification,uploadedFile.size,user.id!);
        if (!fileResult.isOK) 
        {
            await addressManager.delete(user.address.value as Address);
            await userManager.delete(user);
            return Responses.createValidationErrorResponse(fileResult.errors);
        }
        
        if( ! await fileService.save(fileResult.value!,uploadedFile) )
        {
            await addressManager.delete(user.address.value as Address);
            await userManager.delete(user);
            return Responses.createServerErrorResponse();
        }

        const campaignManager = setCampaignManagerInfo(managerFormData);
        const managerResult = await campaignManagerManager.signUp(campaignManager);

        if (!managerResult.isOK) 
        {
            await fileManager.delete(fileResult.value!);
            await addressManager.delete(user.address.value as Address);
            await userManager.delete(user);
            return Responses.createValidationErrorResponse(managerResult.errors);
        }
    }

    return Responses.createSuccessResponse();
}





function mergeMiddleNames(names: string[]): string {
    if (names.length > 3) {
        let middle_names = "";
        for (let i = 1; i < names.length - 2; i++) {
            middle_names += names[i].trim() + " ";
        }
        middle_names += names[names.length - 2];
        return middle_names;
    } else return names[1];
}

function setUserInfo(formData:PostUserObject): User 
{
    const user = new User();

    user.address.value = new Address();
    user.address.value.address = formData.address;
    user.address.value.specification = formData.addressSpecification
    user.address.value.city = formData.city
    user.address.value.postal_code = formData.postalCode;

    const names = formData.name.split(" ");

    user.first_name = names[0].trim();
    if (names.length > 1) {
        user.middle_names = mergeMiddleNames(names);
        user.last_name = names[names.length - 1].trim();
    }

    user.email = formData.email;
    user.type = formData.type;
    user.password = formData.password;

    return user;
}

function setDonorInfo(user: User): Donor {
    const donor = new Donor();

    donor.donacoins = 0;
    donor.total_donated_value = 0;
    donor.total_donations = 0;
    donor.frequency_of_donation = 0;
    donor.best_frequency_of_donation = 0;
    donor.frequency_of_donation_datetime = new Date();
    donor.user.value = user;

    return donor;
}

function setCampaignManagerInfo(formData:PostManagerObject): CampaignManager 
{
    const campaignManager = new CampaignManager();

    campaignManager.contact_email = formData.contactEmail;
    campaignManager.description = formData.description;
    campaignManager.verified = false;
    campaignManager.type = formData.managerType;

    return campaignManager;
}