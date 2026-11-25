
(() => {
  if (document.getElementById("focusbuddy-overlay")) return;

  const config = window.__FOCUSBUDDY_CONFIG__ || {
    level: 1,
    site: "this website"
  };

  const level = Math.max(
    1,
    Math.min(4, Number(config.level) || 1)
  );

  const lines = {
    1: "Darling, your books aren't going to study themselves.",
    2: "Interesting. So I'm competing with Instagram now?",
    3: "Close. The. Tab.",
    4: "I thought you were more ambitious than this."
  };

  const labels = {
    1: "A gentle reminder",
    2: "That got his attention",
    3: "Last warning",
    4: "A little disappointed"
  };

  const root = document.createElement("div");
  root.id = "focusbuddy-overlay";

  const shadow = root.attachShadow({ mode: "open" });

  const imageUrl = chrome.runtime.getURL(
    "assets/reading-gentleman.png"
  );

  shadow.innerHTML = `
    <style>
      :host{all:initial}
      *{box-sizing:border-box}

      .veil{
        position:fixed;
        inset:0;
        z-index:2147483647;
        background:rgba(10,13,11,.88);
        backdrop-filter:blur(7px);
        display:grid;
        place-items:center;
        padding:22px;
        font-family:Georgia,'Times New Roman',serif;
        animation:fade .35s ease both;
      }

      .panel{
        width:min(900px,96vw);
        min-height:min(590px,88vh);
        max-height:92vh;
        overflow:hidden;
        display:grid;
        grid-template-columns:minmax(230px,.9fr) minmax(260px,1.1fr);
        background:linear-gradient(135deg,#1b241f,#2b211c 75%);
        border:1px solid rgba(196,164,105,.55);
        box-shadow:0 24px 90px #000b;
        border-radius:18px;
        position:relative;
      }

      .portrait{
        position:relative;
        min-height:470px;
        overflow:hidden;
        background:#f2eee6;
      }

      .portrait img{
        width:100%;
        height:100%;
        position:absolute;
        inset:0;
        object-fit:cover;
        object-position:30% center;
        animation:portraitIn .75s cubic-bezier(.2,.8,.2,1) both;
      }

      .portrait:after{
        content:'';
        position:absolute;
        inset:55% 0 0;
        background:linear-gradient(transparent,rgba(15,18,15,.3));
      }

      .copy{
        padding:clamp(25px,5vw,54px);
        display:flex;
        flex-direction:column;
        justify-content:center;
        color:#eee5d3;
      }

      .eyebrow{
        font:11px/1.5 Arial,sans-serif;
        letter-spacing:3px;
        text-transform:uppercase;
        color:#c7a66c;
        margin:0 0 18px;
      }

      h1{
        font-size:clamp(28px,4vw,43px);
        font-weight:normal;
        line-height:1.12;
        margin:0 0 20px;
        color:#e4c995;
      }

      .quote{
        font-size:clamp(19px,2.5vw,25px);
        line-height:1.45;
        margin:0 0 28px;
      }

      .rule{
        height:1px;
        background:linear-gradient(90deg,#b99a65,transparent);
        margin:0 0 22px;
      }

      .site{
        font:12px/1.5 Arial,sans-serif;
        color:#b8b4a8;
        margin:0 0 24px;
        overflow-wrap:anywhere;
      }

      .count{
        display:flex;
        align-items:center;
        gap:13px;
        font:12px Arial,sans-serif;
        letter-spacing:1.4px;
        text-transform:uppercase;
        color:#d6c5a5;
      }

      .number{
        width:43px;
        height:43px;
        border:1px solid #b99a65;
        border-radius:50%;
        display:grid;
        place-items:center;
        font:22px Georgia,serif;
        color:#e4c995;
      }

      .hint{
        font:11px/1.5 Arial,sans-serif;
        color:#aaa89e;
        margin:13px 0 0;
      }

      .close{
        position:absolute;
        top:12px;
        right:14px;
        color:#d9c8a5;
        font:11px Arial,sans-serif;
        letter-spacing:1px;
        z-index:2;
      }

      @keyframes fade{
        from{opacity:0}
        to{opacity:1}
      }

      @keyframes portraitIn{
        from{
          opacity:0;
          transform:scale(1.035) translateY(8px)
        }
        to{
          opacity:1;
          transform:scale(1) translateY(0)
        }
      }

      @media(max-width:620px){
        .panel{
          grid-template-columns:1fr;
          grid-template-rows:minmax(230px,38vh) auto;
          max-height:94vh;
          overflow:auto;
        }

        .portrait{min-height:230px}

        .portrait img{
          object-position:30% 30%;
        }

        .copy{padding:24px}
        .eyebrow{margin-bottom:9px}
        .quote{margin-bottom:18px}
        .rule{margin-bottom:13px}
      }

      @media(prefers-reduced-motion:reduce){
        *,*:before,*:after{
          animation:none!important
        }
      }
    </style>

    <div class="veil">
      <section class="panel" role="dialog"
        aria-modal="true"
        aria-label="FocusBuddy study reminder">

        <div class="close">FOCUSBUDDY · STUDY MODE</div>

        <div class="portrait">
          <img src="${imageUrl}"
            alt="Illustrated gentleman reading a book">
        </div>

        <div class="copy">
          <p class="eyebrow">${labels[level]}</p>

          <h1>Back to your books.</h1>

          <p class="quote">“${lines[level]}”</p>

          <div class="rule"></div>

          <p class="site">
            Caught you visiting:
            ${String(config.site).replace(
              /[&<>"']/g,
              c => ({
                '&':'&amp;',
                '<':'&lt;',
                '>':'&gt;',
                '"':'&quot;',
                "'":'&#39;'
              }[c])
            )}
          </p>

          <div class="count">
            <span class="number" id="fb-count">5</span>
            <span>Returning you to focus</span>
          </div>

          <p class="hint">
            This tab will close automatically.
            Your study session is waiting.
          </p>
        </div>
      </section>
    </div>
  `;

  (document.documentElement || document.body).appendChild(root);

  let remaining = 5;

  const counter = shadow.getElementById("fb-count");

  const timer = setInterval(() => {
    remaining -= 1;

    if (counter) {
      counter.textContent = String(Math.max(remaining, 0));
    }

    if (remaining <= 0) {
      clearInterval(timer);

      chrome.runtime.sendMessage({
        type: "FOCUSBUDDY_CLOSE_TAB"
      });
    }
  }, 1000);

})();
