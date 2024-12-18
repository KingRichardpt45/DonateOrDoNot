"use client"
import React from 'react';
import styles from './shopItem.module.css';
import { StoreItem } from '@/models/StoreItem';
import {File as ModelFile} from "@/models/File";

export const ShopItem: React.FC<{item:StoreItem, userID:number}> = ({item, userID})=>{

  const getItem = async () => {
    try {
      const formData = new FormData();
      formData.append("store_item_id", item.id!.toString() );
      formData.append("donor_id", userID.toString());

      // Send donation data to the API
      const response = await fetch("/api/store/",  { method: "POST", body: formData });

      if (response.ok) {
        const data = await response.json();
        console.log("Purchase Succesfull");
      } else {
        const error = await response.json();
        console.log("Purchase Failed");
      }
    } catch (error) {
      console.log("An error occurred. Please try again.");
    } finally {
      console.log("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.itemContainer}>
        <div className={styles.itemImage}>
            <img src={`/documents/${item.image_id}_${(item.image.value as ModelFile).original_name}`} alt={`${(item.image.value as ModelFile).original_name}`} width={100} height={100} />
        </div>
        <div className={styles.itemDescription}>
          <p>{item.name}</p>
          <p>{item.cost} 
            <img src="/images/donacoin.png" alt="Dona Coin" width={15} height={15}/>
          </p>
          <button onClick={getItem} className={styles.purchaseButton}>Purchase</button>
        </div>
    </div>
  );
};
