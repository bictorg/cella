import CountryFlag from '~/modules/common/country-flag';

import countries from '~/lib/countries.json';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/modules/ui/select';
import { useTranslation } from 'react-i18next';

const SelectCountry = ({ onChange, value }: { onChange: (value: string) => void; value: string }) => {
  const { t } = useTranslation();
  return (
    <Select onValueChange={onChange} value={value || ''}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t('common:placeholder.select_country')} />
      </SelectTrigger>
      <SelectContent className="h-[300px]">
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.name}>
            <CountryFlag countryCode={country.code} imgType="png" className="mr-2" />
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectCountry;
