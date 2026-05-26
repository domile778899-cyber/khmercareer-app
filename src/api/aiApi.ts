/**
 * KhmerCareer Express — AI API
 * Resume optimization, salary analysis, job matching,
 * video promo generation, AI chat assistant, and usage tracking.
 */

import { get, post } from './client';

// =============================================================================
// AI TypeScript Interfaces
// =============================================================================

/** Resume section with AI suggestions */
export interface ResumeSection {
  section: string;
  original: string;
  optimized: string;
  suggestions: string[];
  score: number;
}

/** Resume optimization request payload */
export interface OptimizeResumeRequest {
  /** Full resume text or structured sections */
  resumeText?: string;
  /** Structured resume sections */
  sections?: {
    summary?: string;
    experience?: string;
    education?: string;
    skills?: string[];
    certifications?: string[];
  };
  /** Target job title for tailoring suggestions */
  targetJobTitle?: string;
  /** Target industry for context */
  targetIndustry?: string;
  /** Years of experience */
  experienceYears?: number;
}

/** Resume optimization response */
export interface OptimizeResumeResponse {
  overallScore: number;
  sections: ResumeSection[];
  keywords: {
    missing: string[];
    suggested: string[];
    density: Record<string, number>;
  };
  formatting: {
    score: number;
    suggestions: string[];
  };
  atsCompatibility: {
    score: number;
    suggestions: string[];
  };
  summary: string;
}

/** Salary analysis request */
export interface AnalyzeSalaryRequest {
  position: string;
  location: string;
  experience: number;
  industry?: string;
  skills?: string[];
  education?: string;
}

/** Salary range data point */
export interface SalaryRange {
  percentile: number;
  amount: number;
  currency: string;
}

/** Salary analysis response */
export interface AnalyzeSalaryResponse {
  position: string;
  location: string;
  experience: number;
  industry?: string;
  currentMarket: {
    min: number;
    max: number;
    median: number;
    average: number;
    currency: string;
  };
  percentiles: SalaryRange[];
  byLocation: {
    location: string;
    median: number;
    currency: string;
  }[];
  byExperience: {
    years: string;
    median: number;
    currency: string;
  }[];
  factors: {
    factor: string;
    impact: 'high' | 'medium' | 'low';
    description: string;
  }[];
  trend: {
    year: string;
    median: number;
  }[];
  confidence: number;
  generatedAt: string;
}

/** Job matching request */
export interface MatchJobsRequest {
  skills: string[];
  experience: number;
  preferences?: {
    location?: string;
    remote?: boolean;
    jobType?: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
    industry?: string;
    salaryMin?: number;
    salaryMax?: number;
  };
  education?: string;
  languages?: string[];
  resumeText?: string;
}

/** Matched job result with score */
export interface MatchedJob {
  jobId: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  industry: string;
  matchScore: number;
  skillMatches: {
    skill: string;
    matched: boolean;
  }[];
  reasons: string[];
  postedAt: string;
}

/** Job matching response */
export interface MatchJobsResponse {
  matches: MatchedJob[];
  totalMatches: number;
  skillGapAnalysis: {
    strongSkills: string[];
    missingSkills: string[];
    recommendedSkills: string[];
  };
  overallMatchScore: number;
}

/** Video promo generation request */
export interface GenerateVideoPromoRequest {
  jobTitle: string;
  companyName: string;
  location: string;
  salary?: string;
  jobType: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  companyLogo?: string;
  /** Visual style preference */
  style?: 'modern' | 'professional' | 'creative' | 'minimal';
  /** Primary language for the video */
  language?: 'en' | 'km' | 'zh';
  /** Target duration in seconds (5-60) */
  duration?: number;
}

/** Video promo generation response */
export interface GenerateVideoPromoResponse {
  videoId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  estimatedWaitSeconds?: number;
  error?: string;
  createdAt: string;
}

/** AI chat message */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

/** AI chat request */
export interface ChatWithAIRequest {
  message: string;
  history?: ChatMessage[];
  context?: {
    page?: string;
    jobId?: string;
    userRole?: string;
  };
  language?: 'en' | 'km' | 'zh';
}

/** AI chat response */
export interface ChatWithAIResponse {
  message: string;
  suggestions?: string[];
  relatedJobs?: {
    jobId: string;
    title: string;
    company: string;
  }[];
  relatedCourses?: {
    courseId: string;
    title: string;
  }[];
  actions?: {
    type: string;
    label: string;
    url?: string;
  }[];
}

/** AI usage record */
export interface AIUsageRecord {
  feature: string;
  requests: number;
  tokensUsed: number;
  creditsConsumed: number;
}

/** AI usage response */
export interface AIUsageResponse {
  usage: AIUsageRecord[];
  totalRequests: number;
  totalTokens: number;
  totalCredits: number;
  remainingCredits: number;
  limitCredits: number;
  periodStart: string;
  periodEnd: string;
}

/** AI feature availability */
export interface AIFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  requiresCredits: number;
  category: 'resume' | 'analysis' | 'generation' | 'chat';
}

/** Available AI features response */
export interface AIFeaturesResponse {
  features: AIFeature[];
}

/** Resume parsing request (extract data from uploaded resume) */
export interface ParseResumeRequest {
  resumeText: string;
}

/** Parsed resume response */
export interface ParseResumeResponse {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  certifications: string[];
  languages: string[];
  confidence: number;
}

// =============================================================================
// AI API
// =============================================================================

