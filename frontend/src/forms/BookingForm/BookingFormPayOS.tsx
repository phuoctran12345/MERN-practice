import { useForm } from "react-hook-form";
import { PayOSPaymentLinkResponse, UserType } from "../../../../shared/types";
import useSearchContext from "../../hooks/useSearchContext";
import { useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
    User,
    Phone,
    MessageSquare,
    CreditCard,
    Shield,
    CheckCircle,
    ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { formatVND } from "../../utils/formatCurrency";

type Props = {
    currentUser: UserType;
    paymentLink: PayOSPaymentLinkResponse;
};

export type BookingFormDataForPayOS = {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    adultCount: number;
    childCount: number;
    checkIn: string;
    checkOut: string;
    hotelId: string;
    orderCode: number;
    totalCost: number;
    specialRequests?: string;
};

/**
 * BookingFormPayOS Component
 * Form đặt phòng với PayOS payment
 */
const BookingFormPayOS = ({ currentUser, paymentLink }: Props) => {
    const search = useSearchContext();
    const { hotelId } = useParams();

    // Local state cho form fields
    const [phone, setPhone] = useState<string>(currentUser.phone || "");
    const [specialRequests, setSpecialRequests] = useState<string>("");

    const { handleSubmit, register } = useForm<BookingFormDataForPayOS>({
        defaultValues: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            adultCount: search.adultCount,
            childCount: search.childCount,
            checkIn: search.checkIn.toISOString(),
            checkOut: search.checkOut.toISOString(),
            hotelId: hotelId || "",
            orderCode: paymentLink.orderCode,
            totalCost: paymentLink.totalCost,
        },
        mode: "onChange",
        shouldUnregister: false,
    });

    /**
     * Xử lý khi user click "Thanh toán với PayOS"
     * Lưu form data vào sessionStorage và redirect đến PayOS checkout
     */
    const onSubmit = (formData: BookingFormDataForPayOS) => {
        // Tạo complete form data với phone và specialRequests
        const completeFormData: BookingFormDataForPayOS = {
            ...formData,
            phone: phone || undefined,
            specialRequests: specialRequests || undefined,
        };

        // Lưu form data vào sessionStorage để PaymentSuccess page có thể đọc
        sessionStorage.setItem("pendingBookingData", JSON.stringify(completeFormData));

        // Redirect đến PayOS checkout URL
        window.location.href = paymentLink.checkoutUrl;
    };

    return (
        <div className="p-6">
            <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                    <User className="h-6 w-6 text-blue-600" />
                    Xác nhận thông tin đặt phòng
                </CardTitle>
                <p className="text-gray-600 mt-2">
                    Vui lòng kiểm tra và hoàn tất thông tin đặt phòng của bạn
                </p>
            </CardHeader>

            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            Thông tin cá nhân
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    Họ
                                </Label>
                                <Input
                                    type="text"
                                    readOnly
                                    disabled
                                    className="bg-gray-50 text-gray-600"
                                    {...register("firstName")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    Tên
                                </Label>
                                <Input
                                    type="text"
                                    readOnly
                                    disabled
                                    className="bg-gray-50 text-gray-600"
                                    {...register("lastName")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    Email
                                </Label>
                                <Input
                                    type="email"
                                    readOnly
                                    disabled
                                    className="bg-gray-50 text-gray-600"
                                    {...register("email")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    Số điện thoại (Tùy chọn)
                                </Label>
                                <Input
                                    type="tel"
                                    placeholder="Nhập số điện thoại của bạn"
                                    className="focus:ring-2 focus:ring-blue-500"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Special Requests */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                            Yêu cầu đặc biệt (Tùy chọn)
                        </h3>

                        <div className="space-y-2">
                            <textarea
                                rows={4}
                                placeholder="Mọi yêu cầu đặc biệt, sở thích hoặc thông tin bổ sung..."
                                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                value={specialRequests}
                                onChange={(e) => setSpecialRequests(e.target.value)}
                            />
                            <p className="text-xs text-gray-500">
                                Cho chúng tôi biết nếu bạn có bất kỳ yêu cầu đặc biệt nào cho kỳ nghỉ của bạn
                            </p>
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                            Tổng giá
                        </h3>

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-700 font-medium">Tổng chi phí</span>
                                <span className="text-2xl font-bold text-blue-600">
                                    {formatVND(paymentLink.totalCost)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                Đã bao gồm thuế và phí
                            </div>
                        </div>
                    </div>

                    {/* PayOS Payment Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-600" />
                            Thanh toán qua PayOS
                        </h3>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-800 mb-2">
                                Bạn sẽ được chuyển hướng đến trang thanh toán PayOS để hoàn tất giao dịch.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-green-700">
                                <Shield className="h-3 w-3" />
                                Thanh toán an toàn và được mã hóa
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Thanh toán với PayOS
                            </div>
                        </Button>
                    </div>
                </form>

                {/* Trust Indicators */}
                <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3 text-green-500" />
                            Thanh toán an toàn
                        </div>
                        <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Xác nhận ngay
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3 text-green-500" />
                            Hỗ trợ 24/7
                        </div>
                    </div>
                </div>
            </CardContent>
        </div>
    );
};

export default BookingFormPayOS;

