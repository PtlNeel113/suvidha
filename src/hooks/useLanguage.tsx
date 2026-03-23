import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { LanguageCode, t as translate, languages } from "@/lib/i18n";

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: Parameters<typeof translate>[0]) => string;
  languages: typeof languages;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => translate(key, "en"),
  languages,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LanguageCode>("en");

  const t = useCallback(
    (key: Parameters<typeof translate>[0]) => translate(key, lang),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
