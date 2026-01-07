import { useEffect } from "react";
import { useNavigate } from "react-router";
import { checkJWT } from "../services/userService";
import { useLoading } from "../context/LoadingContext";
import { handleNavigate } from "../utils/navigationHelper";
import { useModalStatus } from "./ModalContext";

const JWTGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { openStatusModal } = useModalStatus();

  useEffect(() => {
    const verifyJWT = async () => {
      try {
        const res = await checkJWT();
        if (res.errors) {
          openStatusModal({
            status: "danger",
            title: "Error",
            message: "Your login credentials is expired",
            onCloseCallback: () =>
              handleNavigate(navigate, "/", undefined, setLoading, true, true),
          });
        }
      } catch (err) {
        openStatusModal({
          status: "danger",
          title: "Error",
          message: "Your login credentials is expired",
          onCloseCallback: () =>
            handleNavigate(navigate, "/", undefined, setLoading, true, true),
        });
      }
    };
    verifyJWT();
  }, [navigate, setLoading]);

  return <>{children}</>;
};

export default JWTGuard;
