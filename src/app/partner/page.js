export default function PartnerPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 text-gray-800">
      {/* Hero Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Join the MoodMap Partner Program</h1>
        <p className="text-xl italic mb-6">Let men and partners understand each other better.</p>
        <p className="text-lg mb-8">
          MoodMap helps men understand their partner’s emotional and hormonal cycle — day by day. 
          It turns science and empathy into a simple daily guide for stronger relationships.
        </p>
        {/* Top Call-to-Action */}
        <a 
          href="https://moodmap.promotekit.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block bg-pink-600 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-pink-700"
        >
          Join the MoodMap Partner Program
        </a>
      </header>

      {/* Why Partner with MoodMap */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Why Partner with MoodMap?</h2>
        <ul className="space-y-3 text-lg list-disc list-inside">
          <li><strong>Make a difference:</strong> Help promote awareness between partners. By sharing MoodMap, you foster understanding and emotional intelligence in relationships.</li>
          <li><strong>Earn by spreading empathy:</strong> Get 50% of every MoodMap subscription from the users you bring in – and keep earning as long as they stay subscribed.</li>
          <li><strong>Simple & transparent:</strong> It’s free to join and easy to start. Our partner portal (powered by PromoteKit) provides your unique link and real-time tracking of clicks, sign-ups, and earnings.</li>
        </ul>
      </section>

      {/* How It Works - 3 Step Guide */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
        <ol className="space-y-4 text-lg list-decimal list-inside">
          <li>
            <strong>Sign Up</strong> – Join the partner program through our <em>MoodMap Partner Portal</em> (via PromoteKit). It takes just a minute to sign up, and you’ll be all set with your dashboard.
          </li>
          <li>
            <strong>Share Your Link</strong> – Spread the word about MoodMap using your unique referral link. Show your audience how this app helps men and partners understand each other better, leading to stronger relationships.
          </li>
          <li>
            <strong>Earn 50%</strong> – For every person who subscribes via your link, you earn 50% of their subscription. MoodMap subscriptions cost <strong>$3.99/month</strong> (or <strong>$29.99/year</strong>), and you get half of that for each subscriber you bring in. You’ll continue to earn every month for as long as they remain subscribed. We handle tracking and payouts automatically, so you can focus on sharing and earning.
          </li>
        </ol>
      </section>

      {/* Example Earnings */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Example Earnings</h2>
        <p className="text-lg mb-4">
          Wondering what your earnings could look like? Here are a few examples of the monthly revenue you could earn:
        </p>
        <ul className="text-lg mb-4 list-disc list-inside">
          <li>10 paying users → approximately $20 per month</li>
          <li>100 paying users → approximately $200 per month</li>
          <li>250 paying users → approximately $500 per month</li>
        </ul>
        <p className="text-lg">
          And remember, there’s no limit – the more people you inspire to join MoodMap, the more you earn. Since commissions are recurring, these earnings repeat every month as long as your referrals stay subscribed.
        </p>
      </section>

      {/* Our Mission */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-lg mb-4">
          MoodMap’s mission is to <strong>help promote awareness and emotional intelligence in relationships.</strong> By partnering with us, you’re not just earning — you’re helping couples connect on a deeper level. In other words, you’re joining the movement that turns emotional insight into connection.
        </p>
        <p className="text-lg">
          We believe that when partners truly understand each other, they build stronger, more compassionate bonds. As a MoodMap Partner, you play a key role in spreading that understanding and empathy to more people around the world.
        </p>
      </section>

      {/* Bottom Call-to-Action */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Join?</h2>
        <p className="text-xl mb-6"><strong>Earn by spreading empathy.</strong> Become a part of the MoodMap movement today.</p>
        <a 
          href="https://moodmap.promotekit.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block bg-pink-600 text-white text-xl font-semibold px-8 py-4 rounded-md shadow-md hover:bg-pink-700"
        >
          Join the MoodMap Partner Program
        </a>
      </section>
    </main>
  );
}
