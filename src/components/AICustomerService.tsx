import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Minimize2,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';

// ==================== Types ====================
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface KnowledgeItem {
  keywords: string[];
  answer: string;
}

interface SuggestionChip {
  label: string;
  query: string;
}

// ==================== Knowledge Base (26+ QA pairs) ====================
const knowledgeBase: KnowledgeItem[] = [
  {
    keywords: ['找工作', 'job', 'search', '职位', '岗位', 'work', 'vacancy', 'how to find job', '应聘'],
    answer:
      `\`🔍 **如何使用平台找工作**

1. 在首页搜索框输入职位关键词或公司名称
2. 使用筛选条件（地区、薪资范围、行业）缩小范围
3. 浏览职位列表，点击查看详情
4. 点击「立即申请」按钮投递简历
5. 在「我的申请」中跟踪申请进度

💡 **小贴士**：完善个人简历可提升被HR看到的概率达80%！'`,
  },
  {
    keywords: ['发布招聘', 'post job', 'hire', '招聘', 'publish', '招人', 'employer', '雇主'],
    answer:
      `'📢 **如何发布招聘信息**

1. 注册并登录企业账号
2. 点击右上角「发布职位」按钮
3. 填写职位信息：标题、描述、要求、薪资、地点
4. 选择发布套餐（免费/付费置顶/紧急招聘）
5. 提交审核，通常1-2小时内通过

✨ 付费职位将获得更多曝光和优先推荐！\``,
  },
  {
    keywords: ['简历', 'resume', 'cv', '修改简历', 'edit profile', '个人信息', 'profile'],
    answer:
      `\`📝 **如何修改简历**

1. 登录后点击头像 →「我的简历」
2. 编辑个人信息、工作经历、教育背景
3. 上传头像和简历附件（支持PDF/DOCX）
4. 使用「AI简历优化」功能获得改进建议
5. 点击「保存」完成更新

🎯 建议：定期更新简历，保持信息时效性'`,
  },
  {
    keywords: ['薪资', 'salary', '工资', 'wage', 'pay', 'compensation', 'income', '薪水'],
    answer:
      `'💰 **柬埔寨各行业薪资范围参考**

| 行业 | 初级(USD) | 中级(USD) | 高级(USD) |
|------|-----------|-----------|-----------|
| IT/科技 | $400-800 | $800-1500 | $1500-3000 |
| 制造业 | $300-500 | $500-900 | $900-1500 |
| 金融服务 | $350-600 | $600-1200 | $1200-2500 |
| 旅游酒店 | $250-400 | $400-700 | $700-1200 |
| 建筑工程 | $350-600 | $600-1000 | $1000-2000 |

⚠️ 以上数据仅供参考，实际薪资因公司规模、个人能力而异\``,
  },
  {
    keywords: ['面试', 'interview', '技巧', 'tips', '准备', 'prepare'],
    answer:
      `\`🎯 **面试技巧大全**

**面试前准备：**
• 研究公司背景、文化和最新动态
• 准备自我介绍（1-2分钟版本）
• 模拟回答常见面试问题
• 准备2-3个反问问题

**常见面试问题：**
1. 请介绍一下你自己
2. 为什么选择我们公司？
3. 你的优点和缺点是什么？
4. 描述一次团队合作经历
5. 未来3-5年的职业规划

**面试礼仪：**
✅ 提前10-15分钟到达
✅ 穿着得体商务装
✅ 保持眼神交流和微笑
✅ 面试后24小时内发送感谢邮件'`,
  },
  {
    keywords: ['培训', 'training', 'course', '课程', '学习', 'skill', '技能'],
    answer:
      `📚 **KhmerCareer 培训课程**

**职业技能培训：**
• 商务英语沟通（初级/中级/高级）
• Microsoft Office 办公技能
• 项目管理基础
• 数据分析师入门

      '📚 **KhmerCareer 培训课程**

**职业技能培训：**
• 商务英语沟通（初级/中级/高级）
• Microsoft Office 办公技能
• 项目管理基础
• 数据分析师入门

**IT技能培训：**
• Web开发全栈课程
• Python编程入门
• 数字营销与SEO
• UI/UX设计基础

**软技能培训：**
• 领导力与团队管理
• 演讲与表达能力
• 时间管理
• 冲突解决技巧

📅 课程周期：4-12周不等
💵 部分课程提供免费试听\``,
  },
  {
    keywords: ['企业服务', 'enterprise', 'company service', 'b2b', 'hr', '人力资源'],
    answer:
      `🏢 **KhmerCareer 企业服务体系**

**招聘服务：**
• 职位发布与推广
• 简历库搜索与下载
• 人才推荐服务
• 校园招聘组织

**HR解决方案：**
• 背景调查服务
• 薪酬调研报告
• 员工满意度调查
• HR管理系统

**品牌推广：**
• 雇主品牌页面定制
• 社交媒体推广
• 行业招聘专场
• 企业宣传片制作

📞 企业专线：+855-23-XXX-XXXX
📧 商务合作：business@khmercareer.com`,
  },
  {
    keywords: ['注册', 'register', 'signup', 'sign up', '账号', 'account', '登录', 'login'],
    answer:
      `🔐 **注册与登录指南**

**注册方式：**
1. 邮箱注册：输入邮箱 → 设置密码 → 验证邮箱
2. 手机号注册：输入手机号 → 获取验证码 → 设置密码
3. 社交账号：支持 Google / Facebook 快速登录

**账户类型：**
• 求职者账户 - 免费
• 企业账户 - 需提交营业执照认证
• 培训机构账户 - 需资质审核

🔒 所有信息均经过SSL加密，保障您的隐私安全`,
  },
  {
    keywords: ['密码', 'password', '忘记密码', 'forgot', 'reset', '找回'],
    answer:
      `🔑 **密码找回指南**

1. 点击登录页面的「忘记密码？」
2. 输入注册邮箱或手机号
3. 查收验证码（邮件/短信）
4. 设置新密码（至少8位，含字母+数字）
5. 使用新密码登录

⚠️ 如未收到验证码，请检查垃圾邮件文件夹或联系客服`,
  },
  {
    keywords: ['上传', 'upload', '文件', 'file', '文档', 'document', '附件'],
    answer:
      `\`📎 **文件上传说明**

**支持的文件类型：**
• 简历：PDF, DOC, DOCX（最大5MB）
• 头像：JPG, PNG（最大2MB）
• 证书：PDF, JPG, PNG（最大5MB）
• 作品集：PDF, ZIP（最大20MB）

**上传技巧：**
• 文件名使用英文命名
• 简历建议PDF格式以保证排版
• 定期更新简历文件'`,
  },
  {
    keywords: ['取消', 'cancel', '删除', 'delete', '撤回', 'withdraw', '申请'],
    answer:
      `'🚫 **如何取消/撤回申请**

1. 登录后进入「我的申请」页面
2. 找到需要取消的职位申请
3. 点击「撤回申请」按钮
4. 确认撤回操作

⚠️ **注意事项：**
• 只有状态为「待查看」的申请可以撤回
• 已被查看的申请无法撤回
• 撤回后可重新投递该职位\``,
  },
  {
    keywords: ['通知', 'notification', '邮件', 'email', '短信', 'alert', '提醒'],
    answer:
      `🔔 **通知设置指南**

**通知类型：**
• 职位推荐通知 - 基于您的求职偏好
• 申请状态更新 - 简历被查看/通过/拒绝
• 企业消息 - HR发送的面试邀请
• 系统公告 - 平台功能更新

**设置方式：**
1. 进入「设置」→「通知偏好」
2. 选择接收渠道：站内信/邮件/短信
3. 设置通知频率：实时/每日汇总/关闭
4. 保存设置`,
  },
  {
    keywords: ['安全', 'security', '隐私', 'privacy', '诈骗', 'scam', 'fraud', 'fake'],
    answer:
      `🛡️ **安全与防诈骗指南**

**常见招聘诈骗手段：**
❌ 要求先交钱再工作
❌ 薪资远高于市场水平
❌ 要求提供银行卡密码
❌ 面试地点偏僻或不正规

**防范建议：**
✅ 核实企业信息（查看营业执照）
✅ 不轻信高薪低要求的职位
✅ 保护个人敏感信息
✅ 发现可疑职位立即举报

📢 举报电话：+855-23-XXX-XXXX
🚨 紧急情况请联系当地警方`,
  },
  {
    keywords: ['订阅', 'subscription', '会员', 'premium', 'vip', '付费', 'upgrade'],
    answer:
      `👑 **会员订阅计划**

**免费版（Free）：**
• 基础简历创建
• 每日5次职位申请
• 基础搜索功能

**专业版（Pro）- $9.9/月：**
• 无限职位申请
• AI简历优化
• 优先简历展示
• 面试辅导服务

**企业版（Business）- $49/月起：**
• 无限职位发布
• 简历库高级搜索
• 品牌展示页面
• 专属客户经理

💳 支持信用卡、PayPal、ABA银行转账`,
  },
  {
    keywords: ['语言', 'language', '中文', '英文', '高棉语', 'khmer', 'english', '多语言'],
    answer:
      `🌐 **平台语言支持**

KhmerCareer 目前支持三种语言：
• 🇰🇭 **高棉语 (Khmer)** - 本地用户首选
• 🇨🇳 **中文 (Chinese)** - 华人企业及求职者
• 🇬🇧 **英语 (English)** - 国际通用

**切换方式：**
点击页面右上角语言切换按钮即可实时切换，所有职位信息和界面文字将同步更新。

🤖 AI客服支持中英文混合对话，高棉语客服正在开发中！`,
  },
  {
    keywords: ['反馈', 'feedback', '投诉', 'complaint', '建议', 'suggestion', '联系'],
    answer:
      `💬 **意见反馈与投诉渠道**

**联系方式：**
• 在线客服：工作日 8:00-18:00
• 客服邮箱：support@khmercareer.com
• 客服热线：+855-23-XXX-XXXX
• WhatsApp：+855-XX-XXX-XXXX

**反馈类型：**
✅ 功能建议与Bug报告
✅ 职位/企业投诉
✅ 账户问题申诉
✅ 合作咨询

⏰ 一般问题24小时内回复，紧急问题2小时内响应`,
  },
  {
    keywords: ['APP', 'app', '手机', 'mobile', '下载', 'download', '应用'],
    answer:
      `📱 **移动端应用下载**

KhmerCareer 提供 iOS 和 Android 双平台APP：

**下载方式：**
• App Store（iOS）：搜索 "KhmerCareer"
• Google Play（Android）：搜索 "KhmerCareer"
• 官网扫码下载

**APP特色功能：**
📍 基于位置的职位推荐
🔔 实时推送通知
📎 手机直接投递简历
💬 与HR即时聊天

📲 扫码立即下载：[二维码图片]`,
  },
  {
    keywords: ['签证', 'visa', '工作证', 'work permit', '劳工证', '证件', 'document'],
    answer:
      `📋 **柬埔寨工作证件指南**

**工作签证 (E类签证)：**
• 有效期：1个月 / 3个月 / 6个月 / 1年
• 所需材料：护照、照片、雇佣合同、营业执照复印件
• 办理地点：柬埔寨移民局或在线申请

**工作证 (Work Permit)：**
• 所有外籍员工必须持有
• 每年需 renew
• 费用：约$100-150/年
• 雇主通常协助办理

⚠️ **重要提醒：** 持商务签证工作属于违法行为，务必办理正确的工作签证！`,
  },
  {
    keywords: ['外国人', 'foreigner', 'expat', '外籍', '海外', 'overseas', '国外'],
    answer:
      `🌍 **外籍人士求职指南**

**在柬埔寨工作的外籍人士需注意：**

1. **签证要求**：必须持有E类工作签证
2. **工作证**：入职后需办理劳工证
3. **税务**：需缴纳个人所得税（0%-20%累进税率）
4. **语言**：英语在商务环境通用，基础高棉语有帮助

**热门外籍岗位：**
• IT技术专家
• 工程管理人员
• 财务/会计
• 教育培训
• 酒店管理

💡 建议通过正规渠道找工作，确保合同和签证合规`,
  },
  {
    keywords: ['合同', 'contract', '劳动', 'labor', '法律', 'law', '权益', 'rights'],
    answer:
      `⚖️ **劳动合同与权益保护**

**柬埔寨劳动法要点：**

📄 **合同类型：**
• 试用期合同（最长3个月）
• 固定期限合同（UDC）
• 无固定期限合同（FDC）

**基本权益：**
✅ 最低工资：$204/月（制衣业标准）
✅ 工作时间：每周48小时（6天×8小时）
✅ 加班费：平时1.5倍，周日2倍，节假日3倍
✅ 年假：每月1.5天，满1年后可使用
✅ 病假：每月最多6天（半薪）

📖 建议仔细阅读合同条款，如有疑问咨询专业律师`,
  },
  {
    keywords: ['行业', 'industry', 'sector', '热门', 'trend', '市场', 'market', '前景'],
    answer:
      `\`📊 **柬埔寨热门行业与就业趋势**

**2024-2025年最热门行业：**

1️⃣ **信息与通信技术 (ICT)**
   需求岗位：软件开发、网络安全、数据分析
   增长率：+25%/年

2️⃣ **电子商务与数字营销**
   需求岗位：电商运营、社媒营销、内容创作
   增长率：+30%/年

3️⃣ **金融服务**
   需求岗位：风控、信贷分析、金融科技
   增长率：+15%/年

4️⃣ **制造业**
   需求岗位：生产管理、质量控制、供应链
   增长率：+10%/年

5️⃣ **旅游与酒店**
   需求岗位：酒店管理、旅游策划、客户服务
   增长率：+20%/年（疫后复苏）'`,
  },
  {
    keywords: ['社保', 'insurance', '福利', 'benefit', '医保', 'nssf', '保障'],
    answer:
      `🏥 **柬埔寨社保与福利制度**

**NSSF（国家社会保障基金）：**

📋 **包含内容：**
• 医疗保险 - 覆盖公立医院和部分私立医院
• 工伤保险 - 工作中的意外伤害
• 养老金 - 退休后的基本保障

      '🏥 **柬埔寨社保与福利制度**

**NSSF（国家社会保障基金）：**

📋 **包含内容：**
• 医疗保险 - 覆盖公立医院和部分私立医院
• 工伤保险 - 工作中的意外伤害
• 养老金 - 退休后的基本保障

**缴费比例：**
• 雇主缴纳：工资的2%
• 员工缴纳：工资的1%
• 总计：工资的3%

**额外福利（部分企业提供）：**
✅ 13薪（年底双薪）
✅ 餐饮补贴
✅ 交通补贴
✅ 电话补贴
✅ 年度体检

⚠️ 所有正规企业必须为员工注册NSSF\``,
  },
  {
    keywords: ['实习', 'internship', '学徒', 'trainee', '应届生', 'fresh graduate', '毕业生'],
    answer:
      `🎓 **实习生与应届生专区**

**实习生项目：**
• 实习时长：3-6个月
• 实习补贴：$100-300/月（因公司而异）
• 转正机会：表现优秀者可转为正式员工

**应届生求职建议：**
1. 突出在校项目和社团经历
2. 考取相关职业证书
3. 积极参加校园招聘会
4. 考虑从实习岗位开始积累经验

**热门应届生岗位：**
• 行政助理
• 初级会计
• 销售代表
• 客服专员
• IT技术支持

🌟 KhmerCareer定期举办「校园招聘专场」，关注活动页面获取最新信息！`,
  },
  {
    keywords: ['远程', 'remote', '居家办公', 'work from home', 'wfh', 'freelance', '兼职', 'part-time'],
    answer:
      `🏠 **远程工作与兼职机会**

**远程工作类型：**
• 软件开发与IT支持
• 数字营销与内容创作
• 在线教育培训
• 数据录入与分析
• 客户服务（在线）

**兼职岗位推荐：**
• 餐厅服务员 - $5-8/天
• 家教辅导 - $5-15/小时
• 翻译工作 - $0.05-0.2/字
• 社交媒体运营 - $100-300/月
•  Event 工作人员 - $8-15/天

💡 提示：使用搜索筛选器选择「远程」或「兼职」标签快速找到相关职位`,
  },
  {
    keywords: ['税务', 'tax', '个税', 'income tax', '纳税', '退税'],
    answer:
      `🧾 **柬埔寨个人所得税指南**

**税率表（2024）：**

| 月收入 (KHR) | 税率 |
|-------------|------|
| 0 - 1,500,000 | 0% |
| 1,500,001 - 2,000,000 | 5% |
| 2,000,001 - 8,500,000 | 10% |
| 8,500,001 - 12,500,000 | 15% |
| 12,500,000+ | 20% |

**税务居民认定：**
• 在柬埔寨居住超过182天/年
• 主要收入来源地在柬埔寨

**减免项目：**
✅ 每位受抚养人减免150,000 KHR/月
✅ 社会保险缴费可抵扣
✅ 慈善捐赠（有限额）

📅 年度税务申报截止日期：3月31日`,
  },
  {
    keywords: ['评估', 'assessment', '测试', 'test', 'quiz', '技能', 'skill test', '能力'],
    answer:
      `🧠 **职业技能评估系统**

KhmerCareer 提供免费的在线技能评估：

**评估类别：**
• 英语能力测试（CERF标准）
• Microsoft Office技能
• 逻辑思维与数理能力
• 性格与职业匹配
• 编程能力测试

**如何使用：**
1. 登录后进入「技能评估」页面
2. 选择要参加的测试
3. 在规定时间内完成答题
4. 查看详细评估报告
5. 可选择将成绩添加到简历中

🏆 高分者可获得平台认证徽章，增加求职竞争力！`,
  },
  {
    keywords: ['柬埔寨', 'cambodia', '国情', '经济', 'culture', 'phnom penh', '西港', 'siem reap'],
    answer:
      `🇰🇭 **柬埔寨就业市场概况**

**基本信息：**
• 首都：金边 (Phnom Penh)
• 人口：约1,700万
• 官方语言：高棉语
• 货币：瑞尔 (KHR)，美元通用
• 时区：UTC+7

**主要经济特区：**
• 金边 - 商业与金融中心
• 西哈努克港 - 工业与旅游
• 暹粒 - 旅游与服务业
• 柴桢 - 制造业集中区

**就业特点：**
✅ 年轻劳动力充足（平均年龄25岁）
✅ 外商投资优惠政策
✅ 英语普及度逐年提高
✅ 政府推动数字化转型

📈 柬埔寨是东南亚经济增长最快的国家之一，就业机会持续增加！`,
  },
  {
    keywords: ['推荐', 'recommend', '算法', '匹配', 'match', '系统', 'ai', '智能'],
    answer:
      `\`🤖 **智能职位推荐系统**

KhmerCareer 使用AI算法为您精准匹配职位：

**匹配维度：**
• 技能标签匹配度
• 工作经验要求
• 期望薪资范围
• 地理位置偏好
• 行业领域

**如何提高匹配准确度：**
1. 完善个人简历信息
2. 定期更新求职意向
3. 浏览和收藏感兴趣的职位
4. 完善技能标签
5. 参与技能评估测试

📌 系统会根据您的行为数据不断学习，推荐会越来越精准！'`,
  },
  {
    keywords: ['签证延期', 'visa extension', '延期', '续签', 'renew', 'extension'],
    answer:
      `'📅 **签证延期与续签指南**

**E类签证延期：**

**所需材料：**
• 护照原件
• 2张白底照片
• 延期申请表
• 雇主出具的工作证明
• NSSF参保证明

**办理方式：**
1. 移民局现场办理（约3-5个工作日）
2. 委托中介代办（额外费用$20-50）
3. 部分公司提供代办服务

**费用参考：**
• 1个月延期：约$40
• 3个月延期：约$80
• 6个月延期：约$160
• 1年延期：约$280

⏰ **重要**：请在签证到期前至少2周办理延期，逾期罚款$5/天\``,
  },
  {
    keywords: ['打招呼', 'hello', 'hi', '你好', '您好', '在吗', '帮助', 'help', 'support'],
    answer:
      `'👋 您好！我是 KhmerCareer 智能客服助手，很高兴为您服务！

我可以帮助您解答以下问题：
• 🔍 如何找工作 / 发布招聘
• 📝 简历创建与修改
• 💰 薪资与福利咨询
• 🎯 面试技巧与培训
• 🛡️ 安全与防诈骗
• 📋 签证与工作证件
• 以及更多...

请直接输入您的问题，我会尽力为您解答！您也可以点击下方快捷问题按钮。'`,
  },
];

