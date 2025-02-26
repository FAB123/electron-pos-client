//dashboard
export const GETBASICCONFIG = "/dashboard/get_basic_info";
export const GETSALESGRPAH = "/dashboard/get_sales_graph";
export const GETPURCHASEGRPAH = "/dashboard/get_purchase_graph";

//customer
export const SEARCHCUSTOMERLIST = "/customers/search_customers/";
export const GETCUSTOMERBYID = "/customers/get_customer_by_id/";
export const SAVECUSTOMER = "/customers/save_customer/1";

//items
export const GETITEMBYBARCODEORID = "/items/search_items_by_barcode";
export const SEARCHSALEITEMLIST = "/items/search_items/S/";
export const GETALLITEMCATEGORY = "/items/get_all_item_category";
export const GETALLITEMBYCATEGORY = "/items/get_all_item_by_category";

//quatation
export const SAVEQUATATION = "/quatation/save_quatation";
export const GETQUATATION = "/quatation/get_quatation";

//workorder
export const SAVEWORKORDER = "/workorder/save_work_order";
export const GETWORKORDER = "/workorder/get_workorder";

//sales
export const SAVESALE = "/sales/save_sale/1";
export const GETSALESHISTORY = "/sales/get_sales_history";
export const GETSALEBYID = "/sales/get_sale_by_id";
export const CLOSEPOSCOUNTER = "/sales/close_pos_counter";
export const GETPOSCOUNTERCLOSINGS = "/sales/get_closing_lists";


//sales recipts
export const GETCASHSALE = "/sales/get_sale";
export const GETCASHSALERETURN = "/sales/get_sale";
export const GETCREDITSALE = "/sales/get_sale";
export const GETCREDITSALERETURN = "/sales/get_sale";
export const GETDAILYSALES = "/sales/get_daily_sales";
export const GETRECONSILATION = "/sales/get_reconsilation_report";


//suspended sales
export const SUSPENDSALE = "/suspended_sales/save_suspended";
export const GETSUSPENEDSALE = "/suspended_sales/get_suspended_details";
export const GETALLSUSPENEDSALE = "/suspended_sales/get_all_suspended";

//configuration
export const GETALLACTIVEPAYMENTS = "/configurations/get_all_active_payments";
export const ACTIVATETOKEN = "/configurations/activate_location";
export const RESETTOKEN = "/configurations/reset_token";
export const SETTOKEN = "/configurations/set_token";
export const TOKENINFORMATION = "/configurations/token_info";
export const GETALLTABLES = "/configurations/get_all_tables";


export const BASECOUNTERDATA = "https://counterupdate.ahcjed.com:7738/api/v2/";

export const getApiConfig = () => {
  return new Promise((resolve, reject) => {
    const tokenApiToken = localStorage.getItem("tokenApiToken") || null;
    if (!tokenApiToken) {
      reject("NO TOKEN FOUND");
    }

    resolve({
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Max-Age": 7200,
        Accept: "application/json",
        Authorization: "Bearer " + tokenApiToken,
      },
    });
  });
};
