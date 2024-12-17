import {UserManager} from "@/core/managers/UserManager";
import {Responses} from "@/core/utils/Responses";
import {Services} from "@/services/Services";
import {SessionService} from "@/services/session/SessionService";

const sessionService = Services.getInstance().get<SessionService>("SessionService")
const userManager = new UserManager();

export async function POST() {
    const session = await sessionService.verify()
    if (session == null || session.expires < new Date())
        return Responses.createBadRequestResponse("There is no valid session to singOut.");

    const userId = session.userId;
    const user = await userManager.getById(userId);

    if (user == null) {
        console.error("Trying to singOut an account that has been deleted or never existed but has a session.")
        return Responses.createServerErrorResponse();
    }

    await sessionService.delete();
    return Responses.createSuccessResponse();
}