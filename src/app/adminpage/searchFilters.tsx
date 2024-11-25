"use client";

import { useState } from "react";
import styles from "./admin.module.css";

export default function AdminPanel({ campaigns, users }) {
  const [view, setView] = useState("Campaigns"); // Toggle state
  const [stateFilter, setStateFilter] = useState("Pending"); // Filter by state
  const [search, setSearch] = useState(""); // Search filter

  const filteredCampaigns = campaigns.filter(
    (c) => c.state === stateFilter && c.title.toLowerCase().includes(search.toLowerCase())
  );
  const filteredUsers = users.filter(
    (u) => u.state === stateFilter && u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Header Controls */}
      <header className={styles.header}>
        <h1>Admin Panel</h1>
        <div className={styles.controls}>
          {/* View Toggle */}
          <select onChange={(e) => setView(e.target.value)} value={view} className={styles.select}>
            <option value="Campaigns">Campaigns</option>
            <option value="Users">Users</option>
          </select>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchBar}
          />

          {/* State Filter */}
          <select onChange={(e) => setStateFilter(e.target.value)} value={stateFilter} className={styles.select}>
            <option value="Pending">Pending</option>
            <option value="In Analysis">In Analysis</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </header>

      {/* Main Grid */}
      <div className={styles.grid}>
        {view === "Campaigns" &&
          filteredCampaigns.map((c) => (
            <div key={c.id} className={styles.card}>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <p>
                <strong>State:</strong> {c.state}
              </p>
              {c.state === "Pending" && (
                <div className={styles.buttonGroup}>
                  <button className={styles.editButton}>Edit</button>
                </div>
              )}
            </div>
          ))}
        {view === "Users" &&
          filteredUsers.map((u) => (
            <div key={u.id} className={styles.card}>
              <h3>{u.name}</h3>
              <p>{u.email}</p>
              <p>
                <strong>State:</strong> {u.state}
              </p>
              {u.state === "Pending" && (
                <div className={styles.buttonGroup}>
                  <button className={styles.acceptButton}>Accept</button>
                  <button className={styles.denyButton}>Deny</button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
