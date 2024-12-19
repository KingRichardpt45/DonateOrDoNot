import React from "react";
import {MainLayout} from "@/app/components/coreComponents/mainLayout";
import styles from "./profile.module.css";
import NotAuthorized from "@/app/components/authorization/notAuthorized";
import NotLoggedIn from "@/app/components/authorization/notLogged";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {Services} from "@/services/Services";
import {IUserProvider} from "@/services/session/userProvider/IUserProvider";
import {DonationManager} from "@/core/managers/DonationManager";
import {DonorManager} from "@/core/managers/DonorManager";
import {Constraint} from "@/core/repository/Constraint";
import {Operator} from "@/core/repository/Operator";
import {DonorBadgeManager} from "@/core/managers/DonorBadgesManager";
import {DonorStoreItemManager} from "@/core/managers/DonorStoreItemManager";
import ProfileSideBar from "@/app/profile/ProfileSideBar";
import BadgesSection from "./badgeSection";
import ItemsSection from "./itemSection";
import CampaignsSection from "./campaignSection";
import {FileManager} from "@/core/managers/FileManager";
import {DonationCampaignManager} from "@/core/managers/DonationCampaignManager";

type SearchParams = {
    [key: string]: string | string[] | undefined;
};

const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");
const donationManager = new DonationManager();
const donorBadgeManager = new DonorBadgeManager();
const donorStoreItemManager = new DonorStoreItemManager();
const donorManager = new DonorManager();
const filesManager = new FileManager();
const campaignManager = new DonationCampaignManager();

const ProfilePage = async ({searchParams}: { searchParams: SearchParams }) => {

    const params = await searchParams;

    // Paginação
    const badgesPage = parseInt(params.badgesPage?.toString() || "1");
    const itemsPage = parseInt(params.itemsPage?.toString() || "1");
    const campaignsPage = parseInt(params.campaignsPage?.toString() || "1");

    const badgesPerPage = 10;
    const itemsPerPage = 10;
    const campaignsPerPage = 5; // Alterado para 5 campanhas por página

    const user = await userProvider.getUser();

    if (!user) return <NotLoggedIn/>;
    if (user.type !== UserRoleTypes.Donor) return <NotAuthorized/>;

    const donations = await donationManager.getDonationsOfDonor(user.id!, 0, 10);
    const badges = await donorBadgeManager.getBadgeOfDonor(user.id!, 0, 100);
    const items = await donorStoreItemManager.getItemsOfDonor(user.id!, 0, 100);

    const Donor = await donorManager.getByCondition([
        new Constraint("id", Operator.EQUALS, user?.id),
    ]);
    const donorData = Donor?.find((donor) => donor.id === user.id);
    const totalDonated = donorData?.total_donated_value || 0;
    const freqDon = donorData?.frequency_of_donation || 0;
    const donacoins = donorData?.donacoins || 0;

    // Buscar campanhas associadas às doações

    const campaigns = donations.value ? await Promise.all(
        donations.value!.map(async (donation) => {
            const [campaignImage] = await filesManager.getByCondition([
                new Constraint("campaign_id", Operator.EQUALS, donation.campaign_id),
            ]);

            const [donatedCampaign] = await campaignManager.getByCondition([
                new Constraint("id", Operator.EQUALS, donation.campaign_id),
            ]);

            return {
                id:donatedCampaign?.id,
                name: donatedCampaign?.title || "Unknown Campaign",
                description: donatedCampaign?.description || "No description available",
                imagePath: campaignImage?.original_name
                    ? `/documents/${campaignImage.id}_${campaignImage.original_name}`
                    : "/default_campaign.jpg",
            };
        })
    ) : [];

    const profileImageId = Array.isArray(user.profileImage?.value)
        ? user.profileImage?.value[0]?.id ?? null
        : user.profileImage?.value?.id ?? null;

    const originalName = Array.isArray(user.profileImage?.value)
        ? user.profileImage?.value[0]?.original_name ?? null
        : user.profileImage?.value?.original_name ?? null;

    const profileImage = (profileImageId  && originalName) ? `/documents/${profileImageId}_${originalName}` : null;

    const address: string | null = Array.isArray(user.address?.value)
        ? user.address.value[0]?.address ?? null
        : user.address?.value?.address ?? null;

    const city: string | null = Array.isArray(user.address?.value)
        ? user.address.value[0]?.city ?? null
        : user.address?.value?.city ?? null;

    const postalCode: string | null = Array.isArray(user.address?.value)
        ? user.address.value[0]?.postal_code ?? null
        : user.address?.value?.postal_code ?? null;

    const fullAddress = [address, city, postalCode].filter(Boolean).join(", ") || null;

    return (
        <MainLayout passUser={user}>
            <div className={styles.ProfileContainer}>
                {/* Sidebar */}
                <ProfileSideBar userId={user.id}
                                profileImage={profileImage}
                                email={user.email}
                                firstName={user.first_name}
                                lastName={user.last_name}
                                address={address}
                                city={city}
                                postalCode={postalCode}
                                fullAddress={fullAddress}/>

                {/* Main Content */}
                <div className={styles.MainContent}>
                    {/* Statistics Section */}
                    <div className={styles.Statistics}>
                        <h2>Statistics</h2>
                        <div className={styles.StatisticsInfo}>
                            <div>
                                <h3>Number of Donations</h3>
                                <p>{donations.isOK ? donations.value?.length : 0}</p>
                            </div>
                            <div>
                                <h3>Frequency of Donation</h3>
                                <p>{freqDon}</p>
                            </div>
                            <div>
                                <h3>Total Donated Value</h3>
                                <p>${totalDonated}</p>
                            </div>
                            <div>
                                <h3>Donacoins</h3>
                                <p>{donacoins}</p>
                            </div>
                        </div>
                    </div>

                    <BadgesSection
                        badges={badges.value}
                        currentPage={badgesPage}
                        itemsPerPage={badgesPerPage}
                        totalPages={Math.ceil(badges.value?.length / badgesPerPage)}
                    />

                    <ItemsSection
                        items={items.value}
                        currentPage={itemsPage}
                        itemsPerPage={itemsPerPage}
                        totalPages={Math.ceil(items.value?.length / itemsPerPage)}
                    />


                    {/* Seção de Campanhas */}
                    <CampaignsSection
                        campaigns={campaigns}
                        currentPage={campaignsPage}
                        itemsPerPage={campaignsPerPage}
                        totalPages={Math.ceil(campaigns.length / campaignsPerPage)}
                    />

                </div>
            </div>
        </MainLayout>
    );
};

export default ProfilePage;
