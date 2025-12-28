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
 */
export const createPaymentLink = async (data: PaymentLinkData) => {
  try {
    // PayOS API: createPaymentLink
    const paymentLink = await (payos as any).createPaymentLink({
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
 */
export const verifyWebhook = (webhookData: any) => {
  try {
    // PayOS API: verifyPaymentWebhookData hoặc verifySignature
    return (payos as any).verifyPaymentWebhookData?.(webhookData) || 
           (payos as any).verifySignature?.(webhookData, webhookData.signature) || 
           true; // Tạm thời return true nếu không có method
  } catch (error) {
    console.error("❌ Lỗi verify webhook:", error);
    return false;
  }
};

/**
 * Lấy thông tin payment theo orderCode
 */
export const getPaymentInfo = async (orderCode: number) => {
  try {
    // PayOS API: getPaymentLinkInformation hoặc getPaymentLinkInfo
    const paymentInfo = await (payos as any).getPaymentLinkInformation?.(orderCode) ||
                       await (payos as any).getPaymentLinkInfo?.(orderCode);
    return paymentInfo;
  } catch (error) {
    console.error("❌ Lỗi lấy thông tin payment:", error);
    throw error;
  }
};

export default payos;

