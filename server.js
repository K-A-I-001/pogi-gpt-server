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

   //
   const promptPrefix = "너는 진로 상담 전문가야. 학생이 병원 간호사로 취업하려고 할 때, 구체적이고 친절하게 도와줘. 질문: ";
  const finalMessage = `${promptPrefix}${userMessage}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // gpt-4o 사용 가능하면 이걸로
      messages: [{ role: 'user', content: finalMessage }],
    });

    const reply = response.choices[0].message.content;
    res.json({ message: reply });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'Something went wrong with OpenAI API.' });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});