// ==================== Suggestion Chips ====================
const defaultSuggestions: SuggestionChip[] = [
  { label: '🔍 如何找工作', query: '如何使用平台找工作' },
  { label: '📢 发布招聘', query: '如何发布招聘信息' },
  { label: '📝 修改简历', query: '如何修改简历' },
  { label: '💰 薪资范围', query: '薪资范围是多少' },
  { label: '🎯 面试技巧', query: '面试技巧' },
  { label: '📚 培训课程', query: '培训课程有哪些' },
];

// ==================== Helper: Local Knowledge Search ====================
function findLocalAnswer(input: string): string | null {
  const normalizedInput = input.toLowerCase().trim();
  
  // Try exact keyword match
  for (const item of knowledgeBase) {
    if (item.keywords.some((kw) => normalizedInput.includes(kw.toLowerCase()))) {
      return item.answer;
    }
  }

  // Try fuzzy match (if at least 2 keywords partially match)
  let bestMatch: KnowledgeItem | null = null;
  let bestScore = 0;

  for (const item of knowledgeBase) {
    let score = 0;
    for (const kw of item.keywords) {
      const kwLower = kw.toLowerCase();
      // Check for partial inclusion both ways
      if (normalizedInput.includes(kwLower) || kwLower.includes(normalizedInput)) {
        score += kwLower.length >= 4 ? 2 : 1;
      }
      // Word boundary match
      const words = normalizedInput.split(/\s+/);
      for (const word of words) {
        if (word.length >= 2 && kwLower.includes(word)) {
          score += 1;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && bestScore >= 2) {
    return bestMatch.answer;
  }

  return null;
}

// ==================== Helper: Generate a contextual fallback response ====================
function generateFallbackResponse(input: string): string {
  return `🤔 感谢您的提问！\n\n我暂时没有找到与您问题完全匹配的内容。\n\n**您可以尝试以下方式获取帮助：**\n\n1. 🔄 换个关键词重新提问\n2. 📧 联系人工客服：support@khmercareer.com\n3. 📞 客服热线：+855-23-XXX-XXXX\n4. 💬 发送邮件详细描述您的问题\n\n**常见问题分类：**\n• 账号注册与登录\n• 简历管理与优化\n• 职位搜索与申请\n• 企业招聘服务\n• 培训课程咨询\n• 薪资与法务咨询\n\n请问还有其他我可以帮您的吗？`;
}

// ==================== Typing Animation Hook ====================
function useTypingAnimation(text: string, speed: number = 25) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTyping = useCallback(() => {
    setDisplayedText('');
    setIsTyping(true);
    indexRef.current = 0;

    const typeNext = () => {
      if (indexRef.current < text.length) {
        // Type 1-3 characters at a time for natural feel
        const chunkSize = Math.floor(Math.random() * 2) + 1;
        const nextIndex = Math.min(indexRef.current + chunkSize, text.length);
        setDisplayedText(text.slice(0, nextIndex));
        indexRef.current = nextIndex;
        timerRef.current = setTimeout(typeNext, speed + Math.random() * 20);
      } else {
        setIsTyping(false);
      }
    };

    timerRef.current = setTimeout(typeNext, speed);
  }, [text, speed]);

  const skipTyping = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayedText(text);
    setIsTyping(false);
  }, [text]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { displayedText, isTyping, startTyping, skipTyping };
}

// ==================== Main Component ====================
export default function AICustomerService() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>('welcome');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [apiFailed, setApiFailed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const welcomeText =
    '👋 您好！我是 **KhmerCareer AI 客服助手**！\n\n我可以帮您解答关于找工作、发布招聘、简历优化、面试技巧、培训课程、薪资咨询等各类问题。\n\n请问有什么可以帮您的吗？😊';

  const {
    displayedText: welcomeDisplayed,
    isTyping: isWelcomeTyping,
    startTyping: startWelcomeTyping,
    skipTyping: skipWelcomeTyping,
  } = useTypingAnimation(welcomeText, 20);

  // Auto-start welcome typing on first open
  const [welcomeStarted, setWelcomeStarted] = useState(false);

  useEffect(() => {
    if (isOpen && !welcomeStarted) {
      setWelcomeStarted(true);
      setTimeout(() => {
        startWelcomeTyping();
      }, 300);
    }
  }, [isOpen, welcomeStarted, startWelcomeTyping]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, welcomeDisplayed]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // ==================== SiliconFlow API Call ====================
  const callSiliconFlowAPI = async (userMessage: string): Promise<string | null> => {
    const API_KEY = import.meta.env.VITE_SILICONFLOW_API_KEY || '';
    const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
    const MODEL = 'deepseek-ai/DeepSeek-V2.5';

    const systemPrompt = `你是 KhmerCareer（柬埔寨招聘平台）的AI客服助手。你的职责是帮助用户解答关于找工作、招聘、简历、面试、培训、薪资、签证、劳动法等相关问题。

重要规则：
1. 优先使用中文回答，可以适当夹杂英文专业术语
2. 回答要专业、友好、有条理
3. 涉及数字和数据时，使用美元(USD)和柬埔寨瑞尔(KHR)双币种
4. 如果不确定答案，建议用户联系人工客服
5. 保持简洁但信息完整，适当使用emoji增加亲和力
6. 针对柬埔寨本地就业市场提供准确信息

当前时间：${new Date().toISOString()}`;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 1024,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    } catch (error) {
      console.error('SiliconFlow API error:', error);
      return null;
    }
  };

  // ==================== Handle Send Message ====================
  const handleSend = async (text: string = inputValue.trim()) => {
    if (!text || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const aiMsgId = `ai-${Date.now()}`;

    // Add user message
    const userMessage: Message = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowSuggestions(false);
    setTypingMessageId(aiMsgId);

    // Prepare AI placeholder
    setMessages((prev) => [
      ...prev,
      {
        id: aiMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      },
    ]);

    let responseText: string;

    // Step 1: Try SiliconFlow API
    const apiResponse = await callSiliconFlowAPI(text);

    if (apiResponse) {
      responseText = apiResponse;
      setApiFailed(false);
    } else {
      // Step 2: Fallback to local knowledge base
      setApiFailed(true);
      const localAnswer = findLocalAnswer(text);
      responseText = localAnswer || generateFallbackResponse(text);
    }

    // Simulate network delay for natural feel (minimum 500ms)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update the AI message with full content
    setMessages((prev) =>
      prev.map((msg) => (msg.id === aiMsgId ? { ...msg, content: responseText } : msg))
    );
    setIsLoading(false);

    // Start typing animation for the response
    setTimeout(() => {
      setTypingMessageId(null);
    }, 100);
  };

  // ==================== Handle Suggestion Click ====================
  const handleSuggestionClick = (query: string) => {
    handleSend(query);
  };

  // ==================== Quick Actions ====================
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'clear':
        setMessages([
          {
            id: 'welcome-2',
            role: 'assistant',
            content: welcomeText,
            timestamp: new Date(),
          },
        ]);
        setShowSuggestions(true);
        setWelcomeStarted(false);
        break;
      case 'human':
        setMessages((prev) => [
          ...prev,
          {
            id: `system-${Date.now()}`,
            role: 'system',
            content:
              '👨‍💼 **人工客服接入方式**\n\n• 📞 客服热线：**+855-23-XXX-XXXX**\n• 📧 邮箱：**support@khmercareer.com**\n• 💬 WhatsApp：**+855-XX-XXX-XXXX**\n• 🕐 服务时间：周一至周五 8:00-18:00\n\n⏳ 当前排队人数：2人，预计等待时间约 3 分钟',
            timestamp: new Date(),
          },
        ]);
        break;
    }
  };

  // ==================== Render Message Content ====================
  const renderMessageContent = (msg: Message) => {
    if (msg.role === 'user') {
      return <p className="whitespace-pre-wrap">{msg.content}</p>;
    }

    if (msg.role === 'system') {
      return (
        <div className="whitespace-pre-wrap text-sm text-amber-800">
          {msg.content}
        </div>
      );
    }

    // Assistant message - show typing animation for the latest one
    if (msg.id === typingMessageId || (msg.id === 'welcome' && isWelcomeTyping)) {
      const displayText = msg.id === 'welcome' ? welcomeDisplayed : msg.content;
      return (
        <div className="relative">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {renderMarkdown(displayText)}
          </div>
          {isWelcomeTyping && msg.id === 'welcome' && (
            <button
              onClick={skipWelcomeTyping}
              className="mt-1 text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer"
            >
              跳过动画
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="whitespace-pre-wrap text-sm leading-relaxed">
        {renderMarkdown(msg.content)}
      </div>
    );
  };

  // ==================== Simple Markdown Renderer ====================
  const renderMarkdown = (text: string) => {
    if (!text) return null;

    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let tableRows: string[][] = [];
    let inTable = false;
    let listItems: React.ReactNode[] = [];
    let inList = false;
    let lineIdx = 0;

    const flushTable = () => {
      if (tableRows.length > 0) {
        elements.push(
          <div key={`table-${lineIdx}`} className="overflow-x-auto my-2">
            <table className="min-w-full text-xs border border-gray-200 rounded">
              <tbody>
                {tableRows.map((row, ri) => (
                  <tr
                    key={ri}
                    className={
                      ri === 0
                        ? 'bg-gray-50 font-semibold'
                        : ri % 2 === 0
                          ? 'bg-white'
                          : 'bg-gray-50/50'
                    }
                  >
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-2 py-1 border border-gray-200">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
      inTable = false;
    };

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${lineIdx}`} className="list-disc list-inside my-1 space-y-0.5">
            {listItems}
          </ul>
        );
        listItems = [];
      }
      inList = false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      lineIdx = i;

      // Skip separator lines
      if (line.match(/^\|[-\s|]+\|$/)) continue;

      // Table row
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!inTable && inList) flushList();
        inTable = true;
        const cells = line
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim());
        tableRows.push(cells);
        continue;
      } else if (inTable) {
        flushTable();
      }

      // List items
      if (line.match(/^[\s]*[•\-\*✅❌✨💡📌⚠️🔒📞📧🕐⏳📅📊📝🔍📢💰🎯📚🏠🛡️⚖️🌍🎓🏥🧾🧠🏢🌐📱📋📎🔐👑🇰🇭🇨🇳🇬🇧🔄👨‍💼🎉🥳🤔🙏💬📍🔔🚫📄🏠🧾🔑📅🎉🚀💻📈💵🌟🤝🎊💪👍❓🎁🌈🏆📣💯🎨🔥⭐🎮📸💌🍀👏🎵🎬🌺🌞🌙🌟🎀💎🌊🍎🎂🎈🎁🎄🎃🎅🤶🦌⛄🎉🎊🎋🎍🎎🎏🎐🎑🎀🎁🎗️🎟️🎫🎖️🏆🏅🥇🥈🥉🏊‍♂️🏋️‍♀️🚴‍♂️🧗‍♀️🤺🏇⛷️🏂🏌️‍♂️🏄‍♀️🚣‍♂️🧘‍♀️🤽‍♂️🤾‍♀️🤼‍♂️🤸‍♀️🧖‍♂️🧗‍♂️🚵‍♀️🧘‍♂️🤽‍♀️🤾‍♂️🤼‍♀️🤸‍♂️🧖‍♀️🚵‍♂️🧘‍♀️]+[\s]/)) {
        const content = line.replace(/^[\s]*[•\-\*]+[\s]/, '');
        listItems.push(<li key={`li-${i}`}>{renderInline(content)}</li>);
        inList = true;
        continue;
      } else if (inList && line.trim() === '') {
        flushList();
        continue;
      } else if (inList) {
        flushList();
      }

      // Empty line
      if (line.trim() === '') {
        elements.push(<div key={`br-${i}`} className="h-1" />);
        continue;
      }

      // Header
      if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
        elements.push(
          <p key={`h-${i}`} className="font-bold text-amber-700 mt-2 mb-1">
            {renderInline(line)}
          </p>
        );
        continue;
      }

      // Normal line
      elements.push(
        <p key={`p-${i}`} className="my-0.5">
          {renderInline(line)}
        </p>
      );
    }

    if (inTable) flushTable();
    if (inList) flushList();

    return <>{elements}</>;
  };

  // ==================== Inline Markdown Parser ====================
  const renderInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    const patterns = [
      { regex: /\*\*(.+?)\*\*/g, type: 'bold' as const },
      { regex: /\*(.+?)\*/g, type: 'italic' as const },
      { regex: /`(.+?)`/g, type: 'code' as const },
    ];

    while (remaining.length > 0) {
      let earliestMatch: { index: number; length: number; type: string; content: string } | null =
        null;

      for (const pattern of patterns) {
        pattern.regex.lastIndex = 0;
        const match = pattern.regex.exec(remaining);
        if (match && (earliestMatch === null || match.index < earliestMatch.index)) {
          earliestMatch = {
            index: match.index,
            length: match[0].length,
            type: pattern.type,
            content: match[1],
          };
        }
      }

      if (earliestMatch) {
        if (earliestMatch.index > 0) {
          parts.push(
            <span key={`text-${keyIdx++}`}>{remaining.slice(0, earliestMatch.index)}</span>
          );
        }

        switch (earliestMatch.type) {
          case 'bold':
            parts.push(
              <strong key={`bold-${keyIdx++}`} className="font-semibold text-amber-800">
                {earliestMatch.content}
              </strong>
            );
            break;
          case 'italic':
            parts.push(
              <em key={`italic-${keyIdx++}`} className="italic text-gray-600">
                {earliestMatch.content}
              </em>
            );
            break;
          case 'code':
            parts.push(
              <code
                key={`code-${keyIdx++}`}
                className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-amber-700"
              >
                {earliestMatch.content}
              </code>
            );
            break;
        }

        remaining = remaining.slice(earliestMatch.index + earliestMatch.length);
      } else {
        parts.push(<span key={`text-${keyIdx++}`}>{remaining}</span>);
        break;
      }
    }

    return <>{parts}</>;
  };

  // ==================== Format Time ====================
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  // ==================== Chat Window (when minimized) ====================
  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-medium text-sm">AI 客服</span>
        {messages.filter((m) => m.role === 'assistant').length > 1 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center animate-pulse">
            !
          </span>
        )}
      </motion.button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-4 w-[400px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
          >
            {/* ==================== Header ==================== */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-1.5">
                    KhmerCareer AI
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/30">
                      Beta
                    </span>
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${apiFailed ? 'bg-amber-400' : 'bg-green-400'} animate-pulse`}
                    />
                    <span className="text-xs text-gray-400">
                      {apiFailed ? '本地知识库模式' : '在线 - AI驱动'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleQuickAction('clear')}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                  title="清空对话"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                  title="最小化"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowSuggestions(true);
                    setWelcomeStarted(false);
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                  title="关闭"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ==================== Messages Area ==================== */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gradient-to-b from-gray-50 to-white"
            >
              {/* Welcome message */}
              {messages[0]?.id === 'welcome' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 self-start shadow">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white border border-amber-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                      {renderMessageContent(messages[0])}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 ml-1">
                      {formatTime(messages[0].timestamp)}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Other messages */}
              {messages.slice(1).map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 self-start shadow ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-gray-600 to-gray-800'
                        : msg.role === 'system'
                          ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                          : 'bg-gradient-to-br from-amber-400 to-amber-600'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : msg.role === 'system' ? (
                      <MessageCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message bubble */}
                  <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div
                      className={`inline-block text-left max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-tr-sm'
                          : msg.role === 'system'
                            ? 'bg-blue-50 border border-blue-100 rounded-tl-sm'
                            : 'bg-white border border-amber-100 rounded-tl-sm'
                      }`}
                    >
                      {msg.role === 'assistant' && !msg.content ? (
                        <div className="flex items-center gap-2 py-1">
                          <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                          <span className="text-sm text-gray-500">AI正在思考中...</span>
                        </div>
                      ) : (
                        renderMessageContent(msg)
                      )}
                    </div>
                    <span
                      className={`text-[10px] text-gray-400 mt-1 block ${
                        msg.role === 'user' ? 'mr-1 text-right' : 'ml-1'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading &&
                messages[messages.length - 1]?.role === 'user' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 shadow">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-amber-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                        <span className="text-sm text-gray-500">AI正在思考中...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

              {/* Suggestion Chips */}
              <AnimatePresence>
                {showSuggestions && messages.length <= 2 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="pt-2"
                  >
                    <p className="text-xs text-gray-400 mb-2">💡 常见问题，点击快速提问：</p>
                    <div className="flex flex-wrap gap-2">
                      {defaultSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.query}
                          onClick={() => handleSuggestionClick(suggestion.query)}
                          className="text-xs bg-white border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-50 hover:border-amber-400 transition-all shadow-sm hover:shadow"
                        >
                          {suggestion.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* ==================== Input Area ==================== */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white shrink-0">
              {/* Quick Actions */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => handleQuickAction('human')}
                  className="text-[10px] text-gray-500 hover:text-amber-600 flex items-center gap-0.5 transition-colors"
                >
                  <User className="w-3 h-3" />
                  人工客服
                </button>
                <span className="text-gray-200">|</span>
                <button
                  onClick={() => handleQuickAction('clear')}
                  className="text-[10px] text-gray-500 hover:text-amber-600 flex items-center gap-0.5 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  新对话
                </button>
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="输入您的问题... (支持中英文)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all placeholder:text-gray-400"
                    disabled={isLoading}
                  />
                  {inputValue && (
                    <button
                      onClick={() => setInputValue('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  disabled={isLoading || !inputValue.trim()}
                  className={`p-2.5 rounded-xl transition-all ${
                    isLoading || !inputValue.trim()
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== Floating Button (when closed) ==================== */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all group relative"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none"
          >
            有什么可以帮您？
            <ChevronDown className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 text-gray-900 rotate-[-90deg]" />
          </motion.div>
        </motion.button>
      )}
    </div>
  );
}
