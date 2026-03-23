import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Landmark,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Filter,
  Users,
  Home,
  Heart,
  GraduationCap,
  Wallet,
  Tractor,
} from "lucide-react";
import KioskLayout from "@/components/layout/KioskLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Scheme {
  id: string;
  name: string;
  ministry: string;
  benefit: string;
  eligibility: "eligible" | "not-eligible" | "partial";
  category: string;
  icon: React.ReactNode;
}

export default function Schemes() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showEligibleOnly, setShowEligibleOnly] = useState(false);

  const categories = [
    { id: "all", label: "All Schemes", icon: <Landmark className="w-4 h-4" /> },
    { id: "housing", label: "Housing", icon: <Home className="w-4 h-4" /> },
    { id: "health", label: "Health", icon: <Heart className="w-4 h-4" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "finance", label: "Finance", icon: <Wallet className="w-4 h-4" /> },
    { id: "agriculture", label: "Agriculture", icon: <Tractor className="w-4 h-4" /> },
    { id: "women", label: "Women & Child", icon: <Users className="w-4 h-4" /> },
  ];

  const schemes: Scheme[] = [
    {
      id: "1",
      name: "PM Awas Yojana (Urban)",
      ministry: "Ministry of Housing",
      benefit: "₹2.67 Lakh subsidy on home loan",
      eligibility: "eligible",
      category: "housing",
      icon: <Home className="w-6 h-6" />,
    },
    {
      id: "2",
      name: "Ayushman Bharat - PMJAY",
      ministry: "Ministry of Health",
      benefit: "₹5 Lakh health insurance/year",
      eligibility: "eligible",
      category: "health",
      icon: <Heart className="w-6 h-6" />,
    },
    {
      id: "3",
      name: "PM Ujjwala Yojana",
      ministry: "Ministry of Petroleum",
      benefit: "Free LPG connection + 1 refill",
      eligibility: "eligible",
      category: "finance",
      icon: <Wallet className="w-6 h-6" />,
    },
    {
      id: "4",
      name: "PM Kisan Samman Nidhi",
      ministry: "Ministry of Agriculture",
      benefit: "₹6,000/year direct transfer",
      eligibility: "not-eligible",
      category: "agriculture",
      icon: <Tractor className="w-6 h-6" />,
    },
    {
      id: "5",
      name: "Sukanya Samriddhi Yojana",
      ministry: "Ministry of Finance",
      benefit: "7.6% interest for girl child savings",
      eligibility: "partial",
      category: "women",
      icon: <Users className="w-6 h-6" />,
    },
    {
      id: "6",
      name: "National Scholarship Portal",
      ministry: "Ministry of Education",
      benefit: "Up to ₹50,000/year scholarship",
      eligibility: "eligible",
      category: "education",
      icon: <GraduationCap className="w-6 h-6" />,
    },
    {
      id: "7",
      name: "PM SVANidhi",
      ministry: "Ministry of Housing",
      benefit: "₹10,000 loan for street vendors",
      eligibility: "not-eligible",
      category: "finance",
      icon: <Wallet className="w-6 h-6" />,
    },
    {
      id: "8",
      name: "Atal Pension Yojana",
      ministry: "Ministry of Finance",
      benefit: "₹1,000-5,000/month pension",
      eligibility: "eligible",
      category: "finance",
      icon: <Wallet className="w-6 h-6" />,
    },
  ];

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || scheme.category === selectedCategory;
    const matchesEligibility = !showEligibleOnly || scheme.eligibility === "eligible";
    return matchesSearch && matchesCategory && matchesEligibility;
  });

  const eligibleCount = schemes.filter((s) => s.eligibility === "eligible").length;

  const getEligibilityBadge = (eligibility: Scheme["eligibility"]) => {
    switch (eligibility) {
      case "eligible":
        return (
          <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Eligible
          </Badge>
        );
      case "not-eligible":
        return (
          <Badge variant="outline" className="text-destructive border-destructive/20">
            <XCircle className="w-3 h-3 mr-1" />
            Not Eligible
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            Partially Eligible
          </Badge>
        );
    }
  };

  return (
    <KioskLayout showBackButton onBack={() => navigate("/dashboard")} title="Government Schemes">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Landmark className="w-10 h-10 text-success" />
          </div>
          <h1 className="font-heading text-3xl font-bold mb-2">
            Government Schemes Hub
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Check your eligibility for 500+ central and state government schemes 
            based on your Aadhaar-linked profile
          </p>
        </div>

        {/* Eligibility Summary */}
        <div className="govt-card bg-gradient-to-r from-success/10 to-success/5 border-success/20 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-success">
                  {eligibleCount} Schemes Found!
                </h2>
                <p className="text-muted-foreground">
                  Based on your profile, you may be eligible for these benefits
                </p>
              </div>
            </div>
            <Button className="bg-success hover:bg-success/90 h-12 px-6">
              Apply for All Eligible
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search schemes by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>
          <Button
            variant={showEligibleOnly ? "default" : "outline"}
            onClick={() => setShowEligibleOnly(!showEligibleOnly)}
            className="h-14 px-6"
          >
            <Filter className="w-5 h-5 mr-2" />
            Show Eligible Only
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                selectedCategory === cat.id
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {cat.icon}
              <span className="text-sm font-medium">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Schemes Grid */}
        <div className="grid gap-4">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="govt-card govt-card-hover cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    scheme.eligibility === "eligible"
                      ? "bg-success/10 text-success"
                      : scheme.eligibility === "partial"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {scheme.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-heading font-bold text-lg group-hover:text-secondary transition-colors">
                        {scheme.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {scheme.ministry}
                      </p>
                    </div>
                    {getEligibilityBadge(scheme.eligibility)}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-secondary">
                        💰 {scheme.benefit}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No schemes match your criteria</p>
          </div>
        )}

        {/* Verify Aadhaar CTA */}
        <div className="mt-8 govt-card bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-xl font-bold mb-1">
                Want more accurate results?
              </h3>
              <p className="text-secondary-foreground/80">
                Verify your Aadhaar to auto-check eligibility for all 500+ schemes
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 h-12 px-6">
              Verify Aadhaar Now
            </Button>
          </div>
        </div>
      </div>
    </KioskLayout>
  );
}
