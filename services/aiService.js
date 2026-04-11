const axios = require('axios');

exports.generateOffreDescription = async (titre, domaine) => {
    const prompt = `Tu es un expert RH. Génère une description professionnelle pour une offre d'emploi de "${titre}" dans le domaine "${domaine}". Inclus: introduction, responsabilités, compétences requises. Maximum 200 mots. Réponds en français.`;

    const res = await axios.post(
        'https://router.huggingface.co/novita/v3/openai/chat/completions',
        {
            model: 'deepseek/deepseek-r1-0528',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 512
        },
        {
            headers: {
                'Authorization': `Bearer ${process.env.HF_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );

    let text = res.data.choices[0].message.content;
    // Supprimer les balises <think>...</think>
    text = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    return text;
};
// Scorer un CV par rapport à une offre
exports.scorerCV = async (cvTexte, offreTitre, offreDescription) => {
    const prompt = `Tu es un système ATS (Applicant Tracking System). Compare ce CV avec cette offre d'emploi et donne un score de compatibilité.

OFFRE D'EMPLOI :
Titre : ${offreTitre}
Description : ${offreDescription}

CV DU CANDIDAT :
${cvTexte.substring(0, 1500)}

Analyse la correspondance entre les compétences du CV et les exigences de l'offre.
Réponds UNIQUEMENT avec un nombre entier entre 0 et 100. Rien d'autre. Pas de texte, pas d'explication. Juste le nombre.`;

    const res = await axios.post(
        'https://router.huggingface.co/novita/v3/openai/chat/completions',
        {
            model: 'deepseek/deepseek-r1-0528',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 50
        },
        {
            headers: {
                'Authorization': `Bearer ${process.env.HF_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );

    let text = res.data.choices[0].message.content;
    text = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    const score = parseInt(text.match(/\d+/)?.[0] || '0');
    return Math.min(100, Math.max(0, score));
};