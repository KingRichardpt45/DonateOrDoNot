import React, { useEffect, useState } from 'react';
import { Donor } from "@/models/Donor";
import { DonorManager } from "@/core/managers/DonorManager";
import { MainLayout } from "../components/coreComponents/mainLayout";
import styles from "./mostDonated.module.css";
import TopFrequent from '../components/topFrequent/topFrequent';
import TopFrequentList from '../components/topFrequent/topFrequentList';

const donorManager = new DonorManager();

export default async function mostFrequent() {
  const top10 = 10;
  const top5 = 5;

  // TOP 10 list
  const top10donorListResult = await donorManager.getTopTotalDonationsValueDonors(0,top10);
  const top10donorList = top10donorListResult.value;
  //console.log(donorList);
  
  //TOP 5 LIST
  const top5donorListResult = await donorManager.getTopTotalDonationsValueDonors(0,top5);
  const top5donorList:Donor[] = top5donorListResult.value!;

  return (
    <MainLayout passUser={null}>
      <div className={styles.page}>
        <main className={styles.main}>
          <TopFrequent
            podiumDonors={top5donorList}
          />
          <div className={styles.topDonorsList}>
            {top10donorList && top10donorList.map((donor, index) => (
              <TopFrequentList
              key={index}
              donor={donor}
              index={index + 1} 
              />
            ))}
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
