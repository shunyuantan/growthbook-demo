import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select, { SingleValue } from 'react-select';

const LANGUAGE_OPTIONS = [
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'id',
    label: 'Bahasa Indonesia',
  },
] as const;

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<
    (typeof LANGUAGE_OPTIONS)[number]
  >(LANGUAGE_OPTIONS[0]);
  const handleLanguageChange = async (
    languageKey: SingleValue<(typeof LANGUAGE_OPTIONS)[number]>,
  ) => {
    await i18n.changeLanguage(languageKey?.value);
  };

  const getLanguage = async () => {
    const language = await i18n.language;
    const found = LANGUAGE_OPTIONS.find((lang) => lang.value === language);
    if (!found) return;
    setSelectedLanguage(found);
  };

  useEffect(() => {
    getLanguage();
  });

  return (
    <div className="mb-4">
      <p>Change your Language</p>
      <Select
        options={LANGUAGE_OPTIONS}
        value={selectedLanguage}
        onChange={(selectedOption) => handleLanguageChange(selectedOption)}
      />
    </div>
  );
};
