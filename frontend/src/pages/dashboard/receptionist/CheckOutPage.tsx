import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../../../api-client";
import { BookingType } from "../../../../../shared/types";
import { formatVND } from "../../../utils/formatCurrency";
import { CheckCircle, Search, AlertCircle, CreditCard, Banknote } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import useAppContext from "../../../hooks/useAppContext";

/**
 * CheckOutPage Component
 * Trang check-out cho Receptionist (UC 10)
 */
const CheckOutPage = () => {
    const { showToast } = useAppContext();
    const queryClient = useQueryClient();
    const [searchInput, setSearchInput] = useState("");
    const [foundBooking, setFoundBooking] = useState<BookingType | null>(null);
    const [extraCharges, setExtraCharges] = useState("");
    const [notes, setNotes] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "">(""); // Payment method cho phần thanh toán bổ sung

    // Fetch bookings để tìm kiếm
    const { data: bookingsData } = useQuery({
        queryKey: ["getAllBookings"],
        queryFn: () => apiClient.getAllBookings({ limit: 1000 }),
    });

    // Fetch service requests cho booking
    const { data: serviceRequestsData } = useQuery({
        queryKey: ["getAllServiceRequests", foundBooking?._id],
        queryFn: () => apiClient.getAllServiceRequests({
            bookingId: foundBooking?._id,
        }),
        enabled: !!foundBooking,
    });

    // Check-out mutation
    const checkOutMutation = useMutation({
        mutationFn: (data: {
            bookingId: string;
            extraCharges?: number;
            notes?: string;
            paymentMethod?: "cash" | "card";
        }) => apiClient.checkOut(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getAllBookings"] });
            queryClient.invalidateQueries({ queryKey: ["getAllServiceRequests"] });
            showToast({
                title: "Check-out thành công!",
                description: "Đã cập nhật trạng thái booking và tính toán chi phí.",
                type: "SUCCESS",
            });
            setFoundBooking(null);
            setSearchInput("");
            setExtraCharges("");
            setNotes("");
            setPaymentMethod("");
        },
        onError: (error: any) => {
            showToast({
                title: "Check-out thất bại",
                description: error?.response?.data?.message || "Có lỗi xảy ra khi check-out",
                type: "ERROR",
            });
        },
    });

    const handleSearch = () => {
        if (!searchInput.trim()) {
            showToast({
                title: "Thiếu thông tin",
                description: "Vui lòng nhập booking code hoặc room number",
                type: "ERROR",
            });
            return;
        }

        const booking = bookingsData?.bookings?.find(
            (b) =>
                b._id.toLowerCase() === searchInput.toLowerCase() ||
                b._id.toLowerCase().includes(searchInput.toLowerCase())
        );

        if (booking) {
            // Kiểm tra booking có thể check-out không
            // Note: TypeScript type không có "checked_in" nhưng backend có thể trả về
            const bookingStatus = booking.status as string;
            if (bookingStatus && bookingStatus !== "checked_in") {
                showToast({
                    title: "Không thể check-out",
                    description: `Booking phải ở trạng thái "checked_in". Trạng thái hiện tại: ${bookingStatus}`,
                    type: "ERROR",
                });
                return;
            }

            setFoundBooking(booking);
        } else {
            showToast({
                title: "Không tìm thấy booking",
                description: "Vui lòng kiểm tra lại booking code",
                type: "ERROR",
            });
            setFoundBooking(null);
        }
    };

    const handleCheckOut = () => {
        if (!foundBooking) return;

        const extraChargesNum = extraCharges ? parseFloat(extraCharges) : 0;
        if (extraCharges && (isNaN(extraChargesNum) || extraChargesNum < 0)) {
            showToast({
                title: "Lỗi validation",
                description: "Extra charges phải là số dương",
                type: "ERROR",
            });
            return;
        }

        // Tính số tiền cần thanh toán thêm
        const amountToPay = calculateAmountToPay();

        // Nếu có số tiền cần thanh toán thêm → yêu cầu chọn payment method
        if (amountToPay > 0 && !paymentMethod) {
            showToast({
                title: "Chưa chọn phương thức thanh toán",
                description: "Vui lòng chọn phương thức thanh toán cho phần chi phí bổ sung",
                type: "ERROR",
            });
            return;
        }

        checkOutMutation.mutate({
            bookingId: foundBooking._id,
            extraCharges: extraChargesNum > 0 ? extraChargesNum : undefined,
            notes: notes || undefined,
            paymentMethod: amountToPay > 0 ? paymentMethod as "cash" | "card" : undefined,
        });
    };

    // Calculate costs
    // Backend có thể trả về array hoặc object với serviceRequests field
    const serviceRequests = Array.isArray(serviceRequestsData)
        ? serviceRequestsData
        : serviceRequestsData?.serviceRequests || [];

    const serviceRequestsTotal = serviceRequests.reduce(
        (sum: number, req: any) => sum + (req.price || 0),
        0
    );

    const extraChargesNum = extraCharges ? parseFloat(extraCharges) : 0;
    const bookingCost = foundBooking?.totalCost || 0;
    const totalCost = bookingCost + serviceRequestsTotal + extraChargesNum;

    // Tính số tiền đã thanh toán (nếu booking đã thanh toán online)
    const alreadyPaid = foundBooking?.paymentStatus === "paid" ? bookingCost : 0;

    // Tính số tiền cần thanh toán thêm
    const calculateAmountToPay = () => {
        return totalCost - alreadyPaid;
    };

    const amountToPay = calculateAmountToPay();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-black uppercase mb-2">
                    Check-out
                </h1>
                <p className="text-gray-600 font-medium">
                    Nhập booking code hoặc room number để tìm booking
                </p>
            </div>

            {/* Search Form */}
            <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0px 0px #000" }}>
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Nhập booking code hoặc room number..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                            className="pl-10 border-4 border-black font-bold"
                        />
                    </div>
                    <Button
                        onClick={handleSearch}
                        className="bg-yellow-100 border-4 border-black text-black font-black uppercase hover:bg-yellow-200"
                        style={{ boxShadow: "4px 4px 0px 0px #000" }}
                    >
                        <Search className="w-5 h-5 mr-2" />
                        Tìm kiếm
                    </Button>
                </div>
            </div>

            {/* Booking Details */}
            {foundBooking && (
                <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0px 0px #000" }}>
                    <h2 className="text-2xl font-black text-black uppercase mb-4">
                        Booking Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-sm text-gray-600 font-bold uppercase mb-1">Guest Name</p>
                            <p className="text-lg font-black">
                                {foundBooking.firstName} {foundBooking.lastName}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-bold uppercase mb-1">Email</p>
                            <p className="text-lg font-black">{foundBooking.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-bold uppercase mb-1">Check-in Date</p>
                            <p className="text-lg font-black">
                                {new Date(foundBooking.checkIn).toLocaleDateString("vi-VN")}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-bold uppercase mb-1">Check-out Date</p>
                            <p className="text-lg font-black">
                                {new Date(foundBooking.checkOut).toLocaleDateString("vi-VN")}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-bold uppercase mb-1">Booking Cost</p>
                            <p className="text-lg font-black">
                                {formatVND(foundBooking.totalCost)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-bold uppercase mb-1">Status</p>
                            <Badge className="bg-green-100 text-green-800 border-2 border-black font-bold">
                                {foundBooking.status}
                            </Badge>
                        </div>
                    </div>

                    {/* COST BREAKDOWN - Hiển thị rõ ràng đã thanh toán vs chưa thanh toán */}
                    <div className="mb-6 p-6 bg-gray-50 border-4 border-black" style={{ boxShadow: "4px 4px 0px 0px #000" }}>
                        <h3 className="text-xl font-black text-black uppercase mb-4">
                            Cost Breakdown
                        </h3>

                        <div className="space-y-3">
                            {/* Booking Cost */}
                            <div className="flex items-center justify-between p-3 bg-white border-2 border-black">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-700">Booking Cost:</span>
                                    {alreadyPaid > 0 && (
                                        <Badge className="bg-green-100 text-green-800 border border-black text-xs">
                                            Đã thanh toán online
                                        </Badge>
                                    )}
                                </div>
                                <span className="text-lg font-black">
                                    {formatVND(bookingCost)}
                                </span>
                            </div>

                            {/* Service Requests */}
                            {serviceRequestsTotal > 0 && (
                                <div className="p-3 bg-yellow-50 border-2 border-black">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-gray-700">Service Requests:</span>
                                        <span className="text-lg font-black text-yellow-800">
                                            {formatVND(serviceRequestsTotal)}
                                        </span>
                                    </div>
                                    {/* Chi tiết từng service request */}
                                    <div className="mt-2 space-y-1 pl-4 border-l-2 border-yellow-300">
                                        {serviceRequests.map((req: any, index: number) => (
                                            <div key={index} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">
                                                    • {req.serviceType || "Service"} {req.description ? `(${req.description})` : ""}
                                                </span>
                                                <span className="font-bold">{formatVND(req.price || 0)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Extra Charges */}
                            {extraChargesNum > 0 && (
                                <div className="flex items-center justify-between p-3 bg-orange-50 border-2 border-black">
                                    <span className="text-sm font-bold text-gray-700">Extra Charges:</span>
                                    <span className="text-lg font-black text-orange-800">
                                        {formatVND(extraChargesNum)}
                                    </span>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="border-t-2 border-black my-3"></div>

                            {/* Total Cost */}
                            <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-black">
                                <span className="text-lg font-black text-black uppercase">Total Cost:</span>
                                <span className="text-2xl font-black text-green-600">
                                    {formatVND(totalCost)}
                                </span>
                            </div>

                            {/* Already Paid */}
                            {alreadyPaid > 0 && (
                                <div className="flex items-center justify-between p-3 bg-blue-50 border-2 border-black">
                                    <span className="text-sm font-bold text-gray-700">Đã thanh toán (online):</span>
                                    <span className="text-lg font-black text-blue-600">
                                        {formatVND(alreadyPaid)}
                                    </span>
                                </div>
                            )}

                            {/* Amount to Pay */}
                            {amountToPay > 0 && (
                                <div className="flex items-center justify-between p-4 bg-red-50 border-4 border-red-500" style={{ boxShadow: "4px 4px 0px 0px #000" }}>
                                    <span className="text-lg font-black text-red-800 uppercase">
                                        Cần thanh toán thêm:
                                    </span>
                                    <span className="text-3xl font-black text-red-600">
                                        {formatVND(amountToPay)}
                                    </span>
                                </div>
                            )}

                            {/* No additional payment needed */}
                            {amountToPay === 0 && alreadyPaid > 0 && (
                                <div className="flex items-center justify-center p-3 bg-green-100 border-2 border-green-500">
                                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                    <span className="text-sm font-bold text-green-800">
                                        Đã thanh toán đủ - Không cần thanh toán thêm
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Extra Charges Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Extra Charges (VND) - Optional
                        </label>
                        <Input
                            type="number"
                            placeholder="Nhập phí phát sinh thêm (late checkout, damage, etc.)..."
                            value={extraCharges}
                            onChange={(e) => setExtraCharges(e.target.value)}
                            className="border-4 border-black font-bold"
                            min="0"
                        />
                    </div>

                    {/* Payment Method Selector - Chỉ hiển thị nếu có số tiền cần thanh toán thêm */}
                    {amountToPay > 0 && (
                        <div className="mb-6 p-4 bg-blue-50 border-4 border-black" style={{ boxShadow: "4px 4px 0px 0px #000" }}>
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                Payment Method (cho phần thanh toán bổ sung):
                            </label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("cash")}
                                    className={`flex-1 p-4 border-4 border-black font-black uppercase transition-all ${paymentMethod === "cash"
                                            ? "bg-green-100 text-black"
                                            : "bg-white text-gray-600 hover:bg-gray-100"
                                        }`}
                                    style={{ boxShadow: "4px 4px 0px 0px #000" }}
                                >
                                    <Banknote className="w-6 h-6 mx-auto mb-2" />
                                    Cash
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("card")}
                                    className={`flex-1 p-4 border-4 border-black font-black uppercase transition-all ${paymentMethod === "card"
                                            ? "bg-green-100 text-black"
                                            : "bg-white text-gray-600 hover:bg-gray-100"
                                        }`}
                                    style={{ boxShadow: "4px 4px 0px 0px #000" }}
                                >
                                    <CreditCard className="w-6 h-6 mx-auto mb-2" />
                                    Card
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notes Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Notes - Optional
                        </label>
                        <textarea
                            placeholder="Ghi chú..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-4 py-2 border-4 border-black font-bold resize-none"
                            rows={3}
                            style={{ boxShadow: "4px 4px 0px 0px #000" }}
                        />
                    </div>


                    {/* Check-out Button */}
                    <Button
                        onClick={handleCheckOut}
                        disabled={checkOutMutation.isPending}
                        className="w-full bg-green-100 border-4 border-black text-black font-black uppercase hover:bg-green-200 disabled:opacity-50"
                        style={{ boxShadow: "4px 4px 0px 0px #000" }}
                    >
                        {checkOutMutation.isPending ? (
                            "Đang xử lý..."
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Confirm Check-out
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* No Booking Found */}
            {!foundBooking && searchInput && (
                <div className="bg-yellow-100 border-4 border-black p-6 text-center" style={{ boxShadow: "8px 8px 0px 0px #000" }}>
                    <AlertCircle className="w-12 h-12 text-yellow-800 mx-auto mb-4" />
                    <p className="text-lg font-bold text-yellow-800">
                        Không tìm thấy booking. Vui lòng kiểm tra lại booking code.
                    </p>
                </div>
            )}
        </div>
    );
};

export default CheckOutPage;

