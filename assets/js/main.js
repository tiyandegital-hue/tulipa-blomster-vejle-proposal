/* TULIPA — site JS. Business name ONE swappable constant: TULIPA */
(function(){
  "use strict";

  /* ── Brand constants (swappable) ── */
  const TULIPA = "Tulipa Blomster & Havedesign";
  const TULIPA_SHORT = "Tulipa";
  const PHONE1 = "+45 24 87 19 01";
  const PHONE1_TEL = "+4524871901";
  const PHONE2 = "+45 24 47 14 41";
  const PHONE2_TEL = "+4524471441";
  const ADDR = "Bredballecenter 22, 7120 Vejle Ø";

  document.querySelectorAll("[data-brand]").forEach(el=>{
    el.textContent = el.dataset.brand === "short" ? TULIPA_SHORT : TULIPA;
  });
  document.querySelectorAll("[data-year]").forEach(el=>{
    el.textContent = new Date().getFullYear();
  });
  document.querySelectorAll("[data-phone1]").forEach(el=>{
    if(el.tagName === "A"){ el.href = "tel:" + PHONE1_TEL; }
    if(!el.textContent.trim()) el.textContent = PHONE1;
  });
  document.querySelectorAll("[data-phone2]").forEach(el=>{
    if(el.tagName === "A"){ el.href = "tel:" + PHONE2_TEL; }
    if(!el.textContent.trim()) el.textContent = PHONE2;
  });
  document.querySelectorAll("[data-addr]").forEach(el=>{
    if(!el.textContent.trim()) el.textContent = ADDR;
  });

  /* ── Mobilmenu ── */
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".main-nav");
  if(burger && nav){
    burger.addEventListener("click", ()=>{
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.querySelector(".material-symbols-outlined").textContent = open ? "close" : "menu";
    });
    nav.querySelectorAll("a").forEach(a=>a.addEventListener("click", ()=>{
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded","false");
      burger.querySelector(".material-symbols-outlined").textContent = "menu";
    }));
  }

  /* ── The Bloom: scroll-reveal ── */
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && !reduced){
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
      });
    },{threshold:.12, rootMargin:"0px 0px -40px 0px"});
    revealEls.forEach(el=>io.observe(el));
  }else{
    revealEls.forEach(el=>el.classList.add("in"));
  }

  /* ── Hero parallax (Drivhuset) ── */
  const parallaxEls = document.querySelectorAll("[data-parallax]");
  if(parallaxEls.length && !reduced){
    let ticking = false;
    window.addEventListener("scroll", ()=>{
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(()=>{
        const y = window.scrollY;
        parallaxEls.forEach(el=>{
          const speed = parseFloat(el.dataset.parallax) || .12;
          el.style.transform = "translateY(" + (y * speed) + "px)";
        });
        ticking = false;
      });
    }, {passive:true});
  }

  /* ── Før/efter-slider ── */
  document.querySelectorAll(".ba-slider").forEach(slider=>{
    const range = slider.parentElement.querySelector(".ba-range");
    let dragging = false;
    const setPos = clientX=>{
      const rect = slider.getBoundingClientRect();
      let p = ((clientX - rect.left) / rect.width) * 100;
      p = Math.max(2, Math.min(98, p));
      slider.style.setProperty("--pos", p + "%");
      if(range) range.value = Math.round(p);
      slider.setAttribute("aria-valuenow", Math.round(p));
    };
    slider.addEventListener("pointerdown", e=>{
      dragging = true;
      slider.setPointerCapture(e.pointerId);
      setPos(e.clientX);
    });
    slider.addEventListener("pointermove", e=>{ if(dragging) setPos(e.clientX); });
    slider.addEventListener("pointerup", ()=>{ dragging = false; });
    slider.addEventListener("pointercancel", ()=>{ dragging = false; });
    slider.addEventListener("keydown", e=>{
      let p = parseFloat(getComputedStyle(slider).getPropertyValue("--pos")) || 50;
      if(e.key === "ArrowLeft"){ p = Math.max(2, p - 4); }
      else if(e.key === "ArrowRight"){ p = Math.min(98, p + 4); }
      else return;
      e.preventDefault();
      slider.style.setProperty("--pos", p + "%");
      if(range) range.value = Math.round(p);
      slider.setAttribute("aria-valuenow", Math.round(p));
    });
    if(range){
      range.addEventListener("input", ()=>{
        slider.style.setProperty("--pos", range.value + "%");
        slider.setAttribute("aria-valuenow", range.value);
      });
    }
  });

  /* ── Cookie-banner ── */
  const banner = document.getElementById("cookie-banner");
  const KEY = "tulipa-cookie-consent";
  try{
    if(!localStorage.getItem(KEY) && banner){
      setTimeout(()=>banner.classList.add("show"), 900);
    }
  }catch(e){ if(banner) banner.classList.add("show"); }
  const acceptBtn = document.getElementById("cookie-accept");
  if(acceptBtn){
    acceptBtn.addEventListener("click", ()=>{
      try{ localStorage.setItem(KEY, "accepted"); }catch(e){}
      banner.classList.remove("show");
    });
  }

  /* ── Formularer: validering + demo-succes ── */
  document.querySelectorAll("form[data-validate]").forEach(form=>{
    form.addEventListener("submit", e=>{
      e.preventDefault();
      let ok = true;
      let firstBad = null;
      form.querySelectorAll("[data-required]").forEach(input=>{
        const field = input.closest(".field") || input.closest(".consent") || input;
        let valid = true;
        if(input.type === "checkbox"){
          valid = input.checked;
        }else{
          valid = input.value.trim().length > 1;
          if(input.type === "tel"){
            valid = input.value.replace(/\D/g,"").length >= 8;
          }
        }
        if(field.classList) field.classList.toggle("invalid", !valid);
        if(!valid){ ok = false; if(!firstBad) firstBad = input; }
      });
      if(!ok){
        if(firstBad) firstBad.focus();
        return;
      }
      const success = form.parentElement.querySelector(".form-success") ||
                      form.querySelector(".form-success");
      if(success){
        success.classList.add("show");
        success.scrollIntoView({behavior: reduced ? "auto" : "smooth", block:"center"});
      }
      form.querySelector("button[type=submit]").disabled = true;
    });
    /* live re-validering */
    form.querySelectorAll("[data-required]").forEach(input=>{
      input.addEventListener("input", ()=>{
        const field = input.closest(".field") || input.closest(".consent");
        if(field && field.classList) field.classList.remove("invalid");
      });
      input.addEventListener("change", ()=>{
        const field = input.closest(".field") || input.closest(".consent");
        if(field && field.classList) field.classList.remove("invalid");
      });
    });
  });

  /* ── Glat scroll til #fredagsbuket (sekundær CTA) ── */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener("click", e=>{
      const id = a.getAttribute("href");
      if(id.length > 1){
        const target = document.querySelector(id);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior: reduced ? "auto" : "smooth"});
        }
      }
    });
  });
})();
