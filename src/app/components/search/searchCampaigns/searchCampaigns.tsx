"use client"

import { Search } from "lucide-react";
import styles from "./searchCampaigns.module.css"
import { CampaignStatus } from "@/models/types/CampaignStatus";
import { useEffect, useState } from "react";
import { Campaign } from "@/models/Campaign";
import { ActionDisplay } from "../../actionsNotifications/actionDisplay/ActionDisplay";
import { IActionResultNotification } from "../../actionsNotifications/IActionResultNotification";
import { ActionResultNotificationError } from "../../actionsNotifications/ActionResultNotificationError";
import { ActionResultNotificationSuccess } from "../../actionsNotifications/ActionResultNotificationSuccess";
import DropdownInput from "../selectWithInput/selectWithInput";
import CampaignItem from "../../campaigns/CampaignsItem";

const SearchCampaigns : React.FC<{ pageSize:number, managerId:number|null }>= ( { pageSize,managerId }) => {
    
    const campaignStatusEntries = Object.entries(CampaignStatus)
    const campaignStatusEntriesSize = campaignStatusEntries.length/2 -1;
    const campaignStatusEntriesSizeString = campaignStatusEntriesSize.toString();

    const [firstRender, setFirstRender] = useState<boolean>(true);
    const [selectedStatus, setSelectedStatus] = useState<string>(campaignStatusEntriesSizeString);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [lastFetchedPage, setLastFetchedPage] = useState<number>(0);
    const [query,setQuery] = useState<string>("Search...");
    const [actions,setActions] = useState<IActionResultNotification[]>([]);
    const [category, setCategory] = useState<string>("");

    function onDroopCategoryChange (value: string)
    {
        setCategory(value)
    }
  
    function onDroopDownChange (event: React.ChangeEvent<HTMLSelectElement>)
    {
        setSelectedStatus(event.target.value); 
    }

    function updateQuery(event: React.ChangeEvent<HTMLInputElement>)
    {
        setQuery(event.target.value);
    }

    async function onSearch()
    {
        await search(0);
        setLastFetchedPage(0);
    }

    async function onSearchMore()
    {
        let page = lastFetchedPage+1;
        await search(page);
        setLastFetchedPage(page);
    }
    
    async function search(page:number)
    {
        setActions([]);

        let url = `/api/campaign?query=${query}&page=${page}&pageSize=${pageSize}`;
        url = managerId ? `${url}&managerId=${managerId}`: url;
        url = selectedStatus !== campaignStatusEntriesSizeString ? `${url}&status=${selectedStatus}`: url;
        url = category !== "" ? `${url}&category=${category}` : url
        const response = await fetch(url, { method: "Get"});
        let responseBody ;

        switch(response.status)
        {
        case 200:
            responseBody =  await response.json()
            const fetchedCampaigns = lastFetchedPage==0 ? [] : [...campaigns];
            const actionsNotificationsResult = [];
            for (const campaign of responseBody.data) 
            {
                fetchedCampaigns.push(campaign)
            }
            actionsNotificationsResult.push( new ActionResultNotificationSuccess("Fetched with success.",1000) );
            setActions(actionsNotificationsResult);
            setCampaigns(fetchedCampaigns);
            return;
        case 422:
            responseBody =  await response.json();
            let time = 5000;
            const actionsNotifications = [];
            for (const error of responseBody.errors) 
            {
            actionsNotifications.push( new ActionResultNotificationError(error.field,error.errors,time) );
            time += 1000;
            }
            setActions(actionsNotifications)
            break;
        case 404:
            const notFount = [new ActionResultNotificationError("No Results found",[],2000)];
            setActions(notFount);
            break;
        default:
            alert(response.statusText);
            break
        }
    }

    useEffect(() => 
    {
        if (firstRender) {
            onSearch(); 
            setFirstRender(false); 
        }
    }, [firstRender] ); 
    
    return (
        <div>
            <div className={styles.searchContainer}>
                <DropdownInput width={200} heigh={30} color="#3b3b3b" options={["Startup","Health","School","Debt"]} onChange={onDroopCategoryChange}/>
                <select 
                    name="type"
                    id="type"
                    className={styles.dropdown}
                    onChange={onDroopDownChange}
                    value={selectedStatus}
                >
                    <option value={campaignStatusEntriesSize}>-- Select Status --</option>
                    {
                        campaignStatusEntries.map( ( [key, value] , index) => 
                            {
                                if(index < campaignStatusEntriesSize )
                                return <option key={`optionSearch_${index}`} value={key}>{value}</option>
                            }
                        )
                    }
                </select>
                <div className={styles.search}>
                <input type="text" placeholder="Search..." className={styles.searchBar}  value={query} onChange={updateQuery}/>
                </div>
                <button className={styles.searchButton} onClick={onSearch}>
                <Search width={18}/>
                <div>Search</div>
                </button>
               
            </div>
            <div  className={styles.resultsContainer}>
                <div className={styles.results}>
                    {
                        campaigns.map( (campaign:Campaign) => 
                        (
                            <CampaignItem campaign={campaign} customStyle={{width:350, height:250}}></CampaignItem>
                        )
                        )
                    }
                    {
                        campaigns.length == 0 &&
                        <div>
                            There are no created campaigns.
                        </div>
                    }
                </div>
                <button className={styles.viewMoreButton} onClick={onSearchMore}>View More</button>
            </div>
            { 
                actions.length > 0 &&
                (
                    <ActionDisplay actions={actions} />
                )
            }
        </div>
    );

};
export default SearchCampaigns;

   