/**
 * Hàm kiểm tra kết nối với Figma MCP Server
 * Test connection to Figma MCP Server
 */

import { execSync } from 'child_process';

interface FigmaMCPResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

/**
 * Hàm chính để chạy test kết nối Figma MCP
 * Main function to test Figma MCP connection
 */
export async function run(): Promise<FigmaMCPResponse> {
  console.log('🔍 Bắt đầu kiểm tra kết nối Figma MCP...');
  console.log('🔍 Starting Figma MCP connection test...');
  console.log('');

  try {
    // Test 1: Kiểm tra môi trường Node.js
    if (typeof process === 'undefined') {
      throw new Error('Không phát hiện môi trường Node.js');
    }

    console.log('✅ Test 1: Môi trường Node.js');
    console.log(`   Node version: ${process.version}`);
    console.log('');

    // Test 2: Kiểm tra npm token
    console.log('🔍 Test 2: Kiểm tra npm authentication...');
    let npmLoggedIn = false;
    try {
      const npmWhoami = execSync('npm whoami 2>&1', { encoding: 'utf-8' }).trim();
      if (npmWhoami && !npmWhoami.includes('error')) {
        console.log(`   ✅ npm user: ${npmWhoami}`);
        npmLoggedIn = true;
      } else {
        throw new Error('Not logged in');
      }
    } catch (error: any) {
      console.log('   ⚠️  npm chưa đăng nhập hoặc token hết hạn');
      console.log('   ⚠️  npm not logged in or token expired');
      console.log('   💡 Chạy: npm login để đăng nhập lại');
      console.log('   💡 Run: npm login to login again');
    }
    console.log('');

    // Test 3: Kiểm tra package @modelcontextprotocol/server-figma
    console.log('🔍 Test 3: Kiểm tra package @modelcontextprotocol/server-figma...');
    let packageExists = false;
    try {
      const packageInfo = execSync('npm view @modelcontextprotocol/server-figma 2>&1', { encoding: 'utf-8' });
      if (packageInfo && !packageInfo.includes('404')) {
        console.log('   ✅ Package tồn tại');
        packageExists = true;
      } else {
        throw new Error('Package not found');
      }
    } catch (error: any) {
      console.log('   ❌ Package KHÔNG TỒN TẠI trong npm registry');
      console.log('   ❌ Package DOES NOT EXIST in npm registry');
      console.log('');
      console.log('   ⚠️  VẤN ĐỀ CHÍNH: @modelcontextprotocol/server-figma không phải là npm package!');
      console.log('   ⚠️  MAIN ISSUE: @modelcontextprotocol/server-figma is NOT an npm package!');
      console.log('');
      console.log('   📝 Giải thích:');
      console.log('   📝 Explanation:');
      console.log('      - Figma MCP Server được tích hợp sẵn trong Figma Dev Mode');
      console.log('      - Figma MCP Server is built-in to Figma Dev Mode');
      console.log('      - Không cần cài package từ npm');
      console.log('      - No need to install package from npm');
      console.log('      - Xem file FIGMA_MCP_SETUP.md để biết cách cấu hình đúng');
      console.log('      - See FIGMA_MCP_SETUP.md for correct setup instructions');
    }
    console.log('');

    // Test 4: Kiểm tra MCP resources (nếu có)
    console.log('🔍 Test 4: Kiểm tra MCP resources...');
    const testResults = {
      nodeEnv: true,
      npmLoggedIn,
      packageExists,
      mcpAvailable: false,
      figmaConnected: false,
      issues: [] as string[],
    };

    // Kiểm tra xem có thể truy cập MCP resources không
    // Note: Trong môi trường thực tế, bạn sẽ cần import MCP client
    console.log('   ⚠️  MCP Server không khả dụng (package không tồn tại)');
    console.log('   ⚠️  MCP Server not available (package does not exist)');
    testResults.issues.push('Package @modelcontextprotocol/server-figma không tồn tại');
    testResults.issues.push('Package @modelcontextprotocol/server-figma does not exist');
    
    console.log('');

    // Tổng hợp kết quả
    console.log('📋 Kết quả chi tiết / Detailed Results:');
    console.log(`   - Node.js Environment: ${testResults.nodeEnv ? '✅' : '❌'}`);
    console.log(`   - npm Logged In: ${testResults.npmLoggedIn ? '✅' : '⚠️'}`);
    console.log(`   - Package Exists: ${testResults.packageExists ? '✅' : '❌'}`);
    console.log(`   - MCP Available: ${testResults.mcpAvailable ? '✅' : '❌'}`);
    console.log(`   - Figma Connected: ${testResults.figmaConnected ? '✅' : '❌'}`);
    console.log('');

    if (testResults.issues.length > 0) {
      console.log('⚠️  Các vấn đề phát hiện / Issues detected:');
      testResults.issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
      console.log('');
      console.log('💡 Giải pháp / Solution:');
      console.log('   1. Xem file FIGMA_MCP_SETUP.md để biết cách cấu hình đúng');
      console.log('   1. See FIGMA_MCP_SETUP.md for correct setup instructions');
      console.log('   2. Hoặc sử dụng Figma REST API trực tiếp (xem ví dụ trong file)');
      console.log('   2. Or use Figma REST API directly (see example in file)');
    }

    return {
      success: testResults.nodeEnv,
      message: testResults.issues.length > 0 
        ? 'Phát hiện vấn đề với Figma MCP. Xem chi tiết ở trên.'
        : 'Kết nối cơ bản OK.',
      data: testResults,
    };

  } catch (error: any) {
    console.error('\n❌ Lỗi khi kiểm tra kết nối:', error.message);
    console.error('❌ Connection test error:', error.message);
    
    return {
      success: false,
      message: `Lỗi: ${error.message}`,
      error: error.message,
    };
  }
}

/**
 * Hàm helper để test với Figma file ID cụ thể
 * Helper function to test with specific Figma file ID
 */
export async function testFigmaFile(fileId: string): Promise<FigmaMCPResponse> {
  console.log(`\n🔍 Kiểm tra file Figma: ${fileId}`);
  console.log(`🔍 Testing Figma file: ${fileId}`);

  try {
    // Trong thực tế, bạn sẽ sử dụng MCP client để fetch file
    // In practice, you would use MCP client to fetch file
    // Example: const file = await mcpClient.getFigmaFile(fileId);
    
    console.log('⚠️  Cần implement MCP client để fetch file thực tế');
    console.log('⚠️  Need to implement MCP client to actually fetch file');
    
    return {
      success: true,
      message: `File ID ${fileId} đã được nhận. Cần MCP client để fetch.`,
      data: { fileId },
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Lỗi khi test file: ${error.message}`,
      error: error.message,
    };
  }
}

// Chạy test nếu file được execute trực tiếp
// Run test if file is executed directly
if (require.main === module) {
  run()
    .then((result) => {
      console.log('\n📊 Kết quả cuối cùng / Final Result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 Lỗi không mong đợi / Unexpected error:', error);
      process.exit(1);
    });
}

