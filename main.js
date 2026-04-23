// 갤러리 컴포넌트
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
        img:hover {
            transform: scale(1.03);
        }
      `;
  
      // 고화질 웨딩 관련 더미 이미지
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
  
  // 계좌번호 복사 기능
  function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
          alert('계좌번호가 복사되었습니다: ' + text);
      }).catch(err => {
          console.error('복사 실패:', err);
          alert('복사에 실패했습니다. 다시 시도해주세요.');
      });
  }
  
  // 다크모드 토글 기능
  function toggleTheme() {
      const body = document.body;
      body.classList.toggle('dark-theme');
      
      const themeBtn = document.getElementById('theme-toggle');
      if (body.classList.contains('dark-theme')) {
          themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
          themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
      }
  }

  // 아코디언 토글 (계좌번호)
  function toggleAccordion(id) {
      const content = document.getElementById(id);
      if (content.style.maxHeight) {
          content.style.maxHeight = null;
          content.classList.remove('active');
      } else {
          content.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 20 + "px"; // padding 고려
      }
  }

  // D-Day 계산기
  function calculateDday() {
      const targetDate = new Date('2024-10-26T14:00:00'); // 결혼식 날짜
      const today = new Date();
      
      // 시간을 00:00:00으로 맞춰 순수 날짜 차이만 계산
      targetDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0);

      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const dDayText = document.getElementById('d-day-text');
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

  // 방명록 기능 (LocalStorage 사용)
  function loadGuestbook() {
      const list = document.getElementById('guestbook-list');
      if(!list) return;

      const entries = JSON.parse(localStorage.getItem('wedding_guestbook')) || [];
      list.innerHTML = '';
      
      entries.reverse().forEach(entry => {
          const div = document.createElement('div');
          div.className = 'guest-entry';
          div.innerHTML = `
              <div class="guest-header">
                  <span class="guest-name">${escapeHTML(entry.name)}</span>
                  <span class="guest-date">${entry.date}</span>
              </div>
              <div class="guest-msg">${escapeHTML(entry.message)}</div>
          `;
          list.appendChild(div);
      });
  }

  function addGuestbookEntry() {
      const nameInput = document.getElementById('guest-name');
      const msgInput = document.getElementById('guest-message');
      
      if (!nameInput.value.trim() || !msgInput.value.trim()) {
          alert('이름과 메시지를 모두 입력해주세요.');
          return;
      }

      const now = new Date();
      const dateStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;

      const newEntry = {
          name: nameInput.value.trim(),
          message: msgInput.value.trim(),
          date: dateStr
      };

      const entries = JSON.parse(localStorage.getItem('wedding_guestbook')) || [];
      entries.push(newEntry);
      localStorage.setItem('wedding_guestbook', JSON.stringify(entries));

      nameInput.value = '';
      msgInput.value = '';
      
      loadGuestbook();
  }

  // HTML 태그 이스케이프 (XSS 방지)
  function escapeHTML(str) {
      return str.replace(/[&<>'"]/g, 
          tag => ({
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              "'": '&#39;',
              '"': '&quot;'
          }[tag] || tag)
      );
  }

  // 스크롤 페이드인 애니메이션 (Intersection Observer)
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

  // 초기화
  document.addEventListener('DOMContentLoaded', () => {
      calculateDday();
      loadGuestbook();
      setupScrollAnimation();
      
      // 초기 로딩 시 첫 번째 섹션 바로 보이게
      setTimeout(() => {
          const firstSection = document.querySelector('.section-fade');
          if(firstSection) firstSection.classList.add('visible');
      }, 100);
  });