import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { Services } from "@/services/Services";
import { IAuthorizationService } from "@/services/session/authorizationService/IAuthorizationService";
import { NextRequest, NextResponse } from "next/server";
import { DonationManager } from "@/core/managers/DonationManager";
import { FormObjectValidator } from "@/core/utils/FormObjectValidator";
import { Donation } from "@/models/Donation";

const authorizationService = Services.getInstance().get<IAuthorizationService>("IAuthorizationService");
const donationManager = new DonationManager();
const donationFormValidator = new FormObjectValidator("campaignId","donorId","comment","value,nameHidden");

export async function POST( request : NextRequest )
{
    if( !await authorizationService.hasRole(UserRoleTypes.Donor) )
        return NextResponse.json({errors:["Create a donor account."]},{status:401, statusText:"You are not authorized to donate. Create a donor account."});

    const formData = await request.formData();

    const errors = donationFormValidator.validateFormParams(formData);
    if( errors.length > 0 )
        return NextResponse.json({errors}, {status: 400, statusText: "Invalid form fields."});
    
    const donation = createDonation(formData);
    const result = await donationManager.createWithValidation(donation);

    if(!result.isOK)
        NextResponse.json({ errors: result.errors },{status:422,statusText:"Invalid form fields."});

    return NextResponse.json({},{status:200,statusText:"Success."});
}


const donationGetFormValidator = new FormObjectValidator("donorId","page","pagesize");

export async function GET( request : NextRequest )
{
    const { searchParams } = request.nextUrl;

    const errors = donationGetFormValidator.validateSearchParams(searchParams);
    if( errors.length > 0 )
        return NextResponse.json({errors}, {status: 400, statusText: "Invalid form fields."});
    
    const donationsResult = await donationManager.getDonationsOfDonor(
        Number(searchParams.get("donorId")),
        Number(searchParams.get("page")),
        Number(searchParams.get("pagesize")),
    )

    if(!donationsResult.isOK)
        NextResponse.json({ errors: donationsResult.errors },{status:404,statusText:"No results."});

    return NextResponse.json({donations:donationsResult.value},{status:200,statusText:"Success."});
}

function createDonation( formData: FormData) : Donation
{
    const donation = new Donation();
    donation.campaign_id = formData.get("campaignId")?.valueOf() as number;
    donation.donor_id = formData.get("donorId")?.valueOf() as number;
    donation.comment = formData.get("comment")?.valueOf() as string;
    donation.value = formData.get("value")?.valueOf() as number;
    donation.is_name_hidden = formData.get("nameHidden")?.valueOf() as boolean;
    
    return donation;
}