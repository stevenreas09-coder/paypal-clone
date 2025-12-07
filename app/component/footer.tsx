import { Urbanist } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});
export function Footer() {
  return (
    <div
      className={`${urbanist.className} bg-white flex flex-col items-center`}
    >
      {/* Card with visible shadow */}
      <div className="w-full border border-black/5 bg-white text-black shadow-[0_1px_8px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.15)]">
        <div className="flex items-center gap-4 w-full pl-[100px]">
          <img
            src="/icons/paypalletter.svg"
            alt="PayPal Logo"
            className="w-25 h-25"
          />
          <GridLayout text="Help" />
          <GridLayout text="Contact Us" />
          <GridLayout text="Security" />
        </div>

        {/* Footer */}
        <div className="w-full bg-gray-50 h-1"></div>
        <div className="w-full h-[150px] bg-white  mt-2 text-black pl-[100px]">
          <div className="pt-6 flex justify-start items-center">
            <p className="text-black/60 text-sm font-semibold">
              ©1999-2025 PayPal, Inc. All rights reserved.
            </p>
            <p className="pl-4 text-sm font-semibold">
              Privacy <span className="pl-4 pr-4">Cookies</span> Legal
            </p>
          </div>
          <p className="pt-6 text-sm font-semibold text-black/50">
            PayPal Pte Ltd is (i) licensed by the Monetary Authority of
            Singapore as a Major Payment Institution under the Payment Services
            Act 2019 and (ii) regulated by the Bangko Sentral ng Pilipinas (
            <span className="text-blue-700">https://www.bsp.gov.ph</span>) as an
            Operator of Payment Services in the Philippines under the National
            Payment Systems Act.
          </p>
        </div>
      </div>
    </div>
  );
}

function GridLayout({ text }: { text: string }) {
  return (
    <div className="p-2 text-[17px] font-semibold text-black/90">{text}</div>
  );
}

function Grid({ text }: { text: string }) {
  return <span className="p-2 text-sm text-black">{text}</span>;
}
