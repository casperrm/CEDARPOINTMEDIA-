/* ==========================================================================
   Everyday phrases, ready in the four languages.
   They are stored locally so a tap gives the answer instantly, even offline.
   ========================================================================== */

const PHRASEBOOK = [
  {
    id: "greetings",
    label: "👋 Greetings",
    items: [
      { en: "Hello",                         ar: "مرحبا",                     zh: "你好",            fr: "Bonjour" },
      { en: "Good morning",                  ar: "صباح الخير",                zh: "早上好",          fr: "Bonjour" },
      { en: "Good evening",                  ar: "مساء الخير",                zh: "晚上好",          fr: "Bonsoir" },
      { en: "How are you?",                  ar: "كيف حالك؟",                 zh: "你好吗？",        fr: "Comment ça va ?" },
      { en: "I am fine, thank you",          ar: "أنا بخير، شكرا",            zh: "我很好，谢谢",     fr: "Ça va bien, merci" },
      { en: "Please",                        ar: "من فضلك",                   zh: "请",              fr: "S'il vous plaît" },
      { en: "Thank you very much",           ar: "شكرا جزيلا",                zh: "非常感谢",        fr: "Merci beaucoup" },
      { en: "You are welcome",               ar: "عفوا",                      zh: "不客气",          fr: "De rien" },
      { en: "Excuse me",                     ar: "لو سمحت",                   zh: "打扰一下",        fr: "Excusez-moi" },
      { en: "I am sorry",                    ar: "أنا آسف",                   zh: "对不起",          fr: "Je suis désolé" },
      { en: "Goodbye",                       ar: "مع السلامة",                zh: "再见",            fr: "Au revoir" },
      { en: "My name is…",                   ar: "اسمي…",                     zh: "我叫…",           fr: "Je m'appelle…" },
      { en: "Nice to meet you",              ar: "تشرفنا",                    zh: "很高兴认识你",     fr: "Enchanté" },
      { en: "Yes / No",                      ar: "نعم / لا",                  zh: "是 / 不是",        fr: "Oui / Non" },
      { en: "I do not understand",           ar: "أنا لا أفهم",               zh: "我不明白",        fr: "Je ne comprends pas" },
      { en: "Do you speak English?",         ar: "هل تتكلم الإنجليزية؟",      zh: "你会说英语吗？",   fr: "Parlez-vous anglais ?" },
      { en: "Could you repeat, please?",     ar: "هل يمكنك الإعادة من فضلك؟", zh: "请再说一遍",       fr: "Pouvez-vous répéter, s'il vous plaît ?" },
      { en: "Please speak slowly",           ar: "تكلم ببطء من فضلك",         zh: "请说慢一点",       fr: "Parlez lentement, s'il vous plaît" }
    ]
  },
  {
    id: "out",
    label: "🛍️ Shopping & money",
    items: [
      { en: "How much is this?",             ar: "كم سعر هذا؟",               zh: "这个多少钱？",     fr: "Combien ça coûte ?" },
      { en: "That is too expensive",         ar: "هذا غالي جدا",              zh: "太贵了",          fr: "C'est trop cher" },
      { en: "Can you lower the price?",      ar: "هل يمكن تخفيض السعر؟",      zh: "可以便宜一点吗？",  fr: "Pouvez-vous baisser le prix ?" },
      { en: "I will take it",                ar: "سآخذه",                     zh: "我要这个",        fr: "Je le prends" },
      { en: "Do you accept cards?",          ar: "هل تقبلون البطاقة؟",        zh: "可以刷卡吗？",     fr: "Acceptez-vous la carte ?" },
      { en: "I am just looking",             ar: "أنا أتفرج فقط",             zh: "我只是看看",       fr: "Je regarde seulement" },
      { en: "Where is the market?",          ar: "أين السوق؟",                zh: "市场在哪里？",     fr: "Où est le marché ?" },
      { en: "A receipt, please",             ar: "الفاتورة من فضلك",          zh: "请给我收据",       fr: "Un reçu, s'il vous plaît" },
      { en: "Do you have a smaller size?",   ar: "هل عندكم قياس أصغر؟",       zh: "有小一点的尺码吗？", fr: "Avez-vous une taille plus petite ?" }
    ]
  },
  {
    id: "food",
    label: "🍽️ Restaurant",
    items: [
      { en: "The menu, please",              ar: "القائمة من فضلك",           zh: "请给我菜单",       fr: "La carte, s'il vous plaît" },
      { en: "I would like…",                 ar: "أريد…",                     zh: "我想要…",          fr: "Je voudrais…" },
      { en: "A glass of water, please",      ar: "كأس ماء من فضلك",           zh: "请来一杯水",       fr: "Un verre d'eau, s'il vous plaît" },
      { en: "A coffee with milk",            ar: "قهوة بالحليب",              zh: "一杯加奶咖啡",     fr: "Un café au lait" },
      { en: "Without pork, please",          ar: "بدون لحم خنزير من فضلك",    zh: "请不要猪肉",       fr: "Sans porc, s'il vous plaît" },
      { en: "Is this halal?",                ar: "هل هذا حلال؟",              zh: "这是清真的吗？",    fr: "Est-ce que c'est halal ?" },
      { en: "I am allergic to…",             ar: "عندي حساسية من…",           zh: "我对…过敏",        fr: "Je suis allergique à…" },
      { en: "The bill, please",              ar: "الحساب من فضلك",            zh: "请买单",          fr: "L'addition, s'il vous plaît" },
      { en: "It was delicious",              ar: "كان لذيذا",                 zh: "很好吃",          fr: "C'était délicieux" }
    ]
  },
  {
    id: "move",
    label: "🚕 Taxi & directions",
    items: [
      { en: "Where is…?",                    ar: "أين…؟",                     zh: "…在哪里？",        fr: "Où est… ?" },
      { en: "Take me to this address",       ar: "خذني إلى هذا العنوان",      zh: "请带我去这个地址",  fr: "Emmenez-moi à cette adresse" },
      { en: "How much to go there?",         ar: "كم الأجرة إلى هناك؟",       zh: "去那里多少钱？",    fr: "Combien pour y aller ?" },
      { en: "Stop here, please",             ar: "قف هنا من فضلك",            zh: "请在这里停车",     fr: "Arrêtez-vous ici, s'il vous plaît" },
      { en: "Turn right / left",             ar: "انعطف يمينا / يسارا",       zh: "右转 / 左转",      fr: "Tournez à droite / à gauche" },
      { en: "Go straight ahead",             ar: "امش على طول",               zh: "一直走",          fr: "Allez tout droit" },
      { en: "I am lost",                     ar: "أنا تائه",                  zh: "我迷路了",         fr: "Je suis perdu" },
      { en: "How far is it?",                ar: "كم تبعد المسافة؟",          zh: "有多远？",         fr: "C'est à quelle distance ?" },
      { en: "Is there a bus to…?",           ar: "هل يوجد باص إلى…؟",         zh: "有去…的公交车吗？",  fr: "Y a-t-il un bus pour… ?" }
    ]
  },
  {
    id: "health",
    label: "🏥 Health & urgent",
    items: [
      { en: "Help!",                         ar: "النجدة!",                   zh: "救命！",          fr: "Au secours !" },
      { en: "Please call a doctor",          ar: "اتصل بطبيب من فضلك",        zh: "请叫医生",        fr: "Appelez un médecin, s'il vous plaît" },
      { en: "Please call the police",        ar: "اتصل بالشرطة من فضلك",      zh: "请叫警察",        fr: "Appelez la police, s'il vous plaît" },
      { en: "I am sick",                     ar: "أنا مريض",                  zh: "我生病了",        fr: "Je suis malade" },
      { en: "It hurts here",                 ar: "يؤلمني هنا",                zh: "这里疼",          fr: "J'ai mal ici" },
      { en: "I need a pharmacy",             ar: "أحتاج صيدلية",              zh: "我需要药店",       fr: "J'ai besoin d'une pharmacie" },
      { en: "I have a fever",                ar: "عندي حرارة",                zh: "我发烧了",        fr: "J'ai de la fièvre" },
      { en: "I take this medicine",          ar: "أنا آخذ هذا الدواء",        zh: "我在吃这个药",     fr: "Je prends ce médicament" }
    ]
  },
  {
    id: "work",
    label: "💼 Work & the day",
    items: [
      { en: "Can we meet tomorrow?",         ar: "هل يمكن أن نلتقي غدا؟",     zh: "我们明天可以见面吗？", fr: "Pouvons-nous nous voir demain ?" },
      { en: "At what time?",                 ar: "على أي ساعة؟",              zh: "几点？",          fr: "À quelle heure ?" },
      { en: "I am on my way",                ar: "أنا في الطريق",             zh: "我在路上",        fr: "Je suis en route" },
      { en: "I will be a little late",       ar: "سأتأخر قليلا",              zh: "我会迟到一点",     fr: "Je vais être un peu en retard" },
      { en: "Send me a message",             ar: "أرسل لي رسالة",             zh: "给我发个消息",     fr: "Envoyez-moi un message" },
      { en: "Let us talk later",             ar: "نتكلم لاحقا",               zh: "我们晚点聊",       fr: "On se parle plus tard" },
      { en: "No problem",                    ar: "لا مشكلة",                  zh: "没问题",          fr: "Pas de problème" },
      { en: "Wait a moment, please",         ar: "انتظر لحظة من فضلك",        zh: "请等一下",        fr: "Attendez un instant, s'il vous plaît" },
      { en: "I agree",                       ar: "أنا موافق",                 zh: "我同意",          fr: "Je suis d'accord" },
      { en: "Can you help me?",              ar: "هل يمكنك مساعدتي؟",         zh: "你能帮我吗？",     fr: "Pouvez-vous m'aider ?" }
    ]
  }
];
