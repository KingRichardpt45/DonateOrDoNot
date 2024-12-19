"use client"
import React, {useState} from 'react';
import styles from './shopItem.module.css';
import {StoreItem} from '@/models/StoreItem';
import {File as ModelFile} from "@/models/File";
import {ActionDisplay} from "@/app/components/actionsNotifications/actionDisplay/ActionDisplay";
import {ActionResultNotificationError} from "@/app/components/actionsNotifications/ActionResultNotificationError";
import {IActionResultNotification} from "@/app/components/actionsNotifications/IActionResultNotification";
import {ActionResultNotificationSuccess} from "@/app/components/actionsNotifications/ActionResultNotificationSuccess";

export const ShopItem: React.FC<{ item: StoreItem, userID: number }> = ({item, userID}) => {

    const [actionResults, setActionResults] = useState<IActionResultNotification[]>([]);

    const getItem = async () => {
        try {
            const formData = new FormData();
            formData.append("store_item_id", item.id!.toString());
            formData.append("donor_id", userID.toString());

            // Send donation data to the API
            const response = await fetch("/api/store/", {method: "POST", body: formData});
            setActionResults([]);

            if (response.ok) {
                const actionsNotificationsError = [new ActionResultNotificationSuccess("Product added to your profile!", 2000)];
                setActionResults(actionsNotificationsError);
            } else {
                const actionsNotificationsError = [new ActionResultNotificationError("An error occured.", [], 2000)];
                setActionResults(actionsNotificationsError);
            }
        } catch (error) {
            const actionsNotificationsError = [new ActionResultNotificationError("An error occured.", [], 2000)];
            setActionResults(actionsNotificationsError);
        } finally {
            setTimeout(() => {
                setActionResults([]);
            }, 2000);
        }
    };

    return (
        <div>
            {
                actionResults.length > 0 &&
                (
                    <ActionDisplay actions={actionResults}/>
                )
            }
            <div className={styles.itemContainer}>
                <div className={styles.itemImage}>
                    <img src={`/documents/${item.image_id}_${(item.image.value as ModelFile).original_name}`}
                         alt={`${(item.image.value as ModelFile).original_name}`} width={100} height={100}/>
                </div>
                <div className={styles.itemDescription}>
                    <p>{item.name}</p>
                    <p>{item.cost}
                        <img src="/images/donacoin.png" alt="Dona Coin" width={15} height={15}/>
                    </p>
                    <button onClick={getItem} className={styles.purchaseButton}>Purchase</button>
                </div>
            </div>
        </div>
    );
};
