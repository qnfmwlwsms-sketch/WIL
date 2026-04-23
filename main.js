
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
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 10px;
        padding: 10px;
      }
      img {
        width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        transition: transform 0.2s;
      }
      img:hover {
          transform: scale(1.05);
      }
    `;

    // Image URLs - Replace these with your actual photos
    const photos = [
      'https://picsum.photos/id/10/400/400',
      'https://picsum.photos/id/20/400/400',
      'https://picsum.photos/id/30/400/400',
      'https://picsum.photos/id/40/400/400',
      'https://picsum.photos/id/50/400/400',
      'https://picsum.photos/id/60/400/400'
    ];

    photos.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '우리의 아름다운 순간';
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
        themeBtn.textContent = '☀️ 라이트 모드';
    } else {
        themeBtn.textContent = '🌙 다크 모드';
    }
}
