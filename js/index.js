  // Wrap toÃƒ n bÃ¡Â»â„¢ script trong IIFE Ã„â€˜Ã¡Â»Æ’ trÃƒÂ¡nh lÃ¡Â»â€”i duplicate declaration
  (function() {
    'use strict';

        var DEFAULT_GIFT_DATA = {
      letterTitle: 'Gửi người tôi yêu thương nhất',
      letterContent: 'Nhân ngày 8/3 này gửi đến bông hoa rực rỡ nhất, tới xin gửi  cậu bức thư siêu siêu cute này.Dù chúng ta đang ở đâu hay bận rộn với cuộc sống riêng, tớ vẫn luôn trân trọng tình bạn này. Nhân ngày 8/3, chúc cậu không chỉ xinh đẹp mà còn luôn kiên cường và hạnh phúc với lựa chọn của chính mình. Mong rằng nụ cười của cậu sẽ luôn rạng rỡ như ánh mặt trời, sưởi ấm mọi nơi cậu đi qua. Hãy luôn là phiên bản tự tin nhất của chính mình nhé!',
      letterSignature: '',
      musicType: 'Sample',
      musicPath: './assets/audio/SaveTik.io_7375038953319173394 (1).mp3'
    };

    // ===== OVERLAY & AUDIO LOGIC =====
    var orientationOverlay = document.getElementById('orientationOverlay');
    var btnDaHieu = document.getElementById('btnDaHieu');
    var audio = document.getElementById('audio-para-ti');

    // CÃ¡Â»Â: user Ã„â€˜ÃƒÂ£ bÃ¡ÂºÂ¥m "Ã„ÂÃƒÂ£ hiÃ¡Â»Æ’u" nhÃ†Â°ng data chÃ†Â°a vÃ¡Â»Â
    var pendingPlay = false;

    function setAudioSrc(data) {
      if (!audio || !data) return;
      if (data.musicType === 'Sample' && data.musicPath) {
        audio.src = data.musicPath;
      } else if (data.musicType === 'Custom' && data.customMusic) {
        // customMusic cÃƒÂ³ thÃ¡Â»Æ’ lÃƒ  URL hoÃ¡ÂºÂ·c base64 data URL
        audio.src = data.customMusic;
      }
    }

    function playAudio() {
      if (!audio || !audio.src || audio.src === window.location.href) return;
      audio.play().catch(function() {
        // Autoplay bÃ¡Â»â€¹ block Ã¢â‚¬â€œ khÃƒÂ´ng lÃƒ m gÃƒÂ¬, user Ã„â€˜ÃƒÂ£ click nÃƒÂªn thÃ†Â°Ã¡Â»Âng ok
      });
    }

    if (btnDaHieu) {
      btnDaHieu.addEventListener('click', function() {
        if (orientationOverlay) orientationOverlay.style.display = 'none';
        // Play nhÃ¡ÂºÂ¡c
        if (audio && audio.src && audio.src !== window.location.href) {
          playAudio();
        } else {
          pendingPlay = true;
        }
        // KhÃ¡Â»Å¸i Ã„â€˜Ã¡Â»â„¢ng lÃ¡ÂºÂ¡i toÃƒ n bÃ¡Â»â„¢ hiÃ¡Â»â€¡u Ã¡Â»Â©ng tÃ¡Â»Â« Ã„â€˜Ã¡ÂºÂ§u
        if (typeof startExperience === 'function') startExperience();
      });
    }

    // ===== FETCH GIFT DATA =====
    var params = new URLSearchParams(window.location.search);
    var giftId = params.get('id');
    var isPreview = params.get('preview') === '1';

    // Khai bÃƒÂ¡o trÃ†Â°Ã¡Â»â€ºc Ã¡Â»Å¸ outer scope Ã„â€˜Ã¡Â»Æ’ button click handler gÃ¡Â»Âi Ã„â€˜Ã†Â°Ã¡Â»Â£c
    // (function declarations inside try{} block-scoped trong strict mode)
    var applyGiftDataToLetter;
    var startExperience;

    function onGiftDataLoaded(data) {
      window.gift83Data = data;
      setAudioSrc(data);
      if (pendingPlay) {
        pendingPlay = false;
        playAudio();
      }
      if (typeof applyGiftDataToLetter === 'function') applyGiftDataToLetter(data);
    }

    if (isPreview) {
      // ThÃƒÂªm watermark "Xem demo"
      var watermark = document.createElement('div');
      watermark.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:99998',
        'display:flex', 'align-items:center', 'justify-content:center',
        'pointer-events:none', 'overflow:hidden'
      ].join(';');
      watermark.innerHTML = '<span style="' + [
        'font-family:Pacifico,Dancing Script,cursive',
        'font-size:clamp(60px,18vw,160px)',
        'font-weight:900',
        'color:rgba(255,255,255,0.18)',
        'letter-spacing:0.05em',
        'text-align:center',
        'line-height:1',
        'transform:rotate(-30deg)',
        'white-space:nowrap',
        'text-shadow:0 2px 20px rgba(0,0,0,0.15)',
        'user-select:none'
      ].join(';') + '">Xem demo</span>';
      document.body.appendChild(watermark);

      // ChÃ¡ÂºÂ¿ Ã„â€˜Ã¡Â»â„¢ xem trÃ†Â°Ã¡Â»â€ºc: Ã„â€˜Ã¡Â»Âc data tÃ¡Â»Â« localStorage
      try {
        var raw = localStorage.getItem('giftPreviewData');
        if (raw) {
          var previewData = JSON.parse(raw);
          // Custom music base64 Ã¢â€ â€™ gÃƒÂ¡n thÃ¡ÂºÂ³ng vÃƒ o audio.src
          if (previewData.musicType === 'Custom' && previewData.customMusic) {
            previewData.musicPath = null; // trÃƒÂ¡nh xung Ã„â€˜Ã¡Â»â„¢t
          }
          onGiftDataLoaded(previewData);
        }
      } catch(e) {
        console.warn('Ã¢Å¡ Ã¯Â¸Â KhÃƒÂ´ng thÃ¡Â»Æ’ Ã„â€˜Ã¡Â»Âc preview data:', e);
      }
    } else {
      // Chay offline/static: khong goi server, luon co du lieu mac dinh
      onGiftDataLoaded(DEFAULT_GIFT_DATA);
    }

    try {
  // Generar partÃƒÂ­culas blancas animadas que suben desde abajo
  function randomBetween(a, b) {
    return Math.random() * (b - a) + a;
  }
  function createParticles() {
    const particlesContainer = document.querySelector('.particles');
      if (!particlesContainer) {
        console.error('Ã¢ÂÅ’ [Tulipanes] KhÃƒÂ´ng tÃƒÂ¬m thÃ¡ÂºÂ¥y .particles container!');
        return;
      }
    const numParticles = 20;
    for (let i = 0; i < numParticles; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      // PosiciÃƒÂ³n horizontal aleatoria
      p.style.left = randomBetween(0, 100) + 'vw';
      // TamaÃƒÂ±o aleatorio
      const size = randomBetween(0.5, 1.5);
      p.style.width = size + 'vmin';
      p.style.height = size + 'vmin';
      // DuraciÃƒÂ³n y retardo aleatorio
      const duration = randomBetween(3, 7);
      const delay = randomBetween(0, 5);
      p.style.animationDuration = duration + 's';
      p.style.animationDelay = delay + 's';
      // Opacidad aleatoria
      p.style.opacity = randomBetween(0.4, 0.9);
      particlesContainer.appendChild(p);
    }
  }
    
  createParticles();

  // Ã„ÂÃ¡Â»Âc gift83Data tÃ¡Â»Â« window (nÃ¡ÂºÂ¿u cÃƒÂ³ sÃ¡ÂºÂµn, hoÃ¡ÂºÂ·c sÃ¡ÂºÂ½ Ã„â€˜Ã†Â°Ã¡Â»Â£c set bÃ¡Â»Å¸i fetch Ã¡Â»Å¸ trÃƒÂªn)
  var gift83Data = window.gift83Data || null;

  // CÃƒÂ¡c phÃ¡ÂºÂ§n tÃ¡Â»Â­ hiÃ¡Â»â€¡u Ã¡Â»Â©ng
  var introEl = document.getElementById('intro');
  var ramoEl = document.querySelector('.ramo');
  var ramoImg = ramoEl ? ramoEl.querySelector('img') : null;

  function showRamoAndRest() {
    if (ramoEl) ramoEl.classList.add('ramo--visible');
    document.querySelectorAll('.rabbit').forEach(function(rabbit) {
      rabbit.classList.add('rabbit--visible');
    });
    var letterEl = document.querySelector('.letter');
    if (letterEl) letterEl.classList.add('letter--visible');
  }

  function tryShowBouquet() {
    if (ramoImg && ramoImg.complete) {
      showRamoAndRest();
    } else if (ramoImg) {
      ramoImg.addEventListener('load', showRamoAndRest);
      ramoImg.addEventListener('error', showRamoAndRest);
      setTimeout(showRamoAndRest, 8000);
    } else {
      showRamoAndRest();
    }
  }

  // GÃƒÂ¡n vÃƒ o biÃ¡ÂºÂ¿n Ã„â€˜ÃƒÂ£ khai bÃƒÂ¡o Ã¡Â»Å¸ outer scope Ã„â€˜Ã¡Â»Æ’ button click handler gÃ¡Â»Âi Ã„â€˜Ã†Â°Ã¡Â»Â£c
  startExperience = function() {
    // 1. Ã„ÂÃ¡ÂºÂ£m bÃ¡ÂºÂ£o cÃƒÂ¡c class hiÃ¡Â»Æ’n thÃ¡Â»â€¹ chÃ†Â°a Ã„â€˜Ã†Â°Ã¡Â»Â£c set (reset sÃ¡ÂºÂ¡ch)
    if (ramoEl) ramoEl.classList.remove('ramo--visible');
    document.querySelectorAll('.rabbit').forEach(function(r) { r.classList.remove('rabbit--visible'); });
    var letterEl = document.querySelector('.letter');
    if (letterEl) letterEl.classList.remove('letter--visible');
    if (introEl) introEl.classList.remove('is-done');

    // 2. XÃƒÂ³a not-loaded, nhÃ†Â°ng giÃ¡Â»Â¯ hoa pause thÃƒÂªm 0.5s
    var flowersEl = document.querySelector('.flowers');
    if (flowersEl) flowersEl.classList.add('flowers--paused');
    document.body.classList.remove('not-loaded');
    setTimeout(function() {
      if (flowersEl) flowersEl.classList.remove('flowers--paused');
    }, 500);

    // 3. BÃƒÂ³ hoa hiÃ¡Â»â€¡n sau 3.5s (Ã„â€˜Ã¡Â»â„¢c lÃ¡ÂºÂ­p vÃ¡Â»â€ºi intro)
    setTimeout(function() {
      tryShowBouquet();
    }, 3500);

    // 4. Intro fade out sau 6s (Ã„â€˜Ã¡Â»â„¢c lÃ¡ÂºÂ­p vÃ¡Â»â€ºi bÃƒÂ³ hoa)
    setTimeout(function() {
      if (introEl) introEl.classList.add('is-done');
    }, 6000);
  }

    // Modal thÃ†Â°: click phong bÃƒÂ¬ mÃ¡Â»Å¸, cÃƒÂ³ tiÃƒÂªu Ã„â€˜Ã¡Â»Â + nÃ¡Â»â„¢i dung
    var letterEnvelope = document.querySelector('.letter-envelope, .letter');
    var letterModal = document.getElementById('letterModal');
    var letterCloseBtn = document.getElementById('letterClose');
    var letterTitleEl = document.getElementById('letterTitle');
    var letterContentEl = document.getElementById('letterContent');

    var letterData = {
      title: 'Gửi người tôi yêu thương nhất',
      content: 'Hôm nay, tôi muốn gửi đến bạn những lời chân thành từ tận đáy lòng. Mỗi ngày trôi qua, tôi đều cảm thấy may mắn vì có bạn bên cạnh.',
      signature: 'Người yêu bạn ❤️'
    };

    // GÃƒÂ¡n hÃƒ m vÃƒ o biÃ¡ÂºÂ¿n Ã„â€˜ÃƒÂ£ khai bÃƒÂ¡o Ã¡Â»Å¸ outer scope Ã„â€˜Ã¡Â»Æ’ onGiftDataLoaded dÃƒÂ¹ng Ã„â€˜Ã†Â°Ã¡Â»Â£c
    applyGiftDataToLetter = function(data) {
      if (!data) return;
      if (data.letterTitle) letterData.title = data.letterTitle;
      if (data.letterContent != null) {
        letterData.content = Array.isArray(data.letterContent)
          ? data.letterContent.join('\n\n')
          : String(data.letterContent);
      }
      if (data.letterSignature) letterData.signature = data.letterSignature;
    };

    // ÃƒÂp dÃ¡Â»Â¥ng ngay nÃ¡ÂºÂ¿u data Ã„â€˜ÃƒÂ£ cÃƒÂ³ (vÃƒÂ­ dÃ¡Â»Â¥ tÃ¡Â»Â« window.gift83Data set trÃ†Â°Ã¡Â»â€ºc)
    if (gift83Data) applyGiftDataToLetter(gift83Data);

    var letterTypingTimeout = null;

    function typeChar(text, index, el, onDone) {
      if (index >= text.length) {
        if (onDone) onDone();
        return;
      }
      var ch = text[index];
      if (ch === '\n') {
        el.appendChild(document.createElement('br'));
      } else {
        el.appendChild(document.createTextNode(ch));
      }
      if (letterModal && letterModal.classList.contains('is-open')) {
        el.scrollIntoView({ block: 'end', behavior: 'smooth' });
      }
      var delay = /[.,!?;:]/.test(ch) ? 70 : (ch === ' ' ? 32 : 28);
      letterTypingTimeout = setTimeout(function() {
        typeChar(text, index + 1, el, onDone);
      }, delay);
    }

    function openLetterModal() {
      if (letterModal) letterModal.classList.add('is-open');
      if (letterTitleEl) letterTitleEl.textContent = '';
      if (letterContentEl) letterContentEl.innerHTML = '';

      function runTyping() {
        var titleDone = false;
        function onTitleDone() {
          titleDone = true;
          if (letterContentEl) {
            var paragraphs = letterData.content.split(/\n\n+/);
            var paraIndex = 0;
            function typeNextParagraph() {
              if (paraIndex >= paragraphs.length) {
                if (letterData.signature) {
                  var sigWrap = document.createElement('p');
                  sigWrap.className = 'letter-modal__signature-wrap';
                  sigWrap.style.margin = '20px 0 0 0';
                  var sigEl = document.createElement('span');
                  sigEl.className = 'letter-modal__signature';
                  letterContentEl.appendChild(sigWrap);
                  sigWrap.appendChild(sigEl);
                  typeChar(letterData.signature, 0, sigEl);
                }
                return;
              }
              var p = document.createElement('p');
              p.style.margin = '0 0 12px 0';
              letterContentEl.appendChild(p);
              var paraText = paragraphs[paraIndex].replace(/\n/g, '\n');
              typeChar(paraText, 0, p, function() {
                paraIndex++;
                typeNextParagraph();
              });
            }
            typeNextParagraph();
          }
        }
        if (letterTitleEl && letterData.title) {
          typeChar(letterData.title, 0, letterTitleEl, onTitleDone);
        } else {
          onTitleDone();
        }
      }
      setTimeout(runTyping, 80);
    }

    function closeLetterModal() {
      if (letterTypingTimeout) {
        clearTimeout(letterTypingTimeout);
        letterTypingTimeout = null;
      }
      if (letterModal) letterModal.classList.remove('is-open');
    }

    if (letterEnvelope) {
      letterEnvelope.addEventListener('click', function(e) {
        e.preventDefault();
        openLetterModal();
      });
    }
    if (letterCloseBtn) letterCloseBtn.addEventListener('click', closeLetterModal);
    if (letterModal) {
      letterModal.querySelector('.letter-modal__backdrop').addEventListener('click', closeLetterModal);
    }
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && letterModal && letterModal.classList.contains('is-open')) {
        closeLetterModal();
      }
    });
  
    } catch (error) {
      console.error('Ã¢ÂÅ’ [Tulipanes] LÃ¡Â»â€“I TRONG SCRIPT:', error);
      console.error('Ã¢ÂÅ’ [Tulipanes] Error stack:', error.stack);
        }
  })(); // Ã„ÂÃƒÂ³ng IIFE
