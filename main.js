/**
 * 모바일 청첩장 스튜디오 메인 로직
 */

// 1. 에디터 아코디언 토글
function toggleFormGroup(header) {
    const group = header.parentElement;
    const isActive = group.classList.contains('active');
    
    // 다른 모든 그룹 닫기 (선택 사항 - 여기선 하나만 열리게 함)
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('active'));
    
    if (!isActive) {
        group.classList.add('active');
    }
}

// 2. 미리보기 아코디언 토글 (계좌번호 등)
function toggleAcc(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('i');
    
    if (content.style.display === 'block') {
        content.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    } else {
        content.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
    }
}

// 3. 갤러리 입력 칸 추가/삭제
function addGalleryInput() {
    const container = document.getElementById('gallery-inputs');
    const btn = container.querySelector('.btn-add-item');
    
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
        <input type="url" class="gallery-url" placeholder="https://..." oninput="updatePreview()">
        <button class="btn-remove" onclick="removeItem(this)">×</button>
    `;
    
    container.insertBefore(row, btn);
    updatePreview();
}

function removeItem(btn) {
    btn.parentElement.remove();
    updatePreview();
}

// 4. 실시간 미리보기 업데이트
function updatePreview() {
    // 기본 텍스트 필드 맵핑
    const mappings = [
        { id: 'input-groom-name', target: 'preview-groom-name' },
        { id: 'input-bride-name', target: 'preview-bride-name' },
        { id: 'input-date-text', target: 'preview-date-text' },
        { id: 'input-venue-name', target: 'preview-venue-name' },
        { id: 'input-venue-name', target: 'preview-venue-name-2' },
        { id: 'input-venue-address', target: 'preview-venue-address' },
        { id: 'input-groom-parents', target: 'preview-groom-parents' },
        { id: 'input-groom-relation', target: 'preview-groom-relation' },
        { id: 'input-bride-parents', target: 'preview-bride-parents' },
        { id: 'input-bride-relation', target: 'preview-bride-relation' },
        { id: 'input-groom-bank', target: 'preview-groom-bank' },
        { id: 'input-groom-acc', target: 'preview-groom-acc' },
        { id: 'input-groom-acc-name', target: 'preview-groom-acc-name' },
        { id: 'input-bride-bank', target: 'preview-bride-bank' },
        { id: 'input-bride-acc', target: 'preview-bride-acc' },
        { id: 'input-bride-acc-name', target: 'preview-bride-acc-name' }
    ];

    mappings.forEach(m => {
        const input = document.getElementById(m.id);
        const target = document.getElementById(m.target);
        if (input && target) target.innerText = input.value;
    });

    // 메인 사진
    const mainPhotoUrl = document.getElementById('input-main-photo-url').value;
    const mainPhotoPreview = document.getElementById('preview-main-photo');
    if (mainPhotoPreview) mainPhotoPreview.src = mainPhotoUrl;

    // 인사말 (줄바꿈 처리)
    const greeting = document.getElementById('input-greeting').value;
    const greetingPreview = document.getElementById('preview-greeting');
    if (greetingPreview) greetingPreview.innerHTML = greeting.replace(/\n/g, '<br>');

    // 소제목 이름들 (길동, 춘향 등 - 마지막 글자만 따거나 전체 이름)
    const gName = document.getElementById('input-groom-name').value;
    const bName = document.getElementById('input-bride-name').value;
    // 성을 뗀 이름만 표시 (보통 2자 이상이면 성을 뗌)
    const gShort = gName.length > 1 ? gName.substring(1) : gName;
    const bShort = bName.length > 1 ? bName.substring(1) : bName;

    document.querySelectorAll('.groom-name-small').forEach(el => el.innerText = gShort);
    document.querySelectorAll('.bride-name-small').forEach(el => el.innerText = bShort);

    // 갤러리 업데이트
    updateGalleryPreview();
    
    // D-Day 업데이트
    calculateDday();
}

function updateGalleryPreview() {
    const urls = Array.from(document.querySelectorAll('.gallery-url')).map(input => input.value).filter(v => v);
    const galleryContainer = document.getElementById('preview-gallery');
    if (!galleryContainer) return;

    galleryContainer.innerHTML = '';
    urls.forEach(url => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `<img src="${url}" alt="갤러리 사진" loading="lazy">`;
        galleryContainer.appendChild(item);
    });
}

function calculateDday() {
    const dateInput = document.getElementById('input-datetime').value;
    if (!dateInput) return;

    const targetDate = new Date(dateInput);
    const today = new Date();
    targetDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    const diff = targetDate.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    const dDayText = document.getElementById('preview-dday');
    if (!dDayText) return;

    if (days > 0) dDayText.innerText = `D-${days} 남았습니다.`;
    else if (days === 0) dDayText.innerText = `오늘입니다!`;
    else dDayText.innerText = `D+${Math.abs(days)} 지났습니다.`;
}

// 5. 방명록 시뮬레이션
function addGuest() {
    const name = document.getElementById('guest-name').value;
    const msg = document.getElementById('guest-msg').value;
    
    if (!name || !msg) return alert('이름과 메시지를 입력해주세요.');

    const list = document.getElementById('preview-guest-list');
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '.');
    
    const item = document.createElement('div');
    item.className = 'guest-item';
    item.innerHTML = `
        <div class="guest-meta"><span>${escapeHTML(name)}</span> <span>${date}</span></div>
        <div class="guest-body">${escapeHTML(msg)}</div>
    `;
    
    list.prepend(item);
    document.getElementById('guest-name').value = '';
    document.getElementById('guest-msg').value = '';
}

function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
}

// 6. 텍스트 복사
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('계좌번호가 복사되었습니다.');
    });
}

// 7. 내보내기 모달 제어
function showModal() {
    const modal = document.getElementById('export-modal');
    const textarea = document.getElementById('export-code');
    
    const content = document.getElementById('preview-content').innerHTML;
    const styles = document.querySelector('style') ? document.querySelector('style').innerHTML : '';
    const mainStyles = Array.from(document.styleSheets[0].cssRules).map(rule => rule.cssText).join('\n');

    const gName = document.getElementById('input-groom-name').value;
    const bName = document.getElementById('input-bride-name').value;

    const fullHTML = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${gName} & ${bName} 결혼식에 초대합니다</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        ${mainStyles}
        /* 추가 조정 스타일 */
        body { background: #fff; height: auto; overflow: auto; }
        .mobile-container { width: 100%; max-width: 500px; margin: 0 auto; height: auto; border-radius: 0; box-shadow: 0 0 20px rgba(0,0,0,0.05); }
    </style>
</head>
<body>
    <div class="mobile-container">
        ${content}
    </div>
    <script>
        // 스크롤 애니메이션
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.section-fade').forEach(s => observer.observe(s));

        // 아코디언
        function toggleAcc(header) {
            const content = header.nextElementSibling;
            const icon = header.querySelector('i');
            if (content.style.display === 'block') {
                content.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
            } else {
                content.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
            }
        }

        // 복사
        function copyText(text) {
            navigator.clipboard.writeText(text).then(() => alert('복사되었습니다.'));
        }

        // 방명록 (추출본은 로컬스토리지 활용 데모)
        function addGuest() {
            const name = document.getElementById('guest-name').value;
            const msg = document.getElementById('guest-msg').value;
            if (!name || !msg) return alert('입력해주세요.');
            const list = document.getElementById('preview-guest-list');
            const date = new Date().toISOString().split('T')[0];
            const item = document.createElement('div');
            item.className = 'guest-item';
            item.innerHTML = '<div class="guest-meta"><span>'+name+'</span> <span>'+date+'</span></div><div class="guest-body">'+msg+'</div>';
            list.prepend(item);
            document.getElementById('guest-name').value = '';
            document.getElementById('guest-msg').value = '';
        }
    </script>
</body>
</html>`;

    textarea.value = fullHTML;
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('export-modal').style.display = 'none';
}

function copyExportCode() {
    const textarea = document.getElementById('export-code');
    textarea.select();
    document.execCommand('copy');
    alert('코드가 복사되었습니다!');
}

// 8. Intersection Observer (스크롤 애니메이션)
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
    // 모든 input에 이벤트 바인딩
    document.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', updatePreview);
    });

    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) exportBtn.addEventListener('click', showModal);

    // 글로벌 함수 등록
    window.toggleFormGroup = toggleFormGroup;
    window.toggleAcc = toggleAcc;
    window.addGalleryInput = addGalleryInput;
    window.removeItem = removeItem;
    window.addGuest = addGuest;
    window.copyText = copyText;
    window.closeModal = closeModal;
    window.copyExportCode = copyExportCode;
    window.updatePreview = updatePreview;

    updatePreview();
    setupScrollAnimation();
});
