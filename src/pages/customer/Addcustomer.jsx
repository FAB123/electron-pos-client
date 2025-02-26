import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../../components/controls/Breadcrumb";
import Stack from "@mui/material/Stack";
import { PinkButton, PurpleButton } from "../../components/util/Theming";
import { useParams } from "react-router-dom";
import { getData, postData } from "../../apis/apiCalls";
import ToasterContainer from "../../components/controls/ToasterContainer";
import toaster from "../../instence/toaster";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormInputText,
  FormInputDropdown,
} from "../../components/controls/mui/";
import { customerHelper } from "../../helpers/FormHelper";
import ProgressLoader from "../../components/controls/ProgressLoader";
import { B2CCustomerValidation } from "../../helpers/FormTrasilationHelper";
import { Box } from "@mui/system";
import { Card, CardContent, Paper } from "@mui/material";
import { GETCUSTOMERBYID, SAVECUSTOMER } from "../../constants/apiUrls";
import ConfirmBox from "../../components/bundled/ConfirmBox";

function Addcustomer(props) {
  const { quickRegister, quickInsert, customer_id } = props;

  const { customerId } = useParams();
  const [confirmation, setConfirmation] = useState(false);

  const submitRef = useRef(null);
  const { t } = useTranslation();
  const [disableSubmit, setDisableSubmit] = useState(false);

  const { handleSubmit, reset, control } = useForm({
    defaultValues: customerHelper.initialValues,
    resolver: yupResolver(B2CCustomerValidation),
    mode: "onBlur",
  });

  useEffect(() => {
    let customerid = quickRegister ? customer_id : customerId;
    if (customerid) {
      getData(`${GETCUSTOMERBYID}${customerid}`).then((response) => {
        let customer = response.data;
        const initialData = {
          customerId: customerid,
          name: customer.name || "",
          email: customer.email || "",
          mobile: customer.mobile || "",
          street: customer.street || "",
          additional_street: customer.additional_street || "",
          city: customer.city || "",
          city_sub_division: customer.city_sub_division || "",
          building_number: customer.building_number || "",
          plot_identification: customer.plot_identification || "",
          identity_type: customer.identity_type || "",
          party_id: customer.party_id || "",
          state: customer.state || "",
          zip: customer.zip || "",
          country: customer.country || "",
          company_name: customer.company_name || "",
          account_number: customer.account_number || "",
          billing_type: customer.billing_type === 1 ? true : false || false,
          opening_balance:
            customer.opening_balance && customer.opening_balance.amount,
          customer_type: customer.customer_type,
          comments: customer.comments || "",
        };
        reset(initialData);
      });
    }
  }, []);

  const onSubmit = (values) => {
    setDisableSubmit(true);
    if (!disableSubmit) {
      postData(SAVECUSTOMER, values).then((response) => {
        if (response.error) {
          toaster.error(t(response.message) + response.info);
        } else {
          quickInsert(response.customer_id);
          toaster.success(t(response.message));
          reset();
        }
        setTimeout(() => {
          setDisableSubmit(false);
        }, 1000);
      });
    }
  };

  return (
    <Stack>
      <Breadcrumb labelHead="Customer" labelSub="Add/Edit Customer" />
      <ToasterContainer />

      <ProgressLoader open={disableSubmit} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <Paper elevation={20}>
            <Card>
              <CardContent>
                <FormInputText
                  label={t("customers.name")}
                  name="name"
                  control={control}
                  secondary
                />

                <FormInputText
                  label={t("common.companyname")}
                  name="company_name"
                  control={control}
                />

                <FormInputText
                  label={t("common.email")}
                  name="email"
                  control={control}
                />
                <FormInputText
                  label={t("common.mobile")}
                  name="mobile"
                  type="number"
                  control={control}
                />

                <FormInputDropdown
                  label={t("common.identity_type")}
                  name="identity_type"
                  control={control}
                  options={customerHelper.identityType}
                />

                <FormInputText
                  label={t("common.party_id")}
                  name="party_id"
                  control={control}
                />

                <Stack
                  spacing={2}
                  sx={{ mx: 3, mb: 3 }}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <PinkButton
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setConfirmation(t("common.confirm"));
                    }}
                  >
                    Clear
                  </PinkButton>
                  <PurpleButton
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                    ref={submitRef}
                  >
                    Send
                  </PurpleButton>
                </Stack>
              </CardContent>
            </Card>
          </Paper>
        </Box>
      </form>
      {confirmation && (
        <ConfirmBox
          confirmation={confirmation}
          setConfirmation={setConfirmation}
          response={(a) => {
            setConfirmation(false);
            if (a) {
              quickInsert(-1);
              reset();
            }
          }}
        />
      )}
    </Stack>
  );
}

export default Addcustomer;
