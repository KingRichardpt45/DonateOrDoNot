import {Entity} from "@/core/repository/Entity";
import {NavigationKey} from "@/core/repository/NavigationKey";
import {File} from "@/models/File";
import {Donation} from "@/models/Donation";
import {CampaignManager} from "@/models/CampaignManager";
import {CampaignStatus} from "@/models/types/CampaignStatus";
import {Notification} from "@/models/Notification";
import {BankAccount} from "@/models/BankAccount";
import {CampaignBadge} from "@/models/CampaignBadge";

export class Campaign extends Entity {
    [key: string]: unknown;

    id: number | null = null;
    title: string | null = null;
    description: string | null = null;
    objective_value: number | null = null;
    current_donation_value: number | null = null;
    category: string | null = null;
    end_date: Date | null = null;
    contact_email: string | null = null;
    contact_phone_number: string | null = null;
    donation_counter: number | null = null;
    last_notified_value: number | null = null;
    interval_notification_value: number | null = null;
    status: CampaignStatus = CampaignStatus.InAnalysis;

    campaign_manager_id: number | null = null;
    bank_account_id: number | null = null;

    readonly notifications = new NavigationKey<Notification>(this, "notifications", "id", Campaign.getTableName(), Campaign.getEntityName(), Notification.getTableName(), Notification.getEntityName(), "campaign_id", []);
    readonly badges = new NavigationKey<CampaignBadge>(this, "badges", "id", Campaign.getTableName(), Campaign.getEntityName(), CampaignBadge.getTableName(), CampaignBadge.getEntityName(), "campaign_id", []);
    readonly files = new NavigationKey<File>(this, "files", "id", Campaign.getTableName(), Campaign.getEntityName(), File.getTableName(), File.getEntityName(), "campaign_id", []);
    readonly donations = new NavigationKey<Donation>(this, "donations", "id", Campaign.getTableName(), Campaign.getEntityName(), Donation.getTableName(), Donation.getEntityName(), "campaign_id", null);
    readonly campaign_manager = new NavigationKey<CampaignManager>(this, "campaign_manager", "campaign_manager_id", Campaign.getTableName(), Campaign.getEntityName(), CampaignManager.getTableName(), CampaignManager.getEntityName(), "id", null);
    readonly bank_account = new NavigationKey<BankAccount>(this, "bank_account", "bank_account_id", Campaign.getTableName(), Campaign.getEntityName(), BankAccount.getTableName(), BankAccount.getEntityName(), "id", null);

    getPrimaryKeyParts(): string[] {
        return ["id"];
    }

    getKeys(): string[] {
        return ["id", 
            "title", 
            "description", 
            "current_donation_value", 
            "objective_value", 
            "category", 
            "end_date",
            "contact_email", 
            "contact_phone_number", 
            "donation_counter", 
            "last_notified_value",
            "interval_notification_value", 
            "status", 
            "campaign_manager_id", 
            "bank_account_id"];
    }

    getNavigationKeys(): string[] {
        return ["notifications", "badges", "files", "donations", "campaign_manager", "bank_account"];
    }

    getTableName(): string {
        return Campaign.getTableName();
    }

    getEntityName(): string {
        return Campaign.getEntityName();
    }

    equals(object: unknown): boolean {
        return object instanceof Campaign && this.id === object.id;
    }

    static getTableName(): string {
        return "Campaigns";
    }

    static getEntityName(): string {
        return "Campaign";
    }
}