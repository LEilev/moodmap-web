// src/app/activate/page.js
import ActivateClient from "./ActivateClient";

export const metadata = {
  title: "Activate",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function ActivatePage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  return <ActivateClient searchParams={resolvedSearchParams || {}} />;
}
