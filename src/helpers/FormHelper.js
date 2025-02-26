const customerType = [
  { value: 0, label: "Retail" },
  { value: 1, label: "Wholesale" },
];

const identityType = [
  // { value: "TIN", label: "VAT NUMBER/TIN NUMBER" },
  { value: "CRN", label: "CRN NUMBER" },
  { value: "MOM", label: "MOMRA LICENCE NUMBER" },
  { value: "SAG", label: "SAGIA LICENCE NUMBER" },
  { value: "NAT", label: "NATIONAL ID NUMBER" },
  { value: "GCC", label: "GCC ID NUMBER" },
  { value: "IQA", label: "IQAMA NUMBER" },
  { value: "PAS", label: "PASSPORT NUMBER" },
];

const loginHelper = {
  initialValues: {
    username: "",
    password: "",
    store: "",
  },
};

const customerHelper = {
  customerType: customerType,
  identityType: identityType,
  initialValues: {
    name: "",
    comments: "",
    email: "",
    mobile: "",
    street: "",
    additional_street: "",
    city_sub_division: "",
    building_number: "",
    plot_identification: "",
    identity_type: "TIN",
    party_id: "",
    city: "",
    state: "",
    zip: "",
    country: "Saudi Arabia",
    company_name: "",
    account_number: "",
    opening_balance: 0,
    customer_type: customerType[0].value,
    billing_type: true,
  },
  stocks: [
    { value: "stock1", label: "Stock 1" },
    { value: "stock2", label: "Stock 2" },
  ],
};

export { loginHelper, customerHelper };
