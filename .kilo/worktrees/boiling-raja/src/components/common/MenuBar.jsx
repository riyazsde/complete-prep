import { Icon } from "@iconify/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationDrawer from "../ThirdParty/NotificationDrawer";

export const UserMenuBar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const icons = [
    {
      icon: "mdi:bell-outline",
      action: () => setShowNotifications(true),
    },
    // {
    //   icon: "ic:round-currency-rupee",
    //   action: () => navigate("/wallet"),
    // },
    // {
    //   icon: "mdi:heart-outline",
    //   action: () => navigate("/wishlist"),
    // },
    // {
    //   icon: "mdi:cart-outline",
    //   action: () => navigate("/cart"),
    // },
  ];

  return (
    <>
      <div className="bg-white p-2 hidden">
        {/* <div className="sm:hidden lg:block"></div> */}
        <div className="flex items-center justify-between w-full gap-3 sm:justify-end sm:gap-4 sm:w-auto">
          {icons.map((item, index) => (
            <div
              key={index}
              onClick={item.action}
              className="flex items-center justify-center w-10 h-10 transition bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200"
            >
              <Icon icon={item.icon} className="text-xl text-black" />
            </div>
          ))}
        </div>
      </div>
      <NotificationDrawer
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};
