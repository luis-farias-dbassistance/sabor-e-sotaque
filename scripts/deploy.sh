#!/bin/bash
set -e

REGION="us-east-1"
FRONTEND_STACK="sabor-sotaque-frontend"
BACKEND_STACK="sabor-sotaque-backend"

echo "================================================"
echo "  🍴 SABOR & SOTAQUE — AWS Free Tier Deployment"
echo "================================================"
echo ""

# Check AWS auth
echo "🔐 Verificando credenciales AWS..."
aws sts get-caller-identity > /dev/null 2>&1 || { echo "❌ No autenticado. Ejecuta 'aws login' primero."; exit 1; }
echo "✅ Credenciales válidas"
echo ""

# ============================================================
# Step 1: Deploy Backend Stack
# ============================================================
echo "📦 [1/5] Desplegando Backend (DynamoDB + Lambda + API Gateway + Cognito)..."
aws cloudformation deploy \
  --template-file deploy/backend-stack.yaml \
  --stack-name $BACKEND_STACK \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION \
  --no-fail-on-empty-changeset \
  --tags Project=portugues-para-turismo-cl App=sabor-e-sotaque Application=sabor-e-sotaque

# Get outputs
API_URL=$(aws cloudformation describe-stacks --stack-name $BACKEND_STACK --region $REGION --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' --output text)
USER_POOL_ID=$(aws cloudformation describe-stacks --stack-name $BACKEND_STACK --region $REGION --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' --output text)
CLIENT_ID=$(aws cloudformation describe-stacks --stack-name $BACKEND_STACK --region $REGION --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' --output text)

echo "✅ Backend desplegado"
echo "   API URL: $API_URL"
echo ""

# ============================================================
# Step 2: Package and Deploy Lambda Code
# ============================================================
echo "⚡ [2/5] Empaquetando Lambda function..."
LAMBDA_ZIP="deploy/lambda.zip"
rm -f $LAMBDA_ZIP
cd api && zip -q "../$LAMBDA_ZIP" index.js && cd ..

aws lambda update-function-code \
  --function-name SaborSotaque-API \
  --zip-file "fileb://$LAMBDA_ZIP" \
  --region $REGION > /dev/null

echo "✅ Lambda actualizada"
echo ""

# ============================================================
# Step 3: Deploy Frontend Stack (S3 + CloudFront)
# ============================================================
echo "🌐 [3/5] Desplegando Frontend (S3 + CloudFront)..."
aws cloudformation deploy \
  --template-file deploy/frontend-stack.yaml \
  --stack-name $FRONTEND_STACK \
  --region $REGION \
  --no-fail-on-empty-changeset \
  --tags Project=portugues-para-turismo-cl App=sabor-e-sotaque Application=sabor-e-sotaque

BUCKET=$(aws cloudformation describe-stacks --stack-name $FRONTEND_STACK --region $REGION --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' --output text)
DISTRIBUTION_ID=$(aws cloudformation describe-stacks --stack-name $FRONTEND_STACK --region $REGION --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' --output text)
CF_DOMAIN=$(aws cloudformation describe-stacks --stack-name $FRONTEND_STACK --region $REGION --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' --output text)

echo "✅ Frontend stack desplegado"
echo ""

# Update backend CORS with CloudFront domain
CF_DOMAIN_CLEAN=$(echo $CF_DOMAIN | sed 's|https://||')
aws lambda update-function-configuration \
  --function-name SaborSotaque-API \
  --environment "Variables={USERS_TABLE=SaborSotaque-Users,PROGRESS_TABLE=SaborSotaque-Progress,LESSONS_TABLE=SaborSotaque-Lessons,USER_POOL_ID=$USER_POOL_ID,CLIENT_ID=$CLIENT_ID,CORS_ORIGIN=https://$CF_DOMAIN_CLEAN}" \
  --region $REGION > /dev/null

# ============================================================
# Step 4: Build & Sync Static Files
# ============================================================
echo "🏗️  [4/5] Construyendo app estática..."
NEXT_PUBLIC_API_URL=$API_URL npm run build

echo "📤 Subiendo a S3..."
aws s3 sync out/ "s3://$BUCKET" --delete --region $REGION

echo "🔄 Invalidando caché de CloudFront..."
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*" \
  --region $REGION > /dev/null

echo "✅ Frontend desplegado"
echo ""

# ============================================================
# Step 5: Create Initial User
# ============================================================
echo "👤 [5/5] Creando usuario 'Mesero de Prueba'..."
aws cognito-idp admin-create-user \
  --user-pool-id $USER_POOL_ID \
  --username "mesero@saborsotaque.app" \
  --user-attributes Name=name,Value="Mesero de Prueba" Name=email,Value="mesero@saborsotaque.app" \
  --temporary-password "prueba123" \
  --message-action SUPPRESS \
  --region $REGION 2>/dev/null || echo "   (Usuario ya existe)"

aws cognito-idp admin-set-user-password \
  --user-pool-id $USER_POOL_ID \
  --username "mesero@saborsotaque.app" \
  --password "prueba123" \
  --permanent \
  --region $REGION 2>/dev/null || true

echo "✅ Usuario creado: mesero@saborsotaque.app / prueba123"
echo ""

# ============================================================
# Summary
# ============================================================
echo "================================================"
echo "  🎉 ¡DESPLIEGUE COMPLETADO!"
echo "================================================"
echo ""
echo "  🌐 App URL:  $CF_DOMAIN"
echo "  🔌 API URL:  $API_URL"
echo "  👤 Login:    mesero@saborsotaque.app"
echo "  🔑 Password: prueba123"
echo ""
echo "  💰 Costo estimado: \$0/mes (Free Tier)"
echo "================================================"
