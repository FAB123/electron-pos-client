import { getData } from "../apis/apiCalls";

// const initializeStoreConfig = (force = null) => {
//   let currentTime = Date.now();
//   const storeData = JSON.parse(localStorage.getItem("store_data"));

//   let lastUpdate = parseInt((storeData !== null && storeData.updateTime) || 0);
//   if (lastUpdate + 120000 < currentTime || force) {
//     getData("/get_required_info/1").then((requiredInfo) => {
//       const configurationData = {
//         ...storeData,
//         updateTime: currentTime,
//         configuration_data: requiredInfo.configuration_data,
//         tax_scheme: requiredInfo.tax_scheme,
//         invoice_templates: requiredInfo.invoice_templates,
//         company_logo: requiredInfo.company_logo,
//       };
//       localStorage.setItem("store_data", JSON.stringify(configurationData));
//     });
//   }
// };

const saveStoreConfig = (response) => {
  return new Promise((resolve, reject) => {
    let login_data = {
      auth_token: response.data.token,
      user: response.data.info.display_name,
      permissions: response.data.info.Permissions,
      store_id: response.data.info.storeID,
    };

    let store_data = {
      store: response.data.info.store,
      storeId: response.data.info.storeID,
      storeData: response.data.info.storeData,
    };

    localStorage.setItem("loginData", JSON.stringify(login_data));
    localStorage.setItem("store_data", JSON.stringify(store_data));
    resolve();
  });
};

// const validateLogin = () => {
//   let currentTime = Date.now();
//   const storeData = JSON.parse(localStorage.getItem("store_data")) || {
//     updateTime: 0,
//   };
//   let loginData = JSON.parse(localStorage.getItem("loginData")) || {};

//   if (loginData.authToken !== 0) {
//     if (storeData.updateTime + 120000 < currentTime) {
//       getData("/get_required_info/1").then((requiredInfo) => {
//         const configurationData = {
//           ...storeData,
//           updateTime: currentTime,
//           configuration_data: requiredInfo.configuration_data,
//         };

//         localStorage.setItem("store_data", JSON.stringify(configurationData));
//       });
//     }
//     return true;
//   } else {
//     return false;
//   }
// };

const logout = () => {
  localStorage.removeItem("loginData");
  localStorage.removeItem("CASHSALE");
  localStorage.removeItem("store_data");
  localStorage.removeItem("CASHSALERETURN");
};

export {
  //  initializeStoreConfig,
  logout,
  //  validateLogin,
  saveStoreConfig,
};
