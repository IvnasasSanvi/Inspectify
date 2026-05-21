import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port= process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

app.post("/test", async(req, res)=>{
    try {
      const response = await client.chat.completions.create({
        model: 'deepseek-ai/DeepSeek-R1:novita',
        messages: [
          {
            role: "user",
            content: "What is name of ai "
          }
        ]
      });

      res.json({
        reply: response.choices[0].message.content,
      })
    } catch (error) {
      console.error(error.message)
    }
})

app.post("/fix-code", async (req, res) => {
  try {
    const { code, language } = req.body;

    const response = await client.chat.completions.create({
        model: "openai/gpt-oss-120b:groq",

      messages: [

        {
          role: "system",
          content: `
You are a coding assistant.

Selected language: ${language}

Rules:
1. Internally verify the code belongs to ${language}.
2. If the language does not match, ONLY return:
   "Language mismatch. Please select the correct language."

3. If the code is logically and syntactically correct:
   - ONLY return:
     "Code is correct."

4. If the code has syntax errors, runtime issues, or logical mistakes:
   - Briefly mention the issue.
   - Return ONLY the corrected code.
   - Keep the response concise.

5. Do not:
   - Add long explanations
   - Add markdown headings
   - Add tables
   - Add unnecessary best practices
   - Rewrite correct code
   - Explain obvious things
`,
        }, {
          role: "user",
          content: `
Fix this code:

${code}
`,
        }
      ],
    });

    res.json({
      success: true,
      reply: response.choices[0].message.content,
    });
  } catch (error) {
   console.log(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});


app.post("/review", async (req, res) => {
  try {
    const { code, language } = req.body;

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b:groq",

      messages: [
                {
          role: "system",
          content: `
You are an expert code reviewer.

Selected language: ${language}

Rules:

1. Internally verify the code belongs to ${language}.
2. If the language does not match, ONLY return:
   "Language mismatch. Please select the correct language."

3. If the code has syntax errors, runtime issues, or logical mistakes:
   - Briefly mention the issue.
   - Give a short correction suggestion.
   - Return ONLY the corrected code.
   - Keep the response concise.

4. If the code is logically and syntactically correct:
   - ONLY return:
     "Code is correct."

5. Do not:
   - Add long explanations
   - Add markdown headings
   - Add tables
   - Add unnecessary best practices
   - Rewrite correct code
   - Explain obvious things
`,
        },

        {
          role: "user",
          content: `
Review and fix this code:

${code}
`,
        },
      ],
    });

    res.json({
      success: true,
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});


app.post("/run", async (req, res) => {
  try {
    const { code, language } = req.body;

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b:groq",

      messages: [
                {
          role: "system",
          content: `
You are a code execution assistant.

Selected language: ${language}

Rules:
1. Internally verify the code belongs to ${language}.
2. If the language does not match, ONLY return:
  "Language mismatch. Please select the correct language."

3. If the code has syntax/runtime errors:
   - ONLY return the error message.
   - Do not explain anything.

4. If the code has runs successfully:
   - ONLY return the exact output.
   - Do not add explaination.
   - Do not add markdown.
   - Do not add labels like "Output:".

5. Keep responses short and clean.
`,
        },
        {
          role: "user",
          content: `
What will be the output of this code?

${code}
`,
        },
      ],
    });

    res.json({
      success: true,
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});




app.listen(port, () => {
  console.log("Server port is running");
});