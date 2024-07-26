import React, { useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import styles from "../styles/Account.module.css";

type TabType = "profile" | "support" | "settings";

const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <>
            <h2 className={styles.profileTitle}>Profile</h2>
            <div className={styles.profileField}>
              <label>Username</label>
              <input type="text" value="adam6266" readOnly />
            </div>
            <div className={styles.profileField}>
              <label>Name</label>
              <div className={styles.inputWithIcon}>
                <input type="text" defaultValue="Adam Sandler" />
                <Image
                  src="/icons/forward.png"
                  alt="Edit"
                  width={25}
                  height={25}
                  className={styles.editIcon}
                />
              </div>
            </div>
            <div className={styles.profileField}>
              <label>Email</label>
              <input type="email" value="adam455@gmail.com" readOnly />
            </div>
            <div className={styles.profileField}>
              <label>Referral ID</label>
              <div className={styles.inputWithIcon}>
                <input type="text" value="156678915" readOnly />
                <Image
                  src="/icons/copy.png"
                  alt="Copy"
                  width={22}
                  height={22}
                  className={styles.copyIcon}
                />
              </div>
            </div>
            <div className={styles.profileField}>
              <label>Change Password</label>
              <input type="password" value="********" readOnly />
            </div>
            <button className={styles.saveChangesButton}>Save Changes</button>
          </>
        );
      case "support":
        return (
          <>
            <h2 className={styles.profileTitle}>Support</h2>
            <Image
              src="/icons/support-guy.png"
              alt="Online Support"
              width={134}
              height={134}
              className={styles.supportIcon}
            />
            <div className={styles.profileField}>
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
            </div>
            <div className={styles.profileField}>
              <label>Message</label>
              <textarea placeholder="Enter your message" rows={5}></textarea>
            </div>
            <button className={styles.sendMessageButton}>Send Message</button>
          </>
        );
      case "settings":
        return (
          <>
            <h2 className={styles.profileTitle}>Custom API</h2>
            <Image
              src="/icons/locked.png"
              alt="API Key"
              width={90}
              height={90}
              className={styles.apiKeyIcon}
            />
            <div className={styles.profileField}>
              <label>API Key</label>
              <div className={styles.inputWithIcon}>
                <input type="text" placeholder="Enter your API key" />
                <Image
                  src="/icons/copy.png"
                  alt="Copy"
                  width={22}
                  height={22}
                  className={styles.copyIcon}
                />
              </div>
            </div>
            <button className={styles.saveApiKeyButton}>Save API Key</button>
          </>
        );
    }
  };

  return (
    <div className={styles.accountPage}>
      <div className={styles.navbarWrapper}>
        <Navbar />
      </div>
      <div className={styles.profileSection}>
        <div className={styles.accountHeader}>
          <h1 className={styles.accountTitle}>Account</h1>
          <div className={styles.coins}>
            <Image
              src="/icons/prepcoins.png"
              alt="PrepCoins"
              width={28}
              height={28}
            />
            <span>146</span>
          </div>
        </div>
        <div className={styles.smallNav}>
          <div
            className={`${styles.navItem} ${
              activeTab === "profile" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <Image src="/icons/user.png" alt="User" width={50} height={40} />
          </div>
          <div
            className={`${styles.navItem} ${
              activeTab === "support" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("support")}
          >
            <Image
              src="/icons/headphones.png"
              alt="Support"
              width={50}
              height={40}
            />
          </div>
          <div
            className={`${styles.navItem} ${
              activeTab === "settings" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Image
              src="/icons/data-encryption.png"
              alt="Security"
              width={50}
              height={40}
            />
          </div>
        </div>
        {renderTabContent()}
      </div>
      <button className={styles.logoutButton}>Log Out</button>
    </div>
  );
};

export default AccountPage;
