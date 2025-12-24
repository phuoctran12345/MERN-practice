/**
 * Test kết nối Figma API trực tiếp
 * Test direct Figma API connection
 */

import { execSync } from 'child_process';

const FIGMA_TOKEN = 'figd_OTf5BbrcD2Z9XB7MtX9irrAIMy8vCzQbx9sCQRBF';
const FIGMA_FILE_KEY = 'eK6Fr1PPL1HeXZTv9942O9'; // SmartHotel file

async function testFigmaAPI() {
  console.log('🔍 Kiểm tra kết nối Figma API...\n');

  try {
    // Test 1: Kiểm tra user info
    console.log('📋 Test 1: Lấy thông tin user...');
    const userResponse = await fetch('https://api.figma.com/v1/me', {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('   ✅ Kết nối thành công!');
      console.log(`   👤 User: ${userData.handle || userData.email}`);
      console.log(`   📧 Email: ${userData.email}`);
      console.log('');
    } else {
      throw new Error(`API Error: ${userResponse.status} ${userResponse.statusText}`);
    }

    // Test 2: Kiểm tra file access
    console.log('📋 Test 2: Kiểm tra quyền truy cập file...');
    const fileResponse = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`, {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN
      }
    });

    if (fileResponse.ok) {
      const fileData = await fileResponse.json();
      console.log('   ✅ Có quyền truy cập file!');
      console.log(`   📄 File: ${fileData.name || 'SmartHotel'}`);
      console.log(`   📅 Last Modified: ${fileData.lastModified || 'N/A'}`);
      console.log('');
    } else {
      console.log(`   ⚠️  Không thể truy cập file: ${fileResponse.status} ${fileResponse.statusText}`);
      console.log('   💡 Kiểm tra xem bạn có quyền truy cập file không');
      console.log('');
    }

    // Test 3: Kiểm tra MCP package
    console.log('📋 Test 3: Kiểm tra package mcp-figma...');
    try {
      const packageInfo = execSync('npm view mcp-figma version 2>&1', { encoding: 'utf-8' }).trim();
      console.log(`   ✅ Package tồn tại: version ${packageInfo}`);
      console.log('');
    } catch (error: any) {
      console.log('   ❌ Không tìm thấy package');
      console.log('');
    }

    console.log('✅ Tất cả test đã hoàn thành!');
    console.log('');
    console.log('📝 Kết luận:');
    console.log('   - ✅ Figma API Token hoạt động tốt');
    console.log('   - ✅ Có thể truy cập Figma API trực tiếp');
    console.log('   - ⚠️  MCP Server cần restart Cursor để kết nối');
    console.log('');
    console.log('💡 Để kích hoạt MCP:');
    console.log('   1. Đóng Cursor hoàn toàn');
    console.log('   2. Mở lại Cursor');
    console.log('   3. MCP server sẽ tự động kết nối');
    console.log('   4. Kiểm tra trong Settings > Tools & MCP');

  } catch (error: any) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

// Chạy test
testFigmaAPI();

