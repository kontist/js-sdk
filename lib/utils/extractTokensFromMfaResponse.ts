import { MfaResult } from "../types";
import * as ClientOAuth2 from "client-oauth2";

type ConfirmedTokenData = {
  accessToken: string;
  refreshToken?: string;
};

export const extractTokensFromMfaResponse = (
  mfaResponse: MfaResult,
  currentToken: ClientOAuth2.Token | null
): ConfirmedTokenData => {
  const { token: accessToken, refresh_token: confirmedRefreshToken } = mfaResponse;

  const { refreshToken: existingRefreshToken } = currentToken || {};

  return {
    accessToken,
    refreshToken: confirmedRefreshToken || existingRefreshToken
  };
};
