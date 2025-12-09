
echo "Running backend tests..."

echo "Running unit tests..."
npm test

echo "Running e2e tests..."
echo "Note: Make sure test database is running (docker-compose --profile test up test-db -d)"
npm run test:e2e

echo "Tests completed!"

