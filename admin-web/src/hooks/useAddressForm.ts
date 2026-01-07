import { useState, useRef } from "react";
import { searchDestinations } from "../services/RajaOngkirService";
import type { RajaOngkirRes } from "../response/AddressResponse";
import type { addressReq } from "../request/addressReq";

export const useAddressForm = () => {
  const [formData, setFormData] = useState<addressReq>({
    destinationID: "",
    RecipientsName: "",
    RecipientsNumber: "",
    address: "",
    zipCode: "",
    destinationLabel: "",
  });

  const [suggestions, setSuggestions] = useState<RajaOngkirRes[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (field: keyof addressReq, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = (query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchDestinations(query);
        setSuggestions(data.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setSuggestions([]);
      }
    }, 200);
  };

  const handleSelect = (item: RajaOngkirRes) => {
    setFormData((prev) => ({
      ...prev,
      destinationLabel: `${item.subdistrict_name}, ${item.district_name}, ${item.city_name}, ${item.province_name}`,
      zipCode: item.zip_code,
      destinationId: item.id.toString(),
    }));
    setSuggestions([]);
  };

  return {
    formData,
    setFormData,
    suggestions,
    handleChange,
    handleSearch,
    handleSelect,
  };
};
