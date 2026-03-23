import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Camera,
  MapPin,
  Upload,
  CheckCircle2,
  Shield,
  Clock,
  XCircle,
  ChevronRight,
  FileText,
} from "lucide-react";
import KioskLayout from "@/components/layout/KioskLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { LocationPicker } from "@/components/common/LocationPicker";

type Step = "category" | "details" | "photo" | "verification" | "success";

interface ComplaintCategory {
  id: string;
  icon: string;
  title: string;
  examples: string;
}

export default function Complaints() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFraud, setIsFraud] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [location, setLocation] = useState("");

  const categories: ComplaintCategory[] = [
    {
      id: "roads",
      icon: "🕳️",
      title: "Roads & Potholes",
      examples: "Potholes, damaged roads, missing signs",
    },
    {
      id: "water",
      icon: "💧",
      title: "Water Supply",
      examples: "Leakage, contamination, no supply",
    },
    {
      id: "electricity",
      icon: "⚡",
      title: "Electricity",
      examples: "Power cuts, damaged poles, illegal connections",
    },
    {
      id: "sanitation",
      icon: "🗑️",
      title: "Sanitation",
      examples: "Garbage, drainage, open defecation",
    },
    {
      id: "corruption",
      icon: "🏛️",
      title: "Corruption",
      examples: "Bribery, delayed services, misconduct",
    },
    {
      id: "other",
      icon: "📝",
      title: "Other",
      examples: "Any other civic issue",
    },
  ];

  const handlePhotoCapture = () => {
    // Simulate photo capture
    setUploadedImage("/placeholder.svg");
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      // Randomly determine if fraud (for demo)
      const fraudResult = Math.random() > 0.7;
      setIsFraud(fraudResult);
      setStep("verification");
    }, 2500);
  };

  const existingComplaints = [
    {
      id: "GRV2026001234",
      title: "Pothole on MG Road",
      status: "in-progress",
      date: "28 Jan 2026",
      department: "PWD",
    },
    {
      id: "GRV2026001189",
      title: "Water leakage near Park",
      status: "resolved",
      date: "20 Jan 2026",
      department: "AMC Water",
    },
  ];

  return (
    <KioskLayout
      showBackButton
      onBack={() => (step === "category" ? navigate("/") : setStep("category"))}
      title="File a Complaint"
    >
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Step: Category Selection */}
        {step === "category" && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-destructive" />
              </div>
              <h1 className="font-heading text-3xl font-bold mb-2">
                Report a Civic Issue
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                AI-powered complaint system with fraud detection. Your complaint
                will be verified and assigned within 24 hours.
              </p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setStep("details");
                  }}
                  className="service-tile"
                >
                  <span className="text-4xl mb-2">{cat.icon}</span>
                  <h3 className="font-heading font-bold">{cat.title}</h3>
                  <p className="text-xs text-muted-foreground text-center">
                    {cat.examples}
                  </p>
                </button>
              ))}
            </div>

            {/* Existing Complaints */}
            <div className="govt-card">
              <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Your Recent Complaints
              </h2>
              <div className="space-y-3">
                {existingComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium">{complaint.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {complaint.id} • {complaint.date} • {complaint.department}
                      </p>
                    </div>
                    <Badge
                      className={
                        complaint.status === "resolved"
                          ? "bg-success/10 text-success"
                          : "bg-primary/10 text-primary"
                      }
                    >
                      {complaint.status === "resolved" ? "Resolved" : "In Progress"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step: Details */}
        {step === "details" && (
          <div className="govt-card max-w-2xl mx-auto animate-fade-in">
            <h2 className="font-heading text-xl font-bold mb-6">
              Describe the Issue
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brief Description *
                </label>
                <Input
                  placeholder="e.g., Large pothole causing accidents"
                  className="h-14"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Detailed Explanation
                </label>
                <Textarea
                  placeholder="Provide more details about the issue, when it started, etc."
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <div className="flex flex-col gap-2">
                  <Input
                    placeholder="Enter address or use map"
                    className="h-14"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <LocationPicker onLocationSelect={(loc) => setLocation(loc)} className="mt-1" />
                </div>
              </div>
              <Button
                className="w-full h-14 text-lg bg-secondary"
                onClick={() => setStep("photo")}
              >
                Continue to Photo Evidence
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Photo Upload */}
        {step === "photo" && (
          <div className="govt-card max-w-2xl mx-auto animate-fade-in">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Camera className="w-10 h-10 text-secondary" />
              </div>
              <h2 className="font-heading text-2xl font-bold mb-2">
                Upload Photo Evidence
              </h2>
              <p className="text-muted-foreground mb-6">
                AI will verify the authenticity of your photo to prevent false complaints
              </p>

              {!uploadedImage && !isAnalyzing && (
                <div className="space-y-4">
                  <button
                    onClick={handlePhotoCapture}
                    className="w-full kiosk-btn kiosk-btn-primary flex items-center justify-center gap-4"
                  >
                    <Camera className="w-8 h-8" />
                    <div className="text-left">
                      <span className="block font-heading font-bold text-lg">
                        Take Photo Now
                      </span>
                      <span className="text-sm opacity-80">
                        Use kiosk camera
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={handlePhotoCapture}
                    className="w-full kiosk-btn flex items-center justify-center gap-4"
                  >
                    <Upload className="w-8 h-8" />
                    <div className="text-left">
                      <span className="block font-heading font-bold text-lg">
                        Upload from Phone
                      </span>
                      <span className="text-sm opacity-80">
                        Scan QR to upload
                      </span>
                    </div>
                  </button>
                </div>
              )}

              {isAnalyzing && (
                <div className="py-12">
                  <div className="chakra-spinner mx-auto mb-4" />
                  <p className="font-medium">AI is analyzing your photo...</p>
                  <p className="text-sm text-muted-foreground">
                    Checking for authenticity, location, and severity
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step: Verification Result */}
        {step === "verification" && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            {isFraud ? (
              <div className="govt-card border-destructive/30 bg-destructive/5 text-center">
                <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-12 h-12 text-destructive" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-destructive mb-2">
                  ⚠️ Potential Fraud Detected
                </h2>
                <p className="text-muted-foreground mb-6">
                  Our AI detected that this image may have been tampered with or
                  downloaded from the internet. Filing false complaints is a punishable offense.
                </p>
                <div className="bg-destructive/10 rounded-xl p-4 mb-6">
                  <p className="text-sm font-medium text-destructive">
                    Warning: Your Aadhaar may be flagged for repeated fraud attempts.
                    Fine: Up to ₹500
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setStep("photo")}
                  >
                    Try Different Photo
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => navigate("/")}
                  >
                    Cancel Complaint
                  </Button>
                </div>
              </div>
            ) : (
              <div className="govt-card border-success/30 bg-success/5 text-center">
                <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-12 h-12 text-success" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-success mb-2">
                  ✓ Photo Verified Authentic
                </h2>
                <p className="text-muted-foreground mb-6">
                  AI has verified your photo is genuine and captured at the location
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-card rounded-xl p-4">
                    <CheckCircle2 className="w-6 h-6 text-success mx-auto mb-2" />
                    <p className="text-sm font-medium">Original Photo</p>
                  </div>
                  <div className="bg-card rounded-xl p-4">
                    <MapPin className="w-6 h-6 text-success mx-auto mb-2" />
                    <p className="text-sm font-medium">Location Match</p>
                  </div>
                  <div className="bg-card rounded-xl p-4">
                    <Clock className="w-6 h-6 text-success mx-auto mb-2" />
                    <p className="text-sm font-medium">Recent Capture</p>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-4 text-left mb-6">
                  <h3 className="font-bold mb-2">AI Assessment:</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Severity:</strong> HIGH - Requires immediate attention<br />
                    <strong>Department:</strong> Public Works Department (PWD)<br />
                    <strong>Est. Resolution:</strong> 3-5 working days
                  </p>
                </div>

                <Button
                  className="w-full h-14 text-lg bg-success hover:bg-success/90"
                  onClick={() => setStep("success")}
                >
                  Submit Complaint
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-success mb-2">
              Complaint Registered! 🎉
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Your complaint has been submitted and assigned to the concerned department
            </p>

            <div className="govt-card max-w-md mx-auto mb-8 text-left">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Complaint ID:</span>
                  <span className="font-mono font-bold">GRV2026001456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span>Public Works Department</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority:</span>
                  <Badge className="bg-destructive text-destructive-foreground">HIGH</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Resolution:</span>
                  <span>5 Feb 2026</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary/10 rounded-xl p-4 max-w-md mx-auto mb-8">
              <p className="text-sm">
                📱 SMS sent to your registered mobile number.
                Track status anytime with complaint ID.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button className="h-12 px-6 bg-secondary">
                Track Status
              </Button>
              <Button variant="outline" className="h-12 px-6" onClick={() => navigate("/")}>
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </KioskLayout >
  );
}
