import { APIGatewayProxyHandler } from 'aws-lambda';
import { UserService } from '../../services/user.service';
import buildResponse from '../../utils/buildResponse';
import { ClientErrorCodes, SuccessfullCodes } from '../../utils/statusCode';
import { userLoginSchema } from '../../validations/userLogin';

export const handler: APIGatewayProxyHandler = async event => {
  const { userID, accountID } = await userLoginSchema.validateAsync(JSON.parse(event.body as string) || {});
  const user = new UserService();

  const result = await user.login(accountID, userID);
  console.log('teste');

  if (result.error) {
    const response = buildResponse.buildErrorResponse(ClientErrorCodes.NotFound, 'NotFound');
    return response;
  }

  const response = buildResponse.buildSuccessfullResponse(SuccessfullCodes.OK, result);
  return response;
};
