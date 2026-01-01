import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../../../api-client";
import { BookingType } from "../../../../../shared/types";
import { formatVND } from "../../../utils/formatCurrency";
import { CheckCircle, Search, AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import useAppContext from "../../../hooks/useAppContext";

/**
 * CheckInPage Component
 * Trang check-in cho Receptionist (UC 9)
 */
const CheckInPage = () => {
    const { showToast } = useAppContext();
    const queryClient = useQueryClient();
    const [searchInput, setSearchInput] = useState("");
    const [foundBooking, setFoundBooking] = useState<BookingType | null>(null);
    const [roomId, setRoomId] = useState("");

    // Fetch bookings để tìm kiếm
    const { data: bookingsData } = useQuery({
        queryKey: ["getAllBookings"],
        queryFn: () => apiClient.getAllBookings({ limit: 1000 }),
    });

    // Check-in mutation
    const checkInMutation = useMutation({
        mutationFn: (data: { bookingId: string; roomId?: string }) =>
            apiClient.checkIn(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getAllBookings"] });
            showToast("Check-in thành công!", "success");
            setFoundBooking(null);
            setSearchInput("");
            setRoomId("");
        },
        onError: (error: any) => {
            showToast(error?.response?.data?.message || "Có lỗi xảy ra", "error");
        },
    });

    const handleSearch = () => {
        if (!searchInput.trim()) {
            showToast("Vui lòng nhập booking code hoặc room number", "error");
            return;
        }

        const booking = bookingsData?.bookings?.find(
            (b) =>
                b._id.toLowerCase() === searchInput.toLowerCase() ||
                b._id.toLowerCase().includes(searchInput.toLowerCase())
        );

        if (booking) {
            // Kiểm tra booking có thể check-in không
            if (booking.status !== "confirmed") {
                showToast(
                    `Booking phải ở trạng thái "confirmed". Trạng thái hiện tại: ${booking.status}`,
                    "error"
                );
                return;
            }

            if (booking.paymentStatus !== "paid") {
                showToast(
                    `Booking chưa thanh toán. PaymentStatus: ${booking.paymentStatus}`,
                    "error"
                );
                return;
            }

            setFoundBooking(booking);
        } else {
            showToast("Không tìm thấy booking", "error");
            setFoundBooking(null);
        }
    };

    const handleCheckIn = () => {
        if (!foundBooking) return;

        checkInMutation.mutate({
            bookingId: foundBooking._id,
            roomId: roomId || undefined,
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-black uppercase mb-2">
                    Check-in
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
                            <p className="text-sm text-gray-600 font-bold uppercase mb-1">Total Cost</p>
                            <p className="text-lg font-black text-green-600">
                                {formatVND(foundBooking.totalCost)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-bold uppercase mb-1">Status</p>
                            <Badge className="bg-blue-100 text-blue-800 border-2 border-black font-bold">
                                {foundBooking.status}
                            </Badge>
                        </div>
                    </div>

                    {/* Room ID Input (Optional) */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Room ID (Optional)
                        </label>
                        <Input
                            placeholder="Nhập Room ID nếu có..."
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="border-4 border-black font-bold"
                        />
                    </div>

                    {/* Check-in Button */}
                    <Button
                        onClick={handleCheckIn}
                        disabled={checkInMutation.isPending}
                        className="w-full bg-green-100 border-4 border-black text-black font-black uppercase hover:bg-green-200 disabled:opacity-50"
                        style={{ boxShadow: "4px 4px 0px 0px #000" }}
                    >
                        {checkInMutation.isPending ? (
                            "Đang xử lý..."
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Confirm Check-in
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

export default CheckInPage;

