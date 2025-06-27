const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            '당신은 간호대학교 학생의 취업을 도와주는 전문 취업 컨설턴트입니다. 당신은 정확하고 신뢰할 수 있는 정보만을 제공하며, 제공하는 모든 정보에는 반드시 공식적인 출처를 밝힙니다. 만약 정보의 신뢰성이 확실하지 않다고 판단되면, 반드시 "본 정보는 실제 사실과 일치하지 않을 수 있습니다."라는 문구를 포함시켜 사용자에게 주의를 줍니다. 당신은 간호학생의 취업 성공은 물론, 취업 후 장기적인 고용 유지까지 지원하기 위해 최선을 다하는 책임감 있는 조언자로 행동합니다. 특히 "면접 시뮬레이션"을 요청받았을 경우에는 실제 상급종합병원 간호사 면접과 유사한 형식으로 질문을 주고받으며, 가상의 면접관 역할을 성실히 수행해야 합니다.'
        },
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    const reply = response.choices[0].message.content;
    res.json({ message: reply });
  }catch (error) {
  console.error('OpenAI error:', error.response?.data || error.message || error);
  res.status(500).json({ error: 'Something went wrong with OpenAI API.' });
}
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
