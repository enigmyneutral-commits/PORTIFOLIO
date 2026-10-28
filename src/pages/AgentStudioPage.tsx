import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AgentAuditReport } from '../types/agent';
import { analyzeRepository, analyzeFile, downloadAuditReport } from '../services/agentEngine';
import { 
  ArrowLeft, 
  Upload, 
  GitBranch, 
  FileText, 
  Download, 
  ShieldAlert, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  Cpu, 
  Layers, 
  Terminal, 
  AlertTriangle, 
  Check, 
  Mail, 
  MessageCircle,
  Loader2,
  FileArchive,
  RefreshCw
} from 'lucide-react';

interface AgentStudioPageProps {
  initialReport?: AgentAuditReport | null;
  onBack: () => void;
  onOpenInquiry: (projectName?: string) => void;
}

export const AgentStudioPage: React.FC<AgentStudioPageProps> = ({
  initialReport = null,
  onBack,
  onOpenInquiry,
}) => {
  const { language } = useLanguage();
  const isPt = language === 'pt-BR';

  const [report, setReport] = useState<AgentAuditReport | null>(initialReport);
  const [repoUrl, setRepoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAuditRepo = async () => {
    if (!repoUrl.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await analyzeRepository(repoUrl);
      setReport(res);
    } catch {
      // ignore
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const res = await analyzeFile(file);
      setReport(res);
    } catch {
      // ignore
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-[#293033] pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-[#A4ADA8] hover:text-[#B7F36B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isPt ? 'Voltar para Engenharia' : 'Back to Engineering'}</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[#55D68B]">
          <Cpu className="w-4 h-4" />
          <span>Enigmy Neutral Engineering Agent</span>
        </div>
      </div>

      {/* Header Statement */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#B7F36B] font-semibold">
          AI Architecture & Codebase Auditor
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7F4]">
          {isPt ? 'Auditoria Técnica & Orçamento Internacional' : 'Technical Audit & International Dev Pricing'}
        </h1>
        <p className="text-sm sm:text-base text-[#A4ADA8] leading-relaxed">
          {isPt
            ? 'Vincule a URL de um repositório GitHub ou suba um arquivo ZIP / PDF de arquitetura. O agente audita vulnerabilidades, débito técnico e gera uma proposta orçamentária balizada pelo mercado internacional.'
            : 'Link any GitHub repository URL or upload a ZIP archive / PDF specification. The agent audits architectural debt, security vulnerabilities, and generates a concrete refactoring scope with international market rates.'}
        </p>
      </div>

      {/* INPUT / INGESTION INTERFACE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ingest 1: GitHub Link */}
        <div className="p-6 bg-[#101315] border border-[#293033] rounded-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#B7F36B]">
              <GitBranch className="w-4 h-4" />
              <h2 className="text-sm font-bold font-mono text-[#F5F7F4]">
                {isPt ? 'Opção 1: Vincular Repositório Git' : 'Option 1: Link Git Repository'}
              </h2>
            </div>
            <p className="text-xs text-[#A4ADA8] leading-relaxed">
              {isPt
                ? 'Insira o link público do GitHub para análise automática de manifesto, linguagens e endpoints.'
                : 'Enter a public GitHub repository URL for automated manifest and dependency inspection.'}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/organization/repository"
              className="w-full bg-[#15191B] border border-[#293033] rounded px-3 py-2 text-xs font-mono text-[#F5F7F4] placeholder-[#737D77] focus:outline-none focus:border-[#B7F36B]"
            />

            <button
              onClick={handleAuditRepo}
              disabled={!repoUrl.trim() || isProcessing}
              className="w-full py-2.5 px-4 bg-[#B7F36B] hover:bg-[#8FCB4F] disabled:opacity-40 text-[#080A0B] font-mono font-bold text-xs rounded transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Terminal className="w-4 h-4" />}
              <span>{isPt ? 'Auditar Repositório' : 'Audit Repository'}</span>
            </button>
          </div>
        </div>

        {/* Ingest 2: File / ZIP / PDF Upload */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 border rounded-xl flex flex-col items-center justify-center text-center space-y-3 cursor-pointer transition-all ${
            dragActive 
              ? 'bg-[#15191B] border-[#B7F36B]' 
              : 'bg-[#101315] border-[#293033] hover:border-[#3c464a]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip,.pdf,image/*,.json,.ts,.go,.py"
            onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])}
            className="hidden"
          />

          <div className="p-3 bg-[#15191B] border border-[#293033] rounded-full text-[#B7F36B]">
            <Upload className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <h2 className="text-sm font-bold font-mono text-[#F5F7F4]">
              {isPt ? 'Opção 2: Subir Arquivo ZIP, PDF ou Imagem' : 'Option 2: Upload ZIP, PDF or Image'}
            </h2>
            <p className="text-xs text-[#A4ADA8]">
              {isPt
                ? 'Arraste ou clique para selecionar seu projeto (.zip), especificação (.pdf) ou diagrama'
                : 'Drag & drop or browse code archive (.zip), system spec (.pdf), or architecture screenshot'}
            </p>
          </div>

          <span className="text-[10px] font-mono text-[#737D77]">
            Supports .zip · .pdf · .png · .jpg · up to 50MB
          </span>
        </div>

      </div>

      {/* PROCESSING STATE */}
      {isProcessing && (
        <div className="p-12 bg-[#101315] border border-[#293033] rounded-xl text-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#B7F36B] animate-spin mx-auto" />
          <div className="space-y-1 font-mono">
            <h3 className="text-sm font-bold text-[#F5F7F4]">
              {isPt ? 'Agente da Enigmy Neutral em Execução...' : 'Enigmy Neutral Engineering Agent in Execution...'}
            </h3>
            <p className="text-xs text-[#737D77]">
              Analyzing dependency tree, identifying vulnerabilities, and computing international developer rates...
            </p>
          </div>
        </div>
      )}

      {/* AUDIT REPORT DISPLAY */}
      {report && !isProcessing && (
        <div className="bg-[#101315] border border-[#293033] rounded-2xl p-6 sm:p-10 space-y-10 animate-in fade-in duration-300">
          
          {/* Header of Report */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#293033]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#55D68B]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Audit Complete · NVIDIA NIM Architecture Verification</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F4] font-mono tracking-tight">
                {report.projectName}
              </h2>
              <span className="text-xs font-mono text-[#737D77] block">
                Target: {report.sourceIdentifier} · Audited at {new Date(report.generatedAt).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-4 bg-[#15191B] border border-[#293033] rounded-xl text-center font-mono">
                <span className="text-[10px] uppercase text-[#737D77] block">Health Score</span>
                <span className="text-2xl font-bold text-[#B7F36B]">{report.healthScore}/100</span>
              </div>

              <button
                onClick={() => downloadAuditReport(report)}
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-[#B7F36B] hover:bg-[#8FCB4F] text-[#080A0B] font-mono font-bold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>{isPt ? 'Baixar Dossiê (.md)' : 'Download Audit (.md)'}</span>
              </button>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-6 bg-[#15191B] border border-[#293033] rounded-xl space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#B7F36B]">
              Executive Summary
            </h3>
            <p className="text-xs sm:text-sm text-[#F5F7F4] leading-relaxed">
              {report.executiveSummary}
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
              {report.detectedStack.map((tech) => (
                <span key={tech} className="px-2.5 py-1 bg-[#101315] border border-[#293033] text-[#A4ADA8] rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Vulnerabilities & Bottlenecks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Vulnerabilities */}
            <div className="p-6 bg-[#15191B] border border-[#293033] rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-[#FF7777]">
                <ShieldAlert className="w-4 h-4" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
                  {isPt ? 'Vulnerabilidades & Riscos Detectados' : 'Detected Vulnerabilities & Risks'}
                </h3>
              </div>

              <div className="space-y-3">
                {report.vulnerabilities.map((v, i) => (
                  <div key={i} className="p-3 bg-[#101315] border border-[#FF7777]/20 rounded-lg space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#F5F7F4]">{v.title}</span>
                      <span className="text-[10px] font-mono text-[#FF7777] bg-[#FF7777]/10 px-1.5 py-0.5 rounded border border-[#FF7777]/25">
                        {v.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A4ADA8] leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottlenecks & Roadmap */}
            <div className="p-6 bg-[#15191B] border border-[#293033] rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-[#F2C66D]">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
                  {isPt ? 'Gargalos de Desempenho & Recomendações' : 'Bottlenecks & Modernization Roadmap'}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                {report.recommendations.map((r, i) => (
                  <div key={i} className="p-3 bg-[#101315] border border-[#293033] rounded-lg flex items-start gap-2.5">
                    <span className="text-[#B7F36B] font-mono mt-0.5 font-bold">0{i + 1}.</span>
                    <span className="text-[#A4ADA8] leading-relaxed">{r}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* What Enigmy Neutral Delivers */}
          <div className="p-6 bg-[#15191B] border border-[#293033] rounded-xl space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#55D68B]">
              {isPt ? 'O que a Enigmy Neutral Entrega para este Projeto' : 'What Enigmy Neutral Delivers for this Scope'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {report.enigmyNeutralScope.map((scope, idx) => (
                <div key={idx} className="p-4 bg-[#101315] border border-[#293033] rounded-lg space-y-1">
                  <span className="text-[#55D68B] font-mono font-bold">Sprint 0{idx + 1}</span>
                  <p className="text-[#F5F7F4] leading-relaxed">{scope}</p>
                </div>
              ))}
            </div>
          </div>

          {/* INTERNATIONAL PRICING MODEL (USD) */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-[#15191B] to-[#1a2023] border border-[#55D68B]/40 rounded-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#293033]">
              <div className="space-y-1">
                <span className="text-xs font-mono text-[#55D68B] uppercase tracking-wider font-bold">
                  International Developer Market Pricing Model (USD)
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#F5F7F4] font-mono">
                  {report.pricingEstimate.totalEstimateUSD}
                </h3>
                <p className="text-xs font-mono text-[#737D77]">
                  {report.pricingEstimate.hourlyRateRange} · Total: {report.pricingEstimate.totalHours} Estimated Engineering Hours
                </p>
              </div>

              <button
                onClick={() => onOpenInquiry(report.projectName)}
                className="px-6 py-3 bg-[#B7F36B] hover:bg-[#8FCB4F] text-[#080A0B] font-mono font-bold text-xs sm:text-sm rounded-md transition-colors cursor-pointer shrink-0 shadow-sm"
              >
                {isPt ? 'Iniciar Projeto Conforme Orçamento' : 'Initialize Project Under this Estimate'}
              </button>
            </div>

            {/* Itemized Phases */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {report.pricingEstimate.phases.map((phase, idx) => (
                <div key={idx} className="p-4 bg-[#101315] border border-[#293033] rounded-lg space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[#55D68B] font-bold">{phase.estimateUSD}</span>
                    <span className="text-[10px] font-mono text-[#737D77]">{phase.duration}</span>
                  </div>
                  <h4 className="font-bold text-[#F5F7F4]">{phase.name}</h4>
                  <p className="text-[11px] text-[#A4ADA8] leading-relaxed">{phase.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#737D77] font-mono border-t border-[#293033]">
              <span>Direct execution by Marcos Dresbach · Contracted under USD terms</span>
              <span>Confidentiality Guaranteed</span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
