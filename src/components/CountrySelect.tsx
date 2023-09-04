import { useCountryStore } from '@/hooks/useCountryStore';
import { useState, useEffect } from 'react';
import Select from 'react-select';

export const CountrySelect = () => {
  const [countries, setCountries] = useState([]);
  const { selectedCountry, setSelectedCountry } = useCountryStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      'https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code',
    )
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setCountries(data.countries);
        if (!selectedCountry) {
          setSelectedCountry(data.userSelectValue);
        }
      })
      .finally(() => setLoading(false));
  }, [selectedCountry, setSelectedCountry]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mb-4">
      <Select
        options={countries}
        value={selectedCountry}
        onChange={(selectedOption) => setSelectedCountry(selectedOption)}
      />
      <pre>{JSON.stringify(selectedCountry, null, 2)}</pre>
    </div>
  );
};
