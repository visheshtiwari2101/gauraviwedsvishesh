export function countdownParts(target, now=Date.now()) {
 const seconds=Math.max(0,Math.floor((new Date(target).getTime()-now)/1000));
 return [Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60];
}
export function validateRsvp(data) {
 return typeof data.name==='string' && data.name.trim().length>0 && data.name.trim().length<=120 && ['yes','no'].includes(data.attendance) && Number.isInteger(Number(data.guests)) && (data.attendance==='no'?Number(data.guests)===0:Number(data.guests)>=1&&Number(data.guests)<=100) && String(data.message||'').length<=2000;
}
export async function sendRsvp(endpoint,data,fetcher=fetch) {
 if(!validateRsvp(data))throw new Error('validation');
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
 try {
  // Form encoding avoids JSON preflight; opaque no-cors responses cannot confirm receipt.
  const response=await fetcher(endpoint,{method:'POST',body:new URLSearchParams({type:'rsvp',name:data.name.trim(),attendance:data.attendance,guests:String(data.guests),message:String(data.message||'').trim()}),signal:controller.signal,redirect:'follow'});
  if(!response.ok||response.type==='opaque')throw new Error('unconfirmed');
  let result;try{result=JSON.parse(await response.text());}catch{throw new Error('unconfirmed');}
  if(!(result.ok===true||result.success===true||result.status==='success'||result.result==='success'))throw new Error('unconfirmed');
  return result;
 }finally{clearTimeout(timer);}
}
