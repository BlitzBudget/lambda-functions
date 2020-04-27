# authorize-header-api
Authorize API headers and Retrieve Claims with Cognito

# install dependencies
pip install --target ./package python-jose

# Prepare zip file for lambda
1) cd package
2) zip -r9 ${OLDPWD}/function.zip .
3) cd $OLDPWD
4) zip -g function.zip function.py
