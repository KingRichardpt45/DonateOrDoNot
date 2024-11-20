import {DonorManager} from "@/core/managers/DonorManager";
import {FormError} from "@/core/managers/FormError";
import {UserManager} from "@/core/managers/UserManager";
import {EnumUtils} from "@/core/utils/EnumUtils";
import {FormObjectValidator} from "@/core/utils/FormObjectValidator";
import {Address} from "@/models/Address";
import {CampaignManager} from "@/models/CampaignManager";
import {Donor} from "@/models/Donor";
import {CampaignManagerTypes} from "@/models/types/CampaignManagerTypes";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {User} from "@/models/User";
import {Services} from "@/services/Services";
import {SessionService} from "@/services/session/SessionService";
import {NextRequest, NextResponse} from "next/server";
import {File as ModelFile} from "@/models/File"
import {FileTypes} from "@/models/types/FileTypes";
import fs from "node:fs/promises";
import {FileManager} from "@/core/managers/FileManager";
import {CampaignManagerManager} from "@/core/managers/CampaignManagerManager";


const savePath = "./public/documents/";

const validatorUserForm = new FormObjectValidator("name", "email", "password", "passwordConfirm", "postalCode", "city", "address", "addressSpecification", "type");

const validatorCampaignManagerForm = new FormObjectValidator("contactEmail", "description", "managerType", "identificationFile");

const userManager = new UserManager();
const donorManager = new DonorManager();
const fileManager = new FileManager();
const campaignManagerManager = new CampaignManagerManager();
const sessionService = Services.getInstance().get<SessionService>("SessionService")
const redirectOnSuccessSignUp = "/signin"

export async function POST(request: NextRequest) {
    if (await sessionService.verify()) await sessionService.delete();

    const formData = await request.formData();
    const errors = validatorUserForm.validateFormParams(formData);

    if (errors.length > 0) return NextResponse.json({errors: errors}, {
        status: 422,
        statusText: "Invalid form fields."
    });

    const typeValue = EnumUtils.getEnumValue(UserRoleTypes, formData.get("type")!.toString());
    if (typeValue == null) return NextResponse.json({errors: [{errorMessage: "Invalid type for user."}]}, {
        status: 400,
        statusText: "Invalid type for user."
    });

    if (formData.get("password")!.toString() !== formData.get("passwordConfirm")!.toString()) return NextResponse.json({errors: [new FormError("passwordConfirm", ["Password Confirmation doesn't match with password."])]}, {
        status: 422,
        statusText: "Invalid form data."
    });

    const user = setUserInfo(formData, typeValue as number);
    const result = await userManager.signUp(user);

    if (!result.isOK) return NextResponse.json({errors: result.errors}, {
        status: 422,
        statusText: "Invalid form data."
    });

    if (typeValue == UserRoleTypes.Donor) {
        const donor = setDonorInfo(user);
        await donorManager.signUp(donor); //does't have restrictions
    } else {
        const errors = validatorCampaignManagerForm.validateFormParams(formData);
        if (errors.length > 0) {
            await userManager.delete(user);
            return NextResponse.json({errors: errors}, {status: 422, statusText: "Invalid form fields."});
        }

        const managerTypeValue = EnumUtils.getEnumValue(CampaignManagerTypes, formData.get("managerType")!.toString());
        if (managerTypeValue == null) {
            await userManager.delete(user);
            return NextResponse.json({errors: [{errorMessage: "Invalid type for manager."}]}, {
                status: 400,
                statusText: "Invalid type for manager."
            });
        }

        const file = createFile(formData, user);
        const fileResult = await fileManager.createWithValidation(file);

        if (fileResult.isOK) saveFile(fileResult.value!, await (formData.get("identificationFile") as File).arrayBuffer()); else {
            await userManager.delete(user);
            return NextResponse.json({errors: fileResult.errors}, {status: 422, statusText: "Invalid file."});
        }

        const campaignManager = setCampaignInfo(formData, user, fileResult.value!, typeValue);
        const managerResult = await campaignManagerManager.signUp(campaignManager);

        if (!managerResult.isOK) {
            await fileManager.delete(fileResult.value!);
            await userManager.delete(user);
            return NextResponse.json({errors: managerResult.errors}, {status: 422, statusText: "Invalid form fields."})
        }
    }

    return NextResponse.redirect(new URL(redirectOnSuccessSignUp, request.url));
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

function setUserInfo(formData: FormData, type: number): User {
    const user = new User();

    user.address.value = new Address();
    user.address.value.address = formData.get("address")!.toString().trim();
    user.address.value.specification = formData.get("addressSpecification")!.toString().trim();
    user.address.value.city = formData.get("city")!.toString().trim();
    user.address.value.postal_code = formData.get("postalCode")!.toString().trim();

    const names = formData.get("name")!.toString().split(" ");

    user.first_name = names[0].trim();
    if (names.length > 1) {
        user.middle_names = mergeMiddleNames(names);
        user.last_name = names[names.length - 1].trim();
    }

    user.email = (formData.get("email") as string).trim();
    user.type = type;
    user.password = (formData.get("password") as string).trim();

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

function setCampaignInfo(formData: FormData, user: User, file: ModelFile, type: CampaignManagerTypes): CampaignManager {
    const campaignManager = new CampaignManager();

    campaignManager.contact_email = formData.get("contactEmail")!.toString().trim();
    campaignManager.description = formData.get("description")!.toString().trim();
    campaignManager.verified = false;
    campaignManager.type = type;

    return campaignManager;
}

function createFile(formData: FormData, user: User): ModelFile {
    const file = new ModelFile();
    const uploadedFile = formData.get("identificationFile")!.valueOf() as File;

    file.original_name = uploadedFile.name;
    file.file_path = savePath;
    file.file_suffix = uploadedFile.type;
    file.file_type = FileTypes.Identification;
    file.size = uploadedFile.size;
    file.timestamp = new Date();
    file.user_id = user.id;

    return file;
}

async function saveFile(file: ModelFile, fileData: ArrayBuffer) {
    const arrayBuffer = fileData
    const buffer = new Uint8Array(arrayBuffer);
    await fs.writeFile(`${savePath}${file.id}`, buffer);
}