import jwt from 'jsonwebtoken';

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, consistent-return
export const handler = async (event, _context, callback) => {
  // check header or url parameters or post parameters for token
  const token = event.authorizationToken;

  if (!token) return callback(null, 'Unauthorized');

  // verifies secret and checks exp
  jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
    if (err) return callback(null, 'Unauthorized');

    // if everything is good, save to request for use in other routes
    return callback(null, generatePolicy(decoded.id, 'Allow', '*'));
  });
};
