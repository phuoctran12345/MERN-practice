import { Link, useNavigate } from "react-router-dom";
import useAppContext from "../hooks/useAppContext";
import useSearchContext from "../hooks/useSearchContext";
import { useUserStore } from "../stores/userStore";
import SignOutButton from "./SignOutButton";
import { NeoButton } from "./ui/neo-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  BarChart3,
  Building2,
  Calendar,
  LogIn,
  Menu,
  type LucideIcon,
} from "lucide-react";

const Header = () => {
  const { isLoggedIn } = useAppContext();
  const { getUserRole } = useUserStore();
  const search = useSearchContext();
  const navigate = useNavigate();

  const userRole = getUserRole();
  const isStaff =
    userRole === "hotel_owner" ||
    userRole === "manager" ||
    userRole === "receptionist" ||
    userRole === "admin";

  // Map route theo role để reuse, tránh hardcode lặp nhiều lần
  const dashboardBasePath =
    userRole === "hotel_owner"
      ? "/dashboard/owner"
      : userRole === "manager"
        ? "/dashboard/manager"
        : userRole === "receptionist"
          ? "/dashboard/receptionist"
          : "/dashboard";

  // Menu dashboard cho staff (manager/owner/receptionist)
  const dashboardMenuItems: Array<{
    label: string;
    to: string;
    icon: LucideIcon;
  }> = [
    // ✅ Tổng quan / dashboard home
    { label: "Dashboard", to: `${dashboardBasePath}`, icon: BarChart3 },

    // ✅ Các mục quản trị theo UC (manager/owner có nhiều hơn)
    ...(userRole === "hotel_owner" || userRole === "manager"
      ? ([
          { label: "Khách Sạn", to: `${dashboardBasePath}/hotels`, icon: Building2 },
          { label: "Đặt Phòng", to: `${dashboardBasePath}/bookings`, icon: Calendar },
          { label: "Thống Kê", to: `${dashboardBasePath}/analytics`, icon: BarChart3 },
          { label: "Nhân Viên", to: `${dashboardBasePath}/employees`, icon: Menu },
          { label: "Khuyến Mãi", to: `${dashboardBasePath}/promotions`, icon: Menu },
        ] as const)
      : userRole === "receptionist"
        ? ([
            { label: "Đặt Phòng", to: `${dashboardBasePath}`, icon: Calendar },
          ] as const)
        : ([] as const)),
  ];

  const handleLogoClick = () => {
    // Clear search context when going to home page
    search.clearSearchValues();
    navigate("/");
  };

  return (
    <>
      {/* Development Banner */}
      {/* {!import.meta.env.PROD && (
        <div className="bg-yellow-500 text-black text-center py-1 text-xs font-medium">
          🚧 Development Mode - Auth state persists between sessions
        </div>
      )} */}
      <header
        className="bg-yellow-50 border-b-4 border-black sticky top-0 z-50"
        style={{ boxShadow: "0px 4px 0px 0px #000" }}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo - Neo Brutalism Style */}
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-3 group transition-all duration-150 hover:translate-x-1 active:translate-x-0"
            >
              <div
                className="bg-amber-500 p-3 border-4 border-black flex items-center justify-center"
                style={{ boxShadow: "4px 4px 0px 0px #000" }}
              >
                <Building2 className="w-6 h-6 text-black" strokeWidth={3} />
              </div>
              <span
                className="text-2xl font-black text-black tracking-tight uppercase"
              >
                MernHolidays
              </span>
            </button>

            {/* Navigation - Neo Brutalism Style */}
            <nav className="hidden md:flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  {/* ✅ Tối ưu header: gom menu theo role để đỡ "dài" */}
                  {isStaff ? (
                    <>
                      {/* Dashboard menu (manager/owner/receptionist) */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="flex items-center px-4 py-2 bg-white border-4 border-black text-black font-black text-sm uppercase transition-all duration-150 hover:translate-x-1 hover:translate-y-1 active:translate-x-0 active:translate-y-0"
                            style={{ boxShadow: "4px 4px 0px 0px #000" }}
                          >
                            <Menu className="w-4 h-4 mr-2" strokeWidth={3} />
                            Dashboard
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-56 bg-white border-4 border-black"
                          align="end"
                          style={{ boxShadow: "6px 6px 0px 0px #000" }}
                        >
                          {dashboardMenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <DropdownMenuItem
                                key={item.to}
                                asChild
                                className="text-black font-black uppercase focus:bg-yellow-100 focus:text-black"
                              >
                                <Link to={item.to} className="flex items-center">
                                  <Icon className="w-4 h-4 mr-2" strokeWidth={3} />
                                  {item.label}
                                </Link>
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  ) : (
                    // User thường: giữ link "Đặt phòng của tôi"
                    <Link
                      to="/my-bookings"
                      className="flex items-center px-4 py-2 bg-white border-4 border-black text-black font-black text-sm uppercase transition-all duration-150 hover:translate-x-1 hover:translate-y-1 active:translate-x-0 active:translate-y-0"
                      style={{ boxShadow: "4px 4px 0px 0px #000" }}
                    >
                      <Calendar className="w-4 h-4 mr-2" strokeWidth={3} />
                      Đặt Phòng
                    </Link>
                  )}

                  <SignOutButton />
                </>
              ) : (
                <NeoButton asChild variant="default" size="default">
                  <Link to="/sign-in" className="flex items-center">
                    <LogIn className="w-4 h-4 mr-2" strokeWidth={3} />
                    Đăng Nhập
                  </Link>
                </NeoButton>
              )}
            </nav>

            {/* Mobile Menu Button - Neo Brutalism Style */}
            <div className="md:hidden">
              <button
                className="p-3 bg-white border-4 border-black text-black transition-all duration-150 active:translate-x-0 active:translate-y-0"
                style={{ boxShadow: "4px 4px 0px 0px #000" }}
              >
                <Menu className="w-6 h-6" strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
