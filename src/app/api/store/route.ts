import {NextRequest} from "next/server";
import {StoreItemManager} from "@/core/managers/StoreItemManager";
import * as yup from 'yup';
import {FormValidator} from "@/core/utils/FormValidator";
import {DonorManager} from "@/core/managers/DonorManager";
import {FileManager} from "@/core/managers/FileManager";
import {FileTypes} from "@/models/types/FileTypes";
import {Services} from "@/services/Services";
import {IAuthorizationService} from "@/services/session/authorizationService/IAuthorizationService";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {FileService} from "@/services/FIleService";
import {IUserProvider} from "@/services/session/userProvider/IUserProvider";
import {Responses} from "@/core/utils/Responses";
import {YupUtils} from "@/core/utils/YupUtils";
import {Constraint} from "@/core/repository/Constraint";
import {Operator} from "@/core/repository/Operator";

const storeItemManager = new StoreItemManager();
const donorManager = new DonorManager();
const fileManager = new FileManager();
const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");
const fileService = Services.getInstance().get<FileService>("FileService");
const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");

const putFormSchema = yup.object().shape(
    {
        cost: yup.number().required().positive().nonNullable(),
        description: yup.string().trim().required().nonNullable().min(1).max(200),
        name: yup.string().trim().required().nonNullable().min(1).max(100),
        imageFile: fileService.filesSchema,
    }
);
const putFormValidator = new FormValidator(putFormSchema);

export async function PUT(request: NextRequest) {
    const user = await userProvider.getUser();
    if (!user || user.type != UserRoleTypes.Admin)
        return Responses.createUnauthorizedResponse();

    const bodyData = await request.formData();
    const validatorResult = await putFormValidator.validate(Object.fromEntries(bodyData.entries()));

    if (!validatorResult.isOK)
        return Responses.createValidationErrorResponse(validatorResult.errors);

    const formData = validatorResult?.value
    if (!formData) {
        return Responses.createBadRequestResponse();
    }

    const uploadedFile: File = formData.imageFile as File;
    const fileResult = await fileManager.create(uploadedFile.name, fileService.savePath, uploadedFile.type, FileTypes.Image, uploadedFile.size, user.id!);
    if (!fileResult.isOK)
        return Responses.createValidationErrorResponse(fileResult.errors);

    if (!await fileService.save(fileResult.value!, uploadedFile)) {
        await fileManager.delete(fileResult.value!);
        return Responses.createValidationErrorResponse(fileResult.errors);
    }

    const createdStoreItem = await storeItemManager.create(formData.name, formData.description, formData.cost, fileResult.value!.id!);

    return Responses.createSuccessResponse(createdStoreItem);
}

const searchFormSchema = yup.object().shape(
    {
        query: yup.string().lowercase().trim().notRequired().nonNullable().min(0),
        page: yup.number().transform(YupUtils.convertToNumber).required().integer().nonNullable(),
        pageSize: yup.number().transform(YupUtils.convertToNumber).required().integer().positive().nonNullable(),
    }
);
const searchFormValidator = new FormValidator(searchFormSchema);

export async function GET(request: NextRequest) {
    const {searchParams} = request.nextUrl;
    const validatorResult = await searchFormValidator.validate(Object.fromEntries(searchParams.entries()));

    if (!validatorResult.isOK)
        return Responses.createValidationErrorResponse(validatorResult.errors);

    const formData = validatorResult.value!;

    const constraints = [];

    if (formData.query) {
        constraints.push(new Constraint("name", Operator.LIKE, `%${formData.query}%`))
    }

    const result = await storeItemManager.searchWithConstraints(constraints, formData.page, formData.pageSize);

    if (result.isOK)
        return Responses.createSuccessResponse(result.value);
    else
        return Responses.createNotFoundResponse("No item where found with the provided search.");
}

const buyFormSchema = yup.object().shape(
    {
        store_item_id: yup.number().required().integer().positive().nonNullable(),
        donor_id: yup.number().required().integer().positive().nonNullable(),
    }
);
const buyFormValidator = new FormValidator(buyFormSchema);

export async function POST(request: NextRequest) {
    if (!await authorizationService.hasRoles(UserRoleTypes.Donor))
        return Responses.createUnauthorizedResponse();

    const bodyData = await request.formData();
    const validationResult = await buyFormValidator.validate(Object.fromEntries(bodyData.entries()));

    if (!validationResult.isOK)
        return Responses.createValidationErrorResponse(validationResult.errors);

    const formData = validationResult?.value;
    if (!formData) {
        return Responses.createBadRequestResponse();
    }
    const result = await donorManager.buyStoreItem(formData.donor_id, formData.store_item_id);

    if (result.isOK)
        return Responses.createSuccessResponse();
    else
        return Responses.createValidationErrorResponse(result.errors);
}
