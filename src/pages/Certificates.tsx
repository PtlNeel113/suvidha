import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Clock,
  CheckCircle2,
  ChevronRight,
  Download,
  Printer,
  AlertCircle,
  User,
  Home,
  Briefcase,
  GraduationCap,
  Heart,
  Users,
} from "lucide-react";
import KioskLayout from "@/components/layout/KioskLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Certificate {
  id: string;
  name: string;
  nameHi: string;
  department: string;
  processingTime: string;
  fee: number;
  category: string;
  documents: string[];
}

export default function Certificates() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All", icon: <FileText className="w-4 h-4" /> },
    { id: "identity", label: "Identity", icon: <User className="w-4 h-4" /> },
    { id: "residence", label: "Residence", icon: <Home className="w-4 h-4" /> },
    { id: "income", label: "Income", icon: <Briefcase className="w-4 h-4" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "family", label: "Family", icon: <Users className="w-4 h-4" /> },
  ];

  const certificates: Certificate[] = [
    {
      id: "income",
      name: "Income Certificate",
      nameHi: "आय प्रमाण पत्र",
      department: "Revenue Department",
      processingTime: "3-5 days",
      fee: 50,
      category: "income",
      documents: ["Aadhaar Card", "Salary Slip/ITR", "Bank Statement"],
    },
    {
      id: "caste",
      name: "Caste Certificate",
      nameHi: "जाति प्रमाण पत्र",
      department: "Social Welfare",
      processingTime: "7-10 days",
      fee: 30,
      category: "identity",
      documents: ["Aadhaar Card", "Father's Caste Certificate", "Affidavit"],
    },
    {
      id: "domicile",
      name: "Domicile Certificate",
      nameHi: "निवास प्रमाण पत्र",
      department: "Revenue Department",
      processingTime: "5-7 days",
      fee: 50,
      category: "residence",
      documents: ["Aadhaar Card", "Residence Proof", "Utility Bill"],
    },
    {
      id: "birth",
      name: "Birth Certificate",
      nameHi: "जन्म प्रमाण पत्र",
      department: "Municipal Corporation",
      processingTime: "1-2 days",
      fee: 20,
      category: "family",
      documents: ["Hospital Record", "Parent's ID"],
    },
    {
      id: "death",
      name: "Death Certificate",
      nameHi: "मृत्यु प्रमाण पत्र",
      department: "Municipal Corporation",
      processingTime: "1-2 days",
      fee: 20,
      category: "family",
      documents: ["Hospital Record", "Applicant's ID"],
    },
    {
      id: "marriage",
      name: "Marriage Certificate",
      nameHi: "विवाह प्रमाण पत्र",
      department: "Registrar Office",
      processingTime: "7-15 days",
      fee: 100,
      category: "family",
      documents: ["Aadhaar of Both", "Marriage Photos", "Witnesses"],
    },
    {
      id: "obc",
      name: "OBC Certificate",
      nameHi: "ओबीसी प्रमाण पत्र",
      department: "Social Welfare",
      processingTime: "10-15 days",
      fee: 30,
      category: "identity",
      documents: ["Aadhaar Card", "Father's Certificate", "School Records"],
    },
    {
      id: "ews",
      name: "EWS Certificate",
      nameHi: "ईडब्ल्यूएस प्रमाण पत्र",
      department: "Revenue Department",
      processingTime: "3-5 days",
      fee: 30,
      category: "income",
      documents: ["Aadhaar Card", "Income Proof", "Property Documents"],
    },
  ];

  const recentApplications = [
    {
      id: "APP2026001234",
      name: "Income Certificate",
      status: "processing",
      appliedDate: "25 Jan 2026",
      expectedDate: "30 Jan 2026",
    },
    {
      id: "APP2026001189",
      name: "Caste Certificate",
      status: "ready",
      appliedDate: "15 Jan 2026",
      expectedDate: "25 Jan 2026",
    },
  ];

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.nameHi.includes(searchQuery);
    const matchesCategory =
      selectedCategory === "all" || cert.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <KioskLayout showBackButton onBack={() => navigate("/dashboard")} title="Government Certificates">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-secondary" />
          </div>
          <h1 className="font-heading text-3xl font-bold mb-2">
            Government Certificates
          </h1>
          <p className="text-muted-foreground">
            Apply for 25+ certificates with Aadhaar-based instant verification
          </p>
        </div>

        {/* Recent Applications */}
        {recentApplications.length > 0 && (
          <div className="govt-card mb-8">
            <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Your Applications
            </h2>
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-xl cursor-pointer hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        app.status === "ready"
                          ? "bg-success/10 text-success"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {app.status === "ready" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {app.id} • Applied {app.appliedDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {app.status === "ready" ? (
                      <Button size="sm" className="bg-success hover:bg-success/90">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    ) : (
                      <Badge className="bg-primary/10 text-primary">
                        Expected: {app.expectedDate}
                      </Badge>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search certificates (e.g., Income, Caste, Domicile...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg"
          />
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

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="govt-card govt-card-hover cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-lg group-hover:text-secondary transition-colors">
                    {cert.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {cert.nameHi} • {cert.department}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {cert.processingTime}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      ₹{cert.fee}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="w-3 h-3" />
                    Required: {cert.documents.slice(0, 2).join(", ")}
                    {cert.documents.length > 2 && ` +${cert.documents.length - 2} more`}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {filteredCertificates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No certificates match your search</p>
          </div>
        )}

        {/* Help Banner */}
        <div className="mt-8 govt-card bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-xl font-bold mb-1">
                Need help choosing?
              </h3>
              <p className="text-secondary-foreground/80">
                Talk to Suvidha Tai - she'll guide you to the right certificate
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 h-12 px-6">
              👩 Ask Suvidha Tai
            </Button>
          </div>
        </div>
      </div>
    </KioskLayout>
  );
}
