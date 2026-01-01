import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

/**
 * PaymentCancel Page
 * Hiển thị khi khách hàng hủy thanh toán trên PayOS
 */
const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <XCircle className="h-6 w-6" />
            Thanh toán đã bị hủy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Bạn đã hủy thanh toán. Booking của bạn chưa được xác nhận.
          </p>
          <p className="text-sm text-gray-500">
            Nếu bạn muốn tiếp tục đặt phòng, vui lòng quay lại và thử lại.
          </p>
          <div className="flex flex-col gap-2 pt-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại trang trước
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;

