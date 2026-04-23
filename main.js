// 갤러리 컴포넌트 (웹 컴포넌트)
class PhotoGallery extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      const wrapper = document.createElement('div');
      wrapper.setAttribute('class', 'gallery-wrapper');
      const style = document.createElement('style');
      style.textContent = `
        .gallery-wrapper {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 10px;
          padding: 10px 0;
        }
        img {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }
        img:hover { transform: scale(1.03); }
      `;
  
      const photos = [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=400&q=80'
      ];
  
      photos.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = '우리의 아름다운 순간';
        img.loading = 'lazy';
        wrapper.appendChild(img);
      });
      shadow.appendChild(style);
      shadow.appendChild(wrapper);
    }
  }
  customElements.define('photo-gallery', PhotoGallery);
  
  // D-Day 계산기
  function calculateDday() {
      const inputDatetime = document.getElementById('input-datetime');
      if (!inputDatetime) return;

      const targetDate = new Date(inputDatetime.value);
      const today = new Date();
      
      targetDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0);

      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const dDayText = document.getElementById('preview-dday');
      if(dDayText) {
          if (diffDays > 0) {
              dDayText.innerText = `D-${diffDays} 남았습니다.`;
          } else if (diffDays === 0) {
              dDayText.innerText = `오늘입니다!`;
          } else {
              dDayText.innerText = `D+${Math.abs(diffDays)} 지났습니다.`;
          }
      }
  }

  // 실시간 미리보기 업데이트
  function updatePreview() {
      // 1. 기본 텍스트 필드 업데이트
      const mappings = [
          { input: 'input-groom-name', preview: 'preview-groom-name', type: 'text' },
          { input: 'input-bride-name', preview: 'preview-bride-name', type: 'text' },
          { input: 'input-date-text', preview: 'preview-date-text', type: 'text' },
          { input: 'input-venue-name', preview: 'preview-venue-name', type: 'text' },
          { input: 'input-venue-address', preview: 'preview-venue-address', type: 'text' },
          { input: 'input-groom-parents', preview: 'preview-groom-parents', type: 'text' },
          { input: 'input-groom-relation', preview: 'preview-groom-relation', type: 'text' },
          { input: 'input-bride-parents', preview: 'preview-bride-parents', type: 'text' },
          { input: 'input-bride-relation', preview: 'preview-bride-relation', type: 'text' },
          { input: 'input-greeting', preview: 'preview-greeting', type: 'text', newline: true }
      ];

      mappings.forEach(m => {
          const inputEl = document.getElementById(m.input);
          const previewEl = document.getElementById(m.preview);
          if (inputEl && previewEl) {
              let val = inputEl.value;
              if (m.newline) {
                  val = val.replace(/\n/g, '<br>');
                  previewEl.innerHTML = val;
              } else {
                  previewEl.innerText = val;
              }
          }
      });

      // 2. 추가적인 업데이트
      const venueName2 = document.getElementById('preview-venue-name-2');
      if (venueName2) venueName2.innerText = document.getElementById('input-venue-name').value;

      // 3. 이름 일괄 업데이트 (모든 groom-name-small, bride-name-small 클래스)
      const groomName = document.getElementById('input-groom-name').value;
      const brideName = document.getElementById('input-bride-name').value;
      
      document.querySelectorAll('.groom-name-small').forEach(el => el.innerText = groomName);
      document.querySelectorAll('.bride-name-small').forEach(el => el.innerText = brideName);

      // 4. D-Day 업데이트
      calculateDday();
  }

  // 사진 파일 처리
  function handlePhotoUpload(e) {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
              const previewImg = document.getElementById('preview-main-photo');
              if (previewImg) {
                  previewImg.src = event.target.result;
              }
          };
          reader.readAsDataURL(file);
      }
  }

  // 스크롤 애니메이션 설정
  function setupScrollAnimation() {
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.classList.add('visible');
              }
          });
      }, { threshold: 0.1 });

      document.querySelectorAll('.section-fade').forEach(section => {
          observer.observe(section);
      });
  }

  // 모달 제어
  function showModal() {
      const modal = document.getElementById('export-modal');
      const exportTextarea = document.getElementById('export-code');
      
      const previewContent = document.getElementById('preview-content').innerHTML;
      
      const fullHTML = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document.getElementById('input-groom-name').value} & ${document.getElementById('input-bride-name').value} 결혼식에 초대합니다</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        :root { --bg-color: #FDF5E6; --text-color: #333; --primary-color: #DAA520; --secondary-color: #8B7355; }
        body { font-family: 'Noto Sans KR', 'Nanum Myeongjo', serif; background-color: #F8F9FA; color: var(--text-color); margin: 0; line-height: 1.6; }
        .mobile-container { max-width: 500px; margin: 0 auto; background-color: var(--bg-color); min-height: 100vh; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        h1, h2, .hero-names, .section-title { font-family: 'Nanum Myeongjo', serif; font-weight: 700; }
        section { padding: 60px 20px; border-bottom: 1px solid #e0d8c8; text-align: center; }
        .section-title { font-size: 1.4em; color: var(--primary-color); margin-bottom: 30px; letter-spacing: 0.1em; }
        .heart { color: #e25555; font-size: 0.8em; margin: 0 5px; }
        .hero { position: relative; text-align: center; padding-bottom: 40px; border-bottom: 1px solid #e0d8c8; }
        .hero-image { width: 100%; height: 60vh; overflow: hidden; }
        .hero-image img { width: 100%; height: 100%; object-fit: cover; }
        .hero-text { padding: 30px 20px 0; }
        .hero-date { font-size: 0.8em; color: var(--secondary-color); letter-spacing: 0.1em; }
        .hero-names { font-size: 2.2em; margin: 15px 0; }
        .hero-location { font-size: 0.9em; }
        .greeting-message { line-height: 1.8; font-size: 0.95em; white-space: pre-line; }
        .parents-info { margin-top: 40px; }
        .parents-info .relation { font-size: 0.8em; color: var(--secondary-color); margin: 0 5px; }
        .highlight { color: var(--primary-color); font-weight: bold; }
        .footer { padding: 40px 20px; text-align: center; font-size: 0.8em; color: var(--secondary-color); background: #fff; }
        .section-fade { opacity: 0; transform: translateY(20px); transition: all 0.8s ease-out; }
        .section-fade.visible { opacity: 1; transform: translateY(0); }
    </style>
</head>
<body>
    <div class="mobile-container">
        ${previewContent}
    </div>
    <script>
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.section-fade').forEach(s => observer.observe(s));
    </script>
</body>
</html>`;

      exportTextarea.value = fullHTML;
      modal.style.display = 'block';
  }

  function closeModal() {
      document.getElementById('export-modal').style.display = 'none';
  }

  function copyExportCode() {
      const textarea = document.getElementById('export-code');
      textarea.select();
      document.execCommand('copy');
      alert('코드가 클립보드에 복사되었습니다!');
  }

  // 초기화 및 이벤트 바인딩
  document.addEventListener('DOMContentLoaded', () => {
      const inputs = [
          'input-groom-name', 'input-bride-name',
          'input-datetime', 'input-date-text', 'input-greeting',
          'input-groom-parents', 'input-groom-relation',
          'input-bride-parents', 'input-bride-relation',
          'input-venue-name', 'input-venue-address'
      ];

      inputs.forEach(id => {
          const el = document.getElementById(id);
          if (el) {
              el.addEventListener('input', updatePreview);
          }
      });

      // 사진 업로드 이벤트
      const photoInput = document.getElementById('input-main-photo');
      if (photoInput) {
          photoInput.addEventListener('change', handlePhotoUpload);
      }

      const exportBtn = document.getElementById('export-btn');
      if (exportBtn) exportBtn.addEventListener('click', showModal);

      window.closeModal = closeModal;
      window.copyExportCode = copyExportCode;

      updatePreview();
      setupScrollAnimation();
  });
