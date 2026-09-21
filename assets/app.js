const lessons = [
["M0.1","Choisir le test et le score cible","Comprendre IELTS vs TOEFL et définir un objectif réaliste."],
["M0.2","Diagnostic + plan de 4 semaines","Mesurer le niveau initial et transformer l'écart en plan d'action."],
["R1","Reading : lire vite et repérer l'essentiel","Skimming, scanning, structure du texte et gestion du temps."],
["R2","Reading : types de questions et pièges","Méthodes de résolution, distracteurs et vérification des preuves."],
["L1","Listening : prise de notes efficace","Noter idées, relations logiques et informations utiles sans tout écrire."],
["L2","Listening : éviter les pièges","Anticipation, reformulation, distracteurs et écoute active."],
["S1","Speaking : structurer une réponse","Construire une réponse claire avec une structure simple et adaptable."],
["S2","Speaking : fluidité, connecteurs, prononciation","Gagner en clarté sans réciter des phrases artificielles."],
["S3","Speaking : simulation chronométrée","S'entraîner sous contrainte et analyser sa performance."],
["W1","IELTS Writing Task 1","Décrire et comparer des données avec une organisation claire."],
["W2","Writing argumentatif + TOEFL","Développer une idée, justifier et respecter la tâche demandée."],
["W3","Grammar : erreurs fréquentes des francophones","Corriger les erreurs qui réduisent la précision et la lisibilité."],
["W4","Academic Vocabulary","Construire un vocabulaire utile, réutilisable et mémorisable."],
["T1","Test day : stress et logistique","Préparer matériel, timing, sommeil et stratégie mentale."],
["T2","Mock test final + analyse","Faire un test blanc et transformer les erreurs en actions."],
["B1","Lettre de motivation","Relier projet, formation, impact et preuves concrètes."],
["B2","CV académique + documents","Présenter un dossier lisible, cohérent et vérifiable."],
["B3","Calendrier + erreurs fatales","Organiser les échéances et contrôler le dossier avant envoi."]
];

const quiz = [
["Pourquoi faire un diagnostic avant de choisir un plan ?",["Pour connaître l'écart entre le niveau actuel et le score cible","Pour éviter toute pratique","Pour choisir une université au hasard"],0],
["Quelle information est la plus importante dans une prise de notes efficace ?",["Chaque mot prononcé","Les idées, relations et informations utiles","La ponctuation exacte"],1],
["Que faut-il faire face à une réponse-piège en Reading ?",["Choisir parce qu'elle contient les mêmes mots","Revenir à la preuve dans le texte","Choisir la plus longue"],1],
["Dans un dossier de bourse, une affirmation forte doit idéalement être...",["Sans preuve","Appuyée par un exemple, résultat ou document","Très longue"],1]
];

let state = JSON.parse(localStorage.getItem("scoreCibleState")||'{"done":[],"xp":0,"streak":0,"target":"7.5","test":"IELTS"}');
const save=()=>localStorage.setItem("scoreCibleState",JSON.stringify(state));
const $=id=>document.getElementById(id);

function render(){
  const pct=Math.round(state.done.length/lessons.length*100);
  $("pct").textContent=pct+"%"; $("heroPct").textContent=pct+"%";
  $("heroProgress").style.width=pct+"%"; $("xp").textContent=state.xp;
  $("done").textContent=state.done.length+"/18"; $("streak").textContent=state.streak+" jour";
  $("heroScore").textContent=(state.test||"IELTS")+" "+(state.target||"7.5");
  const next=lessons.find(x=>!state.done.includes(x[0]));
  $("nextLesson").textContent=next?next[0]:"Terminé";
  $("lessons").innerHTML=lessons.map((l,i)=>{
    const done=state.done.includes(l[0]);
    return `<article class="lesson ${done?'done':''}">
      <div class="lesson-top"><span class="lesson-id">${l[0]}</span><span>${done?'✓':'+'+(25+i%3*5)+' XP'}</span></div>
      <h3>${l[1]}</h3><p>${l[2]}</p>
      <button class="${done?'secondary':'primary'}" onclick="toggleLesson('${l[0]}')">${done?'Revoir / annuler':'Marquer comme terminée'}</button>
    </article>`;
  }).join("");
}
function toggleLesson(id){
  if(state.done.includes(id)){state.done=state.done.filter(x=>x!==id);state.xp=Math.max(0,state.xp-25)}
  else {state.done.push(id);state.xp+=25;state.streak=Math.max(1,state.streak)}
  save();render();
}
function coachReply(skill){
 const texts={
  reading:"Commence par la structure : titre, paragraphes, idée principale et mots de liaison. Ensuite seulement cherche les preuves nécessaires à la question.",
  listening:"Ne tente pas de transcrire. Note les idées, les changements de direction, les exemples et les mots qui signalent une relation logique.",
  speaking:"Utilise une structure en 3 temps : réponse directe → raison/exemple → conclusion courte. Chronomètre-toi puis réécoute une seule fois.",
  writing:"Avant d'écrire, définis ta thèse, deux idées principales et les exemples qui les soutiennent. La clarté passe avant les formulations compliquées."
 };
 $("coachAnswer").textContent=texts[skill];
}
window.coachReply=coachReply; window.toggleLesson=toggleLesson;

$("saveDiag").onclick=()=>{
 state.test=$("test").value; state.target=$("target").value||"7.5"; save();
 $("diagResult").classList.remove("hidden");
 $("diagResult").innerHTML=`<strong>Plan créé.</strong> Objectif ${state.test} ${state.target}. Commence par M0.1 puis M0.2. Si ton niveau et ton score cible sont éloignés, le plan doit augmenter progressivement l'intensité plutôt que promettre un résultat automatique.`;
 render();
};
$("resetBtn").onclick=()=>{if(confirm("Réinitialiser la progression ?")){localStorage.removeItem("scoreCibleState");location.reload()}};
$("newRule").onclick=()=>{
 const rules=["Une erreur analysée vaut mieux que dix réponses faites mécaniquement.","Chronomètre une partie de l'entraînement, pas tout ton apprentissage.","Une bonne réponse doit être justifiable, pas seulement intuitive.","Travaille la compétence la plus faible sans abandonner les autres."];
 $("rule").textContent=rules[Math.floor(Math.random()*rules.length)];
};
$("quiz").innerHTML=quiz.map((q,i)=>`<div class="quiz-item"><h3>${i+1}. ${q[0]}</h3>${q[1].map((o,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${o}</label>`).join("")}</div>`).join("");
$("checkQuiz").onclick=()=>{
 let score=0;
 quiz.forEach((q,i)=>{const a=document.querySelector(`input[name="q${i}"]:checked`);if(a&&+a.value===q[2])score++});
 $("quizResult").classList.remove("hidden");
 $("quizResult").textContent=`Résultat : ${score}/${quiz.length}. ${score===quiz.length?"Excellent : toutes les réponses sont correctes.":"Analyse les questions ratées, puis refais le quiz après la leçon correspondante."}`;
 if(score===quiz.length){state.xp+=50;save();render();}
};
document.querySelectorAll(".week").forEach(x=>x.addEventListener("change",()=>{if(x.checked){state.xp+=5;save();render()}}));
render();
