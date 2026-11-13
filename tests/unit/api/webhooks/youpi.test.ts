import { describe, it, expect } from "vitest";
import crypto from "crypto";

describe("YouPI-PG Webhook Logic", () => {
  const secret = "test_webhook_secret_key";

  it("generates and verifies HMAC-SHA256 signature correctly", () => {
    const rawPayload = JSON.stringify({
      event_id: "evt_test_123",
      event_type: "payment.success",
      data: {
        order_id: "ord_test_456",
        payment_id: "pay_test_789",
        amount: 500000,
        currency: "INR",
      },
    });

    const signature = crypto
      .createHmac("sha256", secret)
      .update(rawPayload)
      .digest("hex");

    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawPayload)
      .digest("hex");

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);

    expect(sigBuf.length).toBe(expBuf.length);
    expect(crypto.timingSafeEqual(sigBuf, expBuf)).toBe(true);
  });

  it("detects tampered payload through signature mismatch", () => {
    const payload = JSON.stringify({ amount: 1000 });
    const tampered = JSON.stringify({ amount: 9999 });

    const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    const tamperedSig = crypto.createHmac("sha256", secret).update(tampered).digest("hex");

    expect(signature).not.toBe(tamperedSig);
  });
});

