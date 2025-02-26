import { B2CSALE } from "../../constants/constants";

class PrintEngine {
  constructor(data, saleType, storeData) {
    
    this.storeData = storeData;
    this.saleType = saleType;
    this.data = data;
  }

  get templatesType() {
    if (this.data.bill_type === B2CSALE) {
      return this.storeData.configuration_data.b2cprinting;
    } else {
      return this.storeData.configuration_data.b2bprinting;
    }
  }

  get invoiceTemplate() {
    return this.data?.bill_type;
  }

  get invoicePatern() {
    return this.storeData.configuration_data.invoice_patern;
  }

  generateInvoiceData() {
    let itemList = this.data.items.map((item) => {
      let serialnumber = item.serialnumber
        ? `\n Sr : ${item.serialnumber} `
        : "";
      let description = item.description
        ? `\n DESC. : ${item.description}`
        : "";

      let item_name_ar = item.item_name_ar ? `\n ${item.item_name_ar}` : "";

      return {
        item: `${item.item_name} ${item_name_ar} ${serialnumber} ${description}`,
        item_name: item.item_name,
        item_name_ar: item.item_name_ar,
        serialnumber: item.serialnumber,
        description: item.description,
        qty: item.quantity,
        unit: item.unit_name,
        price: item.item_unit_price,
        subtotal: item.item_sub_total,
        discount: `${item.discount} ${item.discount_type === "P" ? "[%]" : ""}`,
        vat: `${item.tax_amount} [${item.tax_percent}%]`,
        total: item.item_sub_total + item.tax_amount,
      };
    });

    let return_policy = {};

    return_policy = {
      return_policy: this.storeData.configuration_data.return_policy,
      return_policy_ar: this.storeData.configuration_data.return_policy_ar,
    };

    let tokenType = localStorage.getItem("tokenType");
    let shopID = localStorage.getItem("tokenShopID");
    let counterID = localStorage.getItem("tokenCounterID");


    return {
      company_data: {
        company_name: this.storeData.configuration_data.company_name,
        company_name_ar: this.storeData.configuration_data.company_name_ar,
        company_address: this.storeData.configuration_data.company_address,
        company_address_ar:
          this.storeData.configuration_data.company_address_ar,
        return_policy: return_policy.return_policy,
        return_policy_ar: return_policy.return_policy_ar,
        postal_code: this.storeData.configuration_data.egs_postal_zone,
        company_vat_number: this.storeData.configuration_data.vat_number,
        location_store_name: this.storeData.store.location_name_en,
        location_store_name_ar: this.storeData.store.location_name_ar,
        location_address_en: this.storeData.store.location_address_en,
        location_address_ar: this.storeData.store.location_address_ar,
        location_email: this.storeData.store.location_email,
        location_mobile: this.storeData.store.location_mobile,
        location_street_name_en: this.storeData.store.location_street_name_en,
        location_street_name_ar: this.storeData.store.location_street_name_ar,
        location_building_no: this.storeData.store.location_building_no,
        location_country_ar: this.storeData.store.location_country_ar,
        location_country_en: this.storeData.store.location_country_en,
        location_district_ar: this.storeData.store.location_district_ar,
        location_district_en: this.storeData.store.location_district_en,
        location_city_en: this.storeData.store.location_city_en,
        location_city_ar: this.storeData.store.location_city_ar,
        location_phone_number: this.storeData.store.location_mobile,
      },
      customer_details: this.data.customer ? this.data.customer : null,
      // `${this.saleType} ${this.data.sale_id}`
      payment: this.data.payment,
      token: this.data.token,
      table: this.data.table?.table_name_en ?? null,
      tokenData:
        tokenType === "true"
          ? `https://token.ahcjed.com/mytoken/${shopID}/${counterID}/${this.data.token}`
          : false,
      invoice_data: {
        invoice_number: this.data.transaction_id,
        invoicePatern: this.storeData.configuration_data.invoice_patern,
        sale_type: this.saleType,
        invoice_date: this.data.transaction_time,
        invoice_date_hijri: this.data.created_at,
        total_as_english: this.data.total_en,
        total_as_arabic: this.data.total_ar,
        subTotal: this.data.sub_total,
        totalVat: this.data.tax,
        total: this.data.total,
        discount: this.data.discount,
        net_amount: this.data.total - this.data.discount,
        body: itemList,
        qrData: this.data.qr_codes,
        qrDataString: this.data.qr_codes_string,
      },
    };
  }
}

export default PrintEngine;
