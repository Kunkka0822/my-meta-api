import { faker } from "@faker-js/faker";
import { TokenPurchase, User } from "@prisma/client";
import axios from "axios";
import { ControllerError } from "../lib/exceptions/controller_exception";
import { env } from "../lib/helpers/env";
import { BalancesType } from "../models/user";
import { TokenPurchaseEntityService } from "./tokenPurchase.entity.service";

export const MMC_CURRENCY = env("MMC_CURRENCY");

export enum KYCStatus {
  NODATA = "NODATA",
  ACCEPT = "ACCEPT",
  DENY = "DENY",
  MANUAL_REVIEW = "MANUAL_REVIEW",
  REVERIFY = "REVERIFY",
}

const getApiUrl = (pref: string) => {
  const environment = env("NODE_ENV") === "production" ? "" : "staging";
  return "https://" + pref + "." + environment + ".tilia-inc.com";
};

const getAccessToken = async (scope: string) => {
  try {
    const defaultScope = "write_registration";
    const result = await axios.post(
      getApiUrl("auth") +
        "/token?client_id=" +
        env("TILIA_CLIENT_ID") +
        "&client_secret=" +
        env("TILIA_CLIENT_SECRET") +
        "&grant_type=client_credentials" +
        "&scope=" +
        (scope || defaultScope)
    );
    return result.data.access_token;
  } catch (e) {
    console.log(e);
    throw new ControllerError("Tilia auth failed");
  }
};
const registerUser = async ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => {
  const token = await getAccessToken("write_registrations");
  const username = "mymeta_" + name + "_" + faker.random.alphaNumeric(10);
  try {
    const result = await axios.post(
      getApiUrl("accounts") + "/register",
      {
        username,
        email: {
          address: email,
        },
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return result.data.payload.account_id;
  } catch (e) {
    console.error(e);
    throw new ControllerError("Register failed");
  }
};
const getUserWallets = async (user: User) => {
  try {
    const token = await getAccessToken("read_payment_methods");
    const result = await axios.get(
      getApiUrl("payments") + `/v1/${user.tiliaId}/payment_methods`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return result.data.payload;
  } catch (e) {
    console.log(e.response.data);
    throw new ControllerError("Get wallets failed");
  }
};

const getUserBalances = async (user: User): Promise<BalancesType> => {
  try {
    const data = await getUserWallets(user);
    const usdBalance = data
      .filter((item: any) => item.processing_currency === "USD")
      .reduce(
        (sum: number, current: any) => sum + parseInt(current.wallet_balance),
        0
      );

    const mmcConvertibleBalance = data
      .filter(
        (item: any) =>
          item.processing_currency === MMC_CURRENCY &&
          item.method_class === "convertible"
      )
      .reduce(
        (sum: number, current: any) => sum + parseInt(current.wallet_balance),
        0
      );
    const mmcSpendableBalance = data
      .filter(
        (item: any) =>
          item.processing_currency === MMC_CURRENCY &&
          item.method_class !== "convertible"
      )
      .reduce(
        (sum: number, current: any) => sum + parseInt(current.wallet_balance),
        0
      );
    return {
      usd: usdBalance || 0,
      mmcConvertible: mmcConvertibleBalance || 0,
      mmcSpendable: mmcSpendableBalance || 0,
    };
  } catch (e) {
    console.log(e.response.data);
    throw new ControllerError("Get balances failed");
  }
};

const authorizeUser = async (user: User) => {
  try {
    const token = await getAccessToken("write_user_tokens,write_invoices");
    const result = await axios.post(
      getApiUrl("auth") + `/authorize/user`,
      {
        account_id: user.tiliaId,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const { data } = result;
    if (data.status !== "Success") {
      throw new Error();
    }
    return data.payload.redirect;
  } catch (e) {
    console.log(e);
    throw new ControllerError("Tilia user authorization failed");
  }
};
const tosCheck = async (user: User) => {
  try {
    const token = await getAccessToken("read_accounts");
    const result = await axios.get(
      getApiUrl("accounts") + `/v1/user-info/${user.tiliaId}/tos/tilia`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const { data } = result;
    return data.signed_tos;
  } catch (e) {
    console.log(e);
    throw new ControllerError("Tos check failed failed");
  }
};

const initialTokenPurchase = async (
  tokenPurchase: TokenPurchase & { buyer: User }
) => {
  try {
    const token = await getAccessToken("write_tokens");
    const result = await axios.post(
      getApiUrl("invoicing") + `/v2/token/purchase`,
      {
        payment_method_id: tokenPurchase.paymentMethodId,
        amount: tokenPurchase.amount,
        currency: MMC_CURRENCY,
        destination_account_id: tokenPurchase.buyer.tiliaId,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const { data } = result;

    await TokenPurchaseEntityService.update(tokenPurchase, {
      tokenExchangeId: data.payload.token_exchange_id,
      invoiceId: data.invoice_id,
    });
  } catch (e) {
    console.log(e);
    await TokenPurchaseEntityService.update(tokenPurchase, {
      status: "Failure",
      errorReason: e.message,
    });
    throw new ControllerError("Tilia Token purchase failed");
  }
};
const executeTokenPurchase = async (tokenPurchase: TokenPurchase) => {
  try {
    const token = await getAccessToken("write_tokens");
    const result = await axios.post(
      getApiUrl("invoicing") +
        `/v2/token/purchase/${tokenPurchase.tokenExchangeId}`,
      undefined,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const { data } = result;
    await TokenPurchaseEntityService.update(tokenPurchase, {
      status: data.payload.status,
    });
  } catch (e) {
    console.error(e);
    console.log(e.response?.data);
    throw new ControllerError("Finalize Token Purchase failed");
  }
};

const processInvoice = async (invoiceData: any) => {
  try {
    const token = await getAccessToken(
      "read_payment_methods,write_user_tokens,write_invoices"
    );
    let result = await axios.post(
      getApiUrl("invoicing") + `/v2/invoice`,
      invoiceData,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const { data } = result;
    const invoiceId = data.payload.invoice_id;

    result = await axios.post(
      getApiUrl("invoicing") + `/v2/invoice/${invoiceId}/pay`,
      null,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    if (result.data.status === "Success") {
      return result.data.payload.invoice_id;
    }
    throw new Error("Transaction Failed");
  } catch (e) {
    console.error(e);
    console.log(e.response?.data);
    throw new ControllerError("Transaction failed");
  }
};
const checkKycStatus = async (user: User) => {
  try {
    const token = await getAccessToken("read_kycs");
    const result = await axios.get(
      getApiUrl("pii") + `/v1/kyc/${user.tiliaId}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return result.data.payload.state;
  } catch (e) {
    console.error(e);
    throw new ControllerError("Check Status failed");
  }
};

export const TiliaService = {
  getApiUrl,
  getAccessToken,
  registerUser,
  getUserWallets,
  getUserBalances,
  authorizeUser,
  tosCheck,
  initialTokenPurchase,
  executeTokenPurchase,
  processInvoice,
  checkKycStatus,
};
