//calculate vat amount
const calculateVat = (amount, percent, includeTax) => {
  var calculatedSubTotal = 0;
  var calculatedVat = 0;
  var calculatedTotal = 0;

  if (includeTax === "1") {
    let tax_fraction = parseFloat(percent) + 100;
    tax_fraction = tax_fraction / 100;
    let price_tax_excl = amount / tax_fraction;
    calculatedVat = amount - price_tax_excl;
    calculatedSubTotal = amount - calculatedVat;
    calculatedTotal = amount;
  } else {
    let tax_fraction = parseFloat(percent) / 100;
    calculatedVat = amount * tax_fraction;
    calculatedSubTotal = amount;
    calculatedTotal = amount + calculatedVat;
  }
  return {
    calculatedVat: calculatedVat.toFixed(2),
    calculatedSubTotal: calculatedSubTotal.toFixed(2),
    calculatedTotal: calculatedTotal.toFixed(2),
  };
};

//genrate current item vat details
const getVatInfo = (discountedTotal, vatList, includeTax) => {
  return new Promise((resolve, reject) => {
    let totalVatPercent = 0;
    let totalVatAmount = 0;
    let vatDetails = [];

    if (vatList.length !== undefined) {
      vatList.forEach(async (vat) => {
        totalVatPercent += isNaN(parseFloat(vat.percent))
          ? 0
          : parseFloat(vat.percent);

        let vatAmount = calculateVat(discountedTotal, vat.percent, includeTax);

        totalVatAmount += parseFloat(vatAmount.calculatedVat);

        vatDetails = [
          ...vatDetails,
          {
            amount: vatAmount.calculatedVat,
            percent: vat.percent,
            tax_name: vat.tax_name,
          },
        ];
      });
    }
    resolve({
      totalVatPercent: totalVatPercent,
      totalVatAmount: totalVatAmount,
      taxDetails: vatDetails,
    });
  });
};

//function for get item amount details
const calculateItemDetails = async (
  price,
  qty,
  discount,
  discount_type,
  vatList,
  includeTax
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let totalPrice = parseFloat(price) * parseFloat(qty);
      let discountedTotal = 0;
      if (discount_type === "P") {
        let discountValue = (totalPrice / 100) * discount;
        discountedTotal = totalPrice - parseFloat(discountValue);
      } else {
        discountedTotal = totalPrice - parseFloat(discount);
      }

      var vatDetails = await getVatInfo(discountedTotal, vatList, includeTax);

      var total = calculateVat(
        discountedTotal,
        vatDetails.totalVatPercent,
        includeTax
      );
      resolve({
        vatDetails: vatDetails,
        total: total,
      });
    } catch (e) {
      reject(e);
    }
  });
};

export { calculateItemDetails };
