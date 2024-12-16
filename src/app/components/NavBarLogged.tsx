"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, Bell } from 'lucide-react';
import styles from './components.module.css';
import Image from 'next/image';
import SideMenu from './SideMenu';
import { Notification } from '@/models/Notification';
import { StringCaseConverter } from '@/core/utils/StringCaseConverter';
import { NotificationTypes } from '@/models/types/NotificationTypes';
import { useConnectionContext } from './coreComponents/ioConnectionProvider';
import { EventNotification } from '@/services/hubs/events/EventNotification';
import { IHubEvent } from '@/services/hubs/IHubEvent';
import { RoomIdGenerator } from '@/services/hubs/notificationHub/RoomIdGenerator';
import { IRoomHubClientConnection } from '@/services/hubs/IRoomHubClientConnections';

export const HeaderL: React.FC<{ userName:string, userImage:string | null, userType:number,userId:number ,  notifications:Notification[] }> = ( {userId,userName,userImage,userType,notifications} )  => 
{
  const [render] = useState({isFirst:true});
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState<Notification[] >(notifications);

  const hubConnection = useRef<IRoomHubClientConnection | null>(null)
  
  //console.log("called navbar");

  if (typeof window !== "undefined" && render.isFirst) {
    
    //console.log("getHubConnection")
    hubConnection.current = useConnectionContext();
    hubConnection.current!.addAfterConnectionHandler(() => {
      const roomId = RoomIdGenerator.generateUserRoom(userId);
      
      //console.log("executed addAfterConnectionHandler", hubConnection.current!.getId());

     //hubConnection.current!.emitEvent(new EventNotification(null!));
      hubConnection.current!.joinRoom(roomId);

      hubConnection.current!.addEventListenerToRoom(roomId, EventNotification.name, (event: IHubEvent<unknown>) => {
         setActiveNotifications((prev) => [...prev, event.data as Notification]);
      });            
    });
    
    render.isFirst = false;
  }

  function notificationToHtml(notification:Notification) : React.JSX.Element
  {
    return (
      <div className={styles.notificationContainer}>  
        <div className={styles.notificationTitle}>{ StringCaseConverter.convertSnakeToNormal( NotificationTypes[notification.type]) }</div>
        <div className={styles.notificationMessage}>{notification.message}</div>
        <button onClick={ () => onMarckAsSeen(notification.id!) } className={styles.notificationMarkSeen}>Mark as Seen</button>
      </div>
    )
  }

  function onMarckAsSeen( notificationId:number )
  {
    const data = new FormData();
    data.set("id",notificationId.toString());
    fetch("/api/notification",{method:"POST",body:data})
      .then( (response)=> {
        if(response.ok)
        {
          setActiveNotifications(activeNotifications.filter((i)=> i.id != notificationId));
        }
      })
  }

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };
  
  return (
    <header className={styles.header}>
      <div className={styles.header__left}>
        <button
          className={styles.burgerButton}
          onClick={toggleSideMenu}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        <Link href="/" className={styles.header__logo}>
          <Image 
            src="/images/logo.png"
            alt="Donate Or Donot Logo"
            width={40}
            height={40}
            className={styles.logo_image}
          />
          Donate Or Donot
        </Link>
      </div>
      <div className={styles.header__user_info}>
        {
          userImage != null &&
          <Image
            src={`/documents/${userImage}`}
            alt={`${userName}'s profile`}
            width={40}
            height={40}
            className={styles.header__user_photo}
          />
        }
        {
          userImage == null &&
          <Image
            src={"/images/ProfileImageDefault.png"}
            alt={`${userName}'s profile`}
            width={40}
            height={40}
            className={styles.header__user_photo}
          />
        }
        <span className={styles.header__user_name}>{userName}</span>
        <div className={styles.notificationBell}>
          <button
            className={styles.bellButton}
            onClick={toggleNotifications}
            aria-label="Notifications"
          >
            <Bell size={24} />
          </button>
          {isNotificationOpen && (
            <div className={styles.notificationDropdown}>
              {activeNotifications.length > 0 ? (
                <ul>
                  {activeNotifications.map((notification) => (
                    <li key={notification.id}>
                      {notificationToHtml(notification)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notifications</p>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Side Menu */}
      <SideMenu  userType={userType} isOpen={isSideMenuOpen} toggleMenu={toggleSideMenu} />
    </header>
  );
};
