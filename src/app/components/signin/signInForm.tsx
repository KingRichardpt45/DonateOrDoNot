"use client"

import styles from "../../components/authentication.module.css";
import {useState} from "react";
import {ActionDisplay} from "@/app/components/actionsNotifications/actionDisplay/ActionDisplay";
import {IActionResultNotification} from "../actionsNotifications/IActionResultNotification";
import {ActionResultNotificationError} from "../actionsNotifications/ActionResultNotificationError";


export default function SignInForm() 
{ 
  const [actionResults, setActionResults] =  useState<IActionResultNotification[]>([]);

  const handleSubmit = async (event: React.FormEvent) => 
  {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement); 
    setActionResults([]); 

    const response = await fetch("/api/account/signin", {
      method: "POST",
      body: formData,
    });

    switch(response.status)
    {
      case 200:
        window.location.href = "/";
        return;
      case 422:
        const responseBody =  await response.json();
        console.log(responseBody);
        let time = 1000;
        const actionsNotifications = [];
        for (const error of responseBody.errors) 
        {
          actionsNotifications.push( new ActionResultNotificationError(error.field,error.errors,time) );
          time += 1000;
        }
        setActionResults(actionsNotifications);
        break;
      default:
        alert(response.statusText);
        break
    }
  };

  return (
    <div style={{width:"100%",flexGrow:1, display:"flex", justifyContent:"center",alignItems:"center"}} >
      { actionResults.length > 0 &&
        <ActionDisplay actions={actionResults}/>
      }
      <div className={styles.signContainer}>
        <h2 className={styles.heading}>Sign In</h2>
        <form action="api/account/signin" method="POST" className={styles.signForm} onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            className={styles.inputField}
            placeholder="Email"
          />
          <input
            name="password"
            type="password"
            className={styles.inputField}
            placeholder="Password"
          />

          <div className={styles.signLink}>
          Forgot Your Password? <a href="/forgotpassword" className={styles.link}>Click Here!</a>
          </div>
          <div className={styles.signLink}>
          Want to create an account? <a href="/signup" className={styles.link}>Click Here!</a>
          </div>

          <button type="submit" className={styles.submitButton}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}