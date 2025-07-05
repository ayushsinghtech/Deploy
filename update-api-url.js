#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get Railway URL from command line argument
const railwayUrl = process.argv[2];

if (!railwayUrl) {
  console.log('❌ Please provide your Railway URL');
  console.log('Usage: node update-api-url.js https://your-app.railway.app');
  process.exit(1);
}

const apiFilePath = path.join(__dirname, 'frontend', 'lib', 'api.ts');

try {
  // Read the current file
  let content = fs.readFileSync(apiFilePath, 'utf8');
  
  // Update the API URL
  const newContent = content.replace(
    /const API_BASE_URL = .*?;/,
    `const API_BASE_URL = '${railwayUrl}/api';`
  );
  
  // Write back to file
  fs.writeFileSync(apiFilePath, newContent);
  
  console.log('✅ Frontend API URL updated successfully!');
  console.log(`📍 New URL: ${railwayUrl}/api`);
  
} catch (error) {
  console.error('❌ Error updating API URL:', error.message);
  process.exit(1);
} 