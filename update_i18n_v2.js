const fs = require('fs');
const path = require('path');

const baseDir = 'c:/REACT/orientation_frontend/src/i18n';
const arPath = path.join(baseDir, 'ar.json');
const enPath = path.join(baseDir, 'en.json');
const frPath = path.join(baseDir, 'fr.json');

const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));

const additions = {
    'admin.management.generateLessonsByAI': {
        fr: "Générer des Leçons par IA",
        ar: "توليد دروس بالذكاء الاصطناعي",
        en: "Generate Lessons by AI"
    },
    'admin.management.forWhichCourse': {
        fr: "Pour quel cours ?",
        ar: "لأي كورس؟",
        en: "For which course?"
    },
    'admin.management.lessonCount': {
        fr: "Nombre de leçons",
        ar: "عدد الدروس",
        en: "Number of lessons"
    },
    'admin.management.aiLessonNote': {
        fr: "L'IA générera automatiquement le titre et le contenu de chaque leçon. Les liens vidéo seront laissés vides pour que vous puissiez les ajouter manuellement plus tard.",
        ar: "سيقوم الذكاء الاصطناعي تلقائيًا بتوليد العنوان والمحتوى لكل درس. سيتم ترك روابط الفيديو فارغة لتتمكن من إضافتها يدويًا لاحقًا.",
        en: "AI will automatically generate the title and content for each lesson. Video links will be left empty for you to add manually later."
    },
    'admin.management.generateLessons': {
        fr: "Générer les leçons",
        ar: "توليد الدروس",
        en: "Generate lessons"
    },
    'common.saveSettings': {
        fr: "Sauvegarder les paramètres",
        ar: "حفظ الإعدادات",
        en: "Save settings"
    },
    'common.searchPlaceholder': {
        fr: "...Rechercher par nom ou email",
        ar: "البحث بالاسم أو البريد الإلكتروني...",
        en: "...Search by name or email"
    }
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

console.log("Translations updated v2!");
