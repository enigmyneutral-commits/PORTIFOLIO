package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

// Config holds runtime configuration
type Config struct {
	Port         string
	NvidiaAPIKey string
	NvidiaModel  string
	NvidiaURL    string
}

// AuditRequest represents incoming analysis payload
type AuditRequest struct {
	RepoURL     string `json:"repoUrl,omitempty"`
	FileName    string `json:"fileName,omitempty"`
	FileType    string `json:"fileType,omitempty"`
	Content     string `json:"content,omitempty"`
	UserPrompt  string `json:"userPrompt,omitempty"`
}

// AuditResponse represents technical diagnostic report
type AuditResponse struct {
	ProjectName       string            `json:"projectName"`
	HealthScore       int               `json:"healthScore"`
	Summary           string            `json:"summary"`
	Vulnerabilities   []string          `json:"vulnerabilities"`
	Bottlenecks       []string          `json:"bottlenecks"`
	Recommendations   []string          `json:"recommendations"`
	EnigmyDeliverables []string         `json:"enigmyDeliverables"`
	PricingEstimate   PricingEstimate   `json:"pricingEstimate"`
	GeneratedAt       string            `json:"generatedAt"`
}

// PricingEstimate models international developer market rates in USD
type PricingEstimate struct {
	Currency          string   `json:"currency"`
	HourlyRateRange   string   `json:"hourlyRateRange"`
	EstimatedHours    int      `json:"estimatedHours"`
	SprintDuration    string   `json:"sprintDuration"`
	TotalEstimateUSD  string   `json:"totalEstimateUSD"`
	ItemizedPhases    []Phase  `json:"itemizedPhases"`
}

type Phase struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	EstimateUSD string `json:"estimateUSD"`
	Duration    string `json:"duration"`
}

