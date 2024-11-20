import { DonorManager } from "@/core/managers/DonorManager";
import { EnumUtils } from "@/core/utils/EnumUtils";
import { FormObjectValidator } from "@/core/utils/FormObjectValidator";
import { TopTypes } from "@/models/types/TopTypes";
import { NextRequest, NextResponse } from "next/server";

const queryValidator = new FormObjectValidator("type","page","pageSize")
const donorManager = new DonorManager();

export async function GET( request : NextRequest )
{
    const { searchParams } = request.nextUrl;

    const errors = queryValidator.validateSearchParams(searchParams);
    if( errors.length > 0 )
        return NextResponse.json({errors}, {status: 400, statusText: "Invalid form fields."});
    
    const page = Number(searchParams.get("page")!.valueOf());
    const pageSize = Number(searchParams.get("pageSize")!.valueOf());
    let donors;
    const typeValue = EnumUtils.getEnumValue(TopTypes, searchParams.get("type")!.valueOf() );
    switch( typeValue )
    {
        case TopTypes.FREQUENCY_OF_DONATIONS:
            donors = await donorManager.getTopFrequencyOfDonationsDonors(page,pageSize)
            break;
        case TopTypes.TOTAL_VALUE_DONATED:
            donors = await donorManager.getTopTotalValueDonors(page,pageSize)
            break;
        case TopTypes.TOTAL_VALUE_DONATED:
            donors = await donorManager.getTopTotalValueDonors(page,pageSize)
            break;
        default:
            return NextResponse.json({},{status:400,statusText:"Invalid type of top."});
    }

    if(!donors.isOK)
        NextResponse.json({ errors: ["No results found."]},{status:404,statusText:"No results."});

    return NextResponse.json({top:donors.value},{status:200,statusText:"Success."});
}