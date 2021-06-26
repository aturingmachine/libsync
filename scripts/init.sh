echo ">>> Initializing LibSync Development Environment..."

echo ">>> Installing Core/Service Dependencies..."
npm ci --prefix ./core
echo ">>> Core/Service Dependencies Installed."

echo ">>> Installing Client Dependencies..."
npm ci --prefix ./client
echo ">>> Client Dependencies Installed."

echo ">>> Installing LibSync Dependencies"
npm ci
echo ">>> LibSync Dependencies Installed."

echo ">>> Initializing Configuration Files..."
cp ./core/.config.example.json ./core/.config.json
echo ">>> Configuration Files Initialized."

echo ">>> Run LibSync in development mode via 'npm run dev'"