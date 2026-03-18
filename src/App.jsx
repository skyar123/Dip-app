import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════

const POWER_WORDS = ["more","mine","off","up","out","mama","daddy","all gone","bye-bye","nose","stop","broken","dirty","hot","open","go","push"];

const VOCAB_CATEGORIES = {
  power:      { label:"Power Words",      icon:"⚡", color:"#FF6B6B", desc:"EMT core words" },
  existence:  { label:"Existence",        icon:"👋", color:"#6C63FF", desc:"People, things, naming" },
  nonexistence:{ label:"Non-existence",   icon:"🫥", color:"#7C5CFC", desc:"All gone, no more" },
  recurrence: { label:"Recurrence",       icon:"🔄", color:"#E040A0", desc:"More, again, another" },
  reject:     { label:"Reject / Denial",  icon:"🚫", color:"#FF6B6B", desc:"No" },
  attribution:{ label:"Attribution",      icon:"🏷️", color:"#F59E0B", desc:"Describing qualities" },
  possession: { label:"Possession",       icon:"🤲", color:"#00D4AA", desc:"Mine, yours" },
  action:     { label:"Action",           icon:"🏃", color:"#6C63FF", desc:"Verbs" },
  locaction:  { label:"Location Action",  icon:"📍", color:"#E040A0", desc:"Movement" },
  l2l:        { label:"Learning to Listen",icon:"👂", color:"#B24BF3", desc:"Sound-object associations" },
};

const WORDS = {
  existence: ["name","mama","daddy","me","you","baby","cookie","juice","water","milk","cup","dress","pants","hat","shoe","sock","eye","nose","mouth","face","hair","hi","bye-bye","dog","cow","bird","fish","ball","fight","car","boat","bed","bathroom","home/house","truck","airplane","spoon","box","chair","floor","table","desk","book","door","block","crayon","night-night","picture","hook","bucket","wall","hearing aid"],
  nonexistence: ["all gone","no more"],
  recurrence: ["more","another","again"],
  reject: ["no"],
  attribution: ["dirty","broken","hot","soft","big","heavy","little","new","funny"],
  possession: ["mine"],
  action: ["wash","wait","stop","eat","open","help","say/talk","show me","touch","turn","drink","color","cut","sleep","ride","draw","hold","do","stand up"],
  locaction: ["in","on","come","sit","go","throw","give","push","run","up","down","jump","under","ride","pick up","get","hang","find","hide"],
  l2l: [
    { word:"ahhh",          object:"airplane",       emoji:"✈️", sound:"ahhh ↗",       ling:"ah",  bg:"linear-gradient(145deg,#4FC3F7,#0277BD)" },
    { word:"mooo",          object:"cow",            emoji:"🐄", sound:"mooooo",        ling:"oo",  bg:"linear-gradient(145deg,#81C784,#2E7D32)" },
    { word:"ummmm",         object:"yummy",          emoji:"😋", sound:"mmmmm",         ling:"m",   bg:"linear-gradient(145deg,#FFB74D,#E65100)" },
    { word:"tongue click",  object:"horse",          emoji:"🐴", sound:"click click",   ling:null,  bg:"linear-gradient(145deg,#A1887F,#4E342E)" },
    { word:"meow",          object:"cat",            emoji:"🐱", sound:"mee-oww",       ling:"ee",  bg:"linear-gradient(145deg,#F48FB1,#AD1457)" },
    { word:"woof",          object:"dog",            emoji:"🐶", sound:"woof woof!",    ling:null,  bg:"linear-gradient(145deg,#FFCC02,#F57F17)" },
    { word:"oink oink",     object:"pig",            emoji:"🐷", sound:"oink oink!",    ling:null,  bg:"linear-gradient(145deg,#F48FB1,#C62828)" },
    { word:"p p p",         object:"boat",           emoji:"⛵", sound:"p-p-p-p",       ling:null,  bg:"linear-gradient(145deg,#4DD0E1,#00838F)" },
    { word:"brrr beep beep",object:"car",            emoji:"🚗", sound:"brrr beep!",    ling:null,  bg:"linear-gradient(145deg,#EF5350,#B71C1C)" },
    { word:"choo-choo",     object:"train",          emoji:"🚂", sound:"choo choo!",    ling:"oo",  bg:"linear-gradient(145deg,#78909C,#263238)" },
    { word:"baaaa",         object:"sheep",          emoji:"🐑", sound:"baaaaaaa",      ling:"ah",  bg:"linear-gradient(145deg,#CFD8DC,#546E7A)" },
    { word:"quack-quack",   object:"duck",           emoji:"🦆", sound:"quack quack!",  ling:null,  bg:"linear-gradient(145deg,#FFF176,#F9A825)" },
    { word:"hi",            object:"mirror",         emoji:"🪞", sound:"hiiii!",        ling:"ee",  bg:"linear-gradient(145deg,#CE93D8,#6A1B9A)" },
    { word:"hahaha",        object:"clown",          emoji:"🤡", sound:"ha ha ha!",     ling:"ah",  bg:"linear-gradient(145deg,#FF8A65,#BF360C)" },
    { word:"sssss",         object:"snake",          emoji:"🐍", sound:"sssssss",       ling:"s",   bg:"linear-gradient(145deg,#A5D6A7,#1B5E20)" },
    { word:"shhhh",         object:"baby sleeping",  emoji:"😴", sound:"shhhhhh",       ling:"sh",  bg:"linear-gradient(145deg,#90CAF9,#1565C0)" },
    { word:"round-round",   object:"top",            emoji:"🌀", sound:"round and round!",ling:null, bg:"linear-gradient(145deg,#B39DDB,#4527A0)" },
    { word:"weeeee",        object:"slide",          emoji:"🛝", sound:"wheeeee!",      ling:"ee",  bg:"linear-gradient(145deg,#80DEEA,#00838F)" },
    { word:"b b b b",       object:"bus",            emoji:"🚌", sound:"b-b-b-b",       ling:null,  bg:"linear-gradient(145deg,#FFD54F,#FF6F00)" },
    { word:"hop-hop",       object:"bunny",          emoji:"🐰", sound:"hop hop hop!",  ling:null,  bg:"linear-gradient(145deg,#F8BBD9,#880E4F)" },
    { word:"t-t-t-t-t",     object:"clock",          emoji:"🕐", sound:"tick tock",     ling:null,  bg:"linear-gradient(145deg,#BCAAA4,#3E2723)" },
    { word:"ooooo",         object:"siren",          emoji:"🚨", sound:"ooooOOOO",      ling:"oo",  bg:"linear-gradient(145deg,#EF9A9A,#B71C1C)" },
    { word:"squeak",        object:"mouse",          emoji:"🐭", sound:"eee eee!",      ling:"ee",  bg:"linear-gradient(145deg,#BDBDBD,#424242)" },
    { word:"tweet-tweet",   object:"bird",           emoji:"🐦", sound:"tweet tweet!",  ling:"ee",  bg:"linear-gradient(145deg,#80CBC4,#004D40)" },
    { word:"woo-woo",       object:"owl",            emoji:"🦉", sound:"woo wooo",      ling:"oo",  bg:"linear-gradient(145deg,#8D6E63,#3E2723)" },
    { word:"ch-ch-ch",      object:"toothbrush",     emoji:"🪥", sound:"ch-ch-ch",      ling:"sh",  bg:"linear-gradient(145deg,#80DEEA,#006064)" },
    { word:"bring-bring",   object:"phone",          emoji:"📞", sound:"brring!",       ling:null,  bg:"linear-gradient(145deg,#A5D6A7,#2E7D32)" },
    { word:"grrrrr",        object:"bear",           emoji:"🐻", sound:"grrrrrr!",      ling:null,  bg:"linear-gradient(145deg,#BCAAA4,#4E342E)" },
    { word:"buk-buk",       object:"chicken",        emoji:"🐔", sound:"buk buk!",      ling:null,  bg:"linear-gradient(145deg,#FFF9C4,#F57F17)" },
    { word:"he-he-he",      object:"witch",          emoji:"🧙‍♀️",sound:"he he he!",     ling:"ee",  bg:"linear-gradient(145deg,#CE93D8,#1A237E)" },
    { word:"swish-swish",   object:"fish",           emoji:"🐟", sound:"swish swish",   ling:"sh",  bg:"linear-gradient(145deg,#4FC3F7,#01579B)" },
    { word:"caw-caw",       object:"crow",           emoji:"🐦‍⬛",sound:"caw! caw!",      ling:"ah",  bg:"linear-gradient(145deg,#757575,#212121)" },
    { word:"ee-ee-ee",      object:"monkey",         emoji:"🐵", sound:"ee ee ee!",     ling:"ee",  bg:"linear-gradient(145deg,#FFCC80,#E65100)" },
    { word:"cockadoodledoo",object:"rooster",        emoji:"🐓", sound:"cockadoodledoo!",ling:"oo", bg:"linear-gradient(145deg,#EF9A9A,#4A148C)" },
  ],
};

const DIP_META = {
  D:{ label:"Duration",  tagline:"Long vs. Short", color:"#6C63FF", icon:"⏱", gradient:"linear-gradient(135deg,#6C63FF,#B24BF3)" },
  I:{ label:"Intensity", tagline:"Loud vs. Soft",  color:"#E040A0", icon:"💪", gradient:"linear-gradient(135deg,#E040A0,#FF6B6B)" },
  P:{ label:"Pitch",     tagline:"High vs. Low",   color:"#00D4AA", icon:"🎵", gradient:"linear-gradient(135deg,#00D4AA,#6C63FF)" },
};

const LING_MAP = {
  ah:{phoneme:"/ah/",color:"#6C63FF"}, oo:{phoneme:"/oo/",color:"#E040A0"},
  ee:{phoneme:"/ee/",color:"#00D4AA"}, sh:{phoneme:"/sh/",color:"#7C5CFC"},
  s:{phoneme:"/s/",color:"#FF6B6B"},   m:{phoneme:"/m/",color:"#F59E0B"},
};

const VOWEL_META = {
  ah:{ phoneme:"/ah/", label:"AH", color:"#6C63FF", gradient:"linear-gradient(135deg,#6C63FF,#B24BF3)", desc:"Jaw drops open", tip:"Like 'ahh' at the doctor — low and open", mouth:"😮" },
  oo:{ phoneme:"/oo/", label:"OO", color:"#E040A0", gradient:"linear-gradient(135deg,#E040A0,#FF6B6B)", desc:"Lips make an O",   tip:"Round lips like blowing a kiss",          mouth:"😯" },
  ee:{ phoneme:"/ee/", label:"EE", color:"#00D4AA", gradient:"linear-gradient(135deg,#00D4AA,#6C63FF)", desc:"Lips spread wide", tip:"Big smile — pull corners back",            mouth:"😁" },
};

