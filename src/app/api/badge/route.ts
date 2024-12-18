import {NextRequest} from "next/server";
import {FormValidator} from "@/core/utils/FormValidator";
import {FileManager} from "@/core/managers/FileManager";
import * as yup from 'yup';
import {FileTypes} from "@/models/types/FileTypes";
import {Services} from "@/services/Services";
import {IAuthorizationService} from "@/services/session/authorizationService/IAuthorizationService";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {BadgeManager} from "@/core/managers/BadgeManager";
import {BadgeTypes} from "@/models/types/BadgeTypes";
import {FileService} from "@/services/FIleService";
import {Responses} from "@/core/utils/Responses";
import {YupUtils} from "@/core/utils/YupUtils";
import {Constraint} from "@/core/repository/Constraint";
import {Operator} from "@/core/repository/Operator";
import {EntityManager} from "@/core/managers/EntityManager";
import {CampaignBadge} from "@/models/CampaignBadge";
import {DonorBadge} from "@/models/DonorBadge";

const badgeManager = new BadgeManager();
const campaignBadgesManager = new EntityManager<CampaignBadge>(CampaignBadge);
const donorBadgesManager = new EntityManager<DonorBadge>(DonorBadge);
const fileManager = new FileManager();
const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");
const fileService = Services.getInstance().get<FileService>("FileService");

const putFormSchema = yup.object().shape({
    name: yup.string().trim().required().nonNullable().min(1).max(100),
    description: yup.string().trim().required().nonNullable().min(1).max(200),
    type: yup.number().required().integer().positive().nonNullable().min(0).max(Object.keys(BadgeTypes).length / 2 - 1),
    unit: yup.string().trim().required().nullable(),
    value: yup.number().required().integer().min(0).nullable(),
    campaignId: yup.number().nullable().min(0).positive(),
    donorId: yup.number().nullable().min(0).positive(),
    imageFile: fileService.filesSchema
});
const putFormValidator = new FormValidator(putFormSchema);

export async function PUT(request: NextRequest) {
    const userId = await authorizationService.getId();
    if (userId == null) return Responses.createUnauthorizedResponse(); else if (!await authorizationService.hasRoles(UserRoleTypes.Admin, UserRoleTypes.CampaignManager)) return Responses.createForbiddenResponse();

    const bodyData = await request.formData();
    const validatorResult = await putFormValidator.validate(Object.fromEntries(bodyData.entries()));

    if (!validatorResult.isOK) return Responses.createValidationErrorResponse(validatorResult.errors);

    const formData = validatorResult?.value

    if (!formData) return Responses.createBadRequestResponse();

    const uploadedFile = formData.imageFile as File;
    const fileResult = await fileManager.create(uploadedFile.name, fileService.savePath, uploadedFile.type, FileTypes.Image, uploadedFile.size, userId);

    if (!fileResult.isOK) return Responses.createValidationErrorResponse(fileResult.errors);

    if (!await fileService.save(fileResult.value!, uploadedFile)) return Responses.createServerErrorResponse();

    const createdBadge = await badgeManager.create(formData.name, formData.description, formData.type, formData.unit, formData.value, fileResult.value!.id!);

    if (formData.campaignId != null) {
        const campaignBadge = new CampaignBadge();
        campaignBadge.campaign_id = formData.campaignId;
        campaignBadge.badge_id = createdBadge.id;
        await campaignBadgesManager.add(campaignBadge);
    } else if (formData.donorId != null) {
        const donorBadge = new DonorBadge();
        donorBadge.donor_id = formData.donorId;
        donorBadge.badge_id = createdBadge.id;
        await donorBadgesManager.add(donorBadge);
    }

    return Responses.createSuccessResponse(createdBadge, `${BadgeTypes[formData.type]} created successfully`);
}

const getFormSchema = yup.object().shape({
    user_id:yup.number().transform(YupUtils.convertToNumber).notRequired().nonNullable().integer().min(0),
    query: yup.string().trim().required().nullable().min(1),
    page: yup.number().transform(YupUtils.convertToNumber).required().nonNullable().positive().integer().min(0),
    pageSize: yup.number().transform(YupUtils.convertToNumber).required().nonNullable().positive().integer().min(0),
    type: yup.number().transform(YupUtils.convertToNumber).integer().positive().min(0).max(Object.keys(BadgeTypes).length / 2 - 1).nullable(),
});
const getFormValidator = new FormValidator(getFormSchema);

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const validatorResult = await getFormValidator.validate(Object.fromEntries(searchParams.entries()));

    if (!validatorResult.isOK) {
        return Responses.createValidationErrorResponse(validatorResult.errors);
    }

    const formData = validatorResult?.value;

    if (!formData) {
        return Responses.createServerErrorResponse();
    }

    const constraints: Constraint[]=[];
    if (formData.user_id){
        constraints.push(new Constraint("user_id",Operator.EQUALS,formData.user_id))
    }else{
        constraints.push(new Constraint("name",Operator.LIKE,`%${formData.query}%`))
    }
    if (formData.type){
        constraints.push(new Constraint("type",Operator.EQUALS,formData.type))
    }

    const result = await badgeManager.searchWithConstraints(constraints, formData.page, formData.pageSize);

    if (!result.isOK) {
        return Responses.createNotFoundResponse();
    }

    return Responses.createSuccessResponse(result.value);
}
