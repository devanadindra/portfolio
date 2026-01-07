import { useState, useEffect } from "react";
import { useAlert } from "../context/AlertContext";
import { useLoading } from "../context/LoadingContext";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import { getDashboard } from "../services/userService";
import { DashboardRes } from "../response/userResponse";

export default function UserProfiles() {
  const [dashboard, setDashboard] = useState<DashboardRes | null>(null);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const fetchData = async () => {
    try {
      const data = await getDashboard();

      if (!data.errors) {
        setDashboard(data);
      } else {
        showAlert("error", "Error", "Failed to fetch user data!");
      }
    } catch (err) {
      showAlert("error", "Error", "Failed to fetch user data!");
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate, setLoading]);
  return (
    <>
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard data={dashboard?.data} refetch={fetchData}/>
          <UserInfoCard data={dashboard?.data} refetch={fetchData}/>
        </div>
      </div>
    </>
  );
}
