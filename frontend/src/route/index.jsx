import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProduct from "../pages/UploadProduct";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermision from "../layouts/AdminPermision";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CartMobile from "../pages/CartMobile";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import Orders from "../pages/Orders";
import AdminAnalytics from "../pages/AdminAnalytics";
import AdminOrderPage from "../pages/AdminOrderPage";
import EditProfile from "../pages/EditProfile";
import Landing from "../pages/Landing";
import AllUsers from "../pages/AllUser";
import AdminOrderDetailPage from "../pages/AdminOrderDetailPage";
import SuratJalan from "../pages/SuratJalan";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Landing />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verification-otp",
        element: <OtpVerification />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "user",
        element: <UserMenuMobile />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "edit-profile",
            element: <EditProfile />,
          },
          {
            path: "myorders",
            element: <MyOrders />,
          },
          {
            path: "address",
            element: <Address />,
          },
          {
            path: "analytics",
            element: (
              <AdminPermision>
                <AdminAnalytics />
              </AdminPermision>
            ),
          },
          {
            path: "adminorder",
            element: (
              <AdminPermision>
                <AdminOrderPage />
              </AdminPermision>
            ),
          },
          {
            path: "adminorder/:orderId",
            element: (
              <AdminPermision>
                <AdminOrderDetailPage />
              </AdminPermision>
            ),
          },
          {
            path: "order/:orderId/invoice-suratjalan",
            element: (
              <AdminPermision>
                <SuratJalan />
              </AdminPermision>
            ),
          },
          {
            path: "category",
            element: (
              <AdminPermision>
                <CategoryPage />
              </AdminPermision>
            ),
          },
          {
            path: "subcategory",
            element: (
              <AdminPermision>
                <SubCategoryPage />
              </AdminPermision>
            ),
          },
          {
            path: "upload-product",
            element: (
              <AdminPermision>
                <UploadProduct />
              </AdminPermision>
            ),
          },
          {
            path: "product",
            element: (
              <AdminPermision>
                <ProductAdmin />
              </AdminPermision>
            ),
          },
          {
            path: "orders",
            element: (
              <AdminPermision>
                <Orders />
              </AdminPermision>
            ),
          },
          {
            path: "all",
            element: (
              <AdminPermision>
                <AllUsers />
              </AdminPermision>
            ),
          },
        ],
      },
      {
        path: "order/:orderId/invoice-suratjalan",
        element: (
          <AdminPermision>
            <SuratJalan />
          </AdminPermision>
        ),
      },
      {
        path: ":category",
        children: [
          {
            path: ":subCategory",
            element: <ProductListPage />,
          },
        ],
      },
      {
        path: "product/:product",
        element: <ProductDisplayPage />,
      },
      {
        path: "cart",
        element: <CartMobile />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "success",
        element: <Success />,
      },
      {
        path: "cancel",
        element: <Cancel />,
      },
    ],
  },
]);

export default router;
