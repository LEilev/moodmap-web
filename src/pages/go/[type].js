// pages/go/[type].js
// Dynamic route for /go/monthly and /go/yearly
// Re-export the SSR redirect from pages/go.js

export { getServerSideProps } from "../go";

export default function GoPlanPage() {
  return null;
}
