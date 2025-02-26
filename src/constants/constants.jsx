import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ResetTvRoundedIcon from "@mui/icons-material/ResetTvRounded";
import NotStartedRoundedIcon from "@mui/icons-material/NotStartedRounded";
import SettingsIcon from "@mui/icons-material/Settings";
export const baseUrl = process.env.REACT_APP_API_URL + "/api/v2";
export const B2BSALE = "B2B";
export const B2CSALE = "B2C";

const menuData = [
  { icon: BarChartOutlinedIcon, label: "dashboard", link: "/dashboard" },
  {
    icon: ShoppingCartOutlinedIcon,
    label: "cash_sales",
    link: "/sales/cash_sales",
  },

  {
    icon: NotStartedRoundedIcon,
    label: "suspended",
    link: "/sales/suspended",
  },
  {
    icon: ResetTvRoundedIcon,
    label: "cash_sales_return",
    link: "/sales/cash_sales_return",
  },

  {
    icon: ArticleOutlinedIcon,
    label: "daily_sales",
    link: "/sales/daily_sales",
  },
  {
    icon: SettingsIcon,
    label: "app_setup",
    link: "/app_setup",
  },
];

const paymentTypes = [
  { value: "cash", name: "common.cash", label: "Cash" },
  { value: "creditcard", name: "common.creditcard", label: "Credit Card" },
  { value: "debitcard", name: "common.debitcard", label: "Debit Card" },
  { value: "bank", name: "common.bank", label: "Bank" },
];

const numberVarients = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "0", label: "0" },
  { value: ".", label: "." },
  { value: "clr", label: "CLR" },
  { value: "bck", label: "BCK" },
];

const toCurrency = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const colorPairs = [
  { color: "#3F51B5", lightColor: "#495aba" }, // Indigo and Darker Light Indigo
  { color: "#FF7043", lightColor: "#FF8A65" }, // Deep Orange and Darker Light Orange
  { color: "#66BB6A", lightColor: "#6dc971" }, // Green and Darker Light Green
  { color: "#29B6F6", lightColor: "#4FC3F7" }, // Blue and Darker Light Blue
  { color: "#FFEB3B", lightColor: "#FFDD57" }, // Yellow and Darker Light Yellow
  { color: "#EC407A", lightColor: "#f55389" }, // Pink and Darker Light Pink
  { color: "#FF8A65", lightColor: "#FF7F50" }, // Coral and Darker Coral
  { color: "#42A5F5", lightColor: "#4FC3F7" }, // Light Blue and Darker Light Blue
];

const accountHolderType = [
  {
    label: "modules.customers",
    value: "C",
  },
  {
    label: "modules.suppliers",
    value: "S",
  },
];

const journalHolderType = [
  {
    label: "modules.customers",
    value: "C",
  },
  {
    label: "modules.suppliers",
    value: "S",
  },
  {
    label: "modules.employee",
    value: "E",
  },
];

const accountsNatures = [
  {
    label: "accounts.account_asset",
    value: 1,
  },
  {
    label: "accounts.account_equity",
    value: 2,
  },
  {
    label: "accounts.account_liabilities",
    value: 3,
  },
  {
    label: "accounts.account_income",
    value: 4,
  },
  {
    label: "accounts.account_expenses",
    value: 5,
  },
];
const accountCodeList = [
  { label: "accounts.account_fixed_asset", value: "100-199" },
  { label: "accounts.account_current_asset", value: "200-299" },
  { label: "accounts.account_equity", value: "300-399" },
  { label: "accounts.account_liabilities", value: "400-499" },
  { label: "accounts.account_direct_income", value: "500-599" },
  { label: "accounts.account_indirect_income", value: "600-699" },
  { label: "accounts.account_direct_expenses", value: "700-799" },
  { label: "accounts.account_indirect_expenses", value: "800-899" },
];
const accountsTypes = {
  1: [
    { label: "accounts.account_fixed_asset", value: 1 },
    { label: "accounts.account_current_asset", value: 2 },
  ],
  2: [{ label: "accounts.account_equity", value: 3 }],
  3: [{ label: "accounts.account_liabilities", value: 4 }],
  4: [
    { label: "accounts.account_direct_income", value: 5 },
    { label: "accounts.account_indirect_income", value: 6 },
  ],
  5: [
    { label: "accounts.account_direct_expenses", value: 7 },
    { label: "accounts.account_indirect_expenses", value: 8 },
  ],
};

export {
  colorPairs,
  paymentTypes,
  toCurrency,
  numberVarients,
  accountsNatures,
  accountCodeList,
  accountsTypes,
  accountHolderType,
  journalHolderType,
  //user_permissions,
  menuData,
};
