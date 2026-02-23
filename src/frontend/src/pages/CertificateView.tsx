import { useParams } from '@tanstack/react-router';
import { Download, Share2, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function CertificateView() {
  const { id } = useParams({ from: '/certificate/$id' });

  const handleDownload = () => {
    toast.info('PDF download feature coming soon!');
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Certificate link copied to clipboard!');
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Your Certificate</h1>
          <p className="text-muted-foreground">Verification ID: {id}</p>
        </div>

        <div className="relative mb-8">
          <img
            src="/assets/generated/certificate-bg.dim_1200x900.png"
            alt="Certificate"
            className="w-full rounded-2xl shadow-2xl border border-border"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <Award className="w-16 h-16 text-primary mb-4" />
            <h2 className="text-3xl font-bold mb-4">Certificate of Completion</h2>
            <p className="text-xl mb-2">This certifies that</p>
            <p className="text-2xl font-bold mb-4">Learner Name</p>
            <p className="text-lg mb-2">has successfully completed</p>
            <p className="text-2xl font-bold mb-4">Skill Track</p>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 rounded-lg gradient-primary text-white font-medium hover:shadow-glow-md transition-all"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card hover:bg-muted transition-all"
          >
            <Share2 className="w-5 h-5" />
            Share Link
          </button>
        </div>
      </div>
    </div>
  );
}
