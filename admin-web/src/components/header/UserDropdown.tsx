import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getDashboard } from "../../services/userService";
import { handleNavigate } from "../../utils/navigationHelper";
import { useLoading } from "../../context/LoadingContext";
import { useModalStatus } from "../../context/ModalContext";
import { API_BASE } from "../../utils/constants";
import { useUser } from "../../context/UserContext";

export default function UserDropdown() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { openStatusModal } = useModalStatus();

  const fetchData = async () => {
    try {
      const data = await getDashboard();

      if (!data.errors) {
        setUser(data.data);
      } else {
        openStatusModal({
          status: "danger",
          title: "Error",
          message: "Your login credentials is expired",
          onCloseCallback: () =>
            handleNavigate(navigate, "/", undefined, setLoading, true, true),
        });
      }
    } catch {
      openStatusModal({
        status: "danger",
        title: "Error",
        message: "Your login credentials is expired",
        onCloseCallback: () =>
          handleNavigate(navigate, "/", undefined, setLoading, true, true),
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate, setLoading]);

  return (
    <div className="relative">
      <div className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400">
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img
            src={
              user?.AvatarUrl
                ? `${API_BASE}${user.AvatarUrl}`
                : "https://cdn.vectorstock.com/i/1000v/92/16/default-profile-picture-avatar-user-icon-vector-46389216.jpg"
            }
            alt="User"
          />
        </span>
        <span className="block mr-1 font-medium text-theme-sm">
          {user?.Username}
        </span>
      </div>
    </div>
  );
}
