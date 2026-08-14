"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Check,
  Upload,
  FileText,
  Camera,
  Lock,
  ChevronRight,
  AlertCircle,
  User,
  MapPin,
} from "lucide-react";
import { useState } from "react";

type KycStatus = "not_started" | "pending" | "verified";

interface StepState {
  completed: boolean;
}

export default function KycPage() {
  const [status, setStatus] = useState<KycStatus>("not_started");
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<StepState[]>([
    { completed: false },
    { completed: false },
    { completed: false },
    { completed: false },
  ]);

  // Personal info form state
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // Document upload state
  const [documents, setDocuments] = useState({
    idProof: null as string | null,
    addressProof: null as string | null,
  });

  // Selfie state
  const [selfieUploaded, setSelfieUploaded] = useState(false);

  const stepLabels = [
    "Personal Info",
    "Document Upload",
    "Selfie Verification",
    "Review & Submit",
  ];

  const completeStep = (stepIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].completed = true;
    setSteps(newSteps);
    if (stepIndex < 3) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const handleSubmit = () => {
    setStatus("pending");
    completeStep(3);
  };

  const getStatusConfig = (s: KycStatus) => {
    switch (s) {
      case "not_started":
        return {
          color: "text-text-muted",
          bg: "bg-surface-tertiary",
          label: "Not Started",
          icon: Shield,
        };
      case "pending":
        return {
          color: "text-secondary-glow",
          bg: "bg-secondary-glow/20",
          label: "Pending Review",
          icon: AlertCircle,
        };
      case "verified":
        return {
          color: "text-accent-green",
          bg: "bg-accent-green/20",
          label: "Verified",
          icon: Check,
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <h1 className="font-display text-display-md gradient-text">
            Identity Verification
          </h1>
          <p className="text-text-secondary mt-1">
            Verify your identity to unlock withdrawals and tournaments
          </p>
        </div>
        <div
          className={`glass-card p-4 rounded-2xl flex items-center gap-3 ${statusConfig.bg}`}
        >
          <div
            className={`w-10 h-10 rounded-xl ${statusConfig.bg} flex items-center justify-center`}
          >
            <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
          </div>
          <div>
            <div className="text-body-sm text-text-muted">Status</div>
            <div
              className={`font-display text-heading-sm ${statusConfig.color}`}
            >
              {statusConfig.label}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card-strong rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          {stepLabels.map((label, index) => (
            <div
              key={label}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    steps[index].completed
                      ? "bg-accent-green/20 text-accent-green"
                      : index === currentStep
                        ? "bg-primary-glow/20 text-primary-glow ring-2 ring-primary-glow/40"
                        : "bg-surface-tertiary text-text-muted"
                  }`}
                >
                  {steps[index].completed ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-display text-body-sm">
                      {index + 1}
                    </span>
                  )}
                </div>
                <span
                  className={`text-caption hidden md:block ${index <= currentStep ? "text-text-primary" : "text-text-muted"}`}
                >
                  {label}
                </span>
              </div>
              {index < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-all ${steps[index].completed ? "bg-accent-green" : "bg-surface-border"}`}
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Step Content */}
      {status !== "pending" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card-strong rounded-2xl p-6"
        >
          {/* Step 1: Personal Info */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-glow/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-glow" />
                </div>
                <div>
                  <h2 className="font-display text-heading-md text-text-primary">
                    Personal Information
                  </h2>
                  <p className="text-text-secondary text-body-sm">
                    Enter your legal details as they appear on your ID
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Legal Name</label>
                  <input
                    type="text"
                    value={personalInfo.fullName}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        fullName: e.target.value,
                      })
                    }
                    placeholder="John Doe"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="label">Date of Birth</label>
                  <input
                    type="date"
                    value={personalInfo.dob}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, dob: e.target.value })
                    }
                    className="input w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Residential Address</label>
                  <input
                    type="text"
                    value={personalInfo.address}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        address: e.target.value,
                      })
                    }
                    placeholder="123 Main Street, Apt 4B"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="label">City</label>
                  <input
                    type="text"
                    value={personalInfo.city}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, city: e.target.value })
                    }
                    placeholder="City"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="label">State / Province</label>
                  <input
                    type="text"
                    value={personalInfo.state}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        state: e.target.value,
                      })
                    }
                    placeholder="State"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="label">ZIP / Postal Code</label>
                  <input
                    type="text"
                    value={personalInfo.zipCode}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        zipCode: e.target.value,
                      })
                    }
                    placeholder="12345"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="label">Country</label>
                  <select
                    value={personalInfo.country}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        country: e.target.value,
                      })
                    }
                    className="input w-full"
                  >
                    <option value="">Select country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="IN">India</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => completeStep(0)}
                className="btn-primary gap-2"
                disabled={!personalInfo.fullName || !personalInfo.dob}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Document Upload */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-glow/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-glow" />
                </div>
                <div>
                  <h2 className="font-display text-heading-md text-text-primary">
                    Document Upload
                  </h2>
                  <p className="text-text-secondary text-body-sm">
                    Upload clear photos of your documents
                  </p>
                </div>
              </div>

              {/* ID Proof */}
              <div>
                <label className="label mb-2 block">
                  Identity Proof (Passport, Driver's License, or National ID)
                </label>
                {documents.idProof ? (
                  <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-green/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-accent-green" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">
                        {documents.idProof}
                      </div>
                      <div className="text-body-sm text-accent-green">
                        Uploaded successfully
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setDocuments({ ...documents, idProof: null })
                      }
                      className="btn-ghost text-body-sm text-accent-red"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      setDocuments({
                        ...documents,
                        idProof: "passport_front.jpg",
                      })
                    }
                    className="w-full glass-card-hover p-8 rounded-2xl border-2 border-dashed border-surface-border hover:border-primary-glow/50 transition-all text-center"
                  >
                    <Upload className="w-10 h-10 mx-auto mb-3 text-text-muted" />
                    <div className="text-text-primary font-medium">
                      Click to upload or drag and drop
                    </div>
                    <div className="text-body-sm text-text-muted mt-1">
                      JPG, PNG, or PDF (max 5MB)
                    </div>
                  </button>
                )}
              </div>

              {/* Address Proof */}
              <div>
                <label className="label mb-2 block">
                  Address Proof (Utility Bill, Bank Statement, or Lease)
                </label>
                {documents.addressProof ? (
                  <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-green/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-accent-green" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">
                        {documents.addressProof}
                      </div>
                      <div className="text-body-sm text-accent-green">
                        Uploaded successfully
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setDocuments({ ...documents, addressProof: null })
                      }
                      className="btn-ghost text-body-sm text-accent-red"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      setDocuments({
                        ...documents,
                        addressProof: "utility_bill.pdf",
                      })
                    }
                    className="w-full glass-card-hover p-8 rounded-2xl border-2 border-dashed border-surface-border hover:border-primary-glow/50 transition-all text-center"
                  >
                    <Upload className="w-10 h-10 mx-auto mb-3 text-text-muted" />
                    <div className="text-text-primary font-medium">
                      Click to upload or drag and drop
                    </div>
                    <div className="text-body-sm text-text-muted mt-1">
                      JPG, PNG, or PDF (max 5MB)
                    </div>
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="btn-secondary gap-2"
                >
                  Back
                </button>
                <button
                  onClick={() => completeStep(1)}
                  className="btn-primary gap-2 flex-1"
                  disabled={!documents.idProof || !documents.addressProof}
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Selfie Verification */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-glow/20 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-primary-glow" />
                </div>
                <div>
                  <h2 className="font-display text-heading-md text-text-primary">
                    Selfie Verification
                  </h2>
                  <p className="text-text-secondary text-body-sm">
                    Take a clear selfie for identity confirmation
                  </p>
                </div>
              </div>

              {selfieUploaded ? (
                <div className="glass-card p-6 rounded-2xl text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-accent-green/20 flex items-center justify-center">
                    <Check className="w-10 h-10 text-accent-green" />
                  </div>
                  <h3 className="font-display text-heading-md text-text-primary mb-2">
                    Selfie Captured!
                  </h3>
                  <p className="text-text-secondary text-body mb-4">
                    Your selfie has been securely uploaded
                  </p>
                  <button
                    onClick={() => setSelfieUploaded(false)}
                    className="btn-ghost text-body-sm"
                  >
                    Retake
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelfieUploaded(true)}
                  className="w-full glass-card-hover p-12 rounded-2xl border-2 border-dashed border-surface-border hover:border-primary-glow/50 transition-all text-center"
                >
                  <Camera className="w-16 h-16 mx-auto mb-4 text-primary-glow" />
                  <div className="text-text-primary font-display text-heading-md mb-2">
                    Take Selfie
                  </div>
                  <div className="text-body-sm text-text-muted max-w-md mx-auto">
                    Ensure good lighting, face the camera directly, and remove
                    glasses or hats. Look straight into the camera.
                  </div>
                </button>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="btn-secondary gap-2"
                >
                  Back
                </button>
                <button
                  onClick={() => completeStep(2)}
                  className="btn-primary gap-2 flex-1"
                  disabled={!selfieUploaded}
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-glow/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-glow" />
                </div>
                <div>
                  <h2 className="font-display text-heading-md text-text-primary">
                    Review & Submit
                  </h2>
                  <p className="text-text-secondary text-body-sm">
                    Please review your information before submitting
                  </p>
                </div>
              </div>

              {/* Review Summary */}
              <div className="glass-card p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                  <span className="text-text-muted text-body-sm">
                    Full Name
                  </span>
                  <span className="text-text-primary font-medium">
                    {personalInfo.fullName || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                  <span className="text-text-muted text-body-sm">
                    Date of Birth
                  </span>
                  <span className="text-text-primary font-medium">
                    {personalInfo.dob || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                  <span className="text-text-muted text-body-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Address
                  </span>
                  <span className="text-text-primary font-medium text-right">
                    {personalInfo.address || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                  <span className="text-text-muted text-body-sm">ID Proof</span>
                  <span className="text-accent-green font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> {documents.idProof}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                  <span className="text-text-muted text-body-sm">
                    Address Proof
                  </span>
                  <span className="text-accent-green font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> {documents.addressProof}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-body-sm">Selfie</span>
                  <span className="text-accent-green font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="glass-panel p-4 rounded-2xl flex items-start gap-3">
                <Lock className="w-5 h-5 text-primary-glow flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-text-primary text-body-sm">
                    Privacy Notice
                  </div>
                  <p className="text-text-secondary text-body-sm mt-1">
                    Your documents are encrypted and securely stored. We use
                    them only for identity verification and comply with all
                    applicable data protection regulations. Your data will never
                    be shared with third parties.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="btn-secondary gap-2"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn-primary gap-2 flex-1"
                >
                  <Shield className="w-4 h-4" />
                  Submit for Verification
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Pending State */}
      {status === "pending" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-strong rounded-2xl p-8 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-secondary-glow/20 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-secondary-glow" />
          </div>
          <h2 className="font-display text-heading-lg text-text-primary mb-2">
            Verification In Progress
          </h2>
          <p className="text-text-secondary text-body max-w-md mx-auto mb-6">
            Your documents have been submitted successfully. Our team will
            review your application within 24-48 hours. You&apos;ll receive a
            notification once verification is complete.
          </p>
          <div className="flex items-center justify-center gap-2 text-body-sm text-text-muted">
            <Lock className="w-4 h-4" />
            Your data is encrypted and securely stored
          </div>
        </motion.div>
      )}

      {/* Info Banner */}
      {status === "not_started" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 rounded-2xl flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-glow/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-primary-glow" />
          </div>
          <div>
            <h3 className="font-display text-heading-sm text-text-primary mb-1">
              Why verify your identity?
            </h3>
            <ul className="text-text-secondary text-body-sm space-y-1 mt-2">
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-accent-green" /> Unlock unlimited
                withdrawals
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-accent-green" /> Participate in
                high-stakes tournaments
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-accent-green" /> Increase your
                account security level
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-accent-green" /> Access exclusive
                verified-only features
              </li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
