import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search as SearchIcon,
  Filter,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useSearchContext from "../hooks/useSearchContext";

interface AdvancedSearchProps {
  onSearch: (searchData: any) => void;
  isExpanded?: boolean;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  isExpanded = false,
}) => {
  const navigate = useNavigate();
  const search = useSearchContext();
  const [showAdvanced, setShowAdvanced] = useState(isExpanded);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [searchData, setSearchData] = useState({
    destination: search.destination,
    checkIn: search.checkIn,
    checkOut: search.checkOut,
    adultCount: search.adultCount,
    childCount: search.childCount,
    // Advanced filters
    minPrice: "",
    maxPrice: "",
    starRating: "",
    hotelType: "",
    facilities: [] as string[],
    sortBy: "relevance",
    radius: "50", // km
    instantBooking: false,
    freeCancellation: false,
    breakfast: false,
    wifi: false,
    parking: false,
    pool: false,
    gym: false,
    spa: false,
  });

  // Danh sách các tỉnh thành Việt Nam (63 tỉnh/thành phố) - Lấy từ API open.oapi.vn
  const vietnamProvinces = [
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bạc Liêu",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Bình Định",
    "Cà Mau",
    "Cần Thơ",
    "Cao Bằng",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Nội",
    "Hà Tĩnh",
    "Hải Dương",
    "Hải Phòng",
    "Hậu Giang",
    "Hồ Chí Minh",
    "Hoà Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
    "Đà Nẵng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    // Các điểm du lịch phổ biến (bổ sung)
    "Nha Trang",
    "Phú Quốc",
    "Hội An",
    "Sapa",
    "Mũi Né",
    "Đà Lạt",
    "Vũng Tàu",
    "Huế",
  ];

  // Dropdown functionality for destination
  const [showDropdown, setShowDropdown] = useState(false);
  const [places] = useState<string[]>(vietnamProvinces);
  const [filteredPlaces, setFilteredPlaces] = useState<string[]>([]);

  // Filter places as user types
  useEffect(() => {
    if (searchData.destination.length > 0) {
      const filtered = places.filter((place) =>
        place.toLowerCase().includes(searchData.destination.toLowerCase())
      );
      setFilteredPlaces(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setShowDropdown(false);
      setFilteredPlaces([]);
    }
  }, [searchData.destination, places]);

  // Đóng date picker khi click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker]);

  // Format date để hiển thị: "29 thg 12 2025"
  const formatDateDisplay = (date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthNames = [
      "thg 1",
      "thg 2",
      "thg 3",
      "thg 4",
      "thg 5",
      "thg 6",
      "thg 7",
      "thg 8",
      "thg 9",
      "thg 10",
      "thg 11",
      "thg 12",
    ];
    return `${day} ${monthNames[month - 1]} ${year}`;
  };

  // Tính số ngày ở (bao gồm cả check-in và check-out)
  // Ví dụ: 11/3 đến 13/3 = 3 ngày (11, 12, 13)
  const calculateStayDays = (checkIn: Date, checkOut: Date): number => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Số ngày ở = số ngày chênh lệch + 1 (bao gồm cả ngày check-in và check-out)
    return diffDays >= 0 ? diffDays + 1 : 0;
  };

  // Format date range để hiển thị: "29 thg 12 2025 - 30 thg 12 2025"
  const formatDateRange = (): string => {
    const checkInStr = formatDateDisplay(searchData.checkIn);
    const checkOutStr = formatDateDisplay(searchData.checkOut);
    return `${checkInStr} - ${checkOutStr}`;
  };

  // Xử lý khi chọn date range
  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    
    if (start) {
      handleInputChange("checkIn", start);
      
      // Nếu chọn start date sau end date hiện tại, reset end date
      if (end && start >= end) {
        // Set end date = start date + 1 ngày
        const nextDay = new Date(start);
        nextDay.setDate(nextDay.getDate() + 1);
        handleInputChange("checkOut", nextDay);
      }
    }
    
    if (end) {
      // Validate: end date phải sau start date
      if (start && end <= start) {
        // Nếu end <= start, set end = start + 1 ngày
        const nextDay = new Date(start);
        nextDay.setDate(nextDay.getDate() + 1);
        handleInputChange("checkOut", nextDay);
      } else {
        handleInputChange("checkOut", end);
      }
      setShowDatePicker(false); // Đóng picker sau khi chọn xong
    }
  };

  const hotelTypes = [
    "Hotel",
    "Resort",
    "Motel",
    "Hostel",
    "Apartment",
    "Villa",
    "Cottage",
    "B&B",
  ];

  const facilityOptions = [
    { id: "wifi", label: "WiFi Miễn Phí", icon: "📶" },
    { id: "parking", label: "Đỗ Xe Miễn Phí", icon: "🚗" },
    { id: "pool", label: "Hồ Bơi", icon: "🏊" },
    { id: "gym", label: "Phòng Gym", icon: "💪" },
    { id: "spa", label: "Spa", icon: "🧖" },
    { id: "breakfast", label: "Bữa Sáng Miễn Phí", icon: "🍳" },
    { id: "instantBooking", label: "Đặt Phòng Ngay", icon: "⚡" },
    { id: "freeCancellation", label: "Hủy Miễn Phí", icon: "✅" },
  ];

  const handleInputChange = (field: string, value: any) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFacilityToggle = (facilityId: string) => {
    setSearchData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facilityId)
        ? prev.facilities.filter((f) => f !== facilityId)
        : [...prev.facilities, facilityId],
    }));
  };

  const handleSearch = () => {
    // Only proceed if destination is not empty
    if (!searchData.destination || searchData.destination.trim() === "") {
      // Show all hotels when destination is empty
      search.saveSearchValues(
        "", // Empty destination to show all hotels
        searchData.checkIn,
        searchData.checkOut,
        searchData.adultCount,
        searchData.childCount
      );

      // Close dropdown before navigation
      setShowDropdown(false);
      setFilteredPlaces([]);

      // Navigate to search page with advanced filters
      const searchParams = new URLSearchParams();
      searchParams.append("destination", ""); // Empty destination
      searchParams.append("checkIn", searchData.checkIn.toISOString());
      searchParams.append("checkOut", searchData.checkOut.toISOString());
      searchParams.append("adultCount", searchData.adultCount.toString());
      searchParams.append("childCount", searchData.childCount.toString());

      // Add advanced filters
      if (searchData.minPrice)
        searchParams.append("minPrice", searchData.minPrice);
      if (searchData.maxPrice)
        searchParams.append("maxPrice", searchData.maxPrice);
      if (searchData.starRating)
        searchParams.append("starRating", searchData.starRating);
      if (searchData.hotelType)
        searchParams.append("hotelType", searchData.hotelType);
      if (searchData.sortBy) searchParams.append("sortBy", searchData.sortBy);
      if (searchData.radius) searchParams.append("radius", searchData.radius);
      searchData.facilities.forEach((facility) =>
        searchParams.append("facilities", facility)
      );

      navigate(`/search?${searchParams.toString()}`);
      onSearch(searchData);

      // Don't clear search values immediately - let the search page use them
      // Only clear the local form state
      setTimeout(() => {
        setSearchData({
          destination: "",
          checkIn: new Date(),
          checkOut: new Date(),
          adultCount: 1,
          childCount: 0,
          minPrice: "",
          maxPrice: "",
          starRating: "",
          hotelType: "",
          facilities: [],
          sortBy: "relevance",
          radius: "50",
          instantBooking: false,
          freeCancellation: false,
          breakfast: false,
          wifi: false,
          parking: false,
          pool: false,
          gym: false,
          spa: false,
        });
        // Remove this line: search.clearSearchValues();
      }, 100);
      return;
    }

    // Update search context
    search.saveSearchValues(
      searchData.destination.trim(),
      searchData.checkIn,
      searchData.checkOut,
      searchData.adultCount,
      searchData.childCount
    );

    // Close dropdown before navigation
    setShowDropdown(false);
    setFilteredPlaces([]);

    // Navigate to search page with advanced filters
    const searchParams = new URLSearchParams();
    searchParams.append("destination", searchData.destination.trim());
    searchParams.append("checkIn", searchData.checkIn.toISOString());
    searchParams.append("checkOut", searchData.checkOut.toISOString());
    searchParams.append("adultCount", searchData.adultCount.toString());
    searchParams.append("childCount", searchData.childCount.toString());

    // Add advanced filters
    if (searchData.minPrice)
      searchParams.append("minPrice", searchData.minPrice);
    if (searchData.maxPrice)
      searchParams.append("maxPrice", searchData.maxPrice);
    if (searchData.starRating)
      searchParams.append("starRating", searchData.starRating);
    if (searchData.hotelType)
      searchParams.append("hotelType", searchData.hotelType);
    if (searchData.sortBy) searchParams.append("sortBy", searchData.sortBy);
    if (searchData.radius) searchParams.append("radius", searchData.radius);
    searchData.facilities.forEach((facility) =>
      searchParams.append("facilities", facility)
    );

    navigate(`/search?${searchParams.toString()}`);
    onSearch(searchData);

    // Don't clear search values immediately - let the search page use them
    // Only clear the local form state
    setTimeout(() => {
      setSearchData({
        destination: "",
        checkIn: new Date(),
        checkOut: new Date(),
        adultCount: 1,
        childCount: 0,
        minPrice: "",
        maxPrice: "",
        starRating: "",
        hotelType: "",
        facilities: [],
        sortBy: "relevance",
        radius: "50",
        instantBooking: false,
        freeCancellation: false,
        breakfast: false,
        wifi: false,
        parking: false,
        pool: false,
        gym: false,
        spa: false,
      });
      // Remove this line: search.clearSearchValues();
    }, 100);
  };

  const handleQuickSearch = (destination: string) => {
    if (!destination || destination.trim() === "") {
      // Show all hotels when destination is empty
      setSearchData((prev) => ({ ...prev, destination: "" }));
      setTimeout(() => handleSearch(), 100);
      return;
    }

    setSearchData((prev) => ({ ...prev, destination: destination.trim() }));
    setTimeout(() => handleSearch(), 100);
  };

  // const handleClear = () => {
  //   setSearchData({
  //     destination: "",
  //     checkIn: new Date(),
  //     checkOut: new Date(),
  //     adultCount: 1,
  //     childCount: 0,
  //     minPrice: "",
  //     maxPrice: "",
  //     starRating: "",
  //     hotelType: "",
  //     facilities: [],
  //     sortBy: "relevance",
  //     radius: "50",
  //     instantBooking: false,
  //     freeCancellation: false,
  //     breakfast: false,
  //     wifi: false,
  //     parking: false,
  //     pool: false,
  //     gym: false,
  //     spa: false,
  //   });
  //   search.clearSearchValues();
  // };

  const popularDestinations = [
    "Hà Nội",
    "Hồ Chí Minh",
    "Đà Nẵng",
    "Nha Trang",
    "Phú Quốc",
    "Hội An",
    "Sapa",
    "Huế",
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-large p-8 max-w-6xl mx-auto border border-white/20">
      {/* Basic Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
        {/* Destination */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-primary-600" />
            Điểm Đến
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Bạn muốn đi đâu?"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              value={searchData.destination}
              onChange={(e) => handleInputChange("destination", e.target.value)}
              onFocus={() => {
                if (searchData.destination.length > 0) {
                  setShowDropdown(filteredPlaces.length > 0);
                } else {
                  // Hiển thị tất cả tỉnh thành khi focus vào input trống
                  setFilteredPlaces(places);
                  setShowDropdown(true);
                }
              }}
              onBlur={() => {
                // Delay để cho phép click vào dropdown item
                setTimeout(() => setShowDropdown(false), 200);
              }}
            />
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            {showDropdown && filteredPlaces.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                {filteredPlaces.map((place) => (
                  <li
                    key={place}
                    className="px-4 py-2 cursor-pointer hover:bg-primary-50 hover:text-primary-600 text-sm border-b border-gray-100 last:border-b-0 transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleInputChange("destination", place);
                      setShowDropdown(false);
                      setFilteredPlaces([]);
                    }}
                  >
                    <MapPin className="w-4 h-4 inline mr-2 text-primary-600" />
                    {place}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Date Range Picker - Thiết kế giống hình ảnh */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-primary-600" />
            Ngày nhận phòng và trả phòng
          </label>
          <div className="relative" ref={datePickerRef}>
            {/* Input field hiển thị date range */}
            <div
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all duration-200 bg-white flex items-center"
            >
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              <div className="flex-1">
                <span className="text-gray-700 block">
                  {formatDateDisplay(searchData.checkIn)} - {formatDateDisplay(searchData.checkOut)}
                </span>
                {calculateStayDays(searchData.checkIn, searchData.checkOut) > 0 && (
                  <span className="text-xs text-primary-600 font-medium mt-1 block">
                    {calculateStayDays(searchData.checkIn, searchData.checkOut)} ngày
                  </span>
                )}
              </div>
              <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Date Picker Modal */}
            {showDatePicker && (
              <div className="absolute top-full left-0 lg:left-1/2 lg:transform lg:-translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4 lg:p-6 w-[95vw] lg:w-[720px] max-w-[95vw]">
                {/* Header hiển thị check-in và check-out */}
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ngày Ở</h3>
                  <div className="grid grid-cols-2 gap-6 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Nhận phòng</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {searchData.checkIn.toLocaleDateString("vi-VN", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Trả phòng</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {searchData.checkOut.toLocaleDateString("vi-VN", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
          </div>
        </div>

                  {/* Hiển thị số ngày ở */}
                  {calculateStayDays(searchData.checkIn, searchData.checkOut) > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-center">
                        <span className="text-sm text-gray-600">
                          Thời gian ở:{" "}
                          <span className="font-semibold text-primary-600 text-base">
                            {calculateStayDays(searchData.checkIn, searchData.checkOut)} ngày
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Date Range Picker với 2 calendars - Căn giữa */}
                <div className="flex justify-center">
                  <DatePicker
                    selected={searchData.checkIn}
                    onChange={handleDateRangeChange}
                    startDate={searchData.checkIn}
                    endDate={searchData.checkOut}
                    selectsRange
                    inline
                    monthsShown={2}
                    minDate={new Date()}
                    className="custom-datepicker"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>

                {/* Custom CSS cho date picker */}
                <style>{`
                  .custom-datepicker {
                    display: flex;
                    justify-content: center;
                  }
                  .custom-datepicker .react-datepicker {
                    border: none;
                    font-family: inherit;
                    box-shadow: none;
                  }
                  .custom-datepicker .react-datepicker__month-container {
                    margin: 0 8px;
                    width: 100%;
                    min-width: 260px;
                  }
                  @media (max-width: 768px) {
                    .custom-datepicker .react-datepicker__month-container {
                      margin: 0 4px;
                      min-width: 240px;
                    }
                  }
                  .custom-datepicker .react-datepicker__header {
                    background-color: white;
                    border-bottom: 1px solid #e5e7eb;
                    padding-top: 16px;
                    padding-bottom: 8px;
                  }
                  .custom-datepicker .react-datepicker__current-month {
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 12px;
                    font-size: 14px;
                  }
                  .custom-datepicker .react-datepicker__day-names {
                    display: flex;
                    justify-content: space-around;
                    margin-bottom: 4px;
                  }
                  .custom-datepicker .react-datepicker__day-name {
                    color: #6b7280;
                    font-weight: 500;
                    width: 40px;
                    line-height: 40px;
                    font-size: 12px;
                    margin: 0;
                  }
                  .custom-datepicker .react-datepicker__week {
                    display: flex;
                    justify-content: space-around;
                    margin: 2px 0;
                  }
                  .custom-datepicker .react-datepicker__day {
                    width: 40px;
                    height: 40px;
                    line-height: 40px;
                    margin: 0;
                    border-radius: 8px;
                    font-size: 14px;
                  }
                  .custom-datepicker .react-datepicker__day--weekend {
                    color: #dc2626;
                  }
                  .custom-datepicker .react-datepicker__day:hover {
                    background-color: #f3f4f6;
                    border-radius: 8px;
                  }
                  .custom-datepicker .react-datepicker__day--selected,
                  .custom-datepicker .react-datepicker__day--in-range {
                    background-color: #3b82f6;
                    color: white;
                    border-radius: 8px;
                  }
                  .custom-datepicker .react-datepicker__day--in-selecting-range {
                    background-color: #dbeafe;
                    color: #1e40af;
                    border-radius: 8px;
                  }
                  .custom-datepicker .react-datepicker__day--range-start,
                  .custom-datepicker .react-datepicker__day--range-end {
                    background-color: #2563eb;
                    color: white;
                    font-weight: 600;
                    border-radius: 8px;
                  }
                  .custom-datepicker .react-datepicker__navigation {
                    top: 16px;
                    width: 32px;
                    height: 32px;
                  }
                  .custom-datepicker .react-datepicker__navigation:hover {
                    background-color: #f3f4f6;
                    border-radius: 6px;
                  }
                  .custom-datepicker .react-datepicker__navigation-icon::before {
                    border-color: #6b7280;
                    border-width: 2px 2px 0 0;
                  }
                  .custom-datepicker .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
                    border-color: #111827;
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Users className="w-4 h-4 mr-2 text-primary-600" />
            Số Khách
          </label>
          <div className="relative">
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              value={`${searchData.adultCount} adults, ${searchData.childCount} children`}
              onChange={(e) => {
                const [adults, children] = e.target.value.split(", ");
                handleInputChange("adultCount", parseInt(adults));
                handleInputChange("childCount", parseInt(children));
              }}
            >
              <option value="1 adults, 0 children">1 người lớn</option>
              <option value="2 adults, 0 children">2 người lớn</option>
              <option value="1 adults, 1 children">1 người lớn, 1 trẻ em</option>
              <option value="2 adults, 1 children">2 người lớn, 1 trẻ em</option>
              <option value="2 adults, 2 children">2 người lớn, 2 trẻ em</option>
              <option value="3 adults, 0 children">3 người lớn</option>
              <option value="4 adults, 0 children">4 người lớn</option>
            </select>
            <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Advanced Search Toggle */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          <Filter className="w-4 h-4 mr-2" />
          Bộ Lọc Nâng Cao
        </button>

        <button
          onClick={handleSearch}
          className="flex items-center bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all duration-200 shadow-medium hover:shadow-large"
        >
          <SearchIcon className="w-4 h-4 mr-2" />
          Tìm Kiếm Khách Sạn
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-6 space-y-6">
          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khoảng Giá
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Tối thiểu"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={searchData.minPrice}
                  onChange={(e) =>
                    handleInputChange("minPrice", e.target.value)
                  }
                />
                <span className="flex items-center text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Tối đa"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={searchData.maxPrice}
                  onChange={(e) =>
                    handleInputChange("maxPrice", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hạng Sao
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchData.starRating}
                onChange={(e) =>
                  handleInputChange("starRating", e.target.value)
                }
              >
                <option value="">Mọi Hạng</option>
                <option value="5">5 Sao</option>
                <option value="4">4+ Sao</option>
                <option value="3">3+ Sao</option>
                <option value="2">2+ Sao</option>
              </select>
            </div>

            {/* Hotel Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại Khách Sạn
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchData.hotelType}
                onChange={(e) => handleInputChange("hotelType", e.target.value)}
              >
                <option value="">Mọi Loại</option>
                {hotelTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Facilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tiện Nghi
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {facilityOptions.map((facility) => (
                <label
                  key={facility.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={searchData.facilities.includes(facility.id)}
                    onChange={() => handleFacilityToggle(facility.id)}
                  />
                  <span className="text-sm text-gray-700">
                    {facility.icon} {facility.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp Xếp Theo
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchData.sortBy}
                onChange={(e) => handleInputChange("sortBy", e.target.value)}
              >
                <option value="relevance">Độ Liên Quan</option>
                <option value="priceLow">Giá: Thấp đến Cao</option>
                <option value="priceHigh">Giá: Cao đến Thấp</option>
                <option value="rating">Đánh Giá</option>
                <option value="distance">Khoảng Cách</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bán Kính Tìm Kiếm (km)
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchData.radius}
                onChange={(e) => handleInputChange("radius", e.target.value)}
              >
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
                <option value="100">100 km</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Quick Search Destinations */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Điểm Đến Phổ Biến
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularDestinations.map((destination) => (
            <button
              key={destination}
              onClick={() => handleQuickSearch(destination)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
            >
              {destination}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
