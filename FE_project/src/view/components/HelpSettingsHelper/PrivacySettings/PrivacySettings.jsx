import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Bell, 
  Eye, 
  Lock, 
  Mail, 
  Smartphone, 
  Globe, 
  Users,
  Settings,
  Check,
  X
} from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import "./PrivacySettings.css";

const PrivacySettings = ({ user }) => {
  // Default settings for reset functionality
  const defaultSettings = {
    // Privacy Settings
    profileVisibility: 'friends',
    dataSharing: false,
    analyticsTracking: true,
    personalizedAds: false,
    locationSharing: false,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyDigest: true,
    securityAlerts: true,
    promotionalEmails: false,
    
    // Security Settings
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30',
    passwordStrength: 'medium'
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [activeSection, setActiveSection] = useState('privacy');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  // טעינת הגדרות המשתמש מ-Firebase
  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }

      try {
        const userSettingsRef = doc(db, "userSettings", user.uid);
        const settingsSnapshot = await getDoc(userSettingsRef);
        
        if (settingsSnapshot.exists()) {
          const userData = settingsSnapshot.data();
          setSettings({
            ...defaultSettings,
            ...userData.settings
          });
        } else {
          // אם אין הגדרות קיימות, שמור את ברירת המחדל
          await saveSettingsToFirebase(defaultSettings);
        }
      } catch (error) {
        console.error("Error loading user settings:", error);
        setSaveMessage('שגיאה בטעינת ההגדרות');
        setTimeout(() => setSaveMessage(''), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserSettings();
  }, [user]);

  // שמירת הגדרות ב-Firebase
  const saveSettingsToFirebase = async (settingsToSave) => {
    if (!user?.uid) return;

    try {
      const userSettingsRef = doc(db, "userSettings", user.uid);
      await setDoc(userSettingsRef, {
        userId: user.uid,
        userEmail: user.email,
        settings: settingsToSave,
        lastUpdated: new Date().toISOString(),
        updatedAt: new Date()
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error("Error saving settings:", error);
      throw error;
    }
  };

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSelectChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      await saveSettingsToFirebase(settings);
      setSaveMessage('ההגדרות נשמרו בהצלחה!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('שגיאה בשמירת ההגדרות. נסה שוב.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('האם אתה בטוח שברצונך לאפס את כל ההגדרות לברירת המחדל?')) {
      setIsSaving(true);
      try {
        await saveSettingsToFirebase(defaultSettings);
        setSettings(defaultSettings);
        setSaveMessage('ההגדרות אופסו לברירת המחדל');
        setTimeout(() => setSaveMessage(''), 3000);
      } catch (error) {
        setSaveMessage(error);
        setTimeout(() => setSaveMessage(''), 3000);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="toggle-item">
      <div className="toggle-info">
        <label className="toggle-label">{label}</label>
        {description && <p className="toggle-description">{description}</p>}
      </div>
      <div 
        className={`toggle-switch ${checked ? 'active' : ''}`}
        onClick={onChange}
      >
        <div className="toggle-slider"></div>
      </div>
    </div>
  );

  const SelectOption = ({ value, onChange, options, label, description }) => (
    <div className="select-item">
      <div className="select-info">
        <label className="select-label">{label}</label>
        {description && <p className="select-description">{description}</p>}
      </div>
      <select 
        className="select-dropdown"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  // מסך טעינה
  if (isLoading) {
    return (
      <div className="privacy-settings-container">
        <div className="loading-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          fontSize: '18px'
        }}>
          טוען הגדרות...
        </div>
      </div>
    );
  }

  return (
    <div className="privacy-settings-container">
      <div className="settings-header">
        <h2 className="settings-title">הגדרות פרטיות והתראות</h2>
        <p className="settings-subtitle">
          נהל את ההגדרות שלך לפרטיות, התראות וביטחון
        </p>
        {user && (
          <div className="user-context" style={{
            fontSize: '14px',
            color: '#666',
            marginTop: '8px'
          }}>
            הגדרות עבור: {user.displayName || user.email}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="settings-nav">
        <button 
          className={`nav-button ${activeSection === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveSection('privacy')}
        >
          <Shield className="nav-icon" />
          פרטיות
        </button>
        <button 
          className={`nav-button ${activeSection === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveSection('notifications')}
        >
          <Bell className="nav-icon" />
          התראות
        </button>
        <button 
          className={`nav-button ${activeSection === 'security' ? 'active' : ''}`}
          onClick={() => setActiveSection('security')}
        >
          <Lock className="nav-icon" />
          ביטחון
        </button>
      </div>

      {/* Privacy Section */}
      {activeSection === 'privacy' && (
        <div className="settings-section">
          <div className="section-header">
            <Eye className="section-icon" />
            <h3 className="section-title">הגדרות פרטיות</h3>
          </div>
          
          <div className="settings-list">
            <SelectOption
              value={settings.profileVisibility}
              onChange={(value) => handleSelectChange('profileVisibility', value)}
              options={[
                { value: 'public', label: 'ציבורי' },
                { value: 'friends', label: 'חברים בלבד' },
                { value: 'private', label: 'פרטי' }
              ]}
              label="נראות הפרופיל"
              description="בחר מי יכול לראות את הפרופיל שלך"
            />

            <ToggleSwitch
              checked={settings.dataSharing}
              onChange={() => handleToggle('dataSharing')}
              label="שיתוף נתונים עם צדדים שלישיים"
              description="אפשר שיתוף נתונים אנונימיים לשיפור השירות"
            />

            <ToggleSwitch
              checked={settings.analyticsTracking}
              onChange={() => handleToggle('analyticsTracking')}
              label="מעקב אנליטיקה"
              description="עזור לנו לשפר את החוויה שלך באמצעות נתוני שימוש"
            />

            <ToggleSwitch
              checked={settings.personalizedAds}
              onChange={() => handleToggle('personalizedAds')}
              label="פרסומות מותאמות אישית"
              description="הצג פרסומות הרלוונטיות לתחומי העניין שלך"
            />

            <ToggleSwitch
              checked={settings.locationSharing}
              onChange={() => handleToggle('locationSharing')}
              label="שיתוף מיקום"
              description="אפשר למערכת לגשת למידע המיקום שלך"
            />
          </div>
        </div>
      )}

      {/* Notifications Section */}
      {activeSection === 'notifications' && (
        <div className="settings-section">
          <div className="section-header">
            <Bell className="section-icon" />
            <h3 className="section-title">הגדרות התראות</h3>
          </div>
          
          <div className="settings-list">
            <div className="subsection">
              <h4 className="subsection-title">
                <Mail className="subsection-icon" />
                התראות אימייל
              </h4>
              
              <ToggleSwitch
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                label="התראות כלליות באימייל"
                description="קבל עדכונים חשובים באימייל"
              />

              <ToggleSwitch
                checked={settings.weeklyDigest}
                onChange={() => handleToggle('weeklyDigest')}
                label="סיכום שבועי"
                description="סיכום שבועי של הפעילות שלך"
              />

              <ToggleSwitch
                checked={settings.promotionalEmails}
                onChange={() => handleToggle('promotionalEmails')}
                label="אימיילים שיווקיים"
                description="קבל הצעות מיוחדות וחדשות על המוצר"
              />
            </div>

            <div className="subsection">
              <h4 className="subsection-title">
                <Smartphone className="subsection-icon" />
                התראות דחיפה
              </h4>
              
              <ToggleSwitch
                checked={settings.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
                label="התראות דחיפה"
                description="קבל התראות ישירות למכשיר שלך"
              />

              <ToggleSwitch
                checked={settings.smsNotifications}
                onChange={() => handleToggle('smsNotifications')}
                label="הודעות SMS"
                description="קבל הודעות חשובות ב-SMS"
              />
            </div>
          </div>
        </div>
      )}

      {/* Security Section */}
      {activeSection === 'security' && (
        <div className="settings-section">
          <div className="section-header">
            <Lock className="section-icon" />
            <h3 className="section-title">הגדרות ביטחון</h3>
          </div>
          
          <div className="settings-list">
            <ToggleSwitch
              checked={settings.twoFactorAuth}
              onChange={() => handleToggle('twoFactorAuth')}
              label="אימות דו-שלבי"
              description="הוסף שכבת ביטחון נוספת לחשבון שלך"
            />

            <ToggleSwitch
              checked={settings.loginAlerts}
              onChange={() => handleToggle('loginAlerts')}
              label="התראות התחברות"
              description="קבל התראה כאשר מישהו נכנס לחשבון שלך"
            />

            <ToggleSwitch
              checked={settings.securityAlerts}
              onChange={() => handleToggle('securityAlerts')}
              label="התראות ביטחון"
              description="קבל התראות על פעילות חשודה"
            />

            <SelectOption
              value={settings.sessionTimeout}
              onChange={(value) => handleSelectChange('sessionTimeout', value)}
              options={[
                { value: '15', label: '15 דקות' },
                { value: '30', label: '30 דקות' },
                { value: '60', label: 'שעה' },
                { value: '240', label: '4 שעות' },
                { value: '0', label: 'ללא הגבלה' }
              ]}
              label="פסק זמן התחברות"
              description="כמה זמן לחכות לפני ניתוק אוטומטי"
            />
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="save-section">
        {saveMessage && (
          <div className={`save-message ${saveMessage.includes('שגיאה') ? 'error' : 'success'}`}>
            {saveMessage}
          </div>
        )}
        <div className="button-group">
          <button 
            className={`save-button ${isSaving ? 'saving' : ''}`}
            onClick={handleSave}
            disabled={isSaving}
          >
            <Check className="save-icon" />
            {isSaving ? 'שומר...' : 'שמור שינויים'}
          </button>
          <button 
            className="reset-button"
            onClick={handleReset}
            disabled={isSaving || isLoading}
          >
            <X className="reset-icon" />
            אפס להגדרות ברירת מחדל
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;