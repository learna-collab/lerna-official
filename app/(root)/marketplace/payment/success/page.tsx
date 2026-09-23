"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { PaymentService } from "@/app/services/payment";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  const hasVerified = useRef(false);

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );

  const [message, setMessage] = useState(
    "Please wait while we confirm your payment.",
  );

  useEffect(() => {
    if (hasVerified.current) {
      return;
    }

    const reference = params.get("reference");

    hasVerified.current = true;

    const verifyPayment = async () => {
      if (!reference) {
        await Promise.resolve();

        setStatus("error");
        setMessage("No payment reference was provided.");

        return;
      }

      try {
        const result = await PaymentService.verify(reference);

        if (result.status !== "PAID" && result.status !== "SUCCESS") {
          setStatus("error");
          setMessage("We could not confirm your payment.");
          return;
        }

        setStatus("success");
        setMessage("Payment confirmed. Redirecting to your orders...");

        setTimeout(() => {
          router.replace("/marketplace/orders");
        }, 1500);
      } catch (error) {
        console.error("Payment verification failed:", error);

        setStatus("error");
        setMessage(
          "We could not verify your payment. Please check your orders or try again.",
        );
      }
    };

    verifyPayment();
  }, [params, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md space-y-4 text-center">
        {status === "verifying" && (
          <>
            <h1 className="text-3xl font-bold">Verifying Payment</h1>

            <p className="text-muted-foreground">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-3xl font-bold">Payment Successful</h1>

            <p className="text-muted-foreground">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-3xl font-bold">Payment Verification Issue</h1>

            <p className="text-muted-foreground">{message}</p>

            <button
              type="button"
              onClick={() => router.replace("/marketplace/orders")}
              className="text-sm underline"
            >
              View My Orders
            </button>
          </>
        )}
      </div>
    </div>
  );
}
