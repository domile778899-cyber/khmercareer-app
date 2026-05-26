// @ts-nocheck
import { useState, useMemo } from 'react';
import aiApi from '../api/aiApi';
import {
  Sparkles,
  FileText,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Star,
  Download,
  User,
  Phone,
  Mail,
  Briefcase,
  GraduationCap,
  Wrench,
  FileEdit,
  Award,
  TrendingUp,
  LayoutTemplate,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { resumeTemplates } from '../data/resumeTemplates';

// ==================== AI 分析函数 ====================
function analyzeResume(data: any) {
  const scores = {
    completeness: 0,
    keywords: 0,
    format: 0,
    quality: 0,
  };
  const suggestions: string[] = [];

  // 完整性评分
  let completeFields = 0;
  let totalFields = 0;
  const requiredFields = ['name', 'phone', 'email', 'targetPosition', 'experience', 'education', 'skills'];
  requiredFields.forEach((f) => {
    totalFields++;
    if (data[f] && data[f].trim()) completeFields++;
  });
  scores.completeness = Math.round((completeFields / totalFields) * 100);

  if (scores.completeness < 100) {
    suggestions.push('完善基本信息：确保所有必填项都已填写');
  }

  // 关键词评分
  const jobKeywords = ['经验', '技能', '团队', '管理', '沟通', '协调', '负责', '完成'];
  const content = `${data.experience || ''} ${data.skills || ''} ${data.selfIntro || ''}`;
  const matchedKeywords = jobKeywords.filter((k) => content.includes(k));
  scores.keywords = Math.round((matchedKeywords.length / jobKeywords.length) * 100);

  if (scores.keywords < 60) {
    suggestions.push('增加关键词：在工作经历中使用更多行业关键词');
  }

  // 格式评分
  scores.format = data.experience?.includes('\n') ? 85 : 60;
  if (scores.format < 80) {
    suggestions.push('优化格式：使用分段和项目符号让简历更易读');
  }

  // 质量评分
  const contentLength = content.length;
  scores.quality = contentLength > 200 ? Math.min(95, 70 + contentLength / 50) : 50;
  if (scores.quality < 70) {
    suggestions.push('丰富内容：增加更多工作经历和成就描述');
  }

  const total = Math.round((scores.completeness + scores.keywords + scores.format + scores.quality) / 4);

  if (suggestions.length === 0) suggestions.push('您的简历已经很完善了！');

  return { scores, total, suggestions, matchedKeywords };
}

// ==================== 评分颜色辅助函数 ====================
function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getScoreRingColor(score: number): string {
  if (score >= 80) return 'stroke-green-500';
  if (score >= 60) return 'stroke-yellow-500';
  return 'stroke-red-500';
}

// ==================== 主组件 ====================
export default function AIResumeOptimize() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    targetPosition: '',
    experience: '',
    education: '',
    skills: '',
    selfIntro: '',
  });
  const [analysis, setAnalysis] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const aiResult = await aiApi.optimizeResume({
        resumeData: {
          name: formData.name,
          experience: formData.experience,
          education: formData.education,
          skills: formData.skills,
          targetPosition: formData.targetPosition,
        },
      });
      const localResult = analyzeResume(formData);
      setAnalysis({
        ...localResult,
        aiSuggestions: aiResult.suggestions || [],
        aiOptimizedContent: aiResult.optimizedResume || null,
        aiScore: aiResult.score || localResult.total,
        total: aiResult.score || localResult.total,
      });
    } catch {
      const result = analyzeResume(formData);
      setAnalysis(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const resumeContent = `
=================================================
                   优化简历
=================================================

【个人信息】
姓名：${formData.name || '未填写'}
电话：${formData.phone || '未填写'}
邮箱：${formData.email || '未填写'}

【求职意向】
${formData.targetPosition || '未填写'}

【工作经历】
${formData.experience || '未填写'}

【教育背景】
${formData.education || '未填写'}

【技能特长】
${formData.skills || '未填写'}

【自我评价】
${formData.selfIntro || '未填写'}

=================================================
AI综合评分：${analysis?.total || 0}/100
=================================================
    `;
    const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.name || '简历'}_优化版.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 计算环形进度条
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = analysis ? circumference - (analysis.total / 100) * circumference : circumference;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ==================== 头部 ==================== */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-3xl font-bold">AI简历优化</h1>
          </div>
          <p className="text-indigo-100 text-lg">智能分析您的简历，提供优化建议</p>
        </div>
      </div>

      {/* ==================== 三栏布局 ==================== */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ==================== 左栏：简历信息表单 ==================== */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-800">简历信息</h2>
            </div>

            <div className="space-y-5">
              {/* 基本信息组 */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  基本信息
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      姓名 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="请输入姓名"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        电话 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="请输入电话"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        邮箱 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="请输入邮箱"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 求职意向 */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  求职意向
                </h3>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    目标职位 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.targetPosition}
                    onChange={(e) => handleChange('targetPosition', e.target.value)}
                    placeholder="例如：生产主管、酒店经理"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* 工作经历 */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-1">
                  <FileEdit className="w-4 h-4" />
                  工作经历 <span className="text-red-400">*</span>
                </h3>
                <textarea
                  value={formData.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  placeholder="请描述您的工作经历，每段经历换行分隔&#10;例如：&#10;2019-2023 制衣厂生产主管&#10;- 负责30人团队日常管理&#10;- 完成年度生产目标120%"
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* 教育背景 */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  教育背景 <span className="text-red-400">*</span>
                </h3>
                <textarea
                  value={formData.education}
                  onChange={(e) => handleChange('education', e.target.value)}
                  placeholder="请填写您的教育经历&#10;例如：2015-2019 金边大学 工商管理专业"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* 技能特长 */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-1">
                  <Wrench className="w-4 h-4" />
                  技能特长 <span className="text-red-400">*</span>
                </h3>
                <textarea
                  value={formData.skills}
                  onChange={(e) => handleChange('skills', e.target.value)}
                  placeholder="请填写您的专业技能&#10;例如：生产管理、质量控制、团队培训、Excel"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* 自我评价 */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  自我评价（选填）
                </h3>
                <textarea
                  value={formData.selfIntro}
                  onChange={(e) => handleChange('selfIntro', e.target.value)}
                  placeholder="简要描述您的优势和特点"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* 分析按钮 */}
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <><RefreshCw className="w-5 h-5 animate-spin" />AI分析中...</>
                ) : (
                  <><Sparkles className="w-5 h-5" />AI智能分析</>
                )}
              </button>
            </div>
          </div>

          {/* ==================== 中栏：AI分析报告 ==================== */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-800">AI分析报告</h2>
            </div>

            {!analysis ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Sparkles className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-center">
                  请填写左侧简历信息
                  <br />
                  点击"AI智能分析"查看报告
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 综合评分 */}
                <div className="flex flex-col items-center py-4">
                  <div className="relative w-32 h-32 mb-3">
                    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        className={getScoreRingColor(analysis.total)}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-3xl font-bold ${getScoreColor(analysis.total)}`}>
                        {analysis.total}
                      </span>
                      <span className="text-xs text-gray-400">综合评分</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(analysis.total / 20)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* 各维度评分 */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-500">各维度评分</h3>

                  {[
                    { key: 'completeness', label: '完整性', icon: CheckCircle },
                    { key: 'keywords', label: '关键词匹配', icon: Award },
                    { key: 'format', label: '格式规范', icon: LayoutTemplate },
                    { key: 'quality', label: '内容质量', icon: Star },
                  ].map((item) => {
                    const Icon = item.icon;
                    const score = analysis.scores[item.key];
                    return (
                      <div key={item.key} className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">{item.label}</span>
                            <span className={`text-sm font-semibold ${getScoreColor(score)}`}>
                              {score}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${getScoreBgColor(score)}`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 关键词匹配 */}
                {analysis.matchedKeywords.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">已匹配关键词</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.matchedKeywords.map((keyword: string) => (
                        <span
                          key={keyword}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-600 text-xs rounded-full border border-green-100"
                        >
                          <CheckCircle className="w-3 h-3" />
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 优化建议 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-1">
                    <Lightbulb className="w-4 h-4" />
                    优化建议
                  </h3>
                  <div className="space-y-2">
                    {analysis.suggestions.map((suggestion: string, index: number) => (
                      <div
                        key={index}
                        className={`flex items-start gap-2 p-3 rounded-xl ${
                          suggestion.includes('已经')
                            ? 'bg-green-50 border border-green-100'
                            : 'bg-amber-50 border border-amber-100'
                        }`}
                      >
                        {suggestion.includes('已经') ? (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-sm ${
                            suggestion.includes('已经')
                              ? 'text-green-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {suggestion}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 重新分析按钮 */}
                <button
                  onClick={handleAnalyze}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  重新分析
                </button>
              </div>
            )}
          </div>

          {/* ==================== 右栏：推荐模板 ==================== */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <LayoutTemplate className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-800">推荐模板</h2>
            </div>

            <div className="space-y-4">
              {resumeTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id
                      ? 'border-indigo-500 bg-indigo-50/50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {selectedTemplate === template.id && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="w-5 h-5 text-indigo-500" />
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    {/* 颜色标识 */}
                    <div
                      className="w-10 h-10 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: template.color }}
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-0.5">{template.name}</h3>
                      <span
                        className="inline-block px-2 py-0.5 text-xs rounded-full mb-2"
                        style={{
                          backgroundColor: template.color + '15',
                          color: template.color,
                        }}
                      >
                        {template.industry}
                      </span>
                      <p className="text-sm text-gray-500 mb-2">{template.description}</p>

                      {/* 适用板块 */}
                      <div className="flex flex-wrap gap-1">
                        {template.sections.map((section) => (
                          <span
                            key={section}
                            className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedTemplate === template.id && (
                    <div className="mt-3 pt-3 border-t border-indigo-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnalyze();
                        }}
                        className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        使用此模板优化
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 导出按钮 */}
            {analysis && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={handleExport}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-md active:scale-[0.98]"
                >
                  <Download className="w-5 h-5" />
                  导出优化简历
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
