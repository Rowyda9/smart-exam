document.querySelectorAll('[data-lead-form]').forEach(async form => {
  const state=form.querySelector('[data-form-state]');
  const fields=form.querySelector('[data-form-fields]');
  const result=form.querySelector('[data-form-result]');
  let csrf='';
  try {
    const config=await fetch('/api/form-config',{credentials:'same-origin',cache:'no-store'}).then(r=>r.json());
    if(config.enabled && config.csrf){csrf=config.csrf;fields.disabled=false;state.textContent='Tell us about your requirements. All fields marked * are required.';}
    else state.textContent='Local preview: requests are not being sent. This form will open when the approved sales channel and privacy details are configured.';
  } catch {state.textContent='Request delivery is unavailable in this preview. No inquiry has been sent.';}
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(!csrf||fields.disabled||!form.reportValidity())return;
    const data=Object.fromEntries(new FormData(form).entries());
    const payload={...data,consent:data.consent==='on',kind:form.dataset.kind,source:location.pathname,csrf};
    const button=form.querySelector('button[type=submit]');button.disabled=true;result.textContent='Sending your inquiry…';result.className='form-result';
    try{
      const response=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify(payload)});
      const body=await response.json();if(!response.ok)throw new Error(body.message||'Delivery could not be confirmed. Please try again later.');
      result.textContent=`Request delivered. Reference: ${body.reference}. A meeting time is not confirmed yet.`;result.className='form-result success';fields.disabled=true;
      window.dispatchEvent(new CustomEvent('smart-exam:conversion',{detail:{event:'lead_delivered',kind:form.dataset.kind,path:location.pathname}}));
    }catch(error){result.textContent=error instanceof Error?error.message:'Delivery could not be confirmed.';result.className='form-result error';button.disabled=false;}
  });
});
