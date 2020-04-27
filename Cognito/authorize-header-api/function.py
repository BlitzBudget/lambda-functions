# Copyright 2017-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file
# except in compliance with the License. A copy of the License is located at
#
#     http://aws.amazon.com/apache2.0/
#
# or in the "license" file accompanying this file. This file is distributed on an "AS IS"
# BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations under the License.

import json
import time
import urllib.request
from jose import jwk, jwt
from jose.utils import base64url_decode

f_p_i_s = 'financialPortfolioId'
region = 'eu-west-1'
userpool_id = 'eu-west-1_cjfC8qNiB'
app_client_id = 'l7nmpavlqp3jcfjbr237prqae'
keys_url = 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_cjfC8qNiB/.well-known/jwks.json'.format(region, userpool_id)
# instead of re-downloading the public keys every time
# we download them only on cold start
# https://aws.amazon.com/blogs/compute/container-reuse-in-lambda/
with urllib.request.urlopen(keys_url) as f:
    response = f.read()
keys = json.loads(response.decode('utf-8'))['keys']
errorRespUA = {
    'status': '401',
     'statusDescription': 'UNAUTHORIZED',
     'headers': {
         'cache-control': [
             {
                 'key': 'Cache-Control',
                 'value': 'max-age=100'
             }
         ],
         "content-type": [
             {
                 'key': 'Content-Type',
                 'value': 'application/json'
             }
         ],
         'content-encoding': [
             {
                 'key': 'Content-Encoding',
                 'value': 'UTF-8'
             }
         ]
     },
     'body': json.dumps({
            'status': '401',
            'error': 'Unauthorized'
     })
}

def lambda_handler(event, context):
    print(str(event))
    request = event['Records'][0]['cf']['request']
    headerReq = request['headers']
    if 'Authorization' not in str(headerReq):
        print('Authorization is empty')
        return errorRespUA
    token = headerReq['authorization'][0]['value']
    if str(token) == 'null':
        print('Authorization is null')
        return errorRespUA
    # get the kid from the headers prior to verification
    headers = jwt.get_unverified_headers(token)
    kid = headers['kid']
    # search for the kid in the downloaded public keys
    key_index = -1
    for i in range(len(keys)):
        if kid == keys[i]['kid']:
            key_index = i
            break
    if key_index == -1:
        print('Public key not found in jwks.json')
        return errorRespUA
    # construct the public key
    public_key = jwk.construct(keys[key_index])
    # get the last two sections of the token,
    # message and signature (encoded in base64)
    message, encoded_signature = str(token).rsplit('.', 1)
    # decode the signature
    decoded_signature = base64url_decode(encoded_signature.encode('utf-8'))
    # verify the signature
    if not public_key.verify(message.encode("utf8"), decoded_signature):
        print('Signature verification failed')
        return errorRespUA
    print('Signature successfully verified')
    # since we passed the verification, we can now safely
    # use the unverified claims
    claims = jwt.get_unverified_claims(token)
    # additionally we can verify the token expiration
    if time.time() > claims['exp']:
        print('Token is expired')
        return errorRespUA
    # and the Audience  (use claims['client_id'] if verifying an access token)
    if claims['aud'] != app_client_id:
        print('Token was not issued for this audience')
        return errorRespUA
    # Check if the financial portfolio id is equal to query param
    #if f_p_i_s in str(request['querystring']):
    #    if claims['custom:financialPortfolioId'] not in str(request['querystring']): 
    #        print('Financial portfolio id did not match')
    #        return errorRespUA
    # now we can use the claims
    print(claims)
    return request
        
# the following is useful to make this script executable in both
# AWS Lambda and any other local environments
if __name__ == '__main__':
    # for testing locally you can enter the JWT ID Token here
    event = {'token': ''}
    lambda_handler(event, None)