/**
 * @vitest-environment node
 */
import { describe, it, expect } from "vitest";
import { createClient, createServiceClient, getPublicPortfolioUrl } from "@/lib/supabase";

describe("Supabase Client Configuration", () => {
  it("initializes client with valid structure", () => {
    const client = createClient();
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
    expect(client.from).toBeDefined();
    expect(client.storage).toBeDefined();
  });

  it("creates service client with service role capabilities in node environment", () => {
    const serviceClient = createServiceClient();
    expect(serviceClient).toBeDefined();
    expect(serviceClient.auth).toBeDefined();
    expect(serviceClient.from).toBeDefined();
  });

  it("throws a security violation if createServiceClient is invoked in a browser environment", () => {
    (globalThis as unknown as { window: unknown }).window = {};
    try {
      expect(() => createServiceClient()).toThrowError(/SECURITY VIOLATION/);
    } finally {
      delete (globalThis as unknown as { window?: unknown }).window;
    }
  });

  it("generates correct public portfolio URL", () => {
    const url = getPublicPortfolioUrl("samples/test-video.mp4");
    expect(url).toContain("public-portfolio/samples/test-video.mp4");
  });
});


