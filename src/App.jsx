import { useState, useEffect, useCallback, useMemo } from "react";

const POWER_WORDS = ["more","mine","off","up","out","mama","daddy","all gone","bye-bye","nose","stop","broken","dirty","hot","open","go","push"];

const VOCAB_CATEGORIES = {
  power: { label: "Power Words", icon: "⚡", color: "#FF6B6B", desc: "EMT core words" },
  existence: { label: "Existence", icon: "👋", color: "#6C63FF", desc: "People, things, naming" },
  nonexistence: { label: "Non-existence", icon: "🫥", color: "#7C5CFC", desc: "All gone, no more" },
  recurrence: { label: "Recurrence", icon: "🔄", color: "#E040A0", desc: "More, again, another" },
  reject: { label: "Reject / Denial", icon: "🚫", color: "#FF6B6B", desc: "No" },
  attribution: { label: "Attribution", icon: "🏷️", color: "#F59E0B", desc: "Describing qualities" },
  possession: { label: "Possession", icon: "🤲", color: "#00D4AA", desc: "Mine, yours" },
  action: { label: "Action", icon: "🏃", color: "#6C63FF", desc: "Verbs" },
  locaction: { label: "Location Action", icon: "📍", color: "#E040A0", desc: "Movement" },
  l2l: { label: "Learning to Listen", icon: "👂", color: "#B24BF3", desc: "Sound-object associations" },
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
    { word:"ahhh", object:"airplane", emoji:"✈️", sound:"ahhh ↗", ling:"ah" },
    { word:"mooo", object:"cow", emoji:"🐄", sound:"mooooo", ling:"oo" },
    { word:"ummmm", object:"yummy", emoji:"😋", sound:"mmmmm", ling:"m" },
    { word:"tongue click", object:"horse", emoji:"🐴", sound:"click click", ling:null },
    { word:"meow", object:"cat", emoji:"🐱", sound:"mee-oww", ling:"ee" },
    { word:"woof", object:"dog", emoji:"🐶", sound:"woof woof!", ling:null },
    { word:"oink oink", object:"pig", emoji:"🐷", sound:"oink oink!", ling:null },
    { word:"p p p", object:"boat", emoji:"⛵", sound:"p-p-p-p", ling:null },
    { word:"brrr beep beep", object:"car", emoji:"🚗", sound:"brrr beep!", ling:null },
    { word:"choo-choo", object:"train", emoji:"🚂", sound:"choo choo!", ling:"oo" },
    { word:"baaaa", object:"sheep", emoji:"🐑", sound:"baaaaaaa", ling:"ah" },
    { word:"quack-quack", object:"duck", emoji:"🦆", sound:"quack quack!", ling:null },
    { word:"hi", object:"mirror", emoji:"🪞", sound:"hiiii!", ling:"ee" },
    { word:"hahaha", object:"clown", emoji:"🤡", sound:"ha ha ha!", ling:"ah" },
    { word:"sssss", object:"snake", emoji:"🐍", sound:"sssssss", ling:"s" },
    { word:"shhhh", object:"baby sleeping", emoji:"😴", sound:"shhhhhh", ling:"sh" },
    { word:"round-round", object:"top", emoji:"🌀", sound:"round and round!", ling:null },
    { word:"weeeee", object:"slide", emoji:"🛝", sound:"wheeeee!", ling:"ee" },
    { word:"b b b b", object:"bus", emoji:"🚌", sound:"b-b-b-b", ling:null },
    { word:"hop-hop", object:"bunny", emoji:"🐰", sound:"hop hop hop!", ling:null },
    { word:"t-t-t-t-t", object:"clock", emoji:"🕐", sound:"tick tock", ling:null },
    { word:"ooooo", object:"siren", emoji:"🚨", sound:"ooooOOOO", ling:"oo" },
    { word:"squeak", object:"mouse", emoji:"🐭", sound:"eee eee!", ling:"ee" },
    { word:"tweet-tweet", object:"bird", emoji:"🐦", sound:"tweet tweet!", ling:"ee" },
    { word:"woo-woo", object:"owl", emoji:"🦉", sound:"woo wooo", ling:"oo" },
    { word:"ch-ch-ch", object:"toothbrush", emoji:"🪥", sound:"ch-ch-ch", ling:"sh" },
    { word:"bring-bring", object:"phone", emoji:"📞", sound:"brring!", ling:null },
    { word:"grrrrr", object:"bear", emoji:"🐻", sound:"grrrrrr!", ling:null },
    { word:"buk-buk", object:"chicken", emoji:"🐔", sound:"buk buk!", ling:null },
    { word:"he-he-he", object:"witch", emoji:"🧙‍♀️", sound:"he he he!", ling:"ee" },
    { word:"swish-swish", object:"fish", emoji:"🐟", sound:"swish swish", ling:"sh" },
    { word:"caw-caw", object:"crow", emoji:"🐦‍⬛", sound:"caw! caw!", ling:"ah" },
    { word:"ee-ee-ee", object:"monkey", emoji:"🐵", sound:"ee ee ee!", ling:"ee" },
    { word:"cockadoodledoo", object:"rooster", emoji:"🐓", sound:"cockadoodledoo!", ling:"oo" },
  ],
};

const DIP_META = {
  D: { label:"Duration", tagline:"Long vs. Short", color:"#6C63FF", icon:"⏱", gradient:"linear-gradient(135deg,#6C63FF,#B24BF3)" },
  I: { label:"Intensity", tagline:"Loud vs. Soft", color:"#E040A0", icon:"💪", gradient:"linear-gradient(135deg,#E040A0,#FF6B6B)" },
  P: { label:"Pitch", tagline:"High vs. Low", color:"#00D4AA", icon:"🎵", gradient:"linear-gradient(135deg,#00D4AA,#6C63FF)" },
};

const LING_MAP = {
  ah:{phoneme:"/ah/",color:"#6C63FF"}, oo:{phoneme:"/oo/",color:"#E040A0"},
  ee:{phoneme:"/ee/",color:"#00D4AA"}, sh:{phoneme:"/sh/",color:"#7C5CFC"},
  s:{phoneme:"/s/",color:"#FF6B6B"}, m:{phoneme:"/m/",color:"#F59E0B"},
};

const VOWEL_META = {
  ah: { phoneme:"/ah/", label:"AH", color:"#6C63FF", gradient:"linear-gradient(135deg,#6C63FF,#B24BF3)", desc:"Jaw drops open", tip:"Like 'ahh' at the doctor — low and open", mouth:"😮" },
  oo: { phoneme:"/oo/", label:"OO", color:"#E040A0", gradient:"linear-gradient(135deg,#E040A0,#FF6B6B)", desc:"Lips make an O", tip:"Round lips like blowing a kiss", mouth:"😯" },
  ee: { phoneme:"/ee/", label:"EE", color:"#00D4AA", gradient:"linear-gradient(135deg,#00D4AA,#6C63FF)", desc:"Lips spread wide", tip:"Big smile — pull corners back", mouth:"😁" },
};

const DIP_TIPS = {
  D: {
    why:"The brain learns to track sound events over time. Long-vs-short contrast builds temporal processing — critical for word boundaries.",
    cues:["Hold LONG sounds 2+ full seconds","Cut SHORT sounds sharp under half a second","10× difference is the goal — really exaggerate"],
    phrase:"Loooooong one... short! Looooong... short!",
  },
  I: {
    why:"Volume contrast activates different hair cells in the cochlea. The jump from soft→loud is a salient acoustic event the brain latches onto.",
    cues:["Whisper until barely audible — make them lean in","Then hit FULL voice — no half measures","The surprise factor is the neural hook"],
    phrase:"Quiet now... LOUD! Quiet... LOUD!",
  },
  P: {
    why:"Pitch (fundamental frequency) is mapped tonotopically in the cochlea. High-vs-low teaches frequency discrimination across the whole cochlea.",
    cues:["Go as high as you can — squeaky cartoon voice","Go as low as you can — rumbling giant","Use rising pitch as a question ↗, falling as a statement ↘"],
    phrase:"High voice? ↗  Low voice↘.  High? ↗  Low↘.",
  },
};

const L2L_DIP = {};
WORDS.l2l.forEach(s => {
  L2L_DIP[s.word] = {
    D:`Long: stretch "${s.sound}" as loooong as you can. Short: quick pulsed "${s.word}! ${s.word}!" The contrast teaches duration.`,
    I:`Soft: whisper the ${s.object} sound barely audible. Loud: full voice "${s.sound.toUpperCase()}" with energy. The volume jump is what the brain grabs.`,
    P:`Low: deep voice ${s.object} sound. High: squeaky excited version. Question "${s.word}↗?" vs statement "${s.word}↘" to show pitch contrast.`,
  };
});

