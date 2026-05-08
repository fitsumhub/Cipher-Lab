import { expect, test } from "@playwright/test";

test("Caesar cipher encrypt/decrypt works", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const caesarCard = page
    .getByText("Caesar Cipher", { exact: true })
    .locator('xpath=ancestor::*[contains(@class,"rounded-xl")]')
    .first();

  const input = caesarCard.getByPlaceholder("Type a message…");
  await input.fill("Hello, World!");

  const shift = caesarCard.locator('input[type="number"]');
  await shift.fill("3");

  // Wait for client hydration before interactions take effect.
  await page.waitForTimeout(250);

  await caesarCard.getByRole("button", { name: "Encrypt" }).click();
  const caesarEncrypted = "Khoor, Zruog!";
  await expect(caesarCard.locator("pre")).toContainText(caesarEncrypted);

  // Decrypt works on the current input (not the previous output), so
  // we put the encrypted text into the input before decrypting.
  await input.fill(caesarEncrypted);
  await caesarCard.getByRole("button", { name: "Decrypt" }).click();
  await expect(caesarCard.locator("pre")).toContainText("Hello, World!");

  // Copy-to-clipboard is browser/permission dependent in headless runs,
  // so we don't assert it here.
});

test("Vigenère cipher encrypt/decrypt works", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const vigenereCard = page
    .getByText("Vigenère Cipher", { exact: true })
    .locator('xpath=ancestor::*[contains(@class,"rounded-xl")]')
    .first();

  const input = vigenereCard.getByPlaceholder("Type a message…");
  await input.fill("Attack at dawn");

  await vigenereCard.getByPlaceholder("e.g. LEMON").fill("LEMON");

  // Wait for client hydration before interactions take effect.
  await page.waitForTimeout(250);

  await vigenereCard.getByRole("button", { name: "Encrypt" }).click();
  const vigenereEncrypted = "Lxfopv ef rnhr";
  await expect(vigenereCard.locator("pre")).toContainText(vigenereEncrypted);

  await input.fill(vigenereEncrypted);
  await vigenereCard.getByRole("button", { name: "Decrypt" }).click();
  await expect(vigenereCard.locator("pre")).toContainText("Attack at dawn");
});
