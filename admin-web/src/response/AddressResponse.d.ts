export interface AddressRes {
  ID: string;
  RecipientsName: string;
  RecipientsNumber: string;
  Address: string;
  DestinationLabel: string;
  ZipCode: string;
  Main: boolean;
}

export interface RajaOngkirRes {
  id: number;
  label: string;
  subdistrict_name: string;
  district_name: string;
  city_name: string;
  province_name: string;
  zip_code: string;
}