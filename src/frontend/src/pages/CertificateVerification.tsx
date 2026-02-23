import { useState } from 'react';
import { useVerifyCertificate } from '../hooks/useQueries';
import { Shield, CheckCircle, XCircle, Search } from 'lucide-react';

export default function CertificateVerification() {
  const [verificationId, setVerificationId] = useState('');
  const [searchId, setSearchId] = useState('');
  const { data: certificate, isLoading } = useVerifyCertificate(searchId);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationId.trim()) {
      setSearchId(verificationId.trim());
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-secondary flex items-center justify-center shadow-glow-md">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gradient">Verify Certificate</h1>
          <p className="text-lg text-muted-foreground">
            Enter a verification ID to confirm certificate authenticity
          </p>
        </div>

        <form onSubmit={handleVerify} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={verificationId}
              onChange={(e) => setVerificationId(e.target.value)}
              placeholder="Enter verification ID (e.g., CERT-123)"
              className="flex-1 px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              type="submit"
              disabled={!verificationId.trim() || isLoading}
              className="px-6 py-3 rounded-lg gradient-primary text-white font-medium hover:shadow-glow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Verify
            </button>
          </div>
        </form>

        {searchId && (
          <div className="p-8 rounded-2xl bg-card border border-border animate-slide-up">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-muted-foreground">Verifying certificate...</p>
              </div>
            ) : certificate ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-success">Certificate Verified!</h3>
                <div className="space-y-3 text-left max-w-md mx-auto">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Skill:</span>
                    <span className="font-medium">{certificate.skill}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Completion Date:</span>
                    <span className="font-medium">
                      {new Date(Number(certificate.completionDate) / 1000000).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Verification ID:</span>
                    <span className="font-medium">{certificate.verificationId}</span>
                  </div>
                </div>
                <p className="mt-6 text-sm text-muted-foreground">
                  This certificate is stored on the Internet Computer blockchain
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-destructive" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-destructive">Certificate Not Found</h3>
                <p className="text-muted-foreground">
                  No certificate found with this verification ID. Please check and try again.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
