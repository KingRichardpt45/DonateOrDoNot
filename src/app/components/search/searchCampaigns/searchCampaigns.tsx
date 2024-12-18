"use client"

import {Search} from "lucide-react";
import styles from "./searchCampaigns.module.css"
import {CampaignStatus} from "@/models/types/CampaignStatus";
import {useEffect, useRef, useState} from "react";
import {Campaign} from "@/models/Campaign";
import {ActionDisplay} from "../../actionsNotifications/actionDisplay/ActionDisplay";
import {IActionResultNotification} from "../../actionsNotifications/IActionResultNotification";
import {ActionResultNotificationError} from "../../actionsNotifications/ActionResultNotificationError";
import {ActionResultNotificationSuccess} from "../../actionsNotifications/ActionResultNotificationSuccess";
import DropdownInput from "../selectWithInput/selectWithInput";
import CampaignItem from "../../campaigns/CampaignsItem";

const SearchCampaigns : React.FC<{ route:string, pageSize:number, managerId:number|null ,mainSearch:boolean, exceptStatusList:CampaignStatus[] | null }>= ( {route, pageSize,managerId,exceptStatusList,mainSearch }) => {
    
    const campaignStatusEntries = Object.entries(CampaignStatus)
    const campaignStatusEntriesSize = campaignStatusEntries.length/2 -1;
    const defaultStatus = "none";

    const [firstRender, setFirstRender] = useState<boolean>(true);
    const [selectedStatus, setSelectedStatus] = useState<string>(defaultStatus);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const lastFetchedPage = useRef<number>(0);
    const [query,setQuery] = useState<string>("");
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
        lastFetchedPage.current = 0;
        await search(0);
    }

    async function onSearchMore()
    {
        let page = lastFetchedPage.current+1;
        await search(page,true);
        lastFetchedPage.current = page;
    }

    const bottomRef = useRef< HTMLDivElement | null>(null); // Reference to the bottom element

    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [campaigns]);
    
    async function search(page:number,viewMore:boolean=false)
    {
        setActions([]);

        let url = `/api/campaign?query=${query == "" ? "" : query}&page=${page}&pageSize=${pageSize}`;
        url = managerId ? `${url}&managerId=${managerId}`: url;
        url = selectedStatus !== defaultStatus ? `${url}&status=${selectedStatus}`: url;
        url = category !== "" ? `${url}&category=${category}` : url
        url = mainSearch? `${url}&mainSearch=${mainSearch}` : url
        const response = await fetch(url, { method: "Get"});
        let responseBody ;

        switch(response.status)
        {
        case 200:
            responseBody =  await response.json()
            const fetchedCampaigns = lastFetchedPage.current==0 && !viewMore ? [] : [...campaigns];
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
            if(!viewMore)
            {
                setCampaigns([]);
            }
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
        <div style={{minHeight:"300px"}}>
            <div className={styles.searchContainer}>
                <DropdownInput width={200} heigh={30} color="#3b3b3b" options={["Startup", "Health", "School", "Debt"]} onChange={onDroopCategoryChange} customContainerStyle={""} value={""}/>
                <select 
                    name="type"
                    id="type"
                    className={styles.dropdown}
                    onChange={onDroopDownChange}
                    value={selectedStatus}
                >
                    <option value={defaultStatus}>-- Select Status --</option>
                    {
                        campaignStatusEntries.map( ( [key, value] , index) => 
                            {
                                if(index < campaignStatusEntries.length/2 && !exceptStatusList?.includes(Number(key)))
                                {        
                                    console.log(key,value)
                                    return <option key={`optionSearch_${index}`} value={key}>{value}</option>
                                }
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
                        campaigns.map( (campaign:Campaign,index) => 
                        (
                            <a href={`/campaigns/${route}/${campaign.id}`} key={`searchLink_${index}_${lastFetchedPage}`}>
                                <CampaignItem key={`search_${index}_${lastFetchedPage}`} campaign={campaign} customStyle={{width:350, height:250}}></CampaignItem>
                            </a>
                        )
                        )
                    }
                    {
                        campaigns.length == 0 &&
                        <div>
                            There are no campaigns to show.
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
            <div ref={bottomRef}></div>
        </div>
    );

};
export default SearchCampaigns;

   