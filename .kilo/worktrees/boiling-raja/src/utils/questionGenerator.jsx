const generateQuestion = async ({
  description,
  setGeneratedQuestionsAndAnswers,
  maxQuestions = 3,
}) => {
  if (!description || !description.trim()) {
    setGeneratedQuestionsAndAnswers([]);
    return;
  }

  if (!OPENAI_KEY) {
    setGeneratedQuestionsAndAnswers([]);
    return;
  }

  const systemPrompt =
    "You are an educational assistant that creates concise assessment questions and model answers from a transcript. Output must be a single valid JSON array of objects with keys: question, answer, hint.";

  const userPrompt = `Transcript:\n\n${description}\n\nReturn up to ${maxQuestions} items as a JSON array like [{"question":"...","answer":"...","hint":"..."}].`;

  try { 
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      setGeneratedQuestionsAndAnswers([]);
      return;
    }

    const data = await res.json();
    let text = data?.choices?.[0]?.message?.content || "";
    text = text.trim();

    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      const jsonMatch = text.match(/(\[.*\]|\{.*\})/s);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[1]);
        } catch (e2) {
          parsed = null;
        }
      }
    }

    if (!Array.isArray(parsed)) {
      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      const items = [];
      for (let i = 0; i < lines.length && items.length < maxQuestions; i++) {
        const qMatch =
          lines[i].match(/^\d+\.\s*(.*)/) || lines[i].match(/^Q[:\-\s]*(.*)/i);
        if (qMatch) {
          const question = qMatch[1];
          const answerLine = lines[i + 1] || "";
          const hintLine = lines[i + 2] || "";
          items.push({
            question: question,
            answer: answerLine.replace(/^A[:\-\s]*/i, "").trim(),
            hint: hintLine.replace(/^Hint[:\-\s]*/i, "").trim(),
          });
          i += 2;
        }
      }
      if (items.length) parsed = items;
    }

    if (Array.isArray(parsed)) {
      const normalized = parsed
        .slice(0, maxQuestions)
        .map((p) => ({
          question: (p.question || p.q || "").toString().trim(),
          answer: (p.answer || p.a || "").toString().trim(),
          hint: (p.hint || p.h || "").toString().trim(),
        }))
        .filter((p) => p.question && p.answer);

      setGeneratedQuestionsAndAnswers(normalized);
    } else {
      setGeneratedQuestionsAndAnswers([]);
    }
  } catch (err) {
    setGeneratedQuestionsAndAnswers([]);
  }
};
