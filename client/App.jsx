

import "./styles/base.css";

import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { FingerprintProvider } from "./context/FingerprintContext";
import { ThemeProvider } from "./context/ThemeProvider";

import PrivateRoute from "./routes/PrivateRoute";
import UnPrivateRoute from "./routes/UnPrivateRoute";


// your pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import Dashboard from "./pages/Dashboard";
import CreateAccount from "./pages/CreateAccount/CreateAccount";
import CreateAccountDetails from "./pages/CreateAccount/CreateAccountDetails";
import BuyTickets from "./pages/BuyTickets/BuyTickets";
import Rules from "./pages/RulesTerms/Rules";
import Terms from "./pages/RulesTerms/Terms";
import CreditHistoryNoLegend from "./pages/Credits/CreditHistoryNoLegend";
import CreditHistoryWithLegend from "./pages/Credits/CreditHistoryWithLegend";
import AddCredits from  "./pages/Credits/CreditsAddCredits";
import MyTickets from  "./pages/MyTickets/MyTickets";
import MyTicketsTable from  "./pages/MyTickets/MyTicketsTable";
import MyWins from  "./pages/MyWins/MyWins";
import MyWinsClaimPrizeFinishedUpload from  "./pages/MyWins/MyWinsClaimPrizeFinishedUpload";
import MyWinsClaimPrizeUploaded from  "./pages/MyWins/MyWinsClaimPrizeUploaded";
import MyWinsClaimPrizeUploadFailed from  "./pages/MyWins/MyWinsClaimPrizeUploadFailed";
import MyWinsClaimFormUploaded from  "./pages/MyWins/MyWinsClaimsFormUploaded";
import TicketDetails from  "./pages/TicketDetails/TicketDetails";
import ClaimPrize from  "./pages/ClaimPrize/ClaimPrize";
import ClaimPrizeUploaded from  "./pages/ClaimPrize/ClaimPrizeUploaded";
import MyProfile  from "./pages/MyProfile/MyProfile";
import EditProfile from "./pages/EditProfile/EditProfile";
import DeleteAccount from "./pages/DeleteAccount/DeleteAccount";
import PurchaseHistory from "./pages/PurchaseHistory/PurchaseHistory";
import Settings from "./pages/Settings/Settings";



import { ToastContainer } from "react-toastify";   
import "react-toastify/dist/ReactToastify.css"; 

const queryClient = new QueryClient();

const App = () => (
  <FingerprintProvider>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
           <ToastContainer position="top-center" autoClose={3000} theme="colored" />
          <Routes>
            {/* Public */}
            <Route element={<UnPrivateRoute />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/otp" element={<OTP />} />
              <Route path="/createaccount" element={<CreateAccount />} />
              <Route path="/createaccountdetails" element={<CreateAccountDetails />} />
            </Route>

            {/* Private */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/buytickets" element={<BuyTickets />} />
              <Route path="/credithistory-with-legend" element={<CreditHistoryWithLegend />} />
              <Route path="/credithistory-no-legend" element={<CreditHistoryNoLegend />} />
              <Route path="/AddCredits" element={<AddCredits/>} />
              <Route path="/mytickets" element={<MyTickets />} />
              <Route path="/mywins" element={<MyWins />} />
              <Route path="/mywins-claim-prize-finished-upload" element={<MyWinsClaimPrizeFinishedUpload />} />
              <Route path="/my-wins-claim-prize-uploaded" element={<MyWinsClaimPrizeUploaded />} />
              <Route path="/mywins-claim-prize-upload-failed" element={<MyWinsClaimPrizeUploadFailed />} />
              <Route path="/mywins-claim-form-uploaded" element={<MyWinsClaimFormUploaded />} />
              <Route path="/myticketstable" element={<MyTicketsTable />} />
              <Route path="/ticketdetails" element={<TicketDetails />} />
              <Route path="/claimprize" element={<ClaimPrize />} />
              <Route path="/claimprizeuploaded" element={<ClaimPrizeUploaded />} />
              <Route path="/myprofile" element={<MyProfile/>} />
              <Route path="/editprofile" element={<EditProfile/>} />
              <Route path="/deleteaccount" element={<DeleteAccount/>} />
              <Route path="/purchasehistory" element={<PurchaseHistory/>} />
              <Route path="/settings" element={<Settings/>} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </FingerprintProvider>
);

export default App;
