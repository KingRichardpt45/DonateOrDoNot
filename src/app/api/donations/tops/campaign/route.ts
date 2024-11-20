import { DonationCampaignManager } from "@/core/managers/DonationCampaignManager";
import { FormObjectValidator } from "@/core/utils/FormObjectValidator";
import { NextRequest, NextResponse } from "next/server";

const queryValidator = new FormObjectValidator("id","page","pageSize")
const donationCampaignManager = new DonationCampaignManager();

export async function GET( request : NextRequest )
{
    const { searchParams } = request.nextUrl;

    const errors = queryValidator.validateSearchParams(searchParams);
    if( errors.length > 0 )
        return NextResponse.json({errors}, {status: 400, statusText: "Invalid form fields."});
    
    const page = Number(searchParams.get("page")!.valueOf());
    const pageSize = Number(searchParams.get("pageSize")!.valueOf());
    const campaign_id = Number(searchParams.get("campaign_id")!.valueOf());
    let donors = await donationCampaignManager.getTopDonors(campaign_id,page,pageSize);
    
    if(!donors.isOK)
        NextResponse.json({ errors: ["No results found."]},{status:404,statusText:"No results."});

    return NextResponse.json({top:donors.value},{status:200,statusText:"Success."});
}