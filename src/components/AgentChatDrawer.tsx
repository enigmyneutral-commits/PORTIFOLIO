import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AgentChatMessage, AgentAuditReport } from '../types/agent';
import { analyzeRepository, analyzeFile, downloadAuditReport, queryNvidiaNemotron } from '../services/agentEngine';
import { EnigmyLogo } from './EnigmyLogo';
import { 
  Cpu, 
  MessageSquare, 
  X, 
  Send, 
  Upload, 
  FileText, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  ShieldAlert, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  Layers, 
  Paperclip,
  GitBranch,
  Terminal,
  Loader2
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<AgentChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('enigmy_agent_chat');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'agent',
        text: isPt
          ? 'Olá! Sou o Enigmy Neutral Engineering Agent. Posso analisar a arquitetura do seu repositório (GitHub/Git), ou auditar arquivos ZIP, PDFs de especificação e diagramas. Forneço diagnóstico de vulnerabilidades, refatorações recomendadas e orçamento balizado pelo mercado dev internacional (USD).'
          : 'Hello! I am the Enigmy Neutral Engineering Agent. I can audit your repository architecture (GitHub/Git link), or inspect uploaded ZIP archives, PDF specifications, and architecture diagrams. I provide vulnerability diagnostics, refactoring recommendations, and an international dev market budget model (USD).',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
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
  }, [messages]);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (!next && onCloseExternal) {
      onCloseExternal();
    }
  };

  const handleSendTextMessage = () => {
    if (!inputMessage.trim() || isAnalyzing) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const newMsg: AgentChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);

    // Check if user entered a GitHub URL directly in the input
    if (userText.includes('github.com/') || userText.startsWith('http')) {
      handleAuditRepo(userText);
      return;
    }

    // Query backend NVIDIA Nemotron endpoint with fallback
    setIsAnalyzing(true);
    (async () => {
      try {
        const historyPayload = messages.slice(-4).map((m) => ({
          role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text,
        }));

        const nvidiaResponse = await queryNvidiaNemotron(userText, historyPayload);

        const replyText = nvidiaResponse || (isPt
          ? `Entendido. Para uma análise técnica profunda com orçamento internacional balizado em USD, vincule o link do repositório (ex: https://github.com/usuario/projeto) ou suba um arquivo ZIP / PDF com a arquitetura do projeto. Posso auditar segredos, concorrência, banco de dados e gargalos de escalabilidade.`
          : `Understood. For a comprehensive technical architecture audit with international market pricing in USD, please link a repository URL (e.g. https://github.com/org/repo) or upload a ZIP archive / PDF specification. I will inspect security boundaries, database latencies, and scalability debt.`);

        const agentReply: AgentChatMessage = {
          id: `agt-${Date.now()}`,
          sender: 'agent',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, agentReply]);
      } catch {
        const fallbackReply: AgentChatMessage = {
          id: `agt-${Date.now()}`,
          sender: 'agent',
          text: isPt
            ? 'Processado pelo agente Enigmy Neutral (NVIDIA Nemotron 3.5 Bolt). Envie o link do repositório ou arquivo para auditoria completa.'
            : 'Processed by Enigmy Neutral Agent (NVIDIA Nemotron 3.5 Bolt). Send repo URL or archive for full audit.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, fallbackReply]);
      } finally {
        setIsAnalyzing(false);
      }
    })();
  };

  const handleAuditRepo = async (urlToAnalyze?: string) => {
    const targetUrl = urlToAnalyze || repoUrlInput;
    if (!targetUrl.trim() || isAnalyzing) return;

    setRepoUrlInput('');
    setIsAnalyzing(true);

    const userMsg: AgentChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: `${isPt ? 'Vincular e analisar repositório' : 'Link and audit repository'}: ${targetUrl}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const report = await analyzeRepository(targetUrl);
      setActiveReport(report);

      const agentMsg: AgentChatMessage = {
        id: `agt-${Date.now()}`,
        sender: 'agent',
        text: isPt
          ? `Auditoria concluída para o repositório ${report.projectName}. Score de Saúde: ${report.healthScore}/100. Foram detectadas ${report.vulnerabilities.length} vulnerabilidades críticas e oportunidades de desacoplamento. Veja abaixo o diagnóstico completo e o modelo de orçamento internacional.`
          : `Audit completed for repository ${report.projectName}. Health Score: ${report.healthScore}/100. Identified ${report.vulnerabilities.length} architectural vulnerabilities and decoupling avenues. Review the diagnostic and international market budget below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        auditReport: report,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch {
      const errorMsg: AgentChatMessage = {
        id: `agt-err-${Date.now()}`,
        sender: 'agent',
        text: isPt
          ? 'Não foi possível analisar o repositório no momento. Verifique a URL ou suba um arquivo ZIP/PDF.'
          : 'Unable to complete repository analysis at this moment. Please verify the URL or upload a ZIP/PDF file.',
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
      text: isPt ? `Upload do arquivo para auditoria técnica: ${file.name}` : `Uploaded file for technical audit: ${file.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: {
        name: file.name,
        type: file.type || 'archive',
        size: `${(file.size / 1024).toFixed(1)} KB`,
      },
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const report = await analyzeFile(file);
      setActiveReport(report);

      const agentMsg: AgentChatMessage = {
        id: `agt-${Date.now()}`,
        sender: 'agent',
        text: isPt
          ? `Arquivo "${file.name}" analisado com sucesso! Estrutura inspecionada. O documento completo foi gerado com diagnóstico de código, pontos de refatoração e estimativa orçamentária internacional em USD.`
          : `File "${file.name}" successfully analyzed! Structure inspected. Full technical dossier generated including code diagnostics, refactoring roadmap, and international USD budget estimate.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        auditReport: report,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch {
      const errorMsg: AgentChatMessage = {
        id: `agt-err-${Date.now()}`,
        sender: 'agent',
        text: isPt ? 'Erro ao processar arquivo.' : 'Error processing uploaded file.',
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
            <span className="text-xs font-mono font-bold text-[#F5F7F4] tracking-tight group-hover:text-[#B7F36B] transition-colors whitespace-nowrap">
              Enigmy Agent
            </span>
            <span className="text-[10px] font-mono text-[#737D77]">
              {isPt ? 'Auditoria & Arquitetura' : 'Architecture & Audit'}
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#55D68B] animate-pulse shrink-0" />
        </button>
      )}

      {/* 2. CHAT DRAWER / WINDOW */}
      {isOpen && (
        <div 
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[480px] h-[640px] max-h-[88vh] bg-[#101315] border border-[#293033] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200"
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
                <h3 id="agent-chat-title" className="text-xs font-mono font-bold text-[#F5F7F4]">
                  Enigmy Neutral Agent
                </h3>
                <span className="text-[10px] font-mono text-[#55D68B]">
                  Engineering & Architecture Runtime
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
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
          <div className="p-3 bg-[#080A0B] border-b border-[#293033] space-y-2 text-xs">
            {/* Repo Link Input */}
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <GitBranch className="w-3.5 h-3.5 text-[#737D77] absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={repoUrlInput}
                  onChange={(e) => setRepoUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAuditRepo()}
                  placeholder={isPt ? 'Cole o link do repositório GitHub...' : 'Paste GitHub repository URL...'}
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
                title={isPt ? 'Subir ZIP / PDF / Imagem' : 'Upload ZIP / PDF / Image'}
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,.pdf,image/*,.json,.ts,.go,.py"
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
                  className={`max-w-[88%] p-3.5 rounded-xl leading-relaxed space-y-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-[#B7F36B] text-[#080A0B] font-medium'
                      : 'bg-[#15191B] border border-[#293033] text-[#F5F7F4]'
                  }`}
                >
                  {/* Attachment if present */}
                  {msg.attachment && (
                    <div className="flex items-center gap-2 p-2 bg-black/10 rounded border border-black/15 font-mono text-[11px]">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span className="truncate">{msg.attachment.name}</span>
                      <span className="opacity-70 text-[10px]">({msg.attachment.size})</span>
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Render Embedded Audit Summary Card if present */}
                  {msg.auditReport && (
                    <div className="mt-3 p-3 bg-[#101315] border border-[#293033] rounded-lg text-xs space-y-3 font-mono text-[#F5F7F4]">
                      <div className="flex items-center justify-between pb-2 border-b border-[#293033]">
                        <span className="font-bold text-[#B7F36B]">
                          Score: {msg.auditReport.healthScore}/100
                        </span>
                        <span className="text-[10px] text-[#737D77]">
                          NVIDIA NIM Analysis
                        </span>
                      </div>

                      {/* Stack */}
                      <div className="text-[11px] text-[#A4ADA8]">
                        <span className="text-[#737D77] block text-[10px] uppercase">Stack:</span>
                        <span>{msg.auditReport.detectedStack.join(' · ')}</span>
                      </div>

                      {/* Top Vulnerability */}
                      {msg.auditReport.vulnerabilities.length > 0 && (
                        <div className="p-2 bg-[#FF7777]/10 border border-[#FF7777]/25 rounded text-[11px] text-[#FF7777] space-y-1">
                          <span className="font-bold block">
                            [HIGH RISK] {msg.auditReport.vulnerabilities[0].title}
                          </span>
                          <span className="text-[10px] text-[#A4ADA8] block">
                            {msg.auditReport.vulnerabilities[0].description}
                          </span>
                        </div>
                      )}

                      {/* International Pricing Summary */}
                      <div className="p-2.5 bg-[#15191B] border border-[#55D68B]/30 rounded space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#55D68B] font-bold">
                            Estimate (USD):
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
                          <span>{isPt ? 'Baixar Relatório (.md)' : 'Download Audit (.md)'}</span>
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

            {isAnalyzing && (
              <div className="flex items-center gap-2 p-3 bg-[#15191B] border border-[#293033] rounded-xl text-xs text-[#A4ADA8] w-fit font-mono">
                <Loader2 className="w-3.5 h-3.5 text-[#B7F36B] animate-spin" />
                <span>
                  {isPt ? 'Agente auditando código e calculando escopo...' : 'Agent auditing architecture & calculating market scope...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-[#15191B] border-t border-[#293033] flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendTextMessage()}
              placeholder={isPt ? 'Pergunte sobre arquitetura, envie link...' : 'Ask about architecture, paste URL...'}
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
        </div>
      )}
    </>
  );
};
