
Deploy
---------------------

### Creating Environments

`aws cloudformation create-stack --stack-name production-delete-items-stack --template-body file://production-delete-items-stack.json  --region eu-west-1 --profile blitzbudget --capabilities CAPABILITY_NAMED_IAM`

### Update CloudFormation Stack

`aws cloudformation update-stack --stack-name production-delete-items-stack --template-body file://production-delete-items-stack.json  --region eu-west-1 --profile blitzbudget --capabilities CAPABILITY_NAMED_IAM`