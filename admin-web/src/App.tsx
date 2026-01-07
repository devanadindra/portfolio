import { Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { AlertProvider } from "./context/AlertContext";
import { useLoading } from "./context/LoadingContext";
import LoadingBar from "./components/common/LoadingBar";
import { LoadingProvider } from "./context/LoadingContext";
import ProductsList from "./pages/Dashboard/ProductList";
import AddProduct from "./pages/Dashboard/AddProduct";
import { ModalProvider } from "./context/ModalContext";
import { ConfirmModalProvider } from "./context/ConfirmModalContext";
import UpdateProduct from "./pages/Dashboard/UpdateProduct";
import ProductDetail from "./pages/Dashboard/ProductDetail";
import { UserProvider } from "./context/UserContext";
import OrderList from "./pages/Dashboard/OrderList";
import PaymentList from "./pages/Dashboard/PaymentList";

const LoadingWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoading } = useLoading();

  return (
    <>
      <LoadingBar isLoading={isLoading} duration={1} />
      {children}
    </>
  );
};

export default function App() {
  return (
    <LoadingProvider>
      <LoadingWrapper>
        <UserProvider>
          <ModalProvider>
            <ConfirmModalProvider>
              <AlertProvider>
                <ScrollToTop />
                <Routes>
                  {/* Dashboard Layout */}
                  <Route element={<AppLayout />}>
                    <Route index path="/home" element={<Home />} />
                    <Route index path="/product" element={<ProductsList />} />
                    <Route index path="/order" element={<OrderList />} />
                    <Route index path="/payment" element={<PaymentList />} />

                    {/* Others Page */}
                    <Route path="/profile" element={<UserProfiles />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/blank" element={<Blank />} />
                    <Route path="/product/add" element={<AddProduct />} />
                    <Route
                      path="/product/update/:productId"
                      element={<UpdateProduct />}
                    />
                    <Route
                      path="/product/detail/:productId"
                      element={<ProductDetail />}
                    />
                    <Route path="/signup" element={<SignUp />} />

                    {/* Forms */}
                    <Route path="/form-elements" element={<FormElements />} />

                    {/* Tables */}
                    <Route path="/basic-tables" element={<BasicTables />} />

                    {/* Ui Elements */}
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/avatars" element={<Avatars />} />
                    <Route path="/badge" element={<Badges />} />
                    <Route path="/buttons" element={<Buttons />} />
                    <Route path="/images" element={<Images />} />
                    <Route path="/videos" element={<Videos />} />

                    {/* Charts */}
                    <Route path="/line-chart" element={<LineChart />} />
                    <Route path="/bar-chart" element={<BarChart />} />
                  </Route>

                  {/* Auth Layout */}
                  <Route path="/" element={<SignIn />} />

                  {/* Fallback Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AlertProvider>
            </ConfirmModalProvider>
          </ModalProvider>
        </UserProvider>
      </LoadingWrapper>
    </LoadingProvider>
  );
}
