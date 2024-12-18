import React from 'react';
import {Donor} from "@/models/Donor";
import {DonorManager} from "@/core/managers/DonorManager";
import {MainLayout} from "../components/coreComponents/mainLayout";
import TopDonorsList from "../components/topDonors/TopDonorsList";
import styles from "./rankingPage.module.css";
import TopDonors from '../components/topDonors/topDonors';

const donorManager = new DonorManager();

export default async function RankingPage() {
  const top10 = 10;
  const top5 = 5;

  // TOP 10 list
  const top10donorListResult = await donorManager.getTopTotalValueDonors(0,top10);
  const top10donorList = top10donorListResult.value;
  //console.log(donorList);
  
  //TOP 5 LIST
  const top5donorListResult = await donorManager.getTopTotalValueDonors(0,top5);
  const top5donorList:Donor[] = top5donorListResult.value!;

  return (
    <MainLayout passUser={null}>
      <div className={styles.page}>
        <main className={styles.main}>
          <TopDonors
            podiumDonors={top5donorList}
          />
          <div className={styles.topDonorsList}>
            {top10donorList && top10donorList.map((donor, index) => (
              <TopDonorsList
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
