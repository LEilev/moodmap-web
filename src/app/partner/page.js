// File: app/partner/page.js
// (keeps the same visual system as the homepage hero, spacing, and CTA styles)

export const metadata = {
  title: "Partner Program – MoodMap",
  description: "Join the MoodMap Partner Program and earn by spreading empathy.",
};

export default function PartnerPage() {
  return (
    <>
      {/* Hero Section */}
      <section
        id="hero"
        className="relative isolate bg-primary-blue text-center px-6 pt-20 pb-14 sm:pt-24 sm:pb-16"
      >
        {/* Subtle premium glows (emerald→blue) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-emerald-400/25 to-blue-500/25 blur-[140px] sm:blur-[180px] md:opacity-30 -z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-32 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-500/25 to-emerald-400/25 blur-[160px] sm:blur-[200px] md:opacity-30 -z-10"
        />
        {/* Hero Content */}
        <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            MoodMap Partner Program
          </span>
        </h1>
        <p className="italic text-blue-100 text-lg sm:text-xl mt-4 mb-6">
          Let men and partners understand each other better.
        </p>
        <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto mb-8">
          MoodMap helps men understand their partner’s emotional and hormonal cycle — day by day.
          It turns science and empathy into a simple daily guide for stronger relationships.
        </p>
        {/* Top Call-to-Action */}
        <a
          href="https://moodmap.promotekit.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.35)] ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_16px_36px_rgba(37,99,235,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
        >
          Join the MoodMap Partner Program
        </a>
      </section>

      {/* Main Content Sections Container */}
      <div className="max-w-3xl mx-auto p-6">
        {/* Why Partner with MoodMap */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why Partner with MoodMap?</h2>
          <ul className="space-y-3 text-lg list-disc list-inside text-blue-100">
            <li>
              <strong className="text-white">Make a difference:</strong> Help promote awareness between partners.
              By sharing MoodMap, you foster understanding and emotional intelligence in relationships.
            </li>
            <li>
              <strong className="text-white">Earn by spreading empathy:</strong> Get 50% of every MoodMap subscription
              from the users you bring in – and keep earning as long as they stay subscribed.
            </li>
            <li>
              <strong className="text-white">Simple &amp; transparent:</strong> It’s free to join and easy to start.
              Our partner portal (powered by PromoteKit) provides your unique link and real-time tracking of clicks,
              sign-ups, and earnings.
            </li>
          </ul>
        </section>

        {/* How It Works - 3 Step Guide */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
          <ol className="space-y-4 text-lg list-decimal list-inside text-blue-100">
            <li>
              <strong className="text-white">Sign Up</strong> – Join the partner program through our
              <em> MoodMap Partner Portal</em> (via PromoteKit). It takes just a minute to sign up, and you’ll be all set
              with your dashboard.
            </li>
            <li>
              <strong className="text-white">Share Your Link</strong> – Spread the word about MoodMap using your unique
              referral link. Show your audience how this app helps men and partners understand each other better, leading
              to stronger relationships.
            </li>
            <li>
              <strong className="text-white">Earn 50%</strong> – For every person who subscribes via your link, you earn
              50% of their subscription. MoodMap subscriptions cost <strong>$3.99/month</strong> (or
              <strong> $29.99/year</strong>), and you get half of that for each subscriber you bring in. You’ll continue
              to earn every month as long as they remain subscribed. We handle tracking and payouts automatically, so you
              can focus on sharing and earning.
            </li>
          </ol>
        </section>

        {/* Example Earnings */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Example Earnings</h2>
          <p className="text-blue-100 text-base sm:text-lg mb-4">
            Wondering what your earnings could look like? Here are a few examples of the monthly revenue you could earn:
          </p>
          <ul className="text-blue-100 text-lg list-disc list-inside mb-4">
            <li>10 paying users → approximately $20 per month</li>
            <li>100 paying users → approximately $200 per month</li>
            <li>250 paying users → approximately $500 per month</li>
          </ul>
          <p className="text-blue-100 text-base sm:text-lg">
            And remember, there’s no limit – the more people you inspire to join MoodMap, the more you earn. Since commissions
            are recurring, these earnings repeat every month as long as your referrals stay subscribed.
          </p>
        </section>

        {/* Our Mission */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-blue-100 text-base sm:text-lg mb-4">
            MoodMap’s mission is to <strong className="text-white">help promote awareness and emotional intelligence in
            relationships.</strong> By partnering with us, you’re not just earning — you’re helping couples connect on a
            deeper level. In other words, you’re joining the movement that turns emotional insight into connection.
          </p>
          <p className="text-blue-100 text-base sm:text-lg">
            We believe that when partners truly understand each other, they build stronger, more compassionate bonds. As a
            MoodMap Partner, you play a key role in spreading that understanding and empathy to more people around the
            world.
          </p>
        </section>

        {/* Bottom Call-to-Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join?</h2>
          <p className="text-blue-100 text-lg sm:text-xl mb-6">
            <strong className="text-white">Earn by spreading empathy.</strong> Become a part of the MoodMap movement today.
          </p>
          <a
            href="https://moodmap.promotekit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.35)] ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_16px_36px_rgba(37,99,235,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
          >
            Join the MoodMap Partner Program
          </a>
        </section>

        {/* Support / Contact line (centered, subtle) */}
        <p className="text-blue-100 text-sm mt-8 text-center">
          Have questions?{" "}
          <a href="/support" className="text-blue-400 hover:underline">
            Visit our Support page
          </a>{" "}
          or join the{" "}
          <a
            href="https://discord.gg/yourdiscordlink"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            MoodMap Discord
          </a>
          .
        </p>
      </div>
    </>
  );
}
