import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Rocket, TrendingUp, Star, Crown, GraduationCap } from "lucide-react";

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
        "Mobile app access"
      ],
      popular: false
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
        "Email support"
      ],
      popular: true
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
        "Custom study plans"
      ],
      popular: false
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient text-primary-foreground py-24 relative overflow-hidden">
        <div className="math-bg absolute inset-0" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 gradient-text">
            JMC Plus
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            JMC Plus is a premium membership that gives you access to all of our courses and resources.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-background -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {packages.map((pkg) => {
              const IconComponent = pkg.icon;
              return (
                <Card
                  key={pkg.id}
                  className={`relative overflow-hidden transition-all hover:shadow-xl ${
                    pkg.popular ? 'ring-2 ring-primary scale-105' : 'hover:-translate-y-2'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground px-6 py-1 rounded-full text-sm font-semibold transform rotate-12 shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="text-center mb-6 p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-primary">{pkg.price}</div>
                      <div className="text-muted-foreground">{pkg.period}</div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full gap-2 ${
                        pkg.popular ? 'bg-primary hover:bg-primary/90' : ''
                      }`}
                      variant={pkg.popular ? 'default' : 'outline'}
                      onClick={() => alert('Subscription feature coming soon!')}
                    >
                      {pkg.id === 'starter' && <Rocket className="w-4 h-4" />}
                      {pkg.id === 'growth' && <Crown className="w-4 h-4" />}
                      {pkg.id === 'pro' && <GraduationCap className="w-4 h-4" />}
                      {pkg.id === 'starter' ? 'Get Started' :
                       pkg.id === 'growth' ? 'Subscribe Now' : 'Upgrade to Pro'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Footer */}
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-2">
                All packages include a 7-day free trial. Cancel anytime.
              </p>
              <p className="text-sm">
                Need help choosing?{' '}
                <a href="/contact" className="text-primary hover:underline font-semibold">
                  Contact our team
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default JMCPlus;