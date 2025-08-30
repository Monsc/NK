import OpenAI from 'openai'

export interface ClassificationResult {
  category: 'royal' | 'political' | 'economic' | 'social' | 'other'
  relevance: number
  sentiment: 'positive' | 'negative' | 'neutral'
  summary: string
}

export interface BriefResult {
  title: string
  summary: string
  keyPoints: string[]
  actionItems: string[]
}

export interface ArticleResult {
  title: string
  content: string
  excerpt: string
  tags: string[]
}

export interface SafetyResult {
  isSafe: boolean
  concerns: string[]
  recommendations: string[]
}

const openai = new OpenAI({
  apiKey: process.env.LLM_API_KEY || 'dummy-key-for-build',
})

export async function classify(
  title: string,
  content: string
): Promise<ClassificationResult> {
  const prompt = `Analyze this news article and classify it for anti-monarchy campaign:

Title: ${title}
Content: ${content}

Please classify this article into one of these categories:
- monarchy_criticism: Direct criticism of British monarchy
- royal_scandals: Royal family scandals or controversies
- cost_analysis: Financial cost of monarchy to taxpayers
- constitutional_reform: Constitutional changes affecting monarchy
- anti_monarchy_arguments: Arguments against hereditary privilege
- royal_family_news: General royal family news
- other: Everything else

Also provide:
- Relevance score (0-10) for anti-monarchy campaign
- Sentiment (positive/negative/neutral) towards monarchy abolition
- Brief summary (2-3 sentences)

Respond in JSON format:
{
  "category": "category_name",
  "relevance": number,
  "sentiment": "positive|negative|neutral",
  "summary": "summary_text"
}`

  const response = await openai.chat.completions.create({
    model: process.env.LLM_MODEL || 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')
  return result
}

export async function brief(
  title: string,
  excerpt: string
): Promise<BriefResult> {
  const prompt = `Create a brief for this news article from an anti-monarchy perspective:

Title: ${title}
Excerpt: ${excerpt}

Generate:
1. A compelling title focused on abolishing the British monarchy
2. A 2-3 sentence summary highlighting why the monarchy should be abolished
3. 3-5 key points emphasising the cost, privilege, and outdated nature of the monarchy
4. 2-3 action items for readers to support the abolition campaign

Respond in JSON format:
{
  "title": "title",
  "summary": "summary",
  "keyPoints": ["point1", "point2", "point3"],
  "actionItems": ["action1", "action2"]
}`

  const response = await openai.chat.completions.create({
    model: process.env.LLM_MODEL || 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')
  return result
}

export async function article(
  title: string,
  excerpt: string,
  sources: string[]
): Promise<ArticleResult> {
  const prompt = `Write a comprehensive anti-monarchy article based on this news:

Title: ${title}
Excerpt: ${excerpt}
Sources: ${sources.join(', ')}

Write an article that:
- Is 800-1200 words
- Focuses specifically on abolishing the British monarchy
- Emphasises the cost to taxpayers, hereditary privilege, and outdated nature
- Uses British English spelling and terminology
- Is factual and well-researched
- Includes a compelling excerpt
- Has relevant tags

Respond in JSON format:
{
  "title": "article_title",
  "content": "full_article_content",
  "excerpt": "compelling_excerpt",
  "tags": ["tag1", "tag2", "tag3"]
}`

  const response = await openai.chat.completions.create({
    model: process.env.LLM_MODEL || 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')
  return result
}

export async function safety(
  content: string
): Promise<SafetyResult> {
  const prompt = `Review this content for safety and compliance:

${content}

Check for:
- Hate speech or discrimination
- Incitement to violence
- False information
- Privacy violations
- Legal compliance

Respond in JSON format:
{
  "isSafe": true/false,
  "concerns": ["concern1", "concern2"],
  "recommendations": ["rec1", "rec2"]
}`

  const response = await openai.chat.completions.create({
    model: process.env.LLM_MODEL || 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')
  return result
}