const L2L_SONGS = {"ahhh":["Twinkle Twinkle","Baa Baa Black Sheep","Row Your Boat","Wheels on the Bus"],"mooo":["Old MacDonald (cow)","Farmer in the Dell"],"ummmm":["Muffin Man","Mary Had a Lamb","Hum any lullaby"],"tongue click":["Horsey Horsey","Ride a Cock-Horse"],"meow":["Three Little Kittens","Soft Kitty"],"woof":["How Much Is That Doggy","Bingo","Old MacDonald (dog)"],"oink oink":["Old MacDonald (pig)","This Little Piggy"],"p p p":["Row Your Boat","Rub-a-Dub-Dub"],"brrr beep beep":["Wheels on the Bus (horn)","Driving in My Car"],"choo-choo":["Down by the Station","I've Been Working on the Railroad"],"baaaa":["Baa Baa Black Sheep","Mary Had a Little Lamb"],"quack-quack":["Five Little Ducks","Six Little Ducks"],"hi":["Hello Song","Where Is Thumbkin"],"hahaha":["If You're Happy and You Know It","Ha Ha This-A-Way"],"sssss":["Sally the Camel","See Saw Margery Daw"],"shhhh":["Hush Little Baby","Rock-a-bye Baby","Rain Rain Go Away"],"round-round":["Ring Around the Rosie","Round and Round the Garden"],"weeeee":["Jack and Jill","London Bridge"],"b b b b":["Wheels on the Bus"],"hop-hop":["Little Bunny Foo Foo","Hop Little Bunnies"],"t-t-t-t-t":["Hickory Dickory Dock","My Grandfather's Clock"],"ooooo":["Do Your Ears Hang Low","Five Little Monkeys"],"squeak":["Hickory Dickory Dock","Three Blind Mice"],"tweet-tweet":["Two Little Blackbirds","Rockin' Robin"],"woo-woo":["A Wise Old Owl","Five Little Owls"],"ch-ch-ch":["Brush Our Teeth song"],"bring-bring":["Banana Phone"],"grrrrr":["Going on a Bear Hunt","Bear Went Over the Mountain"],"buk-buk":["Old MacDonald (chicken)"],"he-he-he":["Five Little Pumpkins"],"swish-swish":["Once I Caught a Fish","Baby Shark"],"caw-caw":["Two Little Blackbirds"],"ee-ee-ee":["Five Little Monkeys"],"cockadoodledoo":["Old MacDonald (rooster)"]};

const L2L_TOYS = {"ahhh":["Toy airplane","Bowl (rolling)","Ball","Bubbles"],"mooo":["Toy cow","Farm set","Cow puppet"],"ummmm":["Play food","Snacks","Microphone toy"],"tongue click":["Toy horse","Stick horse"],"meow":["Toy cat","Cat puppet"],"woof":["Toy dog","Dog puppet"],"oink oink":["Toy pig","Farm set"],"p p p":["Toy boat","Bath boat"],"brrr beep beep":["Toy car","Car ramp"],"choo-choo":["Toy train","Train track"],"baaaa":["Toy sheep","Farm set"],"quack-quack":["Rubber duck","Bath ducks"],"hi":["Mirror","Puppet","Family photos"],"hahaha":["Funny puppet","Jack-in-the-box"],"sssss":["Toy snake","Balloon"],"shhhh":["Baby doll + blanket","Rain stick"],"round-round":["Spinning top","Pinwheel"],"weeeee":["Slide","Ramp + car"],"b b b b":["Toy bus"],"hop-hop":["Toy bunny","Bunny puppet"],"t-t-t-t-t":["Toy clock","Timer"],"ooooo":["Fire truck toy","Siren toy"],"squeak":["Toy mouse","Squeaky toy"],"tweet-tweet":["Toy bird","Bird puppet"],"woo-woo":["Toy owl","Owl puppet"],"ch-ch-ch":["Toy toothbrush"],"bring-bring":["Toy phone"],"grrrrr":["Toy bear","Bear puppet"],"buk-buk":["Toy chicken"],"he-he-he":["Witch puppet"],"swish-swish":["Toy fish","Bath fish"],"caw-caw":["Toy bird"],"ee-ee-ee":["Toy monkey","Monkey puppet"],"cockadoodledoo":["Toy rooster"]};

const STAGES = [
  {key:"I",label:"Input",color:"#6C63FF",desc:"Exposing Remi"},
  {key:"C",label:"Comprehension",color:"#E040A0",desc:"Shows understanding"},
  {key:"Im",label:"Imitation",color:"#00D4AA",desc:"Attempts to copy"},
  {key:"U",label:"Use",color:"#F59E0B",desc:"Uses independently"},
];

const GAMES = [
  {
    id: "peekaboo",
    name: "Sound Peek-a-Boo",
    icon: "🙈",
    color: "#E040A0",
    gradient: "linear-gradient(135deg, #E040A0, #B24BF3)",
    desc: "Hide the toy, make its sound with a DIP twist, then reveal!",
    howTo: "1. Hide a toy behind your back or under a blanket\n2. Make the sound using the DIP challenge shown\n3. Pause — wait for any response from Remi\n4. Reveal the toy with excitement!\n5. The auditory sandwich: sound → object → sound again",
  },
  {
    id: "dipdice",
    name: "DIP Dice",
    icon: "🎲",
    color: "#6C63FF",
    gradient: "linear-gradient(135deg, #6C63FF, #00D4AA)",
    desc: "Roll for a random sound + DIP dimension challenge",
    howTo: "1. Tap Roll to get a random combo\n2. Grab the toy (or just use your voice)\n3. Follow the DIP challenge\n4. Log what happened — any head turns, vocalizations, eye contact",
  },
  {
    id: "safari",
    name: "Sound Safari",
    icon: "🦁",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B, #FF6B6B)",
    desc: "A scavenger hunt through 5 sounds — check them off as you go",
    howTo: "1. Get a fresh set of 5 sounds\n2. Find each toy (or imagine it!)\n3. Practice the sound with the suggested DIP focus\n4. Check off each one as you complete it\n5. Celebrate when you finish all 5!",
  },
  {
    id: "contrast",
    name: "Contrast Showdown",
    icon: "⚡",
    color: "#00D4AA",
    gradient: "linear-gradient(135deg, #00D4AA, #6C63FF)",
    desc: "Two sounds side by side — make them as DIFFERENT as possible",
    howTo: "1. You get two sounds and one DIP dimension\n2. Make the first sound emphasizing one extreme\n3. Make the second sound emphasizing the opposite\n4. The bigger the contrast, the better for Remi's brain!\n5. E.g., a looooong cow vs. a short quick duck",
  },
  {
    id: "storychain",
    name: "Story Chain",
    icon: "📖",
    color: "#B24BF3",
    gradient: "linear-gradient(135deg, #B24BF3, #E040A0)",
    desc: "Build a tiny story connecting 3 sounds with DIP magic",
    howTo: "1. You get 3 random sounds in sequence\n2. Invent a tiny story connecting them\n3. Use the suggested DIP emphasis for each one\n4. Tell it to Remi with full expression!\n5. Repeat the same story — repetition is gold",
  },
];

const pick = arr => arr[Math.floor(Math.random()*arr.length)];
const pickN = (arr, n) => {
  const copy = [...arr];
  const result = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(Math.random()*copy.length);
    result.push(copy.splice(idx,1)[0]);
  }
  return result;
};
const pickDip = () => pick(["D","I","P"]);

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
  const W=180,H=32;const pts=Array.from({length:40},(_,i)=>{const x=(i/39)*W;const y=H/2+Math.sin(((i+o)/40)*Math.PI*3)*(H/2-3)+Math.sin(((i+o)/40)*Math.PI*6)*3;return`${x},${y}`;}).join(" ");
  return <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block",margin:"6px 0"}}><defs><linearGradient id="pv" x1="0" y1="0" x2={W} y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#00D4AA"/><stop offset="50%" stopColor="#6C63FF"/><stop offset="100%" stopColor="#E040A0"/></linearGradient></defs><polyline points={pts} fill="none" stroke="url(#pv)" strokeWidth={2} strokeLinecap="round"/></svg>;
};
const DipViz = ({dim}) => dim==="D"?<DurationViz/>:dim==="I"?<IntensityViz/>:<PitchViz/>;

