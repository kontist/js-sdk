import { ErrorOpts } from "../errors";

type GraphQLAPIError = {
  response?: {
    errors?: [
      {
        message?: string;
        extensions?: {
          status?: number;
          type?: string;
        };
      }
    ];
  };
};

export const serializeGraphQLError = (graphQLError: GraphQLAPIError): ErrorOpts => {
  const errorOptions: ErrorOpts = {};

  const errorDetails =
    graphQLError.response &&
    graphQLError.response.errors &&
    graphQLError.response.errors[0];

  if (errorDetails) {
    errorOptions.message = errorDetails.message;

    const { extensions } = errorDetails;
    if (extensions) {
      errorOptions.status = extensions.status;
      errorOptions.type = extensions.type;
    }
  }

  return errorOptions;
};
