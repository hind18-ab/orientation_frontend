const fs = require('fs');
const path = require('path');

const baseDir = 'c:/REACT/orientation_frontend/src/i18n';
const arPath = path.join(baseDir, 'ar.json');
const enPath = path.join(baseDir, 'en.json');
const frPath = path.join(baseDir, 'fr.json');

const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));

// Keys to add
const additions = {
    'admin.management.lessons': { fr: "Gestion des Leçons", ar: "إدارة الدروس", en: "Lessons Management" },
    'admin.management.lessonsSubtitle': { fr: "Gérez le contenu détaillé de chaque module", ar: "إدارة المحتوى التفصيلي لكل وحدة", en: "Manage detailed content for each module" },
    'admin.management.newLesson': { fr: "Nouvelle Leçon", ar: "درس جديد", en: "New Lesson" },
    'admin.management.createQuiz': { fr: "Créer un Quiz", ar: "إنشاء اختبار", en: "Create a Quiz" },
    'admin.management.questions': { fr: "Gestion des Questions", ar: "إدارة الأسئلة", en: "Questions Management" },
    'admin.management.questionsSubtitle': { fr: "Configurez les questions du test d'orientation et leurs points", ar: "تكوين أسئلة اختبار التوجيه ونقاطها", en: "Configure orientation test questions and their points" },
    'admin.management.addQuestion': { fr: "Ajouter une Question", ar: "إضافة سؤال", en: "Add a Question" },
    'admin.management.users': { fr: "Gestion des Utilisateurs", ar: "إدارة المستخدمين", en: "Users Management" },
    'admin.searchBy': { fr: "...Rechercher par nom ou email", ar: "...البحث بالاسم أو البريد الإلكتروني", en: "...Search by name or email" },
    'admin.history.order': { fr: "Ordre", ar: "الترتيب", en: "Order" },
    'admin.history.title': { fr: "Titre", ar: "العنوان", en: "Title" },
    'admin.history.video': { fr: "Vidéo", ar: "الفيديو", en: "Video" },
    'admin.management.passingScore': { fr: "Score Requis", ar: "الدرجة المطلوبة", en: "Required Score" },
    'admin.management.generalSettings': { fr: "Paramètres Généraux", ar: "الإعدادات العامة", en: "General Settings" },
    'admin.management.generalSettingsSubtitle': { fr: "Gérez les configurations globales de la plateforme", ar: "إدارة التكوينات العامة للمنصة", en: "Manage global platform configurations" },
    'admin.management.aiSettings': { fr: "Intelligence Artificielle (Gemini API)", ar: "الذكاء الاصطناعي (Gemini API)", en: "Artificial Intelligence (Gemini API)" },
    'admin.management.aiSettingsNote': { fr: "La clé API est utilisée pour générer automatiquement des questions.", ar: "يتم استخدام مفتاح API لتوليد الأسئلة.", en: "The API key is used to generate questions." },
    'admin.management.googleGeminiKey': { fr: "Clé API Google Gemini", ar: "مفتاح Google Gemini API", en: "Google Gemini API Key" }
};

function setDeep(obj, pathStr, value) {
    const parts = pathStr.split('.');
    let curr = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        if (!curr[parts[i]]) curr[parts[i]] = {};
        curr = curr[parts[i]];
    }
    curr[parts[parts.length - 1]] = value;
}

for (const [key, trans] of Object.entries(additions)) {
    setDeep(fr, key, trans.fr);
    setDeep(en, key, trans.en);
    setDeep(ar, key, trans.ar);
}

fs.writeFileSync(frPath, JSON.stringify(fr, null, 2), 'utf8');
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(arPath, JSON.stringify(ar, null, 2), 'utf8');

console.log("Translations updated successfully!");
