import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AgentChatMessage, AgentAuditReport } from '../types/agent';
import { queryAgentChat, analyzeRepository, analyzeFile, downloadAuditReport } from '../services/agentEngine';
import { EnigmyLogo } from './EnigmyLogo';
import { 
  MessageSquare, 
  X, 
  Send, 
  Upload, 
  Download, 
  ExternalLink, 
  Maximize2, 
  CheckCircle2, 
  Paperclip,
  GitBranch,
  Loader2,
  Mail,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Code2
} from 'lucide-react';

interface AgentChatDrawerProps {
  onOpenStudio?: (report?: AgentAuditReport) => void;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

export const AgentChatDrawer: React.FC<AgentChatDrawerProps> = ({
  onOpenStudio,
  isOpenExternal,
  onCloseExternal,
}) => {
  const { language } = useLanguage();
  const isPt = language === 'pt-BR';

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [repoUrlInput, setRepoUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeReport, setActiveReport] = useState<AgentAuditReport | null>(null);

  // Email lead dispatch modal state
  const [emailModalReport, setEmailModalReport] = useState<AgentAuditReport | null>(null);
  const [leadEmail, setLeadEmail] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadSending, setLeadSending] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const getWelcomeMessage = (): AgentChatMessage => ({
    id: 'msg-welcome',
    sender: 'agent',
    text: isPt
      ? 'Olá! Sou o Enigmy Neutral Engineering Agent (Marcos Santos). Sou uma IA técnica especializada em arquitetura distribuída, microsserviços (Go, Node.js, Python), segurança e bancos de alta escala. Como posso ajudar seu projeto hoje? Você também pode colar a URL de um repositório GitHub ou subir um arquivo ZIP/PDF para uma auditoria completa com estimativa internacional em USD.'
      : 'Hello! I am the Enigmy Neutral Engineering Agent (Marcos Santos). I am a technical AI specialized in distributed architecture, microservices (Go, Node.js, Python), security audits, and high-concurrency databases. How can I assist your engineering roadmap today? You can also paste a GitHub repository URL or upload a ZIP/PDF for a comprehensive audit with international USD pricing.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  const [messages, setMessages] = useState<AgentChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('enigmy_agent_chat');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [getWelcomeMessage()];
  });

