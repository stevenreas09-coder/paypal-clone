import { BsBellFill } from "react-icons/bs";
import { RiSettings3Fill } from "react-icons/ri";
import { Nav, NavLink } from "./component/nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 p-2 h-25 bg-[#142c8e]">
        <div className="flex justify-between space-x-2 w-screen px-20">
          <div className="flex justify-center items-center">
            <img
              src="/icons/paypal.svg"
              alt="PayPal Logo"
              className="w-7 h-7"
            />
            <Nav>
              <NavLink href="/">Home</NavLink>
              <NavLink href="/send">Send and Request </NavLink>
              <NavLink href="/wallet">Wallet</NavLink>
              <NavLink href="/activity">Activity</NavLink>
              <NavLink href="/help">Help</NavLink>
            </Nav>
          </div>
          <div className="flex space-x-5 justify-center items-center">
            <BsBellFill className="h-5 w-5" />
            <RiSettings3Fill className="h-5 w-5" />
            <div className="text-sm">LOG OUT</div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center bg-white">
        <div className="container bg-white">{children}</div>
      </div>
    </div>
  );
}
