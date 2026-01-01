import { PayOS } from "@payos/node";

// Khởi tạo PayOS instance
const payos = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID as string,
  apiKey: process.env.PAYOS_API_KEY as string,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY as string,
});

export interface PaymentLinkData {
  orderCode: number;        // Mã đơn hàng (unique)
  amount: number;           // Số tiền (VND)
  description: string;      // Mô tả đơn hàng
  returnUrl: string;        // URL redirect sau khi thanh toán thành công
  cancelUrl: string;        // URL redirect khi hủy thanh toán
  items?: Array<{          // Danh sách sản phẩm (optional)
    name: string;
    quantity: number;
    price: number;
  }>;
}

/**
 * Tạo payment link từ PayOS
 * Sử dụng API chính thức: payOS.paymentRequests.create()
 */
export const createPaymentLink = async (data: PaymentLinkData) => {
  try {
    // ✅ PayOS API chính thức: paymentRequests.create()
    const paymentLink = await payos.paymentRequests.create({
      orderCode: data.orderCode,
      amount: data.amount,
      description: data.description,
      returnUrl: data.returnUrl,
      cancelUrl: data.cancelUrl,
      items: data.items || [],
    });

    return paymentLink;
  } catch (error) {
    console.error("❌ Lỗi tạo payment link:", error);
    throw error;
  }
};

/**
 * Xác thực webhook từ PayOS
 * Sử dụng API chính thức: payOS.webhooks.verify()
 */
export const verifyWebhook = (webhookData: any) => {
  try {
    // ✅ PayOS API chính thức: webhooks.verify()
    // Method này sẽ throw error nếu webhook không hợp lệ
    const verifiedData = payos.webhooks.verify(webhookData);
    return verifiedData; // Trả về dữ liệu đã verify
  } catch (error) {
    console.error("❌ Webhook không hợp lệ:", error);
    return null; // Trả về null nếu verify thất bại
  }
};

/**
 * Lấy thông tin payment link theo orderCode
 * Sử dụng API chính thức từ PayOS SDK
 * Note: Method có thể là get() hoặc getPaymentLinkInformation() tùy version
 */
export const getPaymentInfo = async (orderCode: number) => {
  try {
    // ✅ PayOS API chính thức: paymentRequests.get() hoặc getPaymentLinkInformation()
    // Dùng type assertion vì TypeScript có thể không có type definition đầy đủ
    const paymentRequests = payos.paymentRequests as any;
    const paymentInfo = await paymentRequests.get?.(orderCode) ||
                       await paymentRequests.getPaymentLinkInformation?.(orderCode) ||
                       await paymentRequests.getPaymentLinkInfo?.(orderCode);
    
    if (!paymentInfo) {
      throw new Error("Không tìm thấy method để lấy thông tin payment link trong PayOS SDK");
    }
    
    return paymentInfo;
  } catch (error) {
    console.error("❌ Lỗi lấy thông tin payment:", error);
    throw error;
  }
};

export default payos;