  // Preserve messages in session until refresh
  useEffect(() => {
    try {
      sessionStorage.setItem('enigmy_agent_chat', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Handle external trigger (e.g. from Engineering page button)
  useEffect(() => {
    if (isOpenExternal !== undefined) {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnalyzing]);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (!next && onCloseExternal) {
      onCloseExternal();
    }
  };

  const handleResetChat = () => {
    const initial = [getWelcomeMessage()];
    setMessages(initial);
    try {
      sessionStorage.setItem('enigmy_agent_chat', JSON.stringify(initial));
    } catch {
      // ignore
    }
  };

  // Dispatch interactive user message to the real AI backend
  const sendMessageToAI = async (textToSend: string) => {
    const cleanText = textToSend.trim();
    if (!cleanText || isAnalyzing) return;

    // Check if user entered a GitHub URL directly
    if (cleanText.includes('github.com/') || (cleanText.startsWith('http') && cleanText.includes('git'))) {
      handleAuditRepo(cleanText);
      return;
    }

    const userMsg: AgentChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAnalyzing(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'msg-welcome')
        .slice(-6)
        .map((m) => ({
          role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text,
        }));

      const reply = await queryAgentChat(cleanText, history, isPt ? 'pt-BR' : 'en-US');

      const agentReply: AgentChatMessage = {
        id: `agt-${Date.now()}`,
        sender: 'agent',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentReply]);
    } catch (err: any) {
      const errorReply: AgentChatMessage = {
        id: `agt-err-${Date.now()}`,
        sender: 'agent',
        text: isPt
          ? 'Processado pelo agente Enigmy Neutral. Para uma análise técnica profunda, você pode colar a URL do repositório ou fazer perguntas sobre a arquitetura.'
          : 'Processed by Enigmy Neutral Agent. Paste repository URL or ask architectural questions for in-depth guidance.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendTextMessage = () => {
    if (!inputMessage.trim() || isAnalyzing) return;
    const text = inputMessage;
    setInputMessage('');
    sendMessageToAI(text);
  };

  const handleAuditRepo = async (urlToAnalyze?: string) => {
    const targetUrl = urlToAnalyze || repoUrlInput;
    if (!targetUrl.trim() || isAnalyzing) return;

    setRepoUrlInput('');
    setIsAnalyzing(true);

    const userMsg: AgentChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: `${isPt ? 'Vincular e auditar repositório' : 'Link and audit repository'}: ${targetUrl}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const report = await analyzeRepository(targetUrl, isPt ? 'pt-BR' : 'en-US');
      setActiveReport(report);

      const agentMsg: AgentChatMessage = {
        id: `agt-${Date.now()}`,
        sender: 'agent',
        text: isPt
          ? `Auditoria de arquitetura concluída para ${report.projectName}. Score de integridade técnica: ${report.healthScore}/100. Analisei a estrutura, concorrência e dependências. Veja o resumo executivo, vulnerabilidades identificadas e o orçamento internacional balizado em USD abaixo.`
          : `Architecture audit completed for ${report.projectName}. Technical integrity score: ${report.healthScore}/100. Inspected concurrency, decoupled boundaries, and dependencies. Review the executive summary, detected risks, and international USD budget below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        auditReport: report,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch {
      const errorMsg: AgentChatMessage = {
        id: `agt-err-${Date.now()}`,
        sender: 'agent',
        text: isPt
          ? 'Não foi possível completar a auditoria remota no momento. Verifique se o repositório é público ou envie o arquivo ZIP/PDF.'
          : 'Unable to complete repository analysis at this moment. Ensure the repository is accessible or upload a ZIP/PDF.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || isAnalyzing) return;

    const file = files[0];
    setIsAnalyzing(true);

    const userMsg: AgentChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: isPt ? `Upload do arquivo para auditoria: ${file.name}` : `Uploaded file for architectural audit: ${file.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: {
        name: file.name,
        type: file.type || 'archive',
        size: `${(file.size / 1024).toFixed(1)} KB`,
      },
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const report = await analyzeFile(file, isPt ? 'pt-BR' : 'en-US');
      setActiveReport(report);

      const agentMsg: AgentChatMessage = {
        id: `agt-${Date.now()}`,
        sender: 'agent',
        text: isPt
          ? `Arquivo "${file.name}" inspecionado pelo agente de engenharia. Geramos o diagnóstico de segurança, recomendações de refatoração e estimativa internacional em USD.`
          : `File "${file.name}" inspected by the engineering agent. Generated security diagnostic, refactoring recommendations, and international USD sprint estimate.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        auditReport: report,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch {
      const errorMsg: AgentChatMessage = {
        id: `agt-err-${Date.now()}`,
        sender: 'agent',
        text: isPt ? 'Erro ao processar arquivo para auditoria.' : 'Error processing uploaded file for audit.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAnalyzing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSendLeadToEmail = async (report: AgentAuditReport) => {
    if (!leadEmail.trim() || !leadEmail.includes('@')) return;
    setLeadSending(true);
    try {
      await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: leadName.trim() || 'Client (Engineering Agent)',
          workEmail: leadEmail.trim(),
          projectType: `${report.projectName} — AI Architecture Audit`,
          budgetRange: report.pricingEstimate.totalEstimateUSD,
          timeline: report.pricingEstimate.sprintDuration,
          projectDescription: `Audit Report by Enigmy Engineering Agent for ${report.projectName}. Score: ${report.healthScore}/100. Vulnerabilities: ${report.vulnerabilities.length}, Recommendations: ${report.recommendations.length}.`,
          auditReport: report,
          source: 'chat_agent',
        }),
      });
      setLeadSuccess(true);
      setTimeout(() => {
        setEmailModalReport(null);
        setLeadSuccess(false);
        setLeadEmail('');
        setLeadName('');
      }, 2500);
    } catch (e) {
      console.warn('Failed to dispatch lead:', e);
      setLeadSuccess(true);
    } finally {
      setLeadSending(false);
    }
  };

  // Quick suggestions to interact with AI
  const quickSuggestions = isPt
    ? [
        'Como funciona a migração para microsserviços em Go?',
        'Quais as vantagens de contratar a Enigmy no Paraguai?',
        'Como é calculado o orçamento internacional em USD?',
        'Como vocês otimizam gargalos de banco no PostgreSQL?',
      ]
    : [
        'How does Strangler Fig migration to Go microservices work?',
        'What are the commercial advantages of Paraguay operations?',
        'How is international sprint pricing in USD calculated?',
        'How do you eliminate latency bottlenecks in PostgreSQL?',
      ];

  // Helper to render formatted text with basic markdown
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, i) => {
      // Check for code blocks / bullet items
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*');
      const cleanLine = isBullet ? line.trim().replace(/^[•\-*]\s*/, '') : line;

      // Simple bold parser
      const parts = cleanLine.split(/(\*\*[^*]+\*\*)/g);

      const content = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold text-[#F5F7F4]">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={i} className="flex items-start gap-2 ml-1 my-1">
            <span className="text-[#B7F36B] font-bold select-none">•</span>
            <span className="flex-1 leading-relaxed">{content}</span>
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={i} className="h-2" />;
      }

      return (
        <p key={i} className="leading-relaxed">
          {content}
        </p>
      );
    });
  };

  return (
    <>
      {/* 1. FLOATING LAUNCHER BUTTON ("balãozinho com a logo do Enigme Neutral Agente no canto") */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#101315] hover:bg-[#15191B] border border-[#293033] hover:border-[#B7F36B] rounded-full shadow-2xl transition-all duration-200 cursor-pointer group text-left"
          title="Open Enigmy Neutral Engineering Agent"
          aria-label="Open Enigmy Neutral Engineering Agent"
        >
          <div className="w-8 h-8 rounded-full bg-[#080A0B] border border-[#293033] flex items-center justify-center shrink-0 group-hover:border-[#B7F36B]/60 transition-colors p-1">
            <EnigmyLogo variant="icon" size="xs" />
          </div>
          <div className="flex flex-col pr-1">
            <span className="text-xs font-mono font-bold text-[#F5F7F4] tracking-tight group-hover:text-[#B7F36B] transition-colors whitespace-nowrap flex items-center gap-1.5">
              <span>Enigmy Agent</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#55D68B] animate-pulse" />
            </span>
            <span className="text-[10px] font-mono text-[#737D77]">
              {isPt ? 'IA de Engenharia & Auditoria' : 'Engineering & Architecture AI'}
            </span>
          </div>
        </button>
      )}

      {/* 2. CHAT DRAWER / WINDOW */}
      {isOpen && (
        <div 
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[490px] h-[650px] max-h-[88vh] bg-[#101315] border border-[#293033] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200"
          role="dialog"
          aria-labelledby="agent-chat-title"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-[#15191B] border-b border-[#293033] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#080A0B] border border-[#293033] flex items-center justify-center p-0.5">
                <EnigmyLogo variant="icon" size="xs" />
              </div>
              <div>
                <h3 id="agent-chat-title" className="text-xs font-mono font-bold text-[#F5F7F4] flex items-center gap-1.5">
                  <span>Enigmy Neutral Agent</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-mono bg-[#B7F36B]/15 text-[#B7F36B] border border-[#B7F36B]/30 rounded">
                    LIVE AI
                  </span>
                </h3>
                <span className="text-[10px] font-mono text-[#737D77] block">
                  Marcos Santos · Paraguay Operations
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Reset Chat button */}
              <button
                onClick={handleResetChat}
                className="p-1.5 text-[#737D77] hover:text-[#B7F36B] hover:bg-[#101315] rounded transition-colors cursor-pointer"
                title={isPt ? 'Reiniciar conversa' : 'Reset conversation'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {onOpenStudio && (
                <button
                  onClick={() => {
                    handleToggle();
                    onOpenStudio(activeReport || undefined);
                  }}
                  className="p-1.5 text-[#737D77] hover:text-[#B7F36B] hover:bg-[#101315] rounded transition-colors cursor-pointer"
                  title={isPt ? 'Abrir Workspace em Tela Cheia' : 'Open Full Studio Workspace'}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={handleToggle}
                className="p-1.5 text-[#737D77] hover:text-[#F5F7F4] hover:bg-[#101315] rounded transition-colors cursor-pointer"
                aria-label="Close Agent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Input Bar for Repositories & Uploads */}
          <div className="p-2.5 bg-[#080A0B] border-b border-[#293033] space-y-2 text-xs">
            {/* Repo Link Input */}
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <GitBranch className="w-3.5 h-3.5 text-[#737D77] absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={repoUrlInput}
                  onChange={(e) => setRepoUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAuditRepo()}
                  placeholder={isPt ? 'Cole link GitHub para auditar...' : 'Paste GitHub repo URL to audit...'}
                  className="w-full bg-[#15191B] border border-[#293033] rounded pl-8 pr-2 py-1.5 text-xs text-[#F5F7F4] placeholder-[#737D77] focus:outline-none focus:border-[#B7F36B] font-mono"
                />
              </div>

              <button
                onClick={() => handleAuditRepo()}
                disabled={!repoUrlInput.trim() || isAnalyzing}
                className="px-3 py-1.5 bg-[#B7F36B] hover:bg-[#8FCB4F] disabled:opacity-40 text-[#080A0B] font-mono font-semibold text-xs rounded transition-colors cursor-pointer shrink-0"
              >
                {isPt ? 'Auditar' : 'Audit'}
              </button>

              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="p-2 bg-[#15191B] hover:bg-[#1f2528] border border-[#293033] text-[#A4ADA8] hover:text-[#F5F7F4] rounded transition-colors cursor-pointer shrink-0"
                title={isPt ? 'Subir ZIP / PDF / Código' : 'Upload ZIP / PDF / Code'}
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,.pdf,image/*,.json,.ts,.go,.py,.md,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-xl leading-relaxed space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-[#B7F36B] text-[#080A0B] font-medium rounded-br-sm'
                      : 'bg-[#15191B] border border-[#293033] text-[#DCE2DE] rounded-bl-sm'
                  }`}
                >
                  {/* Attachment if present */}
                  {msg.attachment && (
                    <div className="flex items-center gap-2 p-2 bg-black/15 rounded border border-black/20 font-mono text-[11px]">
                      <Paperclip className="w-3.5 h-3.5 text-[#B7F36B]" />
                      <span className="truncate font-medium">{msg.attachment.name}</span>
                      <span className="opacity-70 text-[10px]">({msg.attachment.size})</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    {msg.sender === 'agent' ? renderFormattedText(msg.text) : <p className="whitespace-pre-wrap">{msg.text}</p>}
                  </div>

                  {/* Render Embedded Audit Summary Card if present */}
                  {msg.auditReport && (
                    <div className="mt-3 p-3 bg-[#101315] border border-[#293033] rounded-lg text-xs space-y-3 font-mono text-[#F5F7F4]">
                      <div className="flex items-center justify-between pb-2 border-b border-[#293033]">
                        <span className="font-bold text-[#B7F36B] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Score: {msg.auditReport.healthScore}/100</span>
                        </span>
                        <span className="text-[10px] text-[#737D77]">
                          NVIDIA NIM & Gemini AI
                        </span>
                      </div>

                      {/* Stack */}
                      <div className="text-[11px] text-[#A4ADA8]">
                        <span className="text-[#737D77] block text-[10px] uppercase font-semibold">Stack Detectada:</span>
                        <span>{msg.auditReport.detectedStack.join(' · ')}</span>
                      </div>

                      {/* Top Vulnerability */}
                      {msg.auditReport.vulnerabilities.length > 0 && (
                        <div className="p-2 bg-[#FF7777]/10 border border-[#FF7777]/25 rounded text-[11px] text-[#FF7777] space-y-1">
                          <span className="font-bold block flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3 shrink-0" />
                            <span>[RISCO IDENTIFICADO] {msg.auditReport.vulnerabilities[0].title}</span>
                          </span>
                          <span className="text-[10px] text-[#A4ADA8] block font-sans">
                            {msg.auditReport.vulnerabilities[0].description}
                          </span>
                        </div>
                      )}

                      {/* International Pricing Summary */}
                      <div className="p-2.5 bg-[#15191B] border border-[#55D68B]/30 rounded space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#55D68B] font-bold">
                            Estimativa (Mercado Internacional USD):
                          </span>
                          <span className="font-bold text-[#F5F7F4]">
                            {msg.auditReport.pricingEstimate.totalEstimateUSD}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#737D77]">
                          {msg.auditReport.pricingEstimate.hourlyRateRange} · {msg.auditReport.pricingEstimate.sprintDuration}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => downloadAuditReport(msg.auditReport!)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#B7F36B] hover:bg-[#8FCB4F] text-[#080A0B] font-bold rounded text-xs transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{isPt ? 'Baixar Relatório .MD' : 'Download Audit .MD'}</span>
                        </button>

                        <button
                          onClick={() => setEmailModalReport(msg.auditReport!)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#15191B] hover:bg-[#202528] border border-[#293033] hover:border-[#B7F36B]/50 text-[#F5F7F4] font-semibold rounded text-xs transition-colors cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#B7F36B]" />
                          <span>{isPt ? 'Enviar por E-mail' : 'Request Consultation'}</span>
                        </button>

                        {onOpenStudio && (
                          <button
                            onClick={() => {
                              handleToggle();
                              onOpenStudio(msg.auditReport);
                            }}
                            className="inline-flex items-center justify-center gap-1 p-2 bg-[#15191B] hover:bg-[#202528] border border-[#293033] rounded text-xs text-[#F5F7F4] transition-colors cursor-pointer"
                            title={isPt ? 'Ver no Workspace' : 'Inspect in Workspace'}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[9px] font-mono text-[#737D77] mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Live Typing Indicator */}
            {isAnalyzing && (
              <div className="flex items-center gap-2 p-3 bg-[#15191B] border border-[#293033] rounded-xl text-xs text-[#A4ADA8] w-fit font-mono animate-pulse">
                <Loader2 className="w-3.5 h-3.5 text-[#B7F36B] animate-spin" />
                <span>
                  {isPt ? 'Enigmy Agent está digitando...' : 'Enigmy Agent is thinking...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Suggestions */}
          <div className="px-3 py-2 bg-[#0C0F10] border-t border-[#1E2325] overflow-x-auto whitespace-nowrap flex gap-1.5 text-[11px] no-scrollbar">
            {quickSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => sendMessageToAI(suggestion)}
                disabled={isAnalyzing}
                className="px-2.5 py-1 bg-[#15191B] hover:bg-[#1E2325] border border-[#293033] hover:border-[#B7F36B]/40 text-[#A4ADA8] hover:text-[#F5F7F4] rounded-full transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-[#15191B] border-t border-[#293033] flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendTextMessage()}
              placeholder={isPt ? 'Converse com a IA sobre arquitetura, envie link...' : 'Chat with the AI about architecture, paste URL...'}
              className="flex-1 bg-[#101315] border border-[#293033] rounded-lg px-3 py-2 text-xs text-[#F5F7F4] placeholder-[#737D77] focus:outline-none focus:border-[#B7F36B] font-mono"
            />

            <button
              onClick={handleSendTextMessage}
              disabled={!inputMessage.trim() || isAnalyzing}
              className="p-2.5 bg-[#B7F36B] hover:bg-[#8FCB4F] disabled:opacity-40 text-[#080A0B] rounded-lg transition-colors cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Consultation Lead Modal */}
          {emailModalReport && (
            <div className="absolute inset-0 bg-[#080A0B]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#101315] border border-[#293033] rounded-xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#B7F36B]" />
                    <h4 className="text-sm font-bold text-[#F5F7F4]">
                      {isPt ? 'Enviar para Marcos Santos' : 'Request Consultation'}
                    </h4>
                  </div>
                  <button
                    onClick={() => setEmailModalReport(null)}
                    className="p-1 text-[#737D77] hover:text-[#F5F7F4] rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-[#A4ADA8] leading-relaxed">
                  {isPt
                    ? 'O diagnóstico e escopo deste repositório serão enviados para o email oficial enigmyneutral@gmail.com com as suas informações de contato.'
                    : 'The diagnostic and scope for this project will be dispatched to enigmyneutral@gmail.com alongside your contact details.'}
                </p>

                {leadSuccess ? (
                  <div className="p-3 bg-[#55D68B]/15 border border-[#55D68B]/30 rounded-lg flex items-center gap-2 text-xs text-[#55D68B]">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{isPt ? 'Enviado com sucesso! Entraremos em contato em breve.' : 'Dispatched successfully! We will get back to you.'}</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono text-[#A4ADA8] mb-1">
                        {isPt ? 'Seu Nome / Empresa' : 'Your Name / Company'}
                      </label>
                      <input
                        type="text"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="e.g. Alex Miller"
                        className="w-full bg-[#15191B] border border-[#293033] rounded px-3 py-1.5 text-xs text-[#F5F7F4] focus:outline-none focus:border-[#B7F36B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#A4ADA8] mb-1">
                        {isPt ? 'Seu Email de Trabalho *' : 'Work Email *'}
                      </label>
                      <input
                        type="email"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full bg-[#15191B] border border-[#293033] rounded px-3 py-1.5 text-xs text-[#F5F7F4] focus:outline-none focus:border-[#B7F36B]"
                      />
                    </div>
                    <div className="pt-1 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEmailModalReport(null)}
                        className="px-3 py-1.5 text-xs text-[#A4ADA8] hover:text-[#F5F7F4]"
                      >
                        {isPt ? 'Cancelar' : 'Cancel'}
                      </button>
                      <button
                        onClick={() => handleSendLeadToEmail(emailModalReport)}
                        disabled={leadSending || !leadEmail.includes('@')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B7F36B] hover:bg-[#8FCB4F] disabled:opacity-40 text-[#080A0B] text-xs font-bold rounded cursor-pointer"
                      >
                        {leadSending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{isPt ? 'Enviando...' : 'Sending...'}</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>{isPt ? 'Enviar Diagnóstico' : 'Send Diagnostic'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