const G = ({children,style={},onClick}) => {
  const base = {background:"rgba(255,255,255,0.05)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,...style};
  return onClick
    ? <button onClick={onClick} style={{...base,cursor:"pointer",fontFamily:"inherit",color:"inherit",textAlign:"left",width:"100%"}}>{children}</button>
    : <div style={base}>{children}</div>;
};

export default function App() {
  const [view, setView] = useState("home");
  const [catKey, setCatKey] = useState(null);
  const [l2lItem, setL2lItem] = useState(null);
  const [dipDim, setDipDim] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [focusL2l, setFocusL2l] = useState(null);
  const [tracking, setTracking] = useState({});
  const [logged, setLogged] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [showLog, setShowLog] = useState(false);
  // Moved from renderL2lDetail to fix hooks-in-render-function violation
  const [l2lTab, setL2lTab] = useState("dip");
  const [searchQuery, setSearchQuery] = useState("");
  const [vowelFocus, setVowelFocus] = useState(null); // null | "ah" | "oo" | "ee"

  const toggleTrack = (word, stage) => setTracking(t=>({...t,[word]:{...(t[word]||{}),[stage]:!(t[word]||{})[stage]}}));
  const addLog = entry => setLogged(l=>[...l,{...entry,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),id:Date.now()}]);
  const nav = (v,opts={}) => {
    setView(v);
    if(opts.cat!==undefined)setCatKey(opts.cat);
    if(opts.l2l!==undefined){ setL2lItem(opts.l2l); setL2lTab("dip"); }
    if(opts.dip!==undefined)setDipDim(opts.dip);
    if(opts.game!==undefined)setGameId(opts.game);
    setShowLog(false);
    setSearchQuery("");
  };

  const SL = {fontSize:10,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:12,paddingLeft:2};
  const backBtn = (label,target="home",opts={}) => <button onClick={()=>nav(target,opts)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.45)",fontSize:12,cursor:"pointer",padding:"8px 0",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>← {label}</button>;

  const soundPool = useMemo(() => {
    if (focusL2l) return WORDS.l2l.filter(s=>s.word===focusL2l.word||s.ling===focusL2l.ling);
    if (vowelFocus) return WORDS.l2l.filter(s=>s.ling===vowelFocus);
    return WORDS.l2l;
  }, [focusL2l, vowelFocus]);
  const fullPool = WORDS.l2l;

  const renderHome = () => (
    <div style={{padding:"0 16px 100px"}}>
      <div style={{textAlign:"center",padding:"32px 0 22px",position:"relative"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(108,99,255,0.12),rgba(224,64,160,0.06),transparent 70%)",filter:"blur(40px)",pointerEvents:"none"}}/>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.25em",textTransform:"uppercase",background:"linear-gradient(90deg,#6C63FF,#E040A0,#00D4AA,#6C63FF)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 3s linear infinite",marginBottom:10}}>Remi's Listening Journey</div>
        <h1 style={{margin:"0 0 4px",fontSize:44,fontWeight:900,lineHeight:1,letterSpacing:"0.12em",background:"linear-gradient(135deg,#fff,rgba(255,255,255,0.6))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>D · I · P</h1>
        <p style={{margin:0,fontSize:12,color:"rgba(255,255,255,0.35)"}}>Duration · Intensity · Pitch</p>
      </div>

      {/* Search bar */}
      <div style={{position:"relative",marginBottom:14}}>
        <input
          value={searchQuery}
          onChange={e=>setSearchQuery(e.target.value)}
          placeholder="🔍  Search sounds & words…"
          style={{width:"100%",padding:"10px 14px",borderRadius:10,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"white",fontSize:13,outline:"none",fontFamily:"inherit"}}
        />
        {searchQuery&&<button onClick={()=>setSearchQuery("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:16,cursor:"pointer",lineHeight:1}}>×</button>}
      </div>

      {/* Inline search results */}
      {searchQuery.trim()&&(()=>{
        const q=searchQuery.toLowerCase();
        const hits=WORDS.l2l.filter(s=>s.word.includes(q)||s.object.includes(q)||s.sound.toLowerCase().includes(q));
        return hits.length>0?(
          <div style={{marginBottom:14}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:8}}>Results — tap to practice</div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {hits.map((s,i)=>(
                <G key={i} onClick={()=>nav("l2ldetail",{l2l:s})} style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:24}}>{s.emoji}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13,color:"white"}}>{s.word}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.35)"}}>{s.object} · {s.sound}</div>
                  </div>
                  {s.ling&&<div style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:`${LING_MAP[s.ling].color}22`,color:LING_MAP[s.ling].color,fontWeight:700}}>{LING_MAP[s.ling].phoneme}</div>}
                </G>
              ))}
            </div>
          </div>
        ):(
          <div style={{textAlign:"center",padding:"12px 0",color:"rgba(255,255,255,0.25)",fontSize:12,marginBottom:14}}>No matches for "{searchQuery}"</div>
        );
      })()}

      {!searchQuery&&<>{/* Vowel Focus */}
      <div style={SL}>🗣 Vowel Focus</div>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {Object.entries(VOWEL_META).map(([k,v])=>{
          const active=vowelFocus===k;
          const count=WORDS.l2l.filter(s=>s.ling===k).length;
          return(
            <button key={k} onClick={()=>{const next=active?null:k;setVowelFocus(next);if(next)nav("vowelfocus");}} style={{flex:1,padding:"12px 6px",borderRadius:12,background:active?v.gradient:"rgba(255,255,255,0.05)",border:active?"none":`1px solid ${v.color}33`,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:2}}>{v.mouth}</div>
              <div style={{fontSize:18,fontWeight:900,color:active?"white":v.color}}>{v.phoneme}</div>
              <div style={{fontSize:8,color:active?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.3)",marginTop:2}}>{count} sounds</div>
            </button>
          );
        })}
      </div>

      {focusL2l && (
        <G style={{padding:"12px 14px",marginBottom:14,border:"1px solid rgba(178,75,243,0.3)",background:"rgba(178,75,243,0.08)"}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"#B24BF3",marginBottom:6}}>🎯 This week's focus</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:28}}>{focusL2l.emoji}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:15,color:"white"}}>{focusL2l.word} — {focusL2l.object}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.45)"}}>{focusL2l.sound}{focusL2l.ling?` · Ling ${LING_MAP[focusL2l.ling]?.phoneme}`:""}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:6,marginTop:10}}>
            <button onClick={()=>nav("l2ldetail",{l2l:focusL2l})} style={{flex:1,padding:"7px",borderRadius:8,background:"rgba(178,75,243,0.15)",border:"1px solid rgba(178,75,243,0.3)",color:"#B24BF3",fontWeight:700,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>Practice →</button>
            <button onClick={()=>setFocusL2l(null)} style={{padding:"7px 10px",borderRadius:8,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.35)",fontWeight:600,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>Clear</button>
          </div>
        </G>
      )}

      <div style={SL}>DIP Dimensions</div>
      <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:24}}>
        {["D","I","P"].map(d=>{const m=DIP_META[d];return(
          <button key={d} onClick={()=>nav("dip",{dip:d})} style={{width:84,height:84,borderRadius:"50%",background:m.gradient,border:"2px solid rgba(255,255,255,0.12)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 24px ${m.color}28`,fontFamily:"inherit"}}>
            <span style={{fontSize:18}}>{m.icon}</span><span style={{fontSize:17,fontWeight:900,color:"white"}}>{d}</span><span style={{fontSize:7,color:"rgba(255,255,255,0.6)"}}>{m.tagline}</span>
          </button>
        );})}
      </div>

      <div style={SL}>🎮 Games</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:24}}>
        {GAMES.map(g => (
          <G key={g.id} onClick={()=>nav("game",{game:g.id})} style={{padding:"14px 12px",textAlign:"center"}}>
            <span style={{fontSize:28,display:"block",marginBottom:6}}>{g.icon}</span>
            <div style={{fontWeight:800,fontSize:13,color:g.color,marginBottom:2}}>{g.name}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",lineHeight:1.4}}>{g.desc}</div>
          </G>
        ))}
      </div>

      <div style={SL}>Vocabulary</div>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
        {Object.entries(VOCAB_CATEGORIES).map(([key,cat])=>{
          const count=key==="power"?POWER_WORDS.length:key==="l2l"?WORDS.l2l.length:(WORDS[key]||[]).length;
          return(
            <G key={key} onClick={()=>nav("category",{cat:key})} style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:9,background:`${cat.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{cat.icon}</div>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:"white"}}>{cat.label}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.35)"}}>{cat.desc}</div></div>
              <div style={{fontSize:15,fontWeight:900,color:cat.color}}>{count}</div>
            </G>
          );
        })}
      </div>

      <G style={{padding:"12px 14px",background:"linear-gradient(135deg,rgba(108,99,255,0.06),rgba(224,64,160,0.06),rgba(0,212,170,0.06))"}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#00D4AA",marginBottom:4}}>🧠 Remi's brain right now</div>
        <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>Every sound-object pairing, every DIP contrast, every power word is building auditory neural pathways. <strong style={{color:"rgba(255,255,255,0.85)"}}>Sound has shape — and words have meaning.</strong></p>
      </G>

      {logged.length>0&&<G onClick={()=>setShowLog(!showLog)} style={{padding:"10px 14px",marginTop:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>📋 Log ({logged.length})</span><span style={{fontSize:10,color:"rgba(255,255,255,0.25)"}}>{showLog?"▲":"▼"}</span></G>}
      {showLog&&<div style={{marginTop:8}}>{renderLog()}</div>}
      </>}
    </div>
  );

  const renderGame = () => {
    const game = GAMES.find(g=>g.id===gameId);
    if (!game) return null;

    return (
      <div style={{padding:"0 16px 100px"}}>
        <div style={{paddingTop:14}}>{backBtn("Home")}</div>
        <div style={{textAlign:"center",padding:"8px 0 20px",position:"relative"}}>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:140,height:140,borderRadius:"50%",background:`radial-gradient(circle,${game.color}22,transparent 70%)`,filter:"blur(25px)",pointerEvents:"none"}}/>
          <span style={{fontSize:44,display:"block",marginBottom:8}}>{game.icon}</span>
          <h2 style={{margin:"0 0 4px",fontSize:24,fontWeight:900,color:game.color}}>{game.name}</h2>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",maxWidth:280,margin:"0 auto"}}>{game.desc}</div>
        </div>

        {focusL2l && <div style={{fontSize:10,textAlign:"center",color:"#B24BF3",marginBottom:12,fontWeight:600}}>🎯 Filtered to: {focusL2l.emoji} {focusL2l.word} {focusL2l.ling?`& related ${LING_MAP[focusL2l.ling]?.phoneme} sounds`:""}</div>}

        <G style={{padding:"12px 14px",marginBottom:20}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:8}}>How to play</div>
          {game.howTo.split("\n").map((line,i)=><p key={i} style={{margin:"0 0 4px",fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.5}}>{line}</p>)}
        </G>

        {gameId==="peekaboo"&&<PeekabooGame pool={soundPool.length>=2?soundPool:fullPool} addLog={addLog}/>}
        {gameId==="dipdice"&&<DipDiceGame pool={soundPool.length>=1?soundPool:fullPool} addLog={addLog}/>}
        {gameId==="safari"&&<SafariGame pool={fullPool} focusPool={soundPool} addLog={addLog}/>}
        {gameId==="contrast"&&<ContrastGame pool={fullPool} addLog={addLog}/>}
        {gameId==="storychain"&&<StoryChainGame pool={fullPool} addLog={addLog}/>}
      </div>
    );
  };

  const renderCategory = () => {
    const cat = VOCAB_CATEGORIES[catKey]; if(!cat) return null;
    const isL2l=catKey==="l2l", isPower=catKey==="power";
    const allWords=isPower?POWER_WORDS:isL2l?WORDS.l2l:(WORDS[catKey]||[]);
    const q=searchQuery.toLowerCase();
    const words=isL2l&&q?allWords.filter(s=>s.word.includes(q)||s.object.includes(q)||s.sound.toLowerCase().includes(q)):allWords;
    return(
      <div style={{padding:"0 16px 100px"}}>
        <div style={{paddingTop:14}}>{backBtn("Home")}</div>
        <div style={{padding:"8px 0 10px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:22}}>{cat.icon}</span><h2 style={{margin:0,fontSize:22,fontWeight:900,color:cat.color}}>{cat.label}</h2></div>
          <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.35)"}}>{cat.desc} · {words.length} words</p>
        </div>
        {isL2l&&<div style={{position:"relative",marginBottom:10}}>
          <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="🔍  Filter sounds…" style={{width:"100%",padding:"9px 14px",borderRadius:9,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",color:"white",fontSize:12,outline:"none",fontFamily:"inherit"}}/>
          {searchQuery&&<button onClick={()=>setSearchQuery("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:16,cursor:"pointer",lineHeight:1}}>×</button>}
        </div>}
        {isL2l&&<div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
          {["ah","oo","ee"].map(ling=>{
            const vm=VOWEL_META[ling];const active=searchQuery===ling;
            return <button key={ling} onClick={()=>setSearchQuery(active?"":ling)} style={{padding:"4px 10px",borderRadius:6,background:active?vm.gradient:"rgba(255,255,255,0.05)",border:active?"none":`1px solid ${vm.color}33`,color:active?"white":vm.color,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{vm.phoneme} {vm.mouth}</button>;
          })}
          <button onClick={()=>setSearchQuery("")} style={{padding:"4px 8px",borderRadius:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.3)",fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>All</button>
        </div>}
        <div style={{display:"flex",gap:3,marginBottom:10,flexWrap:"wrap"}}>
          {STAGES.map(st=><div key={st.key} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 6px",borderRadius:5,background:"rgba(255,255,255,0.04)"}}><div style={{width:7,height:7,borderRadius:2,background:st.color}}/><span style={{fontSize:8,color:"rgba(255,255,255,0.4)",fontWeight:600}}>{st.key}={st.label}</span></div>)}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {words.map((item,idx)=>{
            const word=isL2l?item.word:item;const isPW=POWER_WORDS.includes(word);const tr=tracking[word]||{};
            return(
              <G key={idx} onClick={isL2l?()=>nav("l2ldetail",{l2l:item}):undefined} style={{padding:"9px 11px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  {isL2l&&<span style={{fontSize:20,flexShrink:0}}>{item.emoji}</span>}
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontWeight:700,fontSize:13,color:"white"}}>{isL2l?item.word:word}</span>{isPW&&<span style={{fontSize:7,fontWeight:700,padding:"1px 4px",borderRadius:3,background:"rgba(255,107,107,0.15)",color:"#FF6B6B"}}>POWER</span>}</div>
                    {isL2l&&<div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>{item.object} · {item.sound}</div>}
                  </div>
                  <div style={{display:"flex",gap:2}}>
                    {STAGES.map(st=><button key={st.key} onClick={e=>{e.stopPropagation();toggleTrack(word,st.key);}} style={{width:24,height:24,borderRadius:5,fontSize:8,fontWeight:800,cursor:"pointer",fontFamily:"inherit",background:tr[st.key]?st.color:"rgba(255,255,255,0.04)",color:tr[st.key]?"white":"rgba(255,255,255,0.2)",border:tr[st.key]?"none":"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>{st.key}</button>)}
                  </div>
                </div>
                {isL2l&&<div style={{display:"flex",gap:5,marginTop:6}}>
                  <button onClick={e=>{e.stopPropagation();setFocusL2l(item);}} style={{fontSize:9,padding:"3px 8px",borderRadius:5,background:focusL2l?.word===item.word?"linear-gradient(135deg,#B24BF3,#6C63FF)":"rgba(178,75,243,0.1)",border:focusL2l?.word===item.word?"none":"1px solid rgba(178,75,243,0.2)",color:focusL2l?.word===item.word?"white":"#B24BF3",cursor:"pointer",fontWeight:600,fontFamily:"inherit"}}>{focusL2l?.word===item.word?"✓ Focus":"Set Focus"}</button>
                  <button onClick={e=>{e.stopPropagation();nav("l2ldetail",{l2l:item});}} style={{fontSize:9,padding:"3px 8px",borderRadius:5,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.45)",cursor:"pointer",fontWeight:600,fontFamily:"inherit"}}>DIP + Toys + Songs →</button>
                </div>}
              </G>
            );
          })}
        </div>
      </div>
    );
  };

  const renderL2lDetail = () => {
    if(!l2lItem)return null;
    const s=l2lItem;
    const songs=L2L_SONGS[s.word]||[];
    const toys=L2L_TOYS[s.word]||[];
    const dipP=L2L_DIP[s.word]||{};
    // l2lTab / setL2lTab are now in App component state (hooks rules compliance)
    return(
      <div style={{padding:"0 16px 100px"}}>
        <div style={{paddingTop:14}}>{backBtn("Learning to Listen","category",{cat:"l2l"})}</div>
        <div style={{textAlign:"center",padding:"10px 0 18px",position:"relative"}}>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:120,height:120,borderRadius:"50%",background:`radial-gradient(circle,${s.ling?LING_MAP[s.ling].color:"#B24BF3"}22,transparent 70%)`,filter:"blur(20px)",pointerEvents:"none"}}/>
          <span style={{fontSize:44,display:"block",marginBottom:6}}>{s.emoji}</span>
          <h2 style={{margin:"0 0 2px",fontSize:26,fontWeight:900,color:s.ling?LING_MAP[s.ling].color:"#B24BF3"}}>{s.word}</h2>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{s.object} · "{s.sound}"</div>
          {s.ling&&<div style={{fontSize:9,color:LING_MAP[s.ling].color,marginTop:3,fontWeight:600}}>Ling: {LING_MAP[s.ling].phoneme}</div>}
          <button onClick={()=>setFocusL2l(s)} style={{marginTop:8,fontSize:10,padding:"5px 14px",borderRadius:7,background:focusL2l?.word===s.word?"linear-gradient(135deg,#B24BF3,#6C63FF)":"rgba(178,75,243,0.1)",border:focusL2l?.word===s.word?"none":"1px solid rgba(178,75,243,0.25)",color:focusL2l?.word===s.word?"white":"#B24BF3",cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}>{focusL2l?.word===s.word?"✓ Weekly Focus":"Set as Focus"}</button>
        </div>
        <div style={{display:"flex",gap:3,marginBottom:14,background:"rgba(255,255,255,0.03)",borderRadius:9,padding:3}}>
          {[{id:"dip",l:"DIP Practice",i:"🎯"},{id:"toys",l:"Toys",i:"🧸"},{id:"songs",l:"Songs",i:"🎵"}].map(t=><button key={t.id} onClick={()=>setL2lTab(t.id)} style={{flex:1,padding:"8px 4px",borderRadius:7,background:l2lTab===t.id?"rgba(255,255,255,0.08)":"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",color:l2lTab===t.id?"white":"rgba(255,255,255,0.3)",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:3}}><span style={{fontSize:11}}>{t.i}</span>{t.l}</button>)}
        </div>
        {l2lTab==="dip"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
          {["D","I","P"].map(d=>{const m=DIP_META[d];const isL=logged.some(l=>l.dim===d&&l.sound===s.word);return(
            <G key={d} style={{padding:"12px 14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{width:28,height:28,borderRadius:7,background:m.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,boxShadow:`0 2px 10px ${m.color}28`}}>{m.icon}</div>
                <div><div style={{fontWeight:800,fontSize:13,color:"white"}}>{m.label}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>{m.tagline}</div></div>
              </div>
              <div style={{background:"rgba(255,255,255,0.03)",borderRadius:8,padding:"3px 8px",marginBottom:8}}><DipViz dim={d}/></div>
              <p style={{margin:"0 0 10px",fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.6}}>{dipP[d]}</p>
              <button onClick={()=>addLog({dim:d,sound:s.word,label:`${m.label} · ${s.emoji} ${s.word}`})} style={{width:"100%",padding:"8px",borderRadius:8,fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"inherit",background:isL?m.gradient:"rgba(255,255,255,0.04)",color:isL?"white":m.color,border:isL?"none":`1px solid ${m.color}28`,transition:"all 0.2s"}}>{isL?"✓ Practiced!":"Log "+m.label}</button>
            </G>
          );})}
          <G style={{padding:"10px 12px"}}><div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5}}>Observation</div><div style={{display:"flex",gap:6}}><input value={noteInput} onChange={e=>setNoteInput(e.target.value)} placeholder={`e.g. Remi turned head for ${s.word}`} style={{flex:1,fontSize:11,padding:"8px 10px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,color:"white",outline:"none",fontFamily:"inherit"}} onKeyDown={e=>{if(e.key==="Enter"&&noteInput.trim()){addLog({dim:"📝",sound:s.word,label:noteInput.trim(),note:true});setNoteInput("");}}} /><button onClick={()=>{if(noteInput.trim()){addLog({dim:"📝",sound:s.word,label:noteInput.trim(),note:true});setNoteInput("");}}} style={{padding:"8px 12px",background:"linear-gradient(135deg,#6C63FF,#E040A0)",border:"none",borderRadius:8,color:"white",fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Add</button></div></G>
        </div>}
        {l2lTab==="toys"&&<div style={{display:"flex",flexDirection:"column",gap:5}}>{toys.map((t,i)=><G key={i} style={{padding:"10px 12px",display:"flex",gap:10,alignItems:"center"}}><div style={{width:24,height:24,borderRadius:6,background:`${s.ling?LING_MAP[s.ling].color:"#B24BF3"}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:s.ling?LING_MAP[s.ling].color:"#B24BF3",fontWeight:900,flexShrink:0}}>{i+1}</div><div style={{fontWeight:600,fontSize:12,color:"white"}}>{t}</div></G>)}</div>}
        {l2lTab==="songs"&&<div style={{display:"flex",flexDirection:"column",gap:5}}>{songs.map((sg,i)=><G key={i} style={{padding:"10px 12px",display:"flex",gap:10,alignItems:"center"}}><div style={{width:24,height:24,borderRadius:6,background:"linear-gradient(135deg,rgba(108,99,255,0.12),rgba(224,64,160,0.12))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>🎶</div><div style={{fontWeight:600,fontSize:12,color:"white"}}>{sg}</div></G>)}</div>}
      </div>
    );
  };

  const renderVowelFocus = () => {
    const v = VOWEL_META[vowelFocus]; if(!v) return null;
    const sounds = WORDS.l2l.filter(s=>s.ling===vowelFocus);
    return(
      <div style={{padding:"0 16px 100px"}}>
        <div style={{paddingTop:14}}>{backBtn("Home")}</div>
        <div style={{textAlign:"center",padding:"10px 0 20px",position:"relative"}}>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:160,height:160,borderRadius:"50%",background:`radial-gradient(circle,${v.color}20,transparent 70%)`,filter:"blur(30px)",pointerEvents:"none"}}/>
          <div style={{fontSize:52,marginBottom:6}}>{v.mouth}</div>
          <h2 style={{margin:"0 0 2px",fontSize:32,fontWeight:900,color:v.color}}>{v.phoneme}</h2>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:4}}>{v.desc}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.55)",fontStyle:"italic"}}>{v.tip}</div>
        </div>

        <G style={{padding:"12px 14px",marginBottom:16,background:`linear-gradient(135deg,${v.color}08,transparent)`}}>
          <div style={{fontSize:9,fontWeight:700,color:v.color,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>💡 Mouth Position</div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:v.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{v.mouth}</div>
            <div>
              <p style={{margin:"0 0 4px",fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.5}}><strong style={{color:"white"}}>{v.phoneme}</strong> — {v.tip}</p>
              <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.4)",lineHeight:1.5}}>All {sounds.length} sounds below share this vowel. When you make these sounds, you're drilling the same mouth shape each time.</p>
            </div>
          </div>
        </G>

        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:10}}>Sounds with {v.phoneme}</div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {sounds.map((s,i)=>(
            <G key={i} onClick={()=>nav("l2ldetail",{l2l:s})} style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:28,flexShrink:0}}>{s.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:14,color:"white"}}>{s.word}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>{s.object} · <em style={{color:v.color}}>{s.sound}</em></div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                <div style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:v.gradient,color:"white",fontWeight:700}}>{v.phoneme}</div>
                <button onClick={e=>{e.stopPropagation();setFocusL2l(s);}} style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:focusL2l?.word===s.word?"rgba(178,75,243,0.4)":"rgba(255,255,255,0.06)",border:"none",color:focusL2l?.word===s.word?"white":"rgba(255,255,255,0.3)",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>{focusL2l?.word===s.word?"✓ Focus":"Focus"}</button>
              </div>
            </G>
          ))}
        </div>

        <div style={{marginTop:16}}>
          <G style={{padding:"12px 14px",background:`linear-gradient(135deg,${v.color}06,transparent)`}}>
            <div style={{fontSize:9,fontWeight:700,color:v.color,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>🎮 Practice with games</div>
            <p style={{margin:"0 0 10px",fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>The vowel filter is active — all games will use only {v.phoneme} sounds.</p>
            <button onClick={()=>nav("game",{game:"peekaboo"})} style={{width:"100%",padding:"10px",borderRadius:9,background:v.gradient,border:"none",color:"white",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>🙈 Play Peek-a-Boo with {v.phoneme} sounds</button>
          </G>
        </div>
      </div>
    );
  };

  const renderDip = () => {
    const m=DIP_META[dipDim];if(!m)return null;
    return(
      <div style={{padding:"0 16px 100px"}}>
        <div style={{paddingTop:14}}>{backBtn("Home")}</div>
        <div style={{textAlign:"center",padding:"8px 0 18px"}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:m.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 8px",boxShadow:`0 4px 24px ${m.color}33`}}>{m.icon}</div>
          <h2 style={{margin:"0 0 2px",fontSize:24,fontWeight:900,color:m.color}}>{m.label}</h2>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{m.tagline}</div>
        </div>
        <G style={{padding:"6px 10px",marginBottom:12}}><DipViz dim={dipDim}/></G>

        {/* Pro Tips card */}
        {DIP_TIPS[dipDim]&&<G style={{padding:"14px",marginBottom:18,background:`linear-gradient(135deg,${m.color}08,transparent)`}}>
          <div style={{fontSize:9,fontWeight:700,color:m.color,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>💡 Why {m.label} matters</div>
          <p style={{margin:"0 0 10px",fontSize:11,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>{DIP_TIPS[dipDim].why}</p>
          <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Technique cues</div>
          {DIP_TIPS[dipDim].cues.map((c,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:4,alignItems:"flex-start"}}><div style={{width:4,height:4,borderRadius:"50%",background:m.color,marginTop:5,flexShrink:0}}/><span style={{fontSize:11,color:"rgba(255,255,255,0.55)",lineHeight:1.5}}>{c}</span></div>)}
          <div style={{marginTop:10,padding:"8px 10px",borderRadius:7,background:"rgba(255,255,255,0.04)",borderLeft:`2px solid ${m.color}`}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginBottom:2}}>Say it like this</div>
            <div style={{fontSize:12,fontWeight:700,color:"white",fontStyle:"italic"}}>"{DIP_TIPS[dipDim].phrase}"</div>
          </div>
        </G>}

        <div style={SL}>{m.label} across all L2L sounds</div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {WORDS.l2l.map((s,i)=>{const dp=L2L_DIP[s.word]?.[dipDim]||"";const isL=logged.some(l=>l.dim===dipDim&&l.sound===s.word);return(
            <G key={i} style={{padding:"11px 13px"}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}><span style={{fontSize:20}}>{s.emoji}</span><div><div style={{fontWeight:800,fontSize:13,color:s.ling?LING_MAP[s.ling]?.color:"#B24BF3"}}>{s.word}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>{s.object}</div></div></div>
              <p style={{margin:"0 0 8px",fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.55}}>{dp}</p>
              <button onClick={()=>addLog({dim:dipDim,sound:s.word,label:`${m.label} · ${s.emoji} ${s.word}`})} style={{width:"100%",padding:"7px",borderRadius:7,fontWeight:700,fontSize:10,cursor:"pointer",fontFamily:"inherit",background:isL?m.gradient:"rgba(255,255,255,0.04)",color:isL?"white":m.color,border:isL?"none":`1px solid ${m.color}22`}}>{isL?"✓ Practiced!":"Log"}</button>
            </G>
          );})}
        </div>
      </div>
    );
  };

  const renderLog = () => (
    <G style={{padding:"12px 14px"}}>
      {logged.length===0?<p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.3)",textAlign:"center"}}>No entries</p>:logged.slice(-20).reverse().map((l,i)=>(
        <div key={l.id} style={{display:"flex",gap:7,alignItems:"center",padding:"5px 0",borderBottom:i<Math.min(logged.length,20)-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
          {l.note?<div style={{width:20,height:20,borderRadius:4,background:"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9}}>📝</div>
          :<div style={{width:20,height:20,borderRadius:4,background:DIP_META[l.dim]?.gradient||"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:900,color:"white"}}>{l.dim}</div>}
          <div style={{flex:1,fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.65)"}}>{l.label}</div>
          <div style={{fontSize:8,color:"rgba(255,255,255,0.2)"}}>{l.time}</div>
        </div>
      ))}
    </G>
  );

  const renderNav = () => (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"rgba(8,8,26,0.93)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.05)",padding:"5px 0 max(5px,env(safe-area-inset-bottom))",display:"flex",justifyContent:"center",gap:4}}>
      {[
        {id:"home",icon:"🏠",label:"Home"},
        ...(vowelFocus?[{id:"vowelfocus",icon:VOWEL_META[vowelFocus].mouth,label:VOWEL_META[vowelFocus].phoneme}]:[]),
        ...(focusL2l?[{id:"focus",icon:focusL2l.emoji,label:focusL2l.word.length>6?focusL2l.word.slice(0,5)+"…":focusL2l.word}]:[]),
        {id:"games",icon:"🎮",label:"Games"},
        {id:"log",icon:"📋",label:`${logged.length||""}`}
      ].map(item=>{
        const active=item.id==="log"?showLog:item.id==="focus"?(view==="l2ldetail"&&l2lItem?.word===focusL2l?.word):item.id==="vowelfocus"?view==="vowelfocus":item.id==="games"?view==="game"||view==="games":view===item.id;
        return(
          <button key={item.id} onClick={()=>{if(item.id==="log")setShowLog(!showLog);else if(item.id==="focus")nav("l2ldetail",{l2l:focusL2l});else if(item.id==="vowelfocus")nav("vowelfocus");else if(item.id==="games")nav("home");else nav(item.id);}} style={{background:active?"rgba(255,255,255,0.07)":"none",border:"none",borderRadius:8,padding:"5px 12px",color:active?"white":"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:9,fontWeight:700,fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:1,position:"relative"}}>
            <span style={{fontSize:14}}>{item.icon}</span>{item.label}
            {item.id==="log"&&logged.length>0&&<div style={{position:"absolute",top:1,right:4,width:13,height:13,borderRadius:"50%",background:"linear-gradient(135deg,#E040A0,#6C63FF)",fontSize:7,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",color:"white"}}>{logged.length}</div>}
          </button>
        );
      })}
    </div>
  );

  return(
    <div style={{background:"linear-gradient(160deg,#08081a 0%,#140a28 35%,#0a142a 65%,#08081a 100%)",minHeight:"100vh",color:"white",fontFamily:"'Outfit','Helvetica Neue',sans-serif",position:"relative",overflow:"hidden"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap');*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}button{font-family:inherit}input::placeholder{color:rgba(255,255,255,0.2)}@keyframes shimmer{to{background-position:200% center}}@keyframes holoShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}@keyframes popIn{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}::-webkit-scrollbar{width:0}`}</style>
      <div style={{position:"fixed",top:-100,right:-60,width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle,rgba(108,99,255,0.06),transparent 60%)",pointerEvents:"none"}}/>
      <div style={{position:"fixed",bottom:-80,left:-60,width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,rgba(224,64,160,0.04),transparent 60%)",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:1,maxWidth:420,margin:"0 auto"}}>
        {view==="home"&&renderHome()}
        {view==="category"&&renderCategory()}
        {view==="l2ldetail"&&renderL2lDetail()}
        {view==="dip"&&renderDip()}
        {view==="game"&&renderGame()}
        {view==="vowelfocus"&&renderVowelFocus()}
        {showLog&&view!=="home"&&logged.length>0&&<div style={{position:"fixed",bottom:56,left:12,right:12,maxWidth:396,margin:"0 auto",zIndex:99}}>{renderLog()}</div>}
      </div>
      {renderNav()}
    </div>
  );
}

function PeekabooGame({ pool, addLog }) {
  const [round, setRound] = useState(null);
  const [phase, setPhase] = useState("ready"); // ready|hide|countdown|reveal|react
  const [count, setCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [cntDown, setCntDown] = useState(3);

  // Countdown logic
  useEffect(() => {
    if (phase !== "countdown") return;
    setCntDown(3);
    const id = setInterval(() => {
      setCntDown(v => {
        if (v <= 1) { clearInterval(id); setPhase("reveal"); return 3; }
        return v - 1;
      });
    }, 800);
    return () => clearInterval(id);
  }, [phase]);

  const newRound = () => {
    const s = pick(pool);
    const d = pickDip();
    const challenges = {
      D: [
        [`Looooong "${s.sound}"`, `Hold the sound behind your back for a full 3 seconds — no cutting it short!`],
        [`Short sharp bursts`, `"${s.word}! ${s.word}! ${s.word}!" — quick staccato pops, hidden from view`],
      ],
      I: [
        [`Whisper`, `Make the ${s.object} sound so soft Remi has to work to hear it — barely audible`],
        [`LOUD burst`, `Start silent… then EXPLODE with "${s.sound.toUpperCase()}" — surprise is the hook!`],
      ],
      P: [
        [`Squeaky high voice`, `Hit your highest pitch for "${s.sound}" while the ${s.object} is hidden`],
        [`Deep giant voice`, `Rumbling low "${s.sound}" like a slow-motion giant ${s.object}`],
      ],
    };
    const ch = pick(challenges[d]);
    setRound({ sound: s, dim: d, tag: ch[0], challenge: ch[1] });
    setPhase("hide");
  };

  const logAndReact = (reaction) => {
    addLog({dim:round.dim,sound:round.sound.word,label:`🙈 ${round.sound.emoji} ${round.sound.word} · ${DIP_META[round.dim].label} · ${reaction}`});
    const responded = reaction !== "😐 No response";
    setStreak(s => responded ? s + 1 : 0);
    setCount(c => c + 1);
  };

  const m = round ? DIP_META[round.dim] : null;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>

      {/* Header bar */}
      {count > 0 && (
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"2px 4px"}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.25)"}}>{count} round{count!==1?"s":""}</div>
          {streak > 0 && <div style={{fontSize:12,fontWeight:700,color:"#F59E0B"}}>🔥 {streak} streak</div>}
        </div>
      )}

      {/* READY */}
      {phase==="ready"&&(
        <G onClick={newRound} style={{padding:"36px 20px",textAlign:"center",border:"1px solid rgba(224,64,160,0.25)",background:"linear-gradient(135deg,rgba(224,64,160,0.06),rgba(178,75,243,0.06))"}}>
          <div style={{fontSize:64,marginBottom:12,animation:"pulse 2s infinite"}}>🙈</div>
          <div style={{fontSize:20,fontWeight:900,color:"#E040A0",marginBottom:6}}>Tap to start!</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>Round {count+1} {streak>1?`· 🔥${streak}`:""}</div>
        </G>
      )}

      {/* HIDE */}
      {phase==="hide"&&round&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{padding:"14px",borderRadius:14,background:`linear-gradient(135deg,${m.color}15,rgba(0,0,0,0))`,border:`1px solid ${m.color}44`,textAlign:"center"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:6,background:m.gradient,fontSize:10,fontWeight:700,marginBottom:12}}>{m.icon} {m.label} Challenge</div>
            <div style={{fontSize:80,display:"block",marginBottom:10,filter:"blur(10px)",userSelect:"none",lineHeight:1}}>{round.sound.emoji}</div>
            <div style={{fontSize:13,fontWeight:800,color:m.color,marginBottom:4}}>{round.tag}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.6,maxWidth:290,margin:"0 auto"}}>{round.challenge}</div>
          </div>

          <G style={{padding:"4px 10px"}}><DipViz dim={round.dim}/></G>

          <div style={{padding:"10px 12px",borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",fontSize:11,color:"rgba(255,255,255,0.45)",textAlign:"center",lineHeight:1.5}}>
            🎵 Make the sound now, then tap Reveal when ready
          </div>

          <button onClick={()=>setPhase("countdown")} style={{padding:"16px",borderRadius:12,background:`linear-gradient(135deg,${m.color},${m.color}99)`,border:"none",color:"white",fontWeight:900,fontSize:16,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.05em",boxShadow:`0 4px 24px ${m.color}44`}}>
            👀 Reveal!
          </button>
        </div>
      )}

      {/* COUNTDOWN */}
      {phase==="countdown"&&(
        <div style={{textAlign:"center",padding:"40px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
          <div style={{fontSize:96,fontWeight:900,lineHeight:1,color:"white",animation:"pulse 0.8s infinite",textShadow:`0 0 40px ${m?.color||"#E040A0"}88`}}>{cntDown}</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",letterSpacing:"0.15em",textTransform:"uppercase"}}>Get ready…</div>
        </div>
      )}

      {/* REVEAL */}
      {phase==="reveal"&&round&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{padding:"24px 16px",borderRadius:16,background:"linear-gradient(135deg,rgba(0,212,170,0.08),rgba(108,99,255,0.08))",border:"1px solid rgba(0,212,170,0.25)",textAlign:"center"}}>
            <div style={{fontSize:96,display:"block",marginBottom:10,animation:"pulse 1s ease-out",filter:`drop-shadow(0 0 20px ${m.color}66)`}}>{round.sound.emoji}</div>
            <div style={{fontSize:28,fontWeight:900,color:"white",marginBottom:4,letterSpacing:"0.05em"}}>{round.sound.word}!</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:8}}>"{round.sound.sound}"</div>
            {round.sound.ling && <div style={{display:"inline-block",padding:"3px 10px",borderRadius:6,background:`${LING_MAP[round.sound.ling].color}22`,color:LING_MAP[round.sound.ling].color,fontSize:10,fontWeight:700,marginBottom:8}}>Ling {LING_MAP[round.sound.ling].phoneme}</div>}
            <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",lineHeight:1.6}}>Say it again with the toy visible —<br/><strong style={{color:"white"}}>auditory sandwich! 🥪</strong></div>
          </div>

          <div style={{padding:"10px 14px",borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>DIP recap — {m.label}</div>
            <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.55}}>{L2L_DIP[round.sound.word]?.[round.dim]||""}</p>
          </div>

          <button onClick={()=>setPhase("react")} style={{padding:"14px",borderRadius:12,background:"linear-gradient(135deg,#6C63FF,#B24BF3)",border:"none",color:"white",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>
            📊 How did Remi respond?
          </button>
        </div>
      )}

      {/* REACT */}
      {phase==="react"&&round&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{textAlign:"center",padding:"10px 0 4px"}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:6}}>What did Remi do?</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{round.sound.emoji} {round.sound.word}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[
              {icon:"👂",label:"Head turn",color:"#6C63FF"},
              {icon:"😊",label:"Smiled",color:"#00D4AA"},
              {icon:"🗣️",label:"Vocalized",color:"#E040A0"},
              {icon:"👋",label:"Reached / looked",color:"#F59E0B"},
            ].map(r=>(
              <button key={r.label} onClick={()=>{logAndReact(`${r.icon} ${r.label}`);newRound();}} style={{padding:"16px 8px",borderRadius:12,background:`${r.color}18`,border:`1px solid ${r.color}44`,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:4}}>{r.icon}</div>
                <div style={{fontSize:11,fontWeight:700,color:r.color}}>{r.label}</div>
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{logAndReact("😐 No response");newRound();}} style={{flex:1,padding:"12px",borderRadius:10,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.4)",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>😐 No response</button>
            <button onClick={()=>{logAndReact("⏭ Skipped");setPhase("ready");}} style={{padding:"12px 14px",borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.25)",fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Done</button>
          </div>
          {streak>=3&&<div style={{textAlign:"center",padding:"8px",borderRadius:8,background:"linear-gradient(135deg,rgba(245,158,11,0.15),rgba(224,64,160,0.1))",border:"1px solid rgba(245,158,11,0.3)",fontSize:12,color:"#F59E0B",fontWeight:700}}>🔥 {streak} responses in a row! Remi is ON!</div>}
        </div>
      )}
    </div>
  );
}

function DipDiceGame({ pool, addLog }) {
  const [roll, setRoll] = useState(null);
  const [rolling, setRolling] = useState(false);

  const doRoll = () => {
    setRolling(true);
    setTimeout(()=>{
      const s = pick(pool);
      const d = pickDip();
      setRoll({sound:s, dim:d});
      setRolling(false);
    }, 600);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <button onClick={doRoll} disabled={rolling} style={{padding:"20px",borderRadius:14,background:rolling?"rgba(255,255,255,0.06)":"linear-gradient(135deg,#6C63FF,#00D4AA)",border:"none",color:"white",fontWeight:800,fontSize:16,cursor:rolling?"wait":"pointer",fontFamily:"inherit",textAlign:"center",transition:"all 0.3s"}}>
        {rolling?"🎲 Rolling…":"🎲 Roll the DIP Dice!"}
      </button>

      {roll&&!rolling&&(
        <>
          <G style={{padding:"16px",textAlign:"center"}}>
            <span style={{fontSize:48,display:"block",marginBottom:8}}>{roll.sound.emoji}</span>
            <div style={{fontSize:20,fontWeight:900,color:roll.sound.ling?LING_MAP[roll.sound.ling]?.color:"#B24BF3"}}>{roll.sound.word}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:10}}>{roll.sound.object} · "{roll.sound.sound}"</div>
            <div style={{display:"inline-block",padding:"5px 14px",borderRadius:8,background:DIP_META[roll.dim].gradient,fontSize:12,fontWeight:700,marginBottom:10}}>{DIP_META[roll.dim].icon} {DIP_META[roll.dim].label}</div>
          </G>
          <G style={{padding:"4px 10px"}}><DipViz dim={roll.dim}/></G>
          <G style={{padding:"12px 14px"}}>
            <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>{L2L_DIP[roll.sound.word]?.[roll.dim]||`Practice ${roll.sound.word} with ${DIP_META[roll.dim].label} contrast`}</p>
          </G>
          <button onClick={()=>{addLog({dim:roll.dim,sound:roll.sound.word,label:`🎲 Dice · ${roll.sound.emoji} ${roll.sound.word} · ${DIP_META[roll.dim].label}`});}} style={{padding:"10px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>✓ Log this practice</button>
        </>
      )}
    </div>
  );
}

function SafariGame({ pool, focusPool, addLog }) {
  const [list, setList] = useState(null);
  const [checked, setChecked] = useState({});

  const generate = () => {
    const focusItems = pickN(focusPool, 2);
    const remaining = pool.filter(s=>!focusItems.find(f=>f.word===s.word));
    const others = pickN(remaining, 3);
    const safari = [...focusItems,...others].map(s=>({...s,dim:pickDip()}));
    setList(safari);
    setChecked({});
  };

  const done = Object.keys(checked).length;
  const total = list?.length||5;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <button onClick={generate} style={{padding:"14px",borderRadius:12,background:"linear-gradient(135deg,#F59E0B,#FF6B6B)",border:"none",color:"white",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>🦁 {list?"New":"Start"} Safari!</button>

      {list&&(
        <>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 4px"}}>
            <span style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{done}/{total} found</span>
            <div style={{flex:1,marginLeft:10,height:6,background:"rgba(255,255,255,0.08)",borderRadius:3}}>
              <div style={{height:"100%",borderRadius:3,width:`${(done/total)*100}%`,background:"linear-gradient(90deg,#F59E0B,#FF6B6B)",transition:"width 0.4s"}}/>
            </div>
          </div>
          {list.map((item,i)=>{
            const isDone = checked[i];
            return(
              <G key={i} style={{padding:"12px 14px",opacity:isDone?0.5:1,transition:"opacity 0.3s"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:28}}>{item.emoji}</span>
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
            );
          })}
          {done===total&&<G style={{padding:"16px",textAlign:"center",border:"1px solid rgba(0,212,170,0.3)",background:"rgba(0,212,170,0.08)"}}><span style={{fontSize:36,display:"block",marginBottom:6}}>🎉</span><div style={{fontSize:16,fontWeight:900,color:"#00D4AA"}}>Safari Complete!</div><div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:4}}>All 5 sounds practiced with DIP. That's real auditory input.</div></G>}
        </>
      )}
    </div>
  );
}

function ContrastGame({ pool, addLog }) {
  const [pair, setPair] = useState(null);

  const generate = () => {
    const two = pickN(pool, 2);
    const d = pickDip();
    const extremes = {
      D: [["LOOOOONG — stretch it out as far as you can","SHORT — quick burst, one tap"],["Sustained glide — don't let the sound stop","Staccato — choppy, pulsed, rapid-fire"]],
      I: [["WHISPER — barely audible, make them lean in","FULL VOICE — project like you mean it"],["Gentle breath — softest you can manage","Surprised SHOUT — sudden burst of volume"]],
      P: [["Highest squeaky voice possible","Deepest rumble you can manage"],["Rising question — pitch goes up↗","Falling statement — pitch drops down↘"]],
    };
    const ext = pick(extremes[d]);
    setPair({a:two[0], b:two[1], dim:d, extA:ext[0], extB:ext[1]});
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <button onClick={generate} style={{padding:"14px",borderRadius:12,background:"linear-gradient(135deg,#00D4AA,#6C63FF)",border:"none",color:"white",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>⚡ {pair?"New":"Generate"} Contrast!</button>

      {pair&&(
        <>
          <div style={{textAlign:"center",padding:"6px 0"}}>
            <div style={{display:"inline-block",padding:"4px 12px",borderRadius:6,background:DIP_META[pair.dim].gradient,fontSize:11,fontWeight:700}}>{DIP_META[pair.dim].icon} {DIP_META[pair.dim].label} Contrast</div>
          </div>
          <G style={{padding:"4px 10px"}}><DipViz dim={pair.dim}/></G>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <G style={{padding:"14px 12px",textAlign:"center",borderColor:`${DIP_META[pair.dim].color}33`}}>
              <span style={{fontSize:36,display:"block",marginBottom:6}}>{pair.a.emoji}</span>
              <div style={{fontWeight:800,fontSize:14,color:"white",marginBottom:4}}>{pair.a.word}</div>
              <div style={{fontSize:10,color:DIP_META[pair.dim].color,fontWeight:600,lineHeight:1.4,minHeight:40}}>{pair.extA}</div>
            </G>
            <G style={{padding:"14px 12px",textAlign:"center",borderColor:`${DIP_META[pair.dim].color}33`}}>
              <span style={{fontSize:36,display:"block",marginBottom:6}}>{pair.b.emoji}</span>
              <div style={{fontWeight:800,fontSize:14,color:"white",marginBottom:4}}>{pair.b.word}</div>
              <div style={{fontSize:10,color:DIP_META[pair.dim].color,fontWeight:600,lineHeight:1.4,minHeight:40}}>{pair.extB}</div>
            </G>
          </div>

          <G style={{padding:"10px 14px"}}>
            <p style={{margin:0,fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.6,textAlign:"center"}}>Make these two sounds as <strong style={{color:"white"}}>different</strong> as possible. The bigger the {DIP_META[pair.dim].label.toLowerCase()} contrast, the more Remi's brain has to work with.</p>
          </G>
          <button onClick={()=>{addLog({dim:pair.dim,sound:`${pair.a.word}+${pair.b.word}`,label:`⚡ Contrast · ${pair.a.emoji}${pair.b.emoji} · ${DIP_META[pair.dim].label}`});}} style={{padding:"10px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>✓ Log this contrast</button>
        </>
      )}
    </div>
  );
}

function StoryChainGame({ pool, addLog }) {
  const [chain, setChain] = useState(null);

  const generate = () => {
    const three = pickN(pool, 3);
    const dims = [pickDip(), pickDip(), pickDip()];
    const connectors = [
      ["One day", "met", "and together they"],
      ["Once upon a time", "heard", "and ran to find"],
      ["In a big house lived", "who found", "and they both saw"],
      ["Wake up!", "Look who's here —", "Oh! And here comes"],
    ];
    setChain({ sounds: three, dims, connector: pick(connectors) });
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <button onClick={generate} style={{padding:"14px",borderRadius:12,background:"linear-gradient(135deg,#B24BF3,#E040A0)",border:"none",color:"white",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>📖 {chain?"New":"Build a"} Story!</button>

      {chain&&(
        <>
          <G style={{padding:"16px",textAlign:"center"}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:12}}>Your story</div>

            {chain.sounds.map((s,i)=>(
              <div key={i}>
                {i>0&&<div style={{fontSize:12,color:"rgba(255,255,255,0.3)",fontStyle:"italic",margin:"8px 0"}}>{chain.connector[i]||"and then..."}</div>}
                {i===0&&<div style={{fontSize:12,color:"rgba(255,255,255,0.3)",fontStyle:"italic",marginBottom:8}}>{chain.connector[0]}</div>}
                <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 16px",borderRadius:12,background:"rgba(255,255,255,0.06)",border:`1px solid ${DIP_META[chain.dims[i]].color}33`,marginBottom:4}}>
                  <span style={{fontSize:32}}>{s.emoji}</span>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontWeight:800,fontSize:15,color:"white"}}>{s.word}!</div>
                    <div style={{fontSize:9,color:DIP_META[chain.dims[i]].color,fontWeight:600}}>{DIP_META[chain.dims[i]].icon} {DIP_META[chain.dims[i]].label}: {chain.dims[i]==="D"?"Stretch or punch it":chain.dims[i]==="I"?"Whisper or shout it":"High voice or low voice"}</div>
                  </div>
                </div>
              </div>
            ))}
          </G>

          <G style={{padding:"12px 14px"}}>
            <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.35)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Tips</div>
            <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>Tell the story with the toys if you have them. Use full expression — the DIP focus for each character is your guide. Repeat the same story 2-3 times — repetition is gold for new CI listeners.</p>
          </G>

          <button onClick={()=>{addLog({dim:"📖",sound:chain.sounds.map(s=>s.word).join("+"),label:`📖 Story · ${chain.sounds.map(s=>s.emoji).join("")}`,note:true});}} style={{padding:"10px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>✓ Log this story</button>
        </>
      )}
    </div>
  );
}
