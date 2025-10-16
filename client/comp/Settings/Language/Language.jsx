import React, { useState } from "react";
import "./Language.css"; // Optional: For component-specific styles

const Language = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
    { code: "ta", label: "मराठी" },

    // Add more as needed
  ];

  const handleLanguageChange = (e) => {
    const selected = e.target.value;
    setSelectedLanguage(selected);

    // You can also save to localStorage or call API here
    localStorage.setItem("preferredLanguage", selected);

    // Optionally show a toast or alert
    // toast.success("Language updated!");
  };

  return (
    <div className="language-settings">
      <h3>Select Your Preferred Language</h3>
      <div className="language-options">
        {languages.map((lang) => (
          <label key={lang.code} className="language-option">
            <input
              type="radio"
              name="language"
              value={lang.code}
              checked={selectedLanguage === lang.code}
              onChange={handleLanguageChange}
            />
            {lang.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Language;
