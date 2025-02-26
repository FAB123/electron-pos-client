import * as Yup from "yup";
import i18n from "../i18n";

const loginTransilationHelper = Yup.object({
  username: Yup.string().required(i18n.t("login.username_required")),
  password: Yup.string().required(i18n.t("login.password_required")),
  store: Yup.string().required(i18n.t("login.store_required")),
});

const B2CCustomerValidation = Yup.object({
  name: Yup.string().required(i18n.t("common.nameisrequierd")),
  email: Yup.string().email(i18n.t("common.emailisrequired")),
  mobile: Yup.number().typeError(i18n.t("common.mobilemustbeanumber")),
  additional_street: Yup.string(),
  city: Yup.string(),
  city_sub_division: Yup.string(),
  building_number: Yup.string().max(4),
  plot_identification: Yup.string().max(4),
  identity_type: Yup.string(),
  party_id: Yup.string(),
  state: Yup.string(),
  zip: Yup.string().max(5, i18n.t("common.zipmustbeanumber")),
  company_name: Yup.string(),
  account_number: Yup.string(),
  type: Yup.string(),
  opening_balance: Yup.number(),
  comments: Yup.string(),
  country: Yup.string(),
});

export { loginTransilationHelper, B2CCustomerValidation };
