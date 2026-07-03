import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/PageHeader";
import { Check, Rocket, TrendingUp, Star, Crown, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const JMCPlus = () => {
  const packages = [
    {
      id: "starter",
      name: "Starter",
      icon: Rocket,
      description: "Perfect for students beginning their math journey",
      price: "MWK3,000",
      period: "/month",
      features: [
        "Access to basic video tutorials",
        "Practice problems with solutions",
        "Progress tracking",
        "Mobile app access",
      ],
      popular: false,
      cta: "Get started",
    },
    {
      id: "growth",
      name: "Growth",
      icon: TrendingUp,
      description: "For dedicated learners seeking comprehensive support",
      price: "MWK9,000",
      period: "/3 months",
      features: [
        "All Starter features",
        "Live weekly Q&A sessions",
        "Downloadable study materials",
        "Practice tests with detailed solutions",
        "Email support",
      ],
      popular: true,
      cta: "Subscribe now",
    },
    {
      id: "pro",
      name: "Pro",
      icon: Star,
      description: "Ultimate package for serious math achievers",
      price: "MWK18,000",
      period: "/year",
      features: [
        "All Growth features",
        "1-on-1 mentorship sessions",
        "Advanced problem sets",
        "Exam preparation modules",
        "Priority support",
        "Custom study plans",
      ],
      popular: false,
      cta: "Upgrade to Pro",
    },
  ];

  return (
    <Layout>
      <main className="min-h-screen bg-[#F5F6FA]">
        <PageHeader
          index="004"
          eyebrow="JMC Plus"
          title={
            <>
              Study smarter,<br />unlock more.
            </>
          }
          description="A premium membership that gives you full access to JMC's courses, mentorship, and exclusive material."
        />

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-14">
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {packages.map((pkg, i) => {
              const Icon = pkg.icon;
              return (
                <div
                  key={pkg.id}
                  className={cn(
                    "group relative flex flex-col rounded-2xl border bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-[0_16px_32px_-12px_rgba(10,10,15,0.16)]",
                    pkg.popular ? "border-[#4338FF] border-2" : "border-[#0A0A0F]/10"
                  )}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-code text-[11px] font-bold tracking-wide text-[#4338FF]">
                      PLN·{String(i + 1).padStart(2, "0")}
                    </span>
                    {pkg.popular && (
                      <span className="font-code text-[10px] font-bold uppercase tracking-wider text-white bg-[#4338FF] px-2 py-1">
                        Most popular
                      </span>
                    )}
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#4338FF]/10 mb-4">
                    <Icon className="w-5 h-5 text-[#4338FF]" />
                  </div>

                  <h3 className="font-inter text-xl font-bold text-[#0A0A0F] mb-1">{pkg.name}</h3>
                  <p className="text-[13px] text-[#0A0A0F]/55 mb-6">{pkg.description}</p>

                  <div className="mb-6 pb-6 border-b border-[#0A0A0F]/8">
                    <span className="font-inter text-3xl font-bold text-[#0A0A0F]">{pkg.price}</span>
                    <span className="text-[13px] text-[#0A0A0F]/50">{pkg.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#4338FF] shrink-0 mt-0.5" />
                        <span className="text-[13px] text-[#0A0A0F]/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => alert("Subscription feature coming soon!")}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-3 font-code text-[11px] font-bold uppercase tracking-wider transition-colors",
                      pkg.popular
                        ? "bg-[#4338FF] text-white hover:bg-[#3730E8]"
                        : "border-2 border-[#0A0A0F] text-[#0A0A0F] hover:bg-[#0A0A0F] hover:text-white"
                    )}
                  >
                    {pkg.id === "starter" && <Rocket className="w-3.5 h-3.5" />}
                    {pkg.id === "growth" && <Crown className="w-3.5 h-3.5" />}
                    {pkg.id === "pro" && <GraduationCap className="w-3.5 h-3.5" />}
                    {pkg.cta}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="text-center border-t-2 border-[#0A0A0F] pt-8">
            <p className="text-[14px] text-[#0A0A0F]/60 mb-1">
              All packages include a 7-day free trial. Cancel anytime.
            </p>
            <p className="font-code text-[12px] text-[#0A0A0F]/45">
              Need help choosing?{" "}
              <a href="/contact" className="text-[#4338FF] hover:underline font-bold">
                Contact our team
              </a>
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default JMCPlus;