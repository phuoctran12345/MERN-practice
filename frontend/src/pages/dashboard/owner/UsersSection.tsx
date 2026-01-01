import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../../../api-client";
import { UserType } from "../../../../../shared/types";
import { Users, Edit, Trash2, Search, Filter, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import useAppContext from "../../../hooks/useAppContext";
import { useUserStore } from "../../../stores/userStore";
import UserForm from "../../../components/forms/UserForm";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { initSocket } from "../../../lib/socket";

/**
 * UsersSection Component
 * Quản lý Users (khách hàng) cho Owner với CRUD và soft delete
 */
const UsersSection = () => {
    const { showToast } = useAppContext();
    const { currentUser } = useUserStore();
    const queryClient = useQueryClient();

    // Lấy companyId của owner hiện tại
    const ownerCompanyId = currentUser?.companyId;

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    // Tách searchInput (value trong input) và searchTerm (dùng trong query)
    // Để debounce - chỉ gọi API sau khi user ngừng gõ 500ms
    const [searchInput, setSearchInput] = useState(""); // Value trong input field
    const [searchTerm, setSearchTerm] = useState(""); // Dùng trong query (debounced)
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [editingUser, setEditingUser] = useState<UserType | null>(null);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(1000); // Lấy tất cả users (không dùng pagination cho 7 users)
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: "danger" | "warning" | "info";
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
    });

    // ============================================
    // DEBOUNCE SEARCH INPUT
    // ============================================
    // Chỉ gọi API sau khi user ngừng gõ 800ms (tránh gọi API quá nhiều)
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setCurrentPage(1); // Reset về trang 1 khi search thay đổi
        }, 800); // Đợi 800ms sau khi user ngừng gõ (tăng từ 500ms để giảm reload)

        // Cleanup: Xóa timer nếu user gõ tiếp
        return () => clearTimeout(timer);
    }, [searchInput]);

    // ============================================
    // SOCKET.IO - REAL-TIME UPDATES
    // ============================================
    // Lắng nghe events từ backend để tự động refresh danh sách users
    useEffect(() => {
        const socket = initSocket();

        // Khi user được update → refresh danh sách
        socket.on("user:updated", () => {
            queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
        });

        // Khi user được delete → refresh danh sách
        socket.on("user:deleted", () => {
            queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
        });

        // Khi user được activate → refresh danh sách
        socket.on("user:activated", () => {
            queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
        });

        // Cleanup: Xóa listeners khi component unmount
        return () => {
            socket.off("user:updated");
            socket.off("user:deleted");
            socket.off("user:activated");
        };
    }, [queryClient]);

    // ============================================
    // FETCH CUSTOMERS TỪ BACKEND
    // ============================================
    // CHỈ LẤY CUSTOMERS (role = "user") ĐÃ ĐẶT PHÒNG Ở HOTELS CỦA CÔNG TY OWNER
    // Backend sẽ tự động filter: chỉ lấy customers có bookings ở hotels của companyId
    // Backend trả về: { message, users: [...], pagination: {...} }
    const { data: usersData, isLoading } = useQuery({
        queryKey: ["getAllUsers", "customers", ownerCompanyId, roleFilter, statusFilter, searchTerm, currentPage],
        queryFn: () => {
            // Chuẩn bị params để gửi lên backend
            const params: {
                role?: string;
                isActive?: boolean;
                search?: string;
                page?: number;
                limit: number;
                companyId?: string;
            } = {
                page: currentPage,
                limit: pageSize, // Số users mỗi trang
            };

            // CHỈ LẤY CUSTOMERS (role = "user") - KHÔNG LẤY EMPLOYEES
            // Nếu roleFilter = "all" → vẫn chỉ lấy "user"
            if (roleFilter && roleFilter !== "all") {
                // Nếu chọn role cụ thể, chỉ lấy role đó (nhưng phải là "user")
                if (roleFilter === "user") {
                    params.role = "user";
                }
            } else {
                // Mặc định: chỉ lấy customers (role = "user")
                params.role = "user";
            }

            // Gửi companyId để backend filter customers đã đặt phòng ở hotels của công ty
            if (ownerCompanyId) {
                params.companyId = ownerCompanyId;
            }

            if (statusFilter && statusFilter !== "all") {
                params.isActive = statusFilter === "active";
            }
            if (searchTerm && searchTerm.trim()) {
                params.search = searchTerm.trim();
            }

            return apiClient.getAllUsers(params);
        },
        enabled: true, // Luôn fetch (nếu không có companyId, backend sẽ trả về tất cả customers)
        // ============================================
        // QUERY OPTIONS - TRÁNH REFETCH KHÔNG CẦN THIẾT
        // ============================================
        staleTime: 30 * 1000, // Data vẫn "fresh" trong 30 giây (không refetch)
        gcTime: 5 * 60 * 1000, // Giữ cache 5 phút
        refetchOnWindowFocus: false, // Không refetch khi focus vào window
        refetchOnMount: false, // Không refetch khi component mount lại
        refetchOnReconnect: false, // Không refetch khi reconnect
    });

    // Delete user mutation (Soft delete - Deactivate)
    const deleteMutation = useMutation({
        mutationFn: apiClient.deleteUser,
        onSuccess: () => {
            showToast({
                title: "User Deactivated",
                description: "User has been deactivated successfully (soft delete).",
                type: "SUCCESS",
            });
            queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
        },
        onError: () => {
            showToast({
                title: "Deactivate Failed",
                description: "Failed to deactivate user. Please try again.",
                type: "ERROR",
            });
        },
    });

    // Activate user mutation
    const activateMutation = useMutation({
        mutationFn: apiClient.activateUser,
        onSuccess: () => {
            showToast({
                title: "User Activated",
                description: "User has been activated successfully.",
                type: "SUCCESS",
            });
            queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
        },
        onError: () => {
            showToast({
                title: "Activate Failed",
                description: "Failed to activate user. Please try again.",
                type: "ERROR",
            });
        },
    });

    // ============================================
    // XỬ LÝ DATA TỪ BACKEND
    // ============================================
    // Backend trả về: { message, users: [...], pagination: {...} }
    // Lấy mảng users từ response
    const allUsers = Array.isArray(usersData?.users)
        ? usersData.users
        : Array.isArray(usersData)
            ? usersData
            : [];

    // ============================================
    // FILTER CHỈ LẤY CUSTOMERS (role = "user")
    // ============================================
    // CHỈ HIỂN THỊ CUSTOMERS - NHỮNG NGƯỜI SỬ DỤNG DỊCH VỤ
    // KHÔNG HIỂN THỊ EMPLOYEES (manager, receptionist, hotel_owner)
    const customers = allUsers.filter((user: any) => user.role === "user");

    // ============================================
    // FILTER CUSTOMERS THEO SEARCH TERM
    // ============================================
    // Backend đã filter theo roleFilter và statusFilter rồi
    // Frontend chỉ cần filter theo search term (tìm kiếm tên, email)
    const filteredUsers = customers.filter((user: UserType) => {
        // Nếu không có search term → hiển thị tất cả users
        if (!searchTerm) return true;

        // Tìm kiếm trong firstName, lastName, email
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            user.firstName?.toLowerCase().includes(searchLower) ||
            user.lastName?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower);
        return matchesSearch;
    });

    // ============================================
    // PAGINATION INFO
    // ============================================
    // Lấy thông tin pagination từ backend
    const pagination = usersData?.pagination || {
        total: 0,
        page: 1,
        limit: pageSize,
        pages: 1,
    };
    const totalPages = pagination.pages || 1;

    const handleDelete = (userId: string) => {
        setConfirmDialog({
            isOpen: true,
            title: "Deactivate User",
            message: "Are you sure you want to deactivate this user? (Soft delete - can be reactivated later)",
            variant: "danger",
            onConfirm: () => {
                deleteMutation.mutate(userId);
                setConfirmDialog({ ...confirmDialog, isOpen: false });
            },
        });
    };

    const handleActivate = (userId: string) => {
        setConfirmDialog({
            isOpen: true,
            title: "Activate User",
            message: "Are you sure you want to activate this user?",
            variant: "info",
            onConfirm: () => {
                activateMutation.mutate(userId);
                setConfirmDialog({ ...confirmDialog, isOpen: false });
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black mx-auto mb-4"></div>
                    <p className="text-lg font-bold">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                variant={confirmDialog.variant || "info"}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
            />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-black" strokeWidth={3} />
                    <h1 className="text-4xl font-black text-black uppercase">
                        Users Management
                    </h1>
                </div>
            </div>

            {/* Filters */}
            <div
                className="bg-white border-4 border-black p-4"
                style={{ boxShadow: "4px 4px 0px 0px #000" }}
            >
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search by name or email..."
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value); // Chỉ update input value, không gọi API ngay
                                // searchTerm sẽ được update sau 500ms (debounce) → tự động gọi API
                            }}
                            className="pl-10 border-4 border-black font-bold"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
                            }}
                            className="border-4 border-black px-4 py-2 font-bold bg-white"
                        >
                            <option value="all">All Roles</option>
                            <option value="user">Customer</option>
                            <option value="hotel_owner">Owner</option>
                            <option value="manager">Manager</option>
                            <option value="receptionist">Receptionist</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
                            }}
                            className="border-4 border-black px-4 py-2 font-bold bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* User Form Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div
                        className="bg-white border-4 border-black p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        style={{ boxShadow: "8px 8px 0px 0px #000" }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-black uppercase">
                                Edit User
                            </h2>
                            <Button
                                onClick={() => {
                                    setEditingUser(null);
                                }}
                                variant="outline"
                                className="border-4 border-black"
                            >
                                ✕
                            </Button>
                        </div>
                        <UserForm
                            user={editingUser}
                            onSuccess={() => {
                                setEditingUser(null);
                                queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
                            }}
                            onCancel={() => {
                                setEditingUser(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Debug Info - Hiển thị thông tin để debug */}
            {process.env.NODE_ENV === "development" && (
                <div className="bg-yellow-100 border-4 border-black p-4 text-sm mb-4">
                    <p className="font-bold mb-2">🔍 Debug Info:</p>
                    <div className="grid grid-cols-2 gap-2">
                        <p><strong>Total users from API:</strong> {allUsers.length}</p>
                        <p><strong>Total customers (role = "user"):</strong> {customers.length}</p>
                        <p><strong>Filtered users (after search):</strong> {filteredUsers.length}</p>
                        <p><strong>Role Filter:</strong> {roleFilter}</p>
                        <p><strong>Status Filter:</strong> {statusFilter}</p>
                        <p><strong>Search Term:</strong> {searchTerm || "(empty)"}</p>
                        <p><strong>Pagination Total:</strong> {usersData?.pagination?.total || "N/A"}</p>
                        <p><strong>Pagination Page:</strong> {usersData?.pagination?.page || "N/A"}</p>
                        <p><strong>Pagination Limit:</strong> {usersData?.pagination?.limit || "N/A"}</p>
                    </div>
                    <p className="mt-2 text-xs text-gray-600">
                        💡 Nếu "Total users from API" nhỏ hơn số users thực tế, kiểm tra filters hoặc pagination
                    </p>
                </div>
            )}

            {/* ============================================
                USERS TABLE - HIỂN THỊ DANH SÁCH USERS
                ============================================ */}
            {filteredUsers.length > 0 ? (
                <div
                    className="bg-white border-4 border-black overflow-hidden"
                    style={{ boxShadow: "8px 8px 0px 0px #000" }}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-black uppercase text-sm">
                                        Name
                                    </th>
                                    <th className="px-6 py-4 text-left font-black uppercase text-sm">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left font-black uppercase text-sm">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-left font-black uppercase text-sm">
                                        Phone
                                    </th>
                                    <th className="px-6 py-4 text-left font-black uppercase text-sm">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left font-black uppercase text-sm">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user: UserType) => (
                                    <tr
                                        key={user._id}
                                        className="border-t-4 border-black hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 font-bold">
                                            {user.firstName} {user.lastName}
                                        </td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                className={`border-2 border-black font-bold ${user.role === "hotel_owner"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : user.role === "manager"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : user.role === "receptionist"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {user.role || "user"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">{user.phone || "N/A"}</td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                className={`border-2 border-black font-bold ${user.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {user.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => {
                                                        setEditingUser(user);
                                                    }}
                                                    className="bg-blue-100 border-2 border-black text-black font-black p-2 hover:bg-blue-200"
                                                    style={{ boxShadow: "2px 2px 0px 0px #000" }}
                                                    title="Edit User"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                {user.isActive ? (
                                                    <Button
                                                        onClick={() => handleDelete(user._id)}
                                                        className="bg-red-100 border-2 border-black text-black font-black p-2 hover:bg-red-200"
                                                        style={{ boxShadow: "2px 2px 0px 0px #000" }}
                                                        title="Deactivate (Soft Delete)"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleActivate(user._id)}
                                                        className="bg-green-100 border-2 border-black text-black font-black p-2 hover:bg-green-200"
                                                        style={{ boxShadow: "2px 2px 0px 0px #000" }}
                                                        title="Activate User"
                                                    >
                                                        <RotateCcw className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="bg-gray-50 border-t-4 border-black px-6 py-4 flex items-center justify-between">
                            <div className="text-sm font-bold">
                                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} users
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="border-2 border-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ boxShadow: "2px 2px 0px 0px #000" }}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        return (
                                            <Button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`border-2 border-black font-bold ${currentPage === pageNum
                                                    ? "bg-black text-white"
                                                    : "bg-white text-black hover:bg-gray-100"
                                                    }`}
                                                style={{ boxShadow: "2px 2px 0px 0px #000" }}
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}
                                </div>
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="border-2 border-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ boxShadow: "2px 2px 0px 0px #000" }}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    className="bg-white border-4 border-black p-12 text-center"
                    style={{ boxShadow: "8px 8px 0px 0px #000" }}
                >
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-black text-gray-600 mb-2">
                        No Users Found
                    </h3>
                    <p className="text-gray-500">
                        {searchTerm
                            ? "Try adjusting your search filters"
                            : "No users in the system"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default UsersSection;

