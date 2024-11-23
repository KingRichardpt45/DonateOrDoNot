import { NextRequest, NextResponse } from "next/server";

/**
 *  This class contains methods to create responses.
 */
export class Responses
{
    // Method to create an Unauthorized response
    static createBadRequestResponse(message: string = "The request is invalid.", statusText:string = "Unprocessable"): NextResponse {
        return NextResponse.json({ error: message }, { status: 400, statusText });
    }

    // Method to create an Unauthorized response
    static createUnauthorizedResponse(message: string = "Not authorized to do this operation.", statusText:string = "Unauthorized"): NextResponse {
        return NextResponse.json({ error: message }, { status: 401, statusText });
    }

    // Method to create a Forbidden response (if needed in the future)
    static createForbiddenResponse(message: string = "Forbidden access.", statusText:string = "Forbidden"): NextResponse {
        return NextResponse.json({ error: message }, { status: 403, statusText });
    }

    // Method to create a Not Found response
    static createNotFoundResponse(message: string = "Resource not found.", statusText: string = "Not Found"): NextResponse {
        return NextResponse.json({ error: message }, { status: 404, statusText });
    }

    // Method to create a Success response
    static createSuccessResponse(data?: any, statusText: string = "Success"): NextResponse {
        return NextResponse.json(data ? data : {}, { status: 200, statusText });
    }

    // Method to create a Validation Error response
    static createValidationErrorResponse(errors: any, statusText: string = "Unprocessable Entity" ): NextResponse {
        return NextResponse.json({ errors }, { status: 422, statusText });
    }

    // Method to create a Server Error response
    static createServerErrorResponse(message: string = "An error occurred, please try again later.", statusText:string = "Internal Server Error" ): NextResponse {
        return NextResponse.json({ error: message }, { status: 500, statusText });
    }

    // Method to create a Server Redirect response.
    static createRedirectResponse(redirectPath:string , request:NextRequest): NextResponse {
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }
}