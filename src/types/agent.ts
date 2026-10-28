export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: string;
    size?: string;
  };
  auditReport?: AgentAuditReport;
}

export interface PricingPhase {
  name: string;
  description: string;
  estimateUSD: string;
  duration: string;
  hours: number;
}

export interface AgentAuditReport {
  projectName: string;
  sourceType: 'repository' | 'zip_archive' | 'pdf_spec' | 'image_architecture';
  sourceIdentifier: string;
  healthScore: number;
  detectedStack: string[];
  executiveSummary: string;
  vulnerabilities: {
    title: string;
    severity: 'High' | 'Medium' | 'Low';
    description: string;
  }[];
  bottlenecks: string[];
  recommendations: string[];
  enigmyNeutralScope: string[];
  pricingEstimate: {
    currency: string;
    hourlyRateRange: string;
    totalHours: number;
    sprintDuration: string;
    totalEstimateUSD: string;
    phases: PricingPhase[];
  };
  generatedAt: string;
}
