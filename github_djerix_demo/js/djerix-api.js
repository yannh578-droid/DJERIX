(function(){
  const candidates = ['', 'http://localhost:3000'];

  function demoResponse(path, body){
    const text = String(body?.text || body?.messages?.at?.(-1)?.content || '').trim();
    const action = body?.action || '';
    if(path === '/api/chat'){
      const lower = text.toLowerCase();
      if(lower.includes('python')) return {reply:'Mode démonstration DJERIX : pour apprendre Python, commence par les variables, conditions, boucles, fonctions puis construis un petit projet. Je peux ensuite te guider étape par étape.'};
      if(lower.includes('projet')) return {reply:'Mode démonstration DJERIX : une idée de projet pourrait être une plateforme intelligente qui aide les étudiants à organiser leurs cours, réviser et suivre leurs objectifs.'};
      if(lower.includes('intelligence artificielle') || lower.includes('ia')) return {reply:'Mode démonstration DJERIX : l’intelligence artificielle regroupe des techniques permettant à des systèmes informatiques d’analyser des informations, reconnaître des modèles et produire des résultats utiles.'};
      return {reply:`Mode démonstration DJERIX : j’ai bien reçu « ${text} ». La connexion à l’IA réelle sera activée lorsque le serveur DJERIX et un crédit API seront disponibles.`};
    }
    if(path === '/api/writing'){
      if(action === 'summarize') return {reply:`Résumé de démonstration : ${text.length > 220 ? text.slice(0,217)+'…' : text}`};
      if(action === 'correct') return {reply:text.replace(/\s+/g,' ').replace(/\bi\b/g,'I').trim()};
      return {reply:`Version améliorée de démonstration : ${text}`};
    }
    if(path === '/api/translate'){
      const target = body?.target;
      const dictionary = target === 'en' ? {
        'bonjour':'hello','merci':'thank you','au revoir':'goodbye','comment allez-vous':'how are you','je suis':'i am','je m’appelle':'my name is','bienvenue':'welcome','projet':'project','technologie':'technology','intelligence artificielle':'artificial intelligence'
      } : {
        'hello':'bonjour','thank you':'merci','goodbye':'au revoir','how are you':'comment allez-vous','i am':'je suis','my name is':'je m’appelle','welcome':'bienvenue','project':'projet','technology':'technologie','artificial intelligence':'intelligence artificielle'
      };
      let out=text;
      for(const [a,b] of Object.entries(dictionary)) out=out.replace(new RegExp(a,'gi'),b);
      return {reply:out === text ? `[Démo ${target === 'en' ? 'EN' : 'FR'}] ${text}` : out};
    }
    return {reply:'Mode démonstration DJERIX.'};
  }

  async function request(path, options={}){
    let lastError;
    for(const base of candidates){
      try{
        const r = await fetch(base + path, options);
        const text = await r.text();
        let data;
        try{ data = JSON.parse(text); }catch{ data = {error:text || 'Réponse invalide du serveur.'}; }
        if(!r.ok) throw new Error(data.error || `Erreur ${r.status}`);
        return data;
      }catch(e){ lastError=e; }
    }
    let body={};
    try{ body = options.body ? JSON.parse(options.body) : {}; }catch{}
    console.info('[DJERIX] Serveur indisponible → mode démonstration');
    return demoResponse(path, body);
  }

  window.DJERIX_API = {request};
})();
