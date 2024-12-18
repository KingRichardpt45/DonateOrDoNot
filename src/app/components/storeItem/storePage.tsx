"use client"
import {useEffect, useState} from "react";
import {ShopItem} from "./shopItem";
import styles from "./StorePage.module.css"; // CSS module for styling
import {StoreItem} from "@/models/StoreItem";

export const StorePage: React.FC<{userID:number}> = ({userID})=>
{
    
    const [storeList,setStoreList]=useState<StoreItem[]>([]);

    useEffect(() => 
      { 
        fetch("/api/store/?query=&page=0&pageSize=20",{method:"GET"}).then(
          async (response)=>{
            if (response.ok){
              const bodyData = await response.json() as {data:StoreItem[]};
              const items = bodyData.data;
              setStoreList(items as StoreItem[]);
            }
          }
        );
      }, []);
    return (
        <div className={styles.page}>
            <div className={styles.storeTitle}>
                <h1>Shop</h1>
            </div>
            <div className={styles.storeContainer}>
                <div className={styles.storeMainContent}>
                    <div className={styles.itemList}>
                        {storeList.map((currentItem:StoreItem, index) => (
                            <ShopItem item={currentItem} userID={userID}key={index}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}