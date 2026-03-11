const Groq = require('groq-sdk');

async function scorerCV(cvTexte, offreTitre, offreDescription) {
    try {
        if (!cvTexte || cvTexte.trim().length < 20) return 0;

        // Instancier ici pour que dotenv soit déjà chargé
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const prompt = `Tu es un expert RH spécialisé dans l'analyse de candidatures.

Analyse la correspondance entre ce CV et cette offre d'emploi.

OFFRE D'EMPLOI:
Titre: ${offreTitre}
Description: ${offreDescription}

CV DU CANDIDAT:
${cvTexte.substring(0, 3000)}

Évalue la correspondance sur une échelle de 0 à 100 en tenant compte de:
- Les compétences techniques (40%)
- L'expérience professionnelle (30%)
- La formation / diplômes (20%)
- Les soft skills et autres (10%)

Réponds UNIQUEMENT avec un JSON valide dans ce format exact:
{"score": <nombre entre 0 et 100>, "resume": "<une phrase résumant le profil>"}

Ne mets rien d'autre dans ta réponse.`;

        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.1,
            max_tokens: 150,
        });

        const text = completion.choices[0]?.message?.content?.trim() || '';
        const clean = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean);
        return Math.min(100, Math.max(0, Math.round(parsed.score)));

    } catch (error) {
        console.error('Erreur scoring IA:', error.message);
        return 0;
    }
}

module.exports = { scorerCV };