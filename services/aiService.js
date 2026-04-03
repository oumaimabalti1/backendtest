const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Générer une description d'offre
exports.generateOffreDescription = async (titre, domaine) => {
    const prompt = `Tu es un expert en ressources humaines. Génère une description professionnelle pour une offre d'emploi.

Titre du poste : ${titre}
Domaine : ${domaine}

La description doit contenir :
- Un paragraphe d'introduction sur le poste
- Les responsabilités principales (4-5 points)
- Les compétences requises (4-5 points)
- Les qualifications souhaitées

Réponds directement avec la description, sans titre ni introduction. Maximum 200 mots.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
};