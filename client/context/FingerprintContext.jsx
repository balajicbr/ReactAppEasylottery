// FingerprintContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getFingerprint } from "thumbmarkjs"; // ← here

const FingerprintContext = createContext();

export const FingerprintProvider = ({ children }) => {
  const [fingerprint, setFingerprint] = useState(null);

  useEffect(() => {
    const init = async () => {
      const fp = await getFingerprint(); // get the fingerprint hash
      setFingerprint(fp);
      console.log("Fingerprint:", fp); // check console
    };
    init();
  }, []);

  return (
    <FingerprintContext.Provider value={{ fingerprint }}>
      {children}
    </FingerprintContext.Provider>
  );
};

export const useFingerprint = () => useContext(FingerprintContext);