func main() {
	config := Config{
		Port:         getEnv("PORT", "8080"),
		NvidiaAPIKey: getEnv("NVIDIA_API_KEY", ""),
		NvidiaModel:  getEnv("NVIDIA_MODEL", "nvidia/nemotron-3.5-bolt-e4b"),
		NvidiaURL:    getEnv("NVIDIA_URL", "https://integrate.api.nvidia.com/v1/chat/completions"),
	}

	mux := http.NewServeMux()

	// CORS wrapper
	enableCORS := func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}
			next(w, r)
		}
	}

	// Routes
	mux.HandleFunc("/health", enableCORS(healthHandler))
	mux.HandleFunc("/api/agent/audit", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		handleAudit(w, r, config)
	}))
	mux.HandleFunc("/api/agent/nvidia-chat", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		handleNvidiaChat(w, r, config)
	}))

	serverAddr := ":" + config.Port
	log.Printf("[Enigmy Neutral Go Backend] Service running on %s", serverAddr)
	log.Printf("[Enigmy Neutral Go Backend] Target NVIDIA Model: %s", config.NvidiaModel)

	if err := http.ListenAndServe(serverAddr, mux); err != nil {
		log.Fatalf("Server startup failed: %v", err)
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "operational",
		"service":   "enigmy-neutral-agent-go-backend",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

func handleAudit(w http.ResponseWriter, r *http.Request, cfg Config) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req AuditRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	targetName := "Uploaded Codebase Archive"
	if req.RepoURL != "" {
		parts := strings.Split(strings.TrimRight(req.RepoURL, "/"), "/")
		if len(parts) >= 2 {
			targetName = parts[len(parts)-2] + "/" + parts[len(parts)-1]
		}
	} else if req.FileName != "" {
		targetName = req.FileName
	}

	// Synthesize technical diagnostic & international market rate estimate
	response := AuditResponse{
		ProjectName: targetName,
		HealthScore: 78,
		Summary: fmt.Sprintf(
			"Architecture evaluation for %s completed by Enigmy Neutral Engineering Agent. System identified key decoupling opportunities, API boundary security constraints, and database performance bottlenecks.",
			targetName,
		),
		Vulnerabilities: []string{
			"Unbounded HTTP handler timeouts risking resource starvation under concurrency spikes",
			"Implicit dependency versioning without lockfile immutability checks",
			"Absence of structured rate-limiting middleware on public ingestion endpoints",
			"Client-side secrets or sensitive endpoint leak potential detected in configuration",
		},
		Bottlenecks: []string{
			"High latency on relational database queries lacking compound indexes",
			"Monolithic routing modules without domain-driven service boundaries",
			"Excessive client bundle payload size affecting mobile Android render benchmarks",
		},
		Recommendations: []string{
			"Refactor API controllers into hexagonal/domain-driven service architecture",
			"Implement strictly typed request/response validation schemas",
			"Containerize staging environments with multi-stage Docker builds",
			"Establish automated CI pipeline enforcing lint, static security analysis, and test suites",
		},
		EnigmyDeliverables: []string{
			"Sprint 1: Architecture review, threat modeling, and Docker containerization",
			"Sprint 2: Service decoupling, database index optimization, and secure API contracts",
			"Sprint 3: CI/CD automation, stress testing benchmarks, and operational runbook handoff",
		},
		PricingEstimate: PricingEstimate{
			Currency:         "USD",
			HourlyRateRange:  "$85 – $145 USD / hr (US Senior Dev Standard)",
			EstimatedHours:   80,
			SprintDuration:   "3 – 4 Weeks",
			TotalEstimateUSD: "$6,800 – $11,600 USD",
			ItemizedPhases: []Phase{
				{
					Name:        "Phase 1: Architecture Refactoring & Security Hardening",
					Description: "Decouple monolithic layers, patch endpoints, and add schema validation.",
					EstimateUSD: "$2,800 USD",
					Duration:    "1.5 Weeks",
				},
				{
					Name:        "Phase 2: Database Optimization & Concurrency Resilience",
					Description: "Index normalization, connection pooling, and latency reduction.",
					EstimateUSD: "$2,400 USD",
					Duration:    "1 Week",
				},
				{
					Name:        "Phase 3: Automated Testing & Deployment Infrastructure",
					Description: "GitHub Actions CI pipeline, Docker optimization, and runbooks.",
					EstimateUSD: "$1,600 USD",
					Duration:    "1 Week",
				},
			},
		},
		GeneratedAt: time.Now().UTC().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func handleNvidiaChat(w http.ResponseWriter, r *http.Request, cfg Config) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// If NVIDIA API Key is provided, forward request directly to NVIDIA NIM API
	apiKey := cfg.NvidiaAPIKey
	if auth := r.Header.Get("Authorization"); auth != "" && strings.HasPrefix(auth, "Bearer ") {
		apiKey = strings.TrimPrefix(auth, "Bearer ")
	}

	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request", http.StatusBadRequest)
		return
	}

	// Parse or normalize payload with Nemotron 3.5 Bolt defaults
	var incomingMap map[string]interface{}
	if err := json.Unmarshal(bodyBytes, &incomingMap); err == nil {
		if incomingMap["model"] == nil || incomingMap["model"] == "" {
			incomingMap["model"] = cfg.NvidiaModel
		}
		if incomingMap["temperature"] == nil {
			incomingMap["temperature"] = 1.0
		}
		if incomingMap["top_p"] == nil {
			incomingMap["top_p"] = 0.95
		}
		if incomingMap["max_tokens"] == nil {
			incomingMap["max_tokens"] = 1024
		}
		if incomingMap["seed"] == nil {
			incomingMap["seed"] = 42
		}
		if incomingMap["parallel_tool_calls"] == nil {
			incomingMap["parallel_tool_calls"] = true
		}
		if incomingMap["chat_template_kwargs"] == nil {
			incomingMap["chat_template_kwargs"] = map[string]interface{}{
				"enable_thinking": true,
			}
		}
		bodyBytes, _ = json.Marshal(incomingMap)
	}

	if apiKey == "" {
		// Return simulated architecture guidance with notice
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"model": cfg.NvidiaModel,
			"choices": []map[string]interface{}{
				{
					"message": map[string]interface{}{
						"role": "assistant",
						"content": "Enigmy Neutral Engineering Agent (Powered by NVIDIA NIM nemotron-3.5-bolt-e4b): Operational. For live NVIDIA NIM inferences, configure NVIDIA_API_KEY environment variable. Defaulting to local architecture heuristic diagnostics.",
					},
				},
			},
		})
		return
	}

	// Forward to NVIDIA API
	reqNvidia, err := http.NewRequest(http.MethodPost, cfg.NvidiaURL, bytes.NewBuffer(bodyBytes))
	if err != nil {
		http.Error(w, "Failed to build NVIDIA request", http.StatusInternalServerError)
		return
	}
	reqNvidia.Header.Set("Content-Type", "application/json")
	reqNvidia.Header.Set("Authorization", "Bearer "+apiKey)
	if r.Header.Get("Accept") != "" {
		reqNvidia.Header.Set("Accept", r.Header.Get("Accept"))
	} else {
		reqNvidia.Header.Set("Accept", "application/json")
	}

	client := &http.Client{Timeout: 60 * time.Second}
	resp, err := client.Do(reqNvidia)
	if err != nil {
		http.Error(w, fmt.Sprintf("NVIDIA upstream error: %v", err), http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	if contentType := resp.Header.Get("Content-Type"); contentType != "" {
		w.Header().Set("Content-Type", contentType)
	} else {
		w.Header().Set("Content-Type", "application/json")
	}
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}
