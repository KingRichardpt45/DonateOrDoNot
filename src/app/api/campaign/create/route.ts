import {FormObjectValidator} from "@/core/utils/FormObjectValidator";
import {NextRequest, NextResponse} from "next/server";
import {DonationCampaignManager} from "@/core/managers/DonationCampaignManager";
import {Campaign} from "@/models/Campaign";

const campaignManager = new DonationCampaignManager();
const formValidator = new FormObjectValidator("title", "description", "objective_value", "end_date", "campaign_manager_id", "bank_account_id");

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const errors = formValidator.validateFormParams(formData);
    if (errors.length > 0)
        return NextResponse.json({errors}, {status: 400, statusText: "Invalid form fields."});

    const campaign = new Campaign()

    campaign.title = formData.get("title")?.toString().trim() || null;
    campaign.description = formData.get("description")?.toString().trim() || null;

    const objectiveValue = formData.get("objective_value");
    campaign.objective_value = objectiveValue ? Number(objectiveValue) : null;

    campaign.current_donation_value = 0;
    campaign.category = formData.get("category")?.toString().trim() || null;
    const endDateString = formData.get("end_date")?.toString().trim();
    campaign.end_date = endDateString ? new Date(endDateString) : null;
    campaign.contact_email = formData.get("contact_email")?.toString().trim() || null;
    campaign.contact_phone_number = formData.get("contact_phone_number")?.toString().trim() || null;
    campaign.donation_counter = 0;
    campaign.last_notified_value = 0;
    const interval_notification_value = formData.get("interval_notification_value");
    campaign.interval_notification_value = interval_notification_value ? Number(interval_notification_value) : 0;

    const campaign_manager_id = formData.get("campaign_manager_id");
    campaign.campaign_manager_id = campaign_manager_id ? Number(campaign_manager_id) : null;
    const bank_account_id = formData.get("bank_account_id");
    campaign.bank_account_id = bank_account_id ? Number(bank_account_id) : null;

    const createdCampaign = await campaignManager.createCampaign(campaign);

    if (createdCampaign == null)
        return NextResponse.json({}, {status: 404, statusText: "Error creating campaign."});

    return NextResponse.json({data: createdCampaign}, {status: 200, statusText: "Success."});
}