export const aiApi = {
  // ===========================================================================
  // Resume Optimization
  // ===========================================================================

  /**
   * Optimize a resume using AI to improve ATS compatibility,
   * keyword density, and formatting suggestions.
   */
  async optimizeResume(resumeData: OptimizeResumeRequest): Promise<OptimizeResumeResponse> {
    return post<OptimizeResumeResponse>('/ai/resume-optimize', resumeData);
  },

  /**
   * Parse and extract structured data from raw resume text.
   */
  async parseResume(resumeText: string): Promise<ParseResumeResponse> {
    return post<ParseResumeResponse>('/ai/resume-parse', { resumeText } as ParseResumeRequest);
  },

  // ===========================================================================
  // Salary Analysis
  // ===========================================================================

  /**
   * Analyze salary data for a given position, location, and experience level.
   * Returns market ranges, percentiles, trends, and influencing factors.
   */
  async analyzeSalary(
    position: string,
    location: string,
    experience: number,
    industry?: string,
    skills?: string[],
    education?: string,
  ): Promise<AnalyzeSalaryResponse> {
    const payload: AnalyzeSalaryRequest = {
      position,
      location,
      experience,
      industry,
      skills,
      education,
    };
    return post<AnalyzeSalaryResponse>('/ai/salary-analyze', payload);
  },

  // ===========================================================================
  // Job Matching
  // ===========================================================================

  /**
   * Match user's skills and preferences against available jobs.
   * Returns ranked job matches with skill gap analysis.
   */
  async matchJobs(
    skills: string[],
    experience: number,
    preferences?: MatchJobsRequest['preferences'],
    education?: string,
    languages?: string[],
    resumeText?: string,
  ): Promise<MatchJobsResponse> {
    const payload: MatchJobsRequest = {
      skills,
      experience,
      preferences,
      education,
      languages,
      resumeText,
    };
    return post<MatchJobsResponse>('/ai/job-match', payload);
  },

  // ===========================================================================
  // Video Promo Generation
  // ===========================================================================

  /**
   * Generate an AI video promo for a job posting.
   * The video is queued and processed asynchronously.
   */
  async generateVideoPromo(jobData: GenerateVideoPromoRequest): Promise<GenerateVideoPromoResponse> {
    return post<GenerateVideoPromoResponse>('/ai/video-promo', jobData);
  },

  /**
   * Check the status of an async video generation job.
   */
  async getVideoPromoStatus(videoId: string): Promise<GenerateVideoPromoResponse> {
    return get<GenerateVideoPromoResponse>(`/ai/video-promo/${videoId}`);
  },

  // ===========================================================================
  // AI Chat Assistant
  // ===========================================================================

  /**
   * Chat with the AI career assistant.
   * Maintains conversation history for context-aware responses.
   */
  async chatWithAI(
    message: string,
    history?: ChatMessage[],
    context?: ChatWithAIRequest['context'],
    language?: 'en' | 'km' | 'zh',
  ): Promise<ChatWithAIResponse> {
    const payload: ChatWithAIRequest = {
      message,
      history,
      context,
      language,
    };
    return post<ChatWithAIResponse>('/ai/chat', payload);
  },

  // ===========================================================================
  // Usage & Feature Management
  // ===========================================================================

  /**
   * Get the current user's AI usage statistics.
   * Includes request counts, token usage, and credit consumption.
   */
  async getAIUsage(): Promise<AIUsageResponse> {
    return get<AIUsageResponse>('/ai/usage');
  },

  /**
   * Get available AI features and their credit requirements.
   */
  async getAIFeatures(): Promise<AIFeaturesResponse> {
    return get<AIFeaturesResponse>('/ai/features');
  },

  /**
   * Stream AI chat for real-time responses (uses EventSource).
   * Returns a callback-based interface for streaming chunks.
   */
  streamChat(
    message: string,
    history?: ChatMessage[],
    context?: ChatWithAIRequest['context'],
    language?: 'en' | 'km' | 'zh',
  ): {
    onChunk: (callback: (chunk: string) => void) => void;
    onComplete: (callback: (fullMessage: string) => void) => void;
    onError: (callback: (error: Error) => void) => void;
    abort: () => void;
  } {
    const abortController = new AbortController();
    const chunkCallbacks: Array<(chunk: string) => void> = [];
    const completeCallbacks: Array<(fullMessage: string) => void> = [];
    const errorCallbacks: Array<(error: Error) => void> = [];

    const onChunk = (cb: (chunk: string) => void) => chunkCallbacks.push(cb);
    const onComplete = (cb: (fullMessage: string) => void) => completeCallbacks.push(cb);
    const onError = (cb: (error: Error) => void) => errorCallbacks.push(cb);
    const abort = () => abortController.abort();

    (async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '/api/v1';
        const payload: ChatWithAIRequest = { message, history, context, language };

        const response = await fetch(`${baseUrl}/ai/chat/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('khmer_access_token') || ''}`,
          },
          body: JSON.stringify(payload),
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Stream request failed: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullMessage = '';

        if (!reader) {
          throw new Error('Response body is not readable');
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                completeCallbacks.forEach((cb) => cb(fullMessage));
                return;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullMessage += parsed.content;
                  chunkCallbacks.forEach((cb) => cb(parsed.content));
                }
              } catch {
                // Non-JSON chunk, treat as plain text
                fullMessage += data;
                chunkCallbacks.forEach((cb) => cb(data));
              }
            }
          }
        }

        completeCallbacks.forEach((cb) => cb(fullMessage));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          errorCallbacks.forEach((cb) => cb(err as Error));
        }
      }
    })();

    return { onChunk, onComplete, onError, abort };
  },
};

export default aiApi;