const DIP_TIPS = {
  D:{ why:"The brain learns to track sound events over time. Long-vs-short contrast builds temporal processing — critical for word boundaries.", cues:["Hold LONG sounds 2+ full seconds","Cut SHORT sounds sharp under half a second","10× difference is the goal — really exaggerate"], phrase:"Loooooong one... short! Looooong... short!" },
  I:{ why:"Volume contrast activates different hair cells in the cochlea. The jump from soft→loud is a salient acoustic event.", cues:["Whisper until barely audible — make them lean in","Then hit FULL voice — no half measures","The surprise factor is the neural hook"], phrase:"Quiet now... LOUD! Quiet... LOUD!" },
  P:{ why:"Pitch is mapped tonotopically in the cochlea. High-vs-low teaches frequency discrimination across the cochlea.", cues:["Go as high as you can — squeaky cartoon voice","Go as low as you can — rumbling giant","Use rising pitch as a question ↗, falling as a statement ↘"], phrase:"High voice? ↗  Low voice↘.  High? ↗  Low↘." },
};

const L2L_DIP = {};
WORDS.l2l.forEach(s => {
  L2L_DIP[s.word] = {
    D:`Long: stretch "${s.sound}" as loooong as you can. Short: quick pulsed "${s.word}! ${s.word}!" The contrast teaches duration.`,
    I:`Soft: whisper the ${s.object} sound barely audible. Loud: full voice "${s.sound.toUpperCase()}" with energy.`,
    P:`Low: deep voice ${s.object} sound. High: squeaky excited version. Question "${s.word}↗?" vs statement "${s.word}↘".`,
  };
});

const L2L_SONGS = {"ahhh":["Twinkle Twinkle","Baa Baa Black Sheep","Row Your Boat","Wheels on the Bus"],"mooo":["Old MacDonald (cow)","Farmer in the Dell"],"ummmm":["Muffin Man","Mary Had a Lamb","Hum any lullaby"],"tongue click":["Horsey Horsey","Ride a Cock-Horse"],"meow":["Three Little Kittens","Soft Kitty"],"woof":["How Much Is That Doggy","Bingo","Old MacDonald (dog)"],"oink oink":["Old MacDonald (pig)","This Little Piggy"],"p p p":["Row Your Boat","Rub-a-Dub-Dub"],"brrr beep beep":["Wheels on the Bus (horn)","Driving in My Car"],"choo-choo":["Down by the Station","I've Been Working on the Railroad"],"baaaa":["Baa Baa Black Sheep","Mary Had a Little Lamb"],"quack-quack":["Five Little Ducks","Six Little Ducks"],"hi":["Hello Song","Where Is Thumbkin"],"hahaha":["If You're Happy and You Know It","Ha Ha This-A-Way"],"sssss":["Sally the Camel","See Saw Margery Daw"],"shhhh":["Hush Little Baby","Rock-a-bye Baby"],"round-round":["Ring Around the Rosie","Round and Round the Garden"],"weeeee":["Jack and Jill","London Bridge"],"b b b b":["Wheels on the Bus"],"hop-hop":["Little Bunny Foo Foo","Hop Little Bunnies"],"t-t-t-t-t":["Hickory Dickory Dock","My Grandfather's Clock"],"ooooo":["Do Your Ears Hang Low","Five Little Monkeys"],"squeak":["Hickory Dickory Dock","Three Blind Mice"],"tweet-tweet":["Two Little Blackbirds","Rockin' Robin"],"woo-woo":["A Wise Old Owl","Five Little Owls"],"ch-ch-ch":["Brush Our Teeth song"],"bring-bring":["Banana Phone"],"grrrrr":["Going on a Bear Hunt","Bear Went Over the Mountain"],"buk-buk":["Old MacDonald (chicken)"],"he-he-he":["Five Little Pumpkins"],"swish-swish":["Once I Caught a Fish","Baby Shark"],"caw-caw":["Two Little Blackbirds"],"ee-ee-ee":["Five Little Monkeys"],"cockadoodledoo":["Old MacDonald (rooster)"]};
const L2L_TOYS = {"ahhh":["Toy airplane","Bowl (rolling)","Ball","Bubbles"],"mooo":["Toy cow","Farm set","Cow puppet"],"ummmm":["Play food","Snacks","Microphone toy"],"tongue click":["Toy horse","Stick horse"],"meow":["Toy cat","Cat puppet"],"woof":["Toy dog","Dog puppet"],"oink oink":["Toy pig","Farm set"],"p p p":["Toy boat","Bath boat"],"brrr beep beep":["Toy car","Car ramp"],"choo-choo":["Toy train","Train track"],"baaaa":["Toy sheep","Farm set"],"quack-quack":["Rubber duck","Bath ducks"],"hi":["Mirror","Puppet","Family photos"],"hahaha":["Funny puppet","Jack-in-the-box"],"sssss":["Toy snake","Balloon"],"shhhh":["Baby doll + blanket","Rain stick"],"round-round":["Spinning top","Pinwheel"],"weeeee":["Slide","Ramp + car"],"b b b b":["Toy bus"],"hop-hop":["Toy bunny","Bunny puppet"],"t-t-t-t-t":["Toy clock","Timer"],"ooooo":["Fire truck toy","Siren toy"],"squeak":["Toy mouse","Squeaky toy"],"tweet-tweet":["Toy bird","Bird puppet"],"woo-woo":["Toy owl","Owl puppet"],"ch-ch-ch":["Toy toothbrush"],"bring-bring":["Toy phone"],"grrrrr":["Toy bear","Bear puppet"],"buk-buk":["Toy chicken"],"he-he-he":["Witch puppet"],"swish-swish":["Toy fish","Bath fish"],"caw-caw":["Toy bird"],"ee-ee-ee":["Toy monkey","Monkey puppet"],"cockadoodledoo":["Toy rooster"]};

const STAGES = [
  {key:"I",label:"Input",color:"#6C63FF"},
  {key:"C",label:"Comprehension",color:"#E040A0"},
  {key:"Im",label:"Imitation",color:"#00D4AA"},
  {key:"U",label:"Use",color:"#F59E0B"},
];

const GAMES = [
  { id:"peekaboo",   name:"Sound Peek-a-Boo", icon:"🙈", color:"#E040A0", gradient:"linear-gradient(135deg,#E040A0,#B24BF3)", desc:"Hide, make the sound, reveal!" },
  { id:"dipdice",    name:"DIP Dice",          icon:"🎲", color:"#6C63FF", gradient:"linear-gradient(135deg,#6C63FF,#00D4AA)", desc:"Roll a random sound + DIP challenge" },
  { id:"safari",     name:"Sound Safari",      icon:"🦁", color:"#F59E0B", gradient:"linear-gradient(135deg,#F59E0B,#FF6B6B)", desc:"Scavenger hunt through 5 sounds" },
  { id:"contrast",   name:"Contrast Showdown", icon:"⚡", color:"#00D4AA", gradient:"linear-gradient(135deg,#00D4AA,#6C63FF)", desc:"Two sounds — make them DIFFERENT" },
  { id:"storychain", name:"Story Chain",        icon:"📖", color:"#B24BF3", gradient:"linear-gradient(135deg,#B24BF3,#E040A0)", desc:"Build a tiny story from 3 sounds" },
];

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const pick = arr => arr[Math.floor(Math.random()*arr.length)];
const pickN = (arr,n) => { const c=[...arr],r=[]; for(let i=0;i<Math.min(n,c.length);i++){const x=Math.floor(Math.random()*c.length);r.push(c.splice(x,1)[0]);}return r; };
const pickDip = () => pick(["D","I","P"]);

// ═══════════════════════════════════════════════════════════════
// VIZ
// ═══════════════════════════════════════════════════════════════

const DurationViz = () => {
  const [p,setP]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setP(v=>(v+1)%4),800);return()=>clearInterval(id)},[]);
  return <div style={{display:"flex",flexDirection:"column",gap:5,padding:"6px 0"}}>{[82,28,60,18].map((w,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6}}><div style={{fontSize:8,color:"rgba(255,255,255,0.3)",width:26,textAlign:"right"}}>{i%2===0?"long":"short"}</div><div style={{height:12,width:`${w}%`,borderRadius:6,background:p===i?"linear-gradient(90deg,#6C63FF,#B24BF3,#E040A0)":"rgba(255,255,255,0.08)",transition:"all 0.5s",boxShadow:p===i?"0 0 12px rgba(108,99,255,0.4)":"none"}}/></div>)}</div>;
};
const IntensityViz = () => {
  const [ls,setLs]=useState(Array(10).fill(0.3));
  useEffect(()=>{const id=setInterval(()=>setLs(Array(10).fill(0).map(()=>Math.random()*0.85+0.15)),600);return()=>clearInterval(id)},[]);
  return <div style={{display:"flex",alignItems:"flex-end",gap:2,height:36,padding:"6px 0"}}>{ls.map((l,i)=><div key={i} style={{flex:1,borderRadius:"3px 3px 0 0",height:`${l*100}%`,background:`linear-gradient(180deg,#E040A0,rgba(224,64,160,${0.3+l*0.7}))`,transition:"height 0.4s"}}/>)}</div>;
};
const PitchViz = () => {
  const [o,setO]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setO(v=>(v+2)%100),40);return()=>clearInterval(id)},[]);
  const W=180,H=32;
  const pts=Array.from({length:40},(_,i)=>{const x=(i/39)*W;const y=H/2+Math.sin(((i+o)/40)*Math.PI*3)*(H/2-3)+Math.sin(((i+o)/40)*Math.PI*6)*3;return`${x},${y}`;}).join(" ");
  return <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block",margin:"6px 0"}}><defs><linearGradient id="pv" x1="0" y1="0" x2={W} y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#00D4AA"/><stop offset="50%" stopColor="#6C63FF"/><stop offset="100%" stopColor="#E040A0"/></linearGradient></defs><polyline points={pts} fill="none" stroke="url(#pv)" strokeWidth={2} strokeLinecap="round"/></svg>;
};
const DipViz = ({dim}) => dim==="D"?<DurationViz/>:dim==="I"?<IntensityViz/>:<PitchViz/>;

// ═══════════════════════════════════════════════════════════════
// G  (glass card)
// ═══════════════════════════════════════════════════════════════

