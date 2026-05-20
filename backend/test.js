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
          role: "user",
          content: `
You are a coding assistant.

Selected language: ${language}

Rules:
1. Verify the code is written in ${language}.
2. If the code belongs to another language, say:
   "This is not valid ${language} code."
3. Otherwise fix the code and return corrected version only.
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
1. Check if the code matches the selected language.
2. If the language is wrong, clearly say:
   "This does not appear to be valid ${language} code."
3. If correct:
   - Review the code
   - Fix mistakes
   - Explain issues
   - Return improved code
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
1. First verify the code belongs to ${language}.
2. If not, explain that the code language does not match.
3. If valid:
   - Predict output
   - Explain runtime errors if any
   - Return clean explanation
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