const G = ({children,style={},onClick}) => {
  const base={background:"rgba(255,255,255,0.05)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,...style};
  return onClick
    ? <button onClick={onClick} style={{...base,cursor:"pointer",fontFamily:"inherit",color:"inherit",textAlign:"left",width:"100%"}}>{children}</button>
    : <div style={base}>{children}</div>;
};


// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════

export default function App() {
  // ─── navigation ───────────────────────────────────────────
  const [activeTab, setActiveTab] = useState(0);   // 0=Play 1=Sounds 2=Learn
  const [overlay, setOverlay]     = useState(null); // l2l item for detail sheet
  const [subView, setSubView]     = useState(null); // {type:"dip"|"cat"|"game", data}
  const touchStartX = useRef(null);

  // ─── feature states ────────────────────────────────────────
  const [focusL2l, setFocusL2l]   = useState(null);
  const [vowelFocus, setVowelFocus] = useState(null);
  const [tracking, setTracking]   = useState({});
  const [logged, setLogged]       = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [l2lTab, setL2lTab]       = useState("dip");
  const [gridCols, setGridCols]   = useState(3); // 2 or 3 for sounds grid

  // ─── helpers ──────────────────────────────────────────────
  const toggleTrack = (word,stage) => setTracking(t=>({...t,[word]:{...(t[word]||{}),[stage]:!(t[word]||{})[stage]}}));
  const addLog      = entry => setLogged(l=>[...l,{...entry,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),id:Date.now()}]);
  const openOverlay = item  => { setL2lTab("dip"); setOverlay(item); };
  const closeOverlay= ()    => setOverlay(null);

  const soundPool = useMemo(()=>{
    if(focusL2l)  return WORDS.l2l.filter(s=>s.word===focusL2l.word||s.ling===focusL2l.ling);
    if(vowelFocus)return WORDS.l2l.filter(s=>s.ling===vowelFocus);
    return WORDS.l2l;
  },[focusL2l,vowelFocus]);

  // ─── swipe between tabs ───────────────────────────────────
  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = e => {
    if(touchStartX.current===null||overlay||subView) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if(Math.abs(diff)>55){
      setActiveTab(t => diff>0 ? Math.min(t+1,2) : Math.max(t-1,0));
    }
    touchStartX.current=null;
  };

  // ─── sub-view (DIP / category / game inside Learn) ────────
  const SL = {fontSize:10,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:12,paddingLeft:2};

  // ══════════════════════════════════════════════════════════
  // PLAY TAB
  // ══════════════════════════════════════════════════════════
  const renderPlayTab = () => (
    <div style={{padding:"0 16px 100px"}}>
      {/* Header */}
      <div style={{textAlign:"center",padding:"24px 0 16px"}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.25em",textTransform:"uppercase",background:"linear-gradient(90deg,#6C63FF,#E040A0,#00D4AA,#6C63FF)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 3s linear infinite",marginBottom:8}}>Remi's Listening Journey</div>
        <h1 style={{margin:"0 0 2px",fontSize:38,fontWeight:900,lineHeight:1,letterSpacing:"0.1em",background:"linear-gradient(135deg,#fff,rgba(255,255,255,0.6))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>D · I · P</h1>
        <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.3)"}}>Duration · Intensity · Pitch</p>
      </div>

      {/* Active focus banner */}
      {(focusL2l||vowelFocus)&&(
        <div style={{padding:"10px 12px",borderRadius:12,background:"rgba(178,75,243,0.1)",border:"1px solid rgba(178,75,243,0.25)",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:24}}>{focusL2l?focusL2l.emoji:VOWEL_META[vowelFocus].mouth}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:11,fontWeight:700,color:"#B24BF3"}}>{focusL2l?`Focus: ${focusL2l.word}`:`Vowel: ${VOWEL_META[vowelFocus].phoneme}`}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.35)"}}>Games are filtered to this pool</div>
          </div>
          <button onClick={()=>{setFocusL2l(null);setVowelFocus(null);}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.3)",fontSize:18,cursor:"pointer",lineHeight:1}}>×</button>
        </div>
      )}

      {/* PEEK-A-BOO — hero card */}
      <div style={{marginBottom:16}}>
        <div style={SL}>⭐ Featured</div>
        <button onClick={()=>setSubView({type:"game",data:"peekaboo"})} style={{width:"100%",padding:"24px 20px",borderRadius:20,background:"linear-gradient(135deg,#E040A0,#B24BF3,#6C63FF)",border:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"center",boxShadow:"0 8px 32px rgba(224,64,160,0.35)"}}>
          <div style={{fontSize:72,marginBottom:8,animation:"pulse 2s infinite"}}>🙈</div>
          <div style={{fontSize:24,fontWeight:900,color:"white",marginBottom:4}}>Sound Peek-a-Boo</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>Hide · Sound · Reveal · React</div>
        </button>
      </div>

      {/* Other games */}
      <div style={SL}>More Games</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
        {GAMES.filter(g=>g.id!=="peekaboo").map(g=>(
          <button key={g.id} onClick={()=>setSubView({type:"game",data:g.id})} style={{padding:"16px 12px",borderRadius:16,background:g.gradient,border:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"center",boxShadow:`0 4px 16px ${g.color}28`}}>
            <div style={{fontSize:36,marginBottom:6}}>{g.icon}</div>
            <div style={{fontSize:13,fontWeight:800,color:"white",marginBottom:2}}>{g.name}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.65)",lineHeight:1.4}}>{g.desc}</div>
          </button>
        ))}
      </div>

      {/* DIP quick-access */}
      <div style={SL}>DIP Practice</div>
      <div style={{display:"flex",gap:10,marginBottom:20}}>
        {["D","I","P"].map(d=>{const m=DIP_META[d];return(
          <button key={d} onClick={()=>setSubView({type:"dip",data:d})} style={{flex:1,aspectRatio:"1",borderRadius:"50%",background:m.gradient,border:"2px solid rgba(255,255,255,0.12)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 20px ${m.color}33`,fontFamily:"inherit"}}>
            <span style={{fontSize:20}}>{m.icon}</span>
            <span style={{fontSize:18,fontWeight:900,color:"white"}}>{d}</span>
            <span style={{fontSize:7,color:"rgba(255,255,255,0.6)"}}>{m.tagline}</span>
          </button>
        );})}
      </div>

      {/* Log preview */}
      {logged.length>0&&(
        <G style={{padding:"12px 14px"}}>
          <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>📋 Recent ({logged.length})</div>
          {logged.slice(-3).reverse().map((l,i)=>(
            <div key={l.id} style={{display:"flex",gap:7,alignItems:"center",padding:"4px 0",borderBottom:i<2?"1px solid rgba(255,255,255,0.04)":"none"}}>
              <div style={{width:18,height:18,borderRadius:4,background:DIP_META[l.dim]?.gradient||"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:900,color:"white",flexShrink:0}}>{l.dim}</div>
              <div style={{flex:1,fontSize:10,color:"rgba(255,255,255,0.55)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.label}</div>
              <div style={{fontSize:8,color:"rgba(255,255,255,0.2)",flexShrink:0}}>{l.time}</div>
            </div>
          ))}
        </G>
      )}
    </div>
  );

  // ══════════════════════════════════════════════════════════
  // SOUNDS TAB  — visual grid
  // ══════════════════════════════════════════════════════════
  const renderSoundsTab = () => {
    const q = searchQuery.toLowerCase();
    const filtered = WORDS.l2l.filter(s=>
      (!q||(s.word.includes(q)||s.object.includes(q)||s.sound.toLowerCase().includes(q))) &&
      (!vowelFocus||s.ling===vowelFocus)
    );
    return(
      <div style={{padding:"0 14px 100px"}}>
        <div style={{paddingTop:20,marginBottom:12}}>
          <div style={{fontSize:18,fontWeight:900,color:"white",marginBottom:10}}>All Sounds</div>

          {/* Search */}
          <div style={{position:"relative",marginBottom:10}}>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="🔍  Search sounds…" style={{width:"100%",padding:"10px 36px 10px 14px",borderRadius:12,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",color:"white",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
            {searchQuery&&<button onClick={()=>setSearchQuery("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:18,cursor:"pointer",lineHeight:1}}>×</button>}
          </div>

          {/* Vowel filter chips + grid size */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
            <button onClick={()=>setVowelFocus(null)} style={{padding:"5px 10px",borderRadius:8,background:!vowelFocus?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.05)",border:"none",color:!vowelFocus?"white":"rgba(255,255,255,0.35)",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>All</button>
            {Object.entries(VOWEL_META).map(([k,v])=>(
              <button key={k} onClick={()=>setVowelFocus(vowelFocus===k?null:k)} style={{padding:"5px 10px",borderRadius:8,background:vowelFocus===k?v.gradient:"rgba(255,255,255,0.05)",border:"none",color:vowelFocus===k?"white":v.color,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{v.phoneme} {v.mouth}</button>
            ))}
            <div style={{flex:1}}/>
            <button onClick={()=>setGridCols(c=>c===3?2:3)} style={{padding:"5px 10px",borderRadius:8,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.4)",fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{gridCols===3?"⊞ 2-col":"⊟ 3-col"}</button>
          </div>
        </div>

        {/* Visual grid */}
        <div style={{display:"grid",gridTemplateColumns:`repeat(${gridCols},1fr)`,gap:8}}>
          {filtered.map((s,i)=>(
            <button key={i} onClick={()=>openOverlay(s)} style={{borderRadius:16,border:"none",cursor:"pointer",fontFamily:"inherit",padding:0,overflow:"hidden",background:"none",WebkitTapHighlightColor:"transparent"}}>
              {/* photo-style card */}
              <div style={{background:s.bg,borderRadius:16,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"16px 8px 12px",minHeight:gridCols===3?120:150,position:"relative",boxShadow:"0 4px 16px rgba(0,0,0,0.3)"}}>
                {/* ling badge */}
                {s.ling&&<div style={{position:"absolute",top:6,right:6,fontSize:8,fontWeight:800,padding:"2px 5px",borderRadius:4,background:"rgba(0,0,0,0.35)",color:"white"}}>{LING_MAP[s.ling].phoneme}</div>}
                {/* focus indicator */}
                {focusL2l?.word===s.word&&<div style={{position:"absolute",top:6,left:6,width:8,height:8,borderRadius:"50%",background:"#B24BF3",boxShadow:"0 0 6px #B24BF3"}}/>}
                {/* big emoji */}
                <div style={{fontSize:gridCols===3?52:72,lineHeight:1,marginBottom:6,filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.4))"}}>{s.emoji}</div>
                <div style={{fontSize:gridCols===3?10:12,fontWeight:800,color:"white",textAlign:"center",lineHeight:1.2,textShadow:"0 1px 4px rgba(0,0,0,0.5)"}}>{s.word}</div>
                <div style={{fontSize:8,color:"rgba(255,255,255,0.65)",marginTop:2,textAlign:"center",textShadow:"0 1px 3px rgba(0,0,0,0.5)"}}>{s.object}</div>
              </div>
            </button>
          ))}
        </div>
        {filtered.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"rgba(255,255,255,0.25)",fontSize:13}}>No matches</div>}
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════
  // LEARN TAB
  // ══════════════════════════════════════════════════════════
  const renderLearnTab = () => (
    <div style={{padding:"0 16px 100px"}}>
      <div style={{paddingTop:20,marginBottom:16,fontSize:18,fontWeight:900,color:"white"}}>Learn</div>

      {/* Vowel Focus */}
      <div style={SL}>🗣 Vowel Focus</div>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {Object.entries(VOWEL_META).map(([k,v])=>{
          const active=vowelFocus===k;
          const count=WORDS.l2l.filter(s=>s.ling===k).length;
          return(
            <button key={k} onClick={()=>setVowelFocus(active?null:k)} style={{flex:1,padding:"14px 8px",borderRadius:14,background:active?v.gradient:"rgba(255,255,255,0.05)",border:active?"none":`1px solid ${v.color}33`,cursor:"pointer",fontFamily:"inherit",textAlign:"center",boxShadow:active?`0 4px 16px ${v.color}44`:"none"}}>
              <div style={{fontSize:24,marginBottom:3}}>{v.mouth}</div>
              <div style={{fontSize:16,fontWeight:900,color:active?"white":v.color}}>{v.phoneme}</div>
              <div style={{fontSize:8,color:active?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.3)",marginTop:2}}>{count} sounds</div>
            </button>
          );
        })}
      </div>
      {vowelFocus&&(
        <G style={{padding:"12px 14px",marginBottom:16,background:`linear-gradient(135deg,${VOWEL_META[vowelFocus].color}08,transparent)`}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{fontSize:28}}>{VOWEL_META[vowelFocus].mouth}</div>
            <div><div style={{fontWeight:700,fontSize:13,color:"white"}}>{VOWEL_META[vowelFocus].desc}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.45)"}}>{VOWEL_META[vowelFocus].tip}</div></div>
          </div>
        </G>
      )}

      {/* DIP */}
      <div style={SL}>DIP Dimensions</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
        {["D","I","P"].map(d=>{const m=DIP_META[d];return(
          <button key={d} onClick={()=>setSubView({type:"dip",data:d})} style={{padding:"14px 16px",borderRadius:14,background:"rgba(255,255,255,0.04)",border:`1px solid ${m.color}22`,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:m.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{m.icon}</div>
            <div style={{flex:1,textAlign:"left"}}>
              <div style={{fontSize:15,fontWeight:800,color:m.color}}>{m.label}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{m.tagline}</div>
            </div>
            <div style={{fontSize:18,color:"rgba(255,255,255,0.2)"}}>›</div>
          </button>
        );})}
      </div>

      {/* Vocabulary */}
      <div style={SL}>Vocabulary</div>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
        {Object.entries(VOCAB_CATEGORIES).map(([key,cat])=>{
          const count=key==="power"?POWER_WORDS.length:key==="l2l"?WORDS.l2l.length:(WORDS[key]||[]).length;
          return(
            <button key={key} onClick={()=>setSubView({type:"cat",data:key})} style={{padding:"10px 12px",borderRadius:12,background:"rgba(255,255,255,0.04)",border:`1px solid rgba(255,255,255,0.06)`,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:9,background:`${cat.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{cat.icon}</div>
              <div style={{flex:1,textAlign:"left"}}><div style={{fontWeight:700,fontSize:13,color:"white"}}>{cat.label}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.35)"}}>{cat.desc}</div></div>
              <div style={{fontSize:15,fontWeight:900,color:cat.color}}>{count}</div>
            </button>
          );
        })}
      </div>

      {/* Brain card */}
      <G style={{padding:"12px 14px",background:"linear-gradient(135deg,rgba(108,99,255,0.06),rgba(224,64,160,0.06),rgba(0,212,170,0.06))"}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#00D4AA",marginBottom:4}}>🧠 Remi's brain right now</div>
        <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>Every sound-object pairing, every DIP contrast, every power word is building auditory neural pathways. <strong style={{color:"rgba(255,255,255,0.85)"}}>Sound has shape — and words have meaning.</strong></p>
      </G>
    </div>
  );

  // ══════════════════════════════════════════════════════════
  // SUB-VIEWS  (DIP detail / Category / Game)
  // ══════════════════════════════════════════════════════════
  const renderSubView = () => {
    if(!subView) return null;
    const backBtn = (
      <button onClick={()=>setSubView(null)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.45)",fontSize:12,cursor:"pointer",padding:"8px 0 8px 0",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>← Back</button>
    );

    if(subView.type==="game"){
      const game=GAMES.find(g=>g.id===subView.data);if(!game)return null;
      return(
        <div style={{padding:"0 16px 100px"}}>
          <div style={{paddingTop:14}}>{backBtn}</div>
          <div style={{textAlign:"center",padding:"8px 0 16px",position:"relative"}}>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:120,height:120,borderRadius:"50%",background:`radial-gradient(circle,${game.color}22,transparent 70%)`,filter:"blur(20px)",pointerEvents:"none"}}/>
            <span style={{fontSize:44,display:"block",marginBottom:6}}>{game.icon}</span>
            <h2 style={{margin:"0 0 4px",fontSize:22,fontWeight:900,color:game.color}}>{game.name}</h2>
          </div>
          {(focusL2l||vowelFocus)&&<div style={{fontSize:10,textAlign:"center",color:"#B24BF3",marginBottom:12,fontWeight:600}}>🎯 Filtered pool active — {soundPool.length} sounds</div>}
          {subView.data==="peekaboo"&&<PeekabooGame pool={soundPool.length>=2?soundPool:WORDS.l2l} addLog={addLog}/>}
          {subView.data==="dipdice"&&<DipDiceGame pool={soundPool.length>=1?soundPool:WORDS.l2l} addLog={addLog}/>}
          {subView.data==="safari"&&<SafariGame pool={WORDS.l2l} focusPool={soundPool} addLog={addLog}/>}
          {subView.data==="contrast"&&<ContrastGame pool={WORDS.l2l} addLog={addLog}/>}
          {subView.data==="storychain"&&<StoryChainGame pool={WORDS.l2l} addLog={addLog}/>}
        </div>
      );
    }

    if(subView.type==="dip"){
      const d=subView.data; const m=DIP_META[d];
      return(
        <div style={{padding:"0 16px 100px"}}>
          <div style={{paddingTop:14}}>{backBtn}</div>
          <div style={{textAlign:"center",padding:"8px 0 16px"}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:m.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 8px",boxShadow:`0 4px 24px ${m.color}33`}}>{m.icon}</div>
            <h2 style={{margin:"0 0 2px",fontSize:22,fontWeight:900,color:m.color}}>{m.label}</h2>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{m.tagline}</div>
          </div>
          <G style={{padding:"6px 10px",marginBottom:12}}><DipViz dim={d}/></G>
          {DIP_TIPS[d]&&<G style={{padding:"14px",marginBottom:16,background:`linear-gradient(135deg,${m.color}08,transparent)`}}>
            <div style={{fontSize:9,fontWeight:700,color:m.color,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>💡 Why {m.label} matters</div>
            <p style={{margin:"0 0 10px",fontSize:11,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>{DIP_TIPS[d].why}</p>
            {DIP_TIPS[d].cues.map((c,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:4,alignItems:"flex-start"}}><div style={{width:4,height:4,borderRadius:"50%",background:m.color,marginTop:5,flexShrink:0}}/><span style={{fontSize:11,color:"rgba(255,255,255,0.55)",lineHeight:1.5}}>{c}</span></div>)}
            <div style={{marginTop:10,padding:"8px 10px",borderRadius:7,background:"rgba(255,255,255,0.04)",borderLeft:`2px solid ${m.color}`}}>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginBottom:2}}>Say it like this</div>
              <div style={{fontSize:12,fontWeight:700,color:"white",fontStyle:"italic"}}>"{DIP_TIPS[d].phrase}"</div>
            </div>
          </G>}
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)",marginBottom:10}}>{m.label} for every sound</div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {WORDS.l2l.map((s,i)=>{const dp=L2L_DIP[s.word]?.[d]||"";const isL=logged.some(l=>l.dim===d&&l.sound===s.word);return(
              <G key={i} style={{padding:"11px 13px"}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                  <div style={{width:38,height:38,borderRadius:10,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.emoji}</div>
                  <div><div style={{fontWeight:800,fontSize:13,color:s.ling?LING_MAP[s.ling]?.color:"#B24BF3"}}>{s.word}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>{s.object}</div></div>
                </div>
                <p style={{margin:"0 0 8px",fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.55}}>{dp}</p>
                <button onClick={()=>addLog({dim:d,sound:s.word,label:`${m.label} · ${s.emoji} ${s.word}`})} style={{width:"100%",padding:"7px",borderRadius:7,fontWeight:700,fontSize:10,cursor:"pointer",fontFamily:"inherit",background:isL?m.gradient:"rgba(255,255,255,0.04)",color:isL?"white":m.color,border:isL?"none":`1px solid ${m.color}22`}}>{isL?"✓ Practiced!":"Log"}</button>
              </G>
            );})}
          </div>
        </div>
      );
    }

    if(subView.type==="cat"){
      const key=subView.data; const cat=VOCAB_CATEGORIES[key]; if(!cat)return null;
      const isL2l=key==="l2l", isPower=key==="power";
      const allWords=isPower?POWER_WORDS:isL2l?WORDS.l2l:(WORDS[key]||[]);
      const q2=searchQuery.toLowerCase();
      const words=isL2l&&q2?allWords.filter(s=>s.word.includes(q2)||s.object.includes(q2)):allWords;
      return(
        <div style={{padding:"0 16px 100px"}}>
          <div style={{paddingTop:14}}>{backBtn}</div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:22}}>{cat.icon}</span><h2 style={{margin:0,fontSize:22,fontWeight:900,color:cat.color}}>{cat.label}</h2></div>
          <p style={{margin:"0 0 10px",fontSize:11,color:"rgba(255,255,255,0.35)"}}>{cat.desc} · {words.length} items</p>
          {isL2l&&<div style={{position:"relative",marginBottom:10}}>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="🔍 Filter…" style={{width:"100%",padding:"9px 36px 9px 14px",borderRadius:10,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",color:"white",fontSize:12,outline:"none",fontFamily:"inherit"}}/>
            {searchQuery&&<button onClick={()=>setSearchQuery("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:16,cursor:"pointer",lineHeight:1}}>×</button>}
          </div>}
          <div style={{display:"flex",gap:3,marginBottom:10,flexWrap:"wrap"}}>
            {STAGES.map(st=><div key={st.key} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 6px",borderRadius:5,background:"rgba(255,255,255,0.04)"}}><div style={{width:7,height:7,borderRadius:2,background:st.color}}/><span style={{fontSize:8,color:"rgba(255,255,255,0.4)",fontWeight:600}}>{st.key}={st.label}</span></div>)}
          </div>
          {!isL2l&&words.length>=2&&<button onClick={()=>setSubView({type:"vocabgame",data:key})} style={{width:"100%",padding:"14px 16px",borderRadius:14,background:`linear-gradient(135deg,${cat.color},${cat.color}99)`,border:"none",cursor:"pointer",fontFamily:"inherit",marginBottom:10,display:"flex",alignItems:"center",gap:10,boxShadow:`0 4px 20px ${cat.color}22`,WebkitTapHighlightColor:"transparent"}}>
            <span style={{fontSize:22}}>🎮</span>
            <div style={{flex:1,textAlign:"left"}}><div style={{fontSize:14,fontWeight:900,color:"white"}}>Play Listening Game</div><div style={{fontSize:10,color:"rgba(255,255,255,0.65)"}}>DIP-guided word activities</div></div>
            <span style={{fontSize:18,color:"rgba(255,255,255,0.5)"}}>›</span>
          </button>}
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {words.map((item,idx)=>{
              const word=isL2l?item.word:item; const isPW=POWER_WORDS.includes(word); const tr=tracking[word]||{};
              return(
                <G key={idx} onClick={isL2l?()=>openOverlay(item):undefined} style={{padding:"9px 11px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {isL2l&&<div style={{width:40,height:40,borderRadius:10,background:item.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{item.emoji}</div>}
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontWeight:700,fontSize:13,color:"white"}}>{isL2l?item.word:word}</span>{isPW&&<span style={{fontSize:7,fontWeight:700,padding:"1px 4px",borderRadius:3,background:"rgba(255,107,107,0.15)",color:"#FF6B6B"}}>POWER</span>}</div>
                      {isL2l&&<div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>{item.object} · {item.sound}</div>}
                    </div>
                    <div style={{display:"flex",gap:2}}>
                      {STAGES.map(st=><button key={st.key} onClick={e=>{e.stopPropagation();toggleTrack(word,st.key);}} style={{width:24,height:24,borderRadius:5,fontSize:8,fontWeight:800,cursor:"pointer",fontFamily:"inherit",background:tr[st.key]?st.color:"rgba(255,255,255,0.04)",color:tr[st.key]?"white":"rgba(255,255,255,0.2)",border:tr[st.key]?"none":"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>{st.key}</button>)}
                    </div>
                  </div>
                </G>
              );
            })}
          </div>
        </div>
      );
    }

    if(subView.type==="vocabgame"){
      const key=subView.data; const cat=VOCAB_CATEGORIES[key]; if(!cat)return null;
      const words=key==="power"?POWER_WORDS:(WORDS[key]||[]);
      return(
        <div style={{padding:"0 16px 100px"}}>
          <div style={{paddingTop:14}}>{backBtn}</div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
            <span style={{fontSize:22}}>{cat.icon}</span>
            <h2 style={{margin:0,fontSize:20,fontWeight:900,color:cat.color}}>{cat.label}</h2>
          </div>
          <VocabListenGame words={words} cat={cat} addLog={addLog}/>
        </div>
      );
    }

    return null;
  };

  // ══════════════════════════════════════════════════════════
  // DETAIL OVERLAY  (slides up)
  // ══════════════════════════════════════════════════════════
  const renderDetailOverlay = () => {
    if(!overlay) return null;
    const s=overlay; const songs=L2L_SONGS[s.word]||[]; const toys=L2L_TOYS[s.word]||[]; const dipP=L2L_DIP[s.word]||{};
    return(
      <>
        {/* Backdrop */}
        <div onClick={closeOverlay} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:200,backdropFilter:"blur(4px)"}}/>
        {/* Sheet */}
        <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:201,maxWidth:420,margin:"0 auto",borderRadius:"20px 20px 0 0",background:"#0e0e24",maxHeight:"88vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,0.6)"}}>
          {/* Hero */}
          <div style={{position:"relative",background:s.bg,borderRadius:"20px 20px 0 0",padding:"24px 20px 20px",textAlign:"center"}}>
            <button onClick={closeOverlay} style={{position:"absolute",top:14,right:14,width:28,height:28,borderRadius:"50%",background:"rgba(0,0,0,0.35)",border:"none",color:"white",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>×</button>
            <div style={{fontSize:80,lineHeight:1,marginBottom:10,filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.4))"}}>{s.emoji}</div>
            <div style={{fontSize:22,fontWeight:900,color:"white",marginBottom:4}}>{s.word}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.75)"}}>"{s.sound}"</div>
            {s.ling&&<div style={{display:"inline-block",marginTop:6,padding:"3px 10px",borderRadius:6,background:"rgba(0,0,0,0.3)",color:"white",fontSize:10,fontWeight:700}}>Ling {LING_MAP[s.ling].phoneme}</div>}
          </div>
          {/* Actions row */}
          <div style={{display:"flex",gap:8,padding:"12px 16px"}}>
            <button onClick={()=>setFocusL2l(focusL2l?.word===s.word?null:s)} style={{flex:1,padding:"10px",borderRadius:10,background:focusL2l?.word===s.word?"linear-gradient(135deg,#B24BF3,#6C63FF)":"rgba(178,75,243,0.12)",border:focusL2l?.word===s.word?"none":"1px solid rgba(178,75,243,0.25)",color:focusL2l?.word===s.word?"white":"#B24BF3",fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{focusL2l?.word===s.word?"✓ Focused":"🎯 Set Focus"}</button>
            <button onClick={()=>{setSubView({type:"game",data:"peekaboo"});closeOverlay();}} style={{flex:1,padding:"10px",borderRadius:10,background:"linear-gradient(135deg,#E040A0,#B24BF3)",border:"none",color:"white",fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>🙈 Peek-a-Boo</button>
          </div>
          {/* Tabs */}
          <div style={{display:"flex",gap:3,margin:"0 16px 12px",background:"rgba(255,255,255,0.04)",borderRadius:10,padding:3}}>
            {[{id:"dip",l:"DIP Practice",i:"🎯"},{id:"toys",l:"Toys",i:"🧸"},{id:"songs",l:"Songs",i:"🎵"}].map(t=>(
              <button key={t.id} onClick={()=>setL2lTab(t.id)} style={{flex:1,padding:"8px 4px",borderRadius:8,background:l2lTab===t.id?"rgba(255,255,255,0.08)":"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",color:l2lTab===t.id?"white":"rgba(255,255,255,0.3)",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:3}}><span style={{fontSize:11}}>{t.i}</span>{t.l}</button>
            ))}
          </div>
          {/* Tab content */}
          <div style={{padding:"0 16px 24px"}}>
            {l2lTab==="dip"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
              {["D","I","P"].map(d=>{const m=DIP_META[d];const isL=logged.some(l=>l.dim===d&&l.sound===s.word);return(
                <G key={d} style={{padding:"12px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <div style={{width:28,height:28,borderRadius:7,background:m.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>{m.icon}</div>
                    <div><div style={{fontWeight:800,fontSize:13,color:"white"}}>{m.label}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>{m.tagline}</div></div>
                  </div>
                  <div style={{background:"rgba(255,255,255,0.03)",borderRadius:8,padding:"3px 8px",marginBottom:8}}><DipViz dim={d}/></div>
                  <p style={{margin:"0 0 10px",fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.6}}>{dipP[d]}</p>
                  <button onClick={()=>addLog({dim:d,sound:s.word,label:`${m.label} · ${s.emoji} ${s.word}`})} style={{width:"100%",padding:"8px",borderRadius:8,fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"inherit",background:isL?m.gradient:"rgba(255,255,255,0.04)",color:isL?"white":m.color,border:isL?"none":`1px solid ${m.color}28`}}>{isL?"✓ Practiced!":"Log "+m.label}</button>
                </G>
              );})}
              <G style={{padding:"10px 12px"}}>
                <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5}}>Observation</div>
                <div style={{display:"flex",gap:6}}>
                  <input value={noteInput} onChange={e=>setNoteInput(e.target.value)} placeholder={`e.g. Remi turned for ${s.word}`} style={{flex:1,fontSize:11,padding:"8px 10px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,color:"white",outline:"none",fontFamily:"inherit"}} onKeyDown={e=>{if(e.key==="Enter"&&noteInput.trim()){addLog({dim:"📝",sound:s.word,label:noteInput.trim(),note:true});setNoteInput("");}}}/>
                  <button onClick={()=>{if(noteInput.trim()){addLog({dim:"📝",sound:s.word,label:noteInput.trim(),note:true});setNoteInput("");}}} style={{padding:"8px 12px",background:"linear-gradient(135deg,#6C63FF,#E040A0)",border:"none",borderRadius:8,color:"white",fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Add</button>
                </div>
              </G>
            </div>}
            {l2lTab==="toys"&&<div style={{display:"flex",flexDirection:"column",gap:5}}>{toys.map((t,i)=><G key={i} style={{padding:"10px 12px",display:"flex",gap:10,alignItems:"center"}}><div style={{width:24,height:24,borderRadius:6,background:`${s.ling?LING_MAP[s.ling].color:"#B24BF3"}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:s.ling?LING_MAP[s.ling].color:"#B24BF3",fontWeight:900,flexShrink:0}}>{i+1}</div><div style={{fontWeight:600,fontSize:12,color:"white"}}>{t}</div></G>)}</div>}
            {l2lTab==="songs"&&<div style={{display:"flex",flexDirection:"column",gap:5}}>{songs.map((sg,i)=><G key={i} style={{padding:"10px 12px",display:"flex",gap:10,alignItems:"center"}}><div style={{width:24,height:24,borderRadius:6,background:"linear-gradient(135deg,rgba(108,99,255,0.12),rgba(224,64,160,0.12))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>🎶</div><div style={{fontWeight:600,fontSize:12,color:"white"}}>{sg}</div></G>)}</div>}
          </div>
        </div>
      </>
    );
  };

  // ══════════════════════════════════════════════════════════
  // BOTTOM TAB BAR
  // ══════════════════════════════════════════════════════════
  const TABS = [
    {icon:"🙈", label:"Play"},
    {icon:"🔊", label:"Sounds"},
    {icon:"📚", label:"Learn"},
  ];

  const renderTabBar = () => (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"rgba(8,8,26,0.96)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.06)",padding:"6px 0 max(6px,env(safe-area-inset-bottom))",display:"flex",justifyContent:"center",gap:0,maxWidth:420,margin:"0 auto"}}>
      {/* tab dot indicators */}
      <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,padding:"3px 0"}}>
        {TABS.map((_,i)=><div key={i} style={{width:i===activeTab?16:5,height:3,borderRadius:2,background:i===activeTab?"#E040A0":"rgba(255,255,255,0.15)",transition:"all 0.3s"}}/>)}
      </div>
      {TABS.map((t,i)=>(
        <button key={i} onClick={()=>{setSubView(null);setActiveTab(i);}} style={{flex:1,background:"none",border:"none",padding:"8px 0 4px",color:activeTab===i?"white":"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:9,fontWeight:700,fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"color 0.2s"}}>
          <span style={{fontSize:22,transition:"transform 0.2s",transform:activeTab===i?"scale(1.15)":"scale(1)"}}>{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );

  // ══════════════════════════════════════════════════════════
  // ROOT RENDER
  // ══════════════════════════════════════════════════════════
  return(
    <div
      style={{background:"linear-gradient(160deg,#08081a 0%,#140a28 35%,#0a142a 65%,#08081a 100%)",minHeight:"100vh",color:"white",fontFamily:"'Outfit','Helvetica Neue',sans-serif",position:"relative",overflow:"hidden"}}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap');*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}button{font-family:inherit}input::placeholder{color:rgba(255,255,255,0.2)}@keyframes shimmer{to{background-position:200% center}}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}@keyframes popIn{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}::-webkit-scrollbar{width:0}`}</style>
      <div style={{position:"fixed",top:-100,right:-60,width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle,rgba(108,99,255,0.06),transparent 60%)",pointerEvents:"none"}}/>
      <div style={{position:"fixed",bottom:-80,left:-60,width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,rgba(224,64,160,0.04),transparent 60%)",pointerEvents:"none"}}/>

      {/* Main content */}
      <div style={{position:"relative",zIndex:1,maxWidth:420,margin:"0 auto",minHeight:"100vh",overflowY:subView||overlay?"hidden":"auto"}}>
        {subView ? renderSubView() : (
          <>
            {activeTab===0&&renderPlayTab()}
            {activeTab===1&&renderSoundsTab()}
            {activeTab===2&&renderLearnTab()}
          </>
        )}
      </div>

      {/* Detail overlay */}
      {renderDetailOverlay()}

      {renderTabBar()}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PEEKABOO  — pre-K visual redesign
// ═══════════════════════════════════════════════════════════════

function PeekabooGame({ pool, addLog }) {
  const [round,  setRound]  = useState(null);
  const [phase,  setPhase]  = useState("ready"); // ready|hide|countdown|reveal|react
  const [count,  setCount]  = useState(0);
  const [streak, setStreak] = useState(0);
  const [cntDown,setCntDown]= useState(3);

  // countdown 3-2-1
  useEffect(()=>{
    if(phase!=="countdown")return;
    setCntDown(3);
    const id=setInterval(()=>{
      setCntDown(v=>{
        if(v<=1){clearInterval(id);setPhase("reveal");return 3;}
        return v-1;
      });
    },900);
    return()=>clearInterval(id);
  },[phase]);

  const newRound = () => {
    const s=pick(pool); const d=pickDip();
    const challenges={
      D:[
        {tag:"LOOOOONG",tip:`Hold "${s.sound}" for a full 3 seconds while it's hidden — slow and stretched`},
        {tag:"SHORT & PUNCHY",tip:`"${s.word}! ${s.word}! ${s.word}!" — quick staccato bursts`},
      ],
      I:[
        {tag:"WHISPER",tip:`Barely audible — so quiet Remi has to really work to hear it`},
        {tag:"EXPLOSION!",tip:`Silent... then BOOM! "${s.sound.toUpperCase()}" — full voice surprise`},
      ],
      P:[
        {tag:"TINY HIGH VOICE",tip:`Squeakiest voice you have for "${s.sound}"`},
        {tag:"BIG LOW VOICE",tip:`Deepest rumble for "${s.sound}" — like a giant ${s.object}`},
      ],
    };
    const ch=pick(challenges[d]);
    setRound({sound:s,dim:d,tag:ch.tag,tip:ch.tip});
    setPhase("hide");
  };

  const logReaction=(reaction)=>{
    if(!round)return;
    addLog({dim:round.dim,sound:round.sound.word,label:`🙈 ${round.sound.emoji} ${round.sound.word} · ${DIP_META[round.dim].label} · ${reaction}`});
    setStreak(s=>reaction==="😐 No response"?0:s+1);
    setCount(c=>c+1);
    newRound();
  };

  const m = round?DIP_META[round.dim]:null;
  const cntColors={3:"#6C63FF",2:"#E040A0",1:"#00D4AA"};

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>

      {/* streak + count header */}
      {count>0&&(
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 4px"}}>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.25)",fontWeight:600}}>{count} round{count!==1?"s":""}</div>
          {streak>=2&&<div style={{fontSize:14,fontWeight:900,color:"#F59E0B",textShadow:"0 0 12px rgba(245,158,11,0.5)"}}>🔥 {streak} in a row!</div>}
        </div>
      )}

      {/* ── READY ── */}
      {phase==="ready"&&(
        <button onClick={newRound} style={{padding:"40px 24px",borderRadius:24,background:"linear-gradient(145deg,#E040A0,#B24BF3,#6C63FF)",border:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"center",boxShadow:"0 8px 40px rgba(224,64,160,0.45)",WebkitTapHighlightColor:"transparent"}}>
          <div style={{fontSize:100,marginBottom:12,display:"block",animation:"pulse 2s infinite",filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.4))"}}>🙈</div>
          <div style={{fontSize:28,fontWeight:900,color:"white",marginBottom:6}}>Tap to Play!</div>
          <div style={{fontSize:14,color:"rgba(255,255,255,0.65)"}}>Round {count+1}</div>
        </button>
      )}

      {/* ── HIDE ── */}
      {phase==="hide"&&round&&(
        <>
          {/* DIP badge */}
          <div style={{textAlign:"center"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 18px",borderRadius:50,background:m.gradient,boxShadow:`0 4px 20px ${m.color}44`,fontSize:13,fontWeight:800,color:"white"}}>
              <span style={{fontSize:16}}>{m.icon}</span>{m.label}: <strong>{round.tag}</strong>
            </div>
          </div>

          {/* Hidden animal card */}
          <div style={{borderRadius:24,background:"rgba(255,255,255,0.06)",border:`2px solid ${m.color}44`,padding:"32px 20px",textAlign:"center",position:"relative",overflow:"hidden"}}>
            {/* blurred emoji */}
            <div style={{fontSize:130,lineHeight:1,filter:"blur(14px)",userSelect:"none",marginBottom:16,opacity:0.7}}>{round.sound.emoji}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",fontStyle:"italic",marginBottom:4}}>It's hidden… make the sound!</div>
          </div>

          {/* Instruction card */}
          <div style={{padding:"18px 20px",borderRadius:18,background:`linear-gradient(135deg,${m.color}18,rgba(0,0,0,0))`,border:`1px solid ${m.color}33`,textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:900,color:m.color,marginBottom:8}}>{round.tag}</div>
            <div style={{fontSize:15,color:"rgba(255,255,255,0.75)",lineHeight:1.6}}>{round.tip}</div>
          </div>

          {/* DIP viz */}
          <div style={{padding:"6px 16px",borderRadius:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <DipViz dim={round.dim}/>
          </div>

          {/* Big reveal button */}
          <button onClick={()=>setPhase("countdown")} style={{padding:"22px",borderRadius:20,background:m.gradient,border:"none",color:"white",fontWeight:900,fontSize:22,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.04em",boxShadow:`0 6px 28px ${m.color}55`,animation:"pulse 1.8s infinite"}}>
            👀  Reveal It!
          </button>
        </>
      )}

      {/* ── COUNTDOWN ── */}
      {phase==="countdown"&&(
        <div style={{textAlign:"center",padding:"60px 20px",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
          <div style={{fontSize:160,fontWeight:900,lineHeight:1,color:cntColors[cntDown]||"white",animation:"pulse 0.9s infinite",textShadow:`0 0 60px ${cntColors[cntDown]||"#fff"}88`,transition:"color 0.3s",userSelect:"none"}}>{cntDown}</div>
          <div style={{fontSize:16,color:"rgba(255,255,255,0.35)",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:700}}>Get ready…</div>
        </div>
      )}

      {/* ── REVEAL ── */}
      {phase==="reveal"&&round&&(
        <>
          {/* Big animal card */}
          <div style={{borderRadius:24,background:round.sound.bg,padding:"32px 20px",textAlign:"center",boxShadow:`0 8px 40px rgba(0,0,0,0.4)`,position:"relative"}}>
            {round.sound.ling&&<div style={{position:"absolute",top:14,right:14,padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.35)",color:"white",fontSize:11,fontWeight:800}}>Ling {LING_MAP[round.sound.ling].phoneme}</div>}
            <div style={{fontSize:130,lineHeight:1,marginBottom:12,animation:"popIn 0.5s ease-out",filter:"drop-shadow(0 6px 20px rgba(0,0,0,0.5))"}}>{round.sound.emoji}</div>
            <div style={{fontSize:32,fontWeight:900,color:"white",marginBottom:4,textShadow:"0 2px 8px rgba(0,0,0,0.5)"}}>{round.sound.word}!</div>
            <div style={{fontSize:15,color:"rgba(255,255,255,0.8)",fontStyle:"italic"}}>"{round.sound.sound}"</div>
          </div>

          {/* Auditory sandwich reminder */}
          <div style={{padding:"14px 18px",borderRadius:14,background:"rgba(0,212,170,0.08)",border:"1px solid rgba(0,212,170,0.25)",textAlign:"center"}}>
            <div style={{fontSize:18,marginBottom:4}}>🥪</div>
            <div style={{fontSize:14,fontWeight:700,color:"#00D4AA",marginBottom:4}}>Auditory Sandwich!</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>Say <strong style={{color:"white"}}>{round.sound.word}</strong> again with the toy visible — sound → object → sound</div>
          </div>

          {/* DIP recap */}
          <div style={{padding:"12px 16px",borderRadius:12,background:"rgba(255,255,255,0.04)",border:`1px solid ${m.color}22`}}>
            <div style={{fontSize:9,fontWeight:700,color:m.color,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>{m.label} recap</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>{L2L_DIP[round.sound.word]?.[round.dim]||""}</div>
          </div>

          {/* How did Remi respond? */}
          <button onClick={()=>setPhase("react")} style={{padding:"20px",borderRadius:18,background:"linear-gradient(135deg,#6C63FF,#B24BF3)",border:"none",color:"white",fontWeight:900,fontSize:18,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 6px 24px rgba(108,99,255,0.4)"}}>
            📊  How did Remi respond?
          </button>
        </>
      )}

      {/* ── REACT ── */}
      {phase==="react"&&round&&(
        <>
          <div style={{textAlign:"center",padding:"8px 0"}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:6}}>What did Remi do?</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <span style={{fontSize:28}}>{round.sound.emoji}</span>
              <span style={{fontSize:16,fontWeight:800,color:"white"}}>{round.sound.word}</span>
            </div>
          </div>

          {/* 2×2 big reaction grid */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[
              {icon:"👂",label:"Turned head",  color:"#6C63FF",bg:"linear-gradient(145deg,#6C63FF44,#6C63FF11)"},
              {icon:"😊",label:"Smiled",        color:"#00D4AA",bg:"linear-gradient(145deg,#00D4AA44,#00D4AA11)"},
              {icon:"🗣️",label:"Vocalized",     color:"#E040A0",bg:"linear-gradient(145deg,#E040A044,#E040A011)"},
              {icon:"👋",label:"Reached / looked",color:"#F59E0B",bg:"linear-gradient(145deg,#F59E0B44,#F59E0B11)"},
            ].map(r=>(
              <button key={r.label} onClick={()=>logReaction(`${r.icon} ${r.label}`)} style={{padding:"22px 10px",borderRadius:20,background:r.bg,border:`2px solid ${r.color}55`,cursor:"pointer",fontFamily:"inherit",textAlign:"center",WebkitTapHighlightColor:"transparent"}}>
                <div style={{fontSize:44,marginBottom:6}}>{r.icon}</div>
                <div style={{fontSize:13,fontWeight:800,color:r.color,lineHeight:1.2}}>{r.label}</div>
              </button>
            ))}
          </div>

          <button onClick={()=>logReaction("😐 No response")} style={{padding:"18px",borderRadius:16,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",fontWeight:700,fontSize:16,cursor:"pointer",fontFamily:"inherit"}}>
            😐  No response
          </button>

          {streak>=3&&(
            <div style={{textAlign:"center",padding:"12px",borderRadius:14,background:"linear-gradient(135deg,rgba(245,158,11,0.15),rgba(224,64,160,0.1))",border:"1px solid rgba(245,158,11,0.3)"}}>
              <div style={{fontSize:28,marginBottom:4}}>🔥</div>
              <div style={{fontSize:15,fontWeight:900,color:"#F59E0B"}}>{streak} responses in a row!</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:2}}>Remi is tuned in — keep going!</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// OTHER GAME COMPONENTS
// ═══════════════════════════════════════════════════════════════

function DipDiceGame({ pool, addLog }) {
  const [roll,setRoll]=useState(null);const [rolling,setRolling]=useState(false);
  const doRoll=()=>{setRolling(true);setTimeout(()=>{setRoll({sound:pick(pool),dim:pickDip()});setRolling(false);},600);};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <button onClick={doRoll} disabled={rolling} style={{padding:"20px",borderRadius:14,background:rolling?"rgba(255,255,255,0.06)":"linear-gradient(135deg,#6C63FF,#00D4AA)",border:"none",color:"white",fontWeight:800,fontSize:16,cursor:rolling?"wait":"pointer",fontFamily:"inherit",textAlign:"center",transition:"all 0.3s"}}>{rolling?"🎲 Rolling…":"🎲 Roll the DIP Dice!"}</button>
      {roll&&!rolling&&(<>
        <G style={{padding:"16px",textAlign:"center"}}>
          <div style={{width:80,height:80,borderRadius:16,background:roll.sound.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,margin:"0 auto 10px",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>{roll.sound.emoji}</div>
          <div style={{fontSize:20,fontWeight:900,color:roll.sound.ling?LING_MAP[roll.sound.ling]?.color:"#B24BF3"}}>{roll.sound.word}</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:10}}>{roll.sound.object} · "{roll.sound.sound}"</div>
          <div style={{display:"inline-block",padding:"5px 14px",borderRadius:8,background:DIP_META[roll.dim].gradient,fontSize:12,fontWeight:700,marginBottom:10}}>{DIP_META[roll.dim].icon} {DIP_META[roll.dim].label}</div>
        </G>
        <G style={{padding:"4px 10px"}}><DipViz dim={roll.dim}/></G>
        <G style={{padding:"12px 14px"}}><p style={{margin:0,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>{L2L_DIP[roll.sound.word]?.[roll.dim]||`Practice ${roll.sound.word} with ${DIP_META[roll.dim].label} contrast`}</p></G>
        <button onClick={()=>addLog({dim:roll.dim,sound:roll.sound.word,label:`🎲 Dice · ${roll.sound.emoji} ${roll.sound.word} · ${DIP_META[roll.dim].label}`})} style={{padding:"10px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>✓ Log this practice</button>
      </>)}
    </div>
  );
}

function SafariGame({ pool, focusPool, addLog }) {
  const [list,setList]=useState(null);const [checked,setChecked]=useState({});
  const generate=()=>{const fi=pickN(focusPool,2);const rem=pool.filter(s=>!fi.find(f=>f.word===s.word));const oth=pickN(rem,3);setList([...fi,...oth].map(s=>({...s,dim:pickDip()})));setChecked({});};
  const done=Object.keys(checked).length;const total=list?.length||5;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <button onClick={generate} style={{padding:"14px",borderRadius:12,background:"linear-gradient(135deg,#F59E0B,#FF6B6B)",border:"none",color:"white",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>🦁 {list?"New":"Start"} Safari!</button>
      {list&&(<>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 4px"}}>
          <span style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{done}/{total} found</span>
          <div style={{flex:1,marginLeft:10,height:6,background:"rgba(255,255,255,0.08)",borderRadius:3}}><div style={{height:"100%",borderRadius:3,width:`${(done/total)*100}%`,background:"linear-gradient(90deg,#F59E0B,#FF6B6B)",transition:"width 0.4s"}}/></div>
        </div>
        {list.map((item,i)=>{const isDone=checked[i];return(
          <G key={i} style={{padding:"12px 14px",opacity:isDone?0.5:1,transition:"opacity 0.3s"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:44,height:44,borderRadius:12,background:item.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{item.emoji}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:14,color:"white",textDecoration:isDone?"line-through":"none"}}>{item.word}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{item.object}</div>
              </div>
              <div style={{padding:"3px 8px",borderRadius:5,background:`${DIP_META[item.dim].color}22`,fontSize:9,fontWeight:700,color:DIP_META[item.dim].color}}>{DIP_META[item.dim].icon} {DIP_META[item.dim].label}</div>
            </div>
            <p style={{margin:"8px 0",fontSize:11,color:"rgba(255,255,255,0.45)",lineHeight:1.5}}>{L2L_DIP[item.word]?.[item.dim]||`Practice with ${DIP_META[item.dim].label}`}</p>
            {!isDone&&<button onClick={()=>{setChecked(c=>({...c,[i]:true}));addLog({dim:item.dim,sound:item.word,label:`🦁 Safari · ${item.emoji} ${item.word} · ${DIP_META[item.dim].label}`});}} style={{width:"100%",padding:"8px",borderRadius:7,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✓ Found it!</button>}
            {isDone&&<div style={{textAlign:"center",fontSize:11,color:"#00D4AA",fontWeight:700}}>✓ Complete!</div>}
          </G>
        );})}
        {done===total&&<G style={{padding:"16px",textAlign:"center",border:"1px solid rgba(0,212,170,0.3)",background:"rgba(0,212,170,0.08)"}}><span style={{fontSize:36,display:"block",marginBottom:6}}>🎉</span><div style={{fontSize:16,fontWeight:900,color:"#00D4AA"}}>Safari Complete!</div></G>}
      </>)}
    </div>
  );
}

function ContrastGame({ pool, addLog }) {
  const [pair,setPair]=useState(null);
  const generate=()=>{const two=pickN(pool,2);const d=pickDip();const extremes={D:[["LOOOOONG — stretch it out","SHORT — quick burst, one tap"],["Sustained glide","Staccato — choppy, rapid-fire"]],I:[["WHISPER — barely audible","FULL VOICE — project loud"],["Gentle breath","Surprised SHOUT — sudden burst"]],P:[["Highest squeaky voice possible","Deepest rumble"],["Rising question ↗","Falling statement ↘"]]};const ext=pick(extremes[d]);setPair({a:two[0],b:two[1],dim:d,extA:ext[0],extB:ext[1]});};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <button onClick={generate} style={{padding:"14px",borderRadius:12,background:"linear-gradient(135deg,#00D4AA,#6C63FF)",border:"none",color:"white",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>⚡ {pair?"New":"Generate"} Contrast!</button>
      {pair&&(<>
        <div style={{textAlign:"center"}}><div style={{display:"inline-block",padding:"4px 12px",borderRadius:6,background:DIP_META[pair.dim].gradient,fontSize:11,fontWeight:700}}>{DIP_META[pair.dim].icon} {DIP_META[pair.dim].label} Contrast</div></div>
        <G style={{padding:"4px 10px"}}><DipViz dim={pair.dim}/></G>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[{s:pair.a,ext:pair.extA},{s:pair.b,ext:pair.extB}].map(({s,ext},i)=>(
            <G key={i} style={{padding:"14px 12px",textAlign:"center"}}>
              <div style={{width:60,height:60,borderRadius:14,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,margin:"0 auto 8px",boxShadow:"0 4px 16px rgba(0,0,0,0.3)"}}>{s.emoji}</div>
              <div style={{fontWeight:800,fontSize:14,color:"white",marginBottom:4}}>{s.word}</div>
              <div style={{fontSize:10,color:DIP_META[pair.dim].color,fontWeight:600,lineHeight:1.4}}>{ext}</div>
            </G>
          ))}
        </div>
        <G style={{padding:"10px 14px"}}><p style={{margin:0,fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.6,textAlign:"center"}}>Make these two as <strong style={{color:"white"}}>different</strong> as possible.</p></G>
        <button onClick={()=>addLog({dim:pair.dim,sound:`${pair.a.word}+${pair.b.word}`,label:`⚡ Contrast · ${pair.a.emoji}${pair.b.emoji} · ${DIP_META[pair.dim].label}`})} style={{padding:"10px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>✓ Log this contrast</button>
      </>)}
    </div>
  );
}

function StoryChainGame({ pool, addLog }) {
  const [chain,setChain]=useState(null);
  const generate=()=>{const three=pickN(pool,3);const dims=[pickDip(),pickDip(),pickDip()];const connectors=[["One day","met","and together they"],["Once upon a time","heard","and ran to find"],["In a big house lived","who found","and they both saw"],["Wake up!","Look who's here —","Oh! And here comes"]];setChain({sounds:three,dims,connector:pick(connectors)});};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <button onClick={generate} style={{padding:"14px",borderRadius:12,background:"linear-gradient(135deg,#B24BF3,#E040A0)",border:"none",color:"white",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>📖 {chain?"New":"Build a"} Story!</button>
      {chain&&(<>
        <G style={{padding:"16px",textAlign:"center"}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:12}}>Your story</div>
          {chain.sounds.map((s,i)=>(
            <div key={i}>
              {i>0&&<div style={{fontSize:12,color:"rgba(255,255,255,0.3)",fontStyle:"italic",margin:"8px 0"}}>{chain.connector[i]||"and then..."}</div>}
              {i===0&&<div style={{fontSize:12,color:"rgba(255,255,255,0.3)",fontStyle:"italic",marginBottom:8}}>{chain.connector[0]}</div>}
              <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"10px 16px",borderRadius:14,background:"rgba(255,255,255,0.06)",border:`1px solid ${DIP_META[chain.dims[i]].color}33`,marginBottom:4}}>
                <div style={{width:50,height:50,borderRadius:12,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,flexShrink:0,boxShadow:"0 3px 12px rgba(0,0,0,0.3)"}}>{s.emoji}</div>
                <div style={{textAlign:"left"}}>
                  <div style={{fontWeight:800,fontSize:15,color:"white"}}>{s.word}!</div>
                  <div style={{fontSize:9,color:DIP_META[chain.dims[i]].color,fontWeight:600}}>{DIP_META[chain.dims[i]].icon} {DIP_META[chain.dims[i]].label}</div>
                </div>
              </div>
            </div>
          ))}
        </G>
        <G style={{padding:"12px 14px"}}><p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>Tell the story with toys if you have them. Repeat 2-3 times — repetition is gold for CI listeners.</p></G>
        <button onClick={()=>addLog({dim:"📖",sound:chain.sounds.map(s=>s.word).join("+"),label:`📖 Story · ${chain.sounds.map(s=>s.emoji).join("")}`,note:true})} style={{padding:"10px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>✓ Log this story</button>
      </>)}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VOCAB LISTEN GAME  — DIP-guided listening game for vocabulary
// ═══════════════════════════════════════════════════════════════

function VocabListenGame({ words, cat, addLog }) {
  const [phase, setPhase]   = useState("ready"); // ready|show|respond
  const [round, setRound]   = useState(null);
  const [count, setCount]   = useState(0);
  const [streak, setStreak] = useState(0);

  const newRound = () => {
    const target = pick(words);
    const others = pickN(words.filter(w => w !== target), Math.min(2, words.length - 1));
    const dim = pickDip();
    const challenges = {
      D: [
        `Say "${target}" loooooong — really stretch it out`,
        `Quick "${target}! ${target}! ${target}!" — short punchy bursts`,
      ],
      I: [
        `Whisper "${target}" softly — make Remi lean in to hear`,
        `Silent… then "${target.toUpperCase()}!" — full voice surprise`,
      ],
      P: [
        `Squeaky high voice: "${target}" ↗`,
        `Deep low rumble: "${target}" ↘`,
      ],
    };
    setRound({ target, others, dim, tip: pick(challenges[dim]) });
    setPhase("show");
  };

  const logResponse = (reaction) => {
    if (!round) return;
    addLog({ dim: round.dim, sound: round.target, label: `${cat.icon} ${cat.label} · "${round.target}" · ${DIP_META[round.dim].label} · ${reaction}` });
    setStreak(s => reaction.includes("No response") ? 0 : s + 1);
    setCount(c => c + 1);
    newRound();
  };

  const m = round ? DIP_META[round.dim] : null;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>

      {/* streak header */}
      {count>0&&(
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 4px"}}>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.25)",fontWeight:600}}>{count} round{count!==1?"s":""}</div>
          {streak>=2&&<div style={{fontSize:14,fontWeight:900,color:"#F59E0B",textShadow:"0 0 12px rgba(245,158,11,0.5)"}}>🔥 {streak} in a row!</div>}
        </div>
      )}

      {/* ── READY ── */}
      {phase==="ready"&&(
        <button onClick={newRound} style={{padding:"40px 24px",borderRadius:24,background:`linear-gradient(145deg,${cat.color},${cat.color}88,rgba(108,99,255,0.8))`,border:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"center",boxShadow:`0 8px 40px ${cat.color}44`,WebkitTapHighlightColor:"transparent"}}>
          <div style={{fontSize:80,marginBottom:12,display:"block",animation:"pulse 2s infinite"}}>🎮</div>
          <div style={{fontSize:26,fontWeight:900,color:"white",marginBottom:6}}>Tap to Start!</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.65)"}}>Round {count+1} · DIP Listening</div>
        </button>
      )}

      {/* ── SHOW ── */}
      {phase==="show"&&round&&(
        <>
          {/* DIP badge */}
          <div style={{textAlign:"center"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 18px",borderRadius:50,background:m.gradient,boxShadow:`0 4px 20px ${m.color}44`,fontSize:13,fontWeight:800,color:"white"}}>
              <span style={{fontSize:16}}>{m.icon}</span>{m.label}
            </div>
          </div>

          {/* Target word – big card */}
          <div style={{borderRadius:24,background:`linear-gradient(145deg,${cat.color}33,${cat.color}11)`,border:`2px solid ${cat.color}66`,padding:"36px 20px",textAlign:"center"}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:12}}>Say this word</div>
            <div style={{fontSize:54,fontWeight:900,color:"white",letterSpacing:"-0.02em",marginBottom:16,lineHeight:1,textShadow:`0 0 40px ${cat.color}88`}}>{round.target}</div>
            <div style={{padding:"12px 16px",borderRadius:12,background:`${m.color}18`,border:`1px solid ${m.color}33`}}>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.5}}>{round.tip}</div>
            </div>
          </div>

          {/* DIP viz */}
          <div style={{padding:"6px 16px",borderRadius:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <DipViz dim={round.dim}/>
          </div>

          {/* Distractors – shown smaller for context */}
          {round.others.length>0&&(
            <div style={{display:"flex",gap:8}}>
              {round.others.map((w,i)=>(
                <div key={i} style={{flex:1,padding:"12px 8px",borderRadius:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",textAlign:"center"}}>
                  <div style={{fontSize:16,fontWeight:700,color:"rgba(255,255,255,0.3)"}}>{w}</div>
                  <div style={{fontSize:8,color:"rgba(255,255,255,0.15)",marginTop:3}}>distractor</div>
                </div>
              ))}
            </div>
          )}

          {/* Respond button */}
          <button onClick={()=>setPhase("respond")} style={{padding:"20px",borderRadius:18,background:"linear-gradient(135deg,#6C63FF,#B24BF3)",border:"none",color:"white",fontWeight:900,fontSize:18,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 6px 24px rgba(108,99,255,0.4)",animation:"pulse 1.8s infinite"}}>
            📊 How did Remi respond?
          </button>
        </>
      )}

      {/* ── RESPOND ── */}
      {phase==="respond"&&round&&(
        <>
          <div style={{textAlign:"center",padding:"8px 0"}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:6}}>Word said:</div>
            <div style={{fontSize:40,fontWeight:900,color:cat.color,letterSpacing:"-0.02em"}}>{round.target}</div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[
              {icon:"👂",label:"Turned / looked", color:"#6C63FF",bg:"linear-gradient(145deg,#6C63FF44,#6C63FF11)"},
              {icon:"😊",label:"Smiled",           color:"#00D4AA",bg:"linear-gradient(145deg,#00D4AA44,#00D4AA11)"},
              {icon:"🗣️",label:"Vocalized",        color:"#E040A0",bg:"linear-gradient(145deg,#E040A044,#E040A011)"},
              {icon:"🏃",label:"Did the action!",  color:"#F59E0B",bg:"linear-gradient(145deg,#F59E0B44,#F59E0B11)"},
            ].map(r=>(
              <button key={r.label} onClick={()=>logResponse(`${r.icon} ${r.label}`)} style={{padding:"22px 10px",borderRadius:20,background:r.bg,border:`2px solid ${r.color}55`,cursor:"pointer",fontFamily:"inherit",textAlign:"center",WebkitTapHighlightColor:"transparent"}}>
                <div style={{fontSize:44,marginBottom:6}}>{r.icon}</div>
                <div style={{fontSize:13,fontWeight:800,color:r.color,lineHeight:1.2}}>{r.label}</div>
              </button>
            ))}
          </div>

          <button onClick={()=>logResponse("😐 No response")} style={{padding:"18px",borderRadius:16,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",fontWeight:700,fontSize:16,cursor:"pointer",fontFamily:"inherit"}}>
            😐 No response
          </button>

          {streak>=3&&(
            <div style={{textAlign:"center",padding:"12px",borderRadius:14,background:"linear-gradient(135deg,rgba(245,158,11,0.15),rgba(224,64,160,0.1))",border:"1px solid rgba(245,158,11,0.3)"}}>
              <div style={{fontSize:28,marginBottom:4}}>🔥</div>
              <div style={{fontSize:15,fontWeight:900,color:"#F59E0B"}}>{streak} responses in a row!</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:2}}>Remi is tuned in — keep going!</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
