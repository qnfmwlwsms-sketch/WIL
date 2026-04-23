// 실시간 미리보기 기능
const inputs = [
    { id: 'input-groom-name', previewIds: ['preview-groom-name', 'groom-name-small-0', 'groom-name-small-1', 'groom-name-small-2'] },
    { id: 'input-bride-name', previewIds: ['preview-bride-name', 'bride-name-small-0', 'bride-name-small-1', 'bride-name-small-2'] },
    { id: 'input-main-photo', previewId: 'preview-main-photo', attr: 'src' },
    { id: 'input-date-text', previewId: 'preview-date-text' },
    { id: 'input-venue-name', previewIds: ['preview-venue-name', 'preview-venue-name-2'] },
    { id: 'input-venue-address', previewId: 'preview-venue-address' },
    { id: 'input-greeting', previewId: 'preview-greeting', nl2br: true },
    { id: 'input-groom-parents', previewId: 'preview-groom-parents' },
    { id: 'input-groom-relation', previewId: 'preview-groom-relation' },
    { id: 'input-bride-parents', previewId: 'preview-bride-parents' },
    { id: 'input-bride-relation', previewId: 'preview-bride-relation' }
];

function updatePreview() {
    inputs.forEach(item => {
        const inputEl = document.getElementById(item.id);
        if (!inputEl) return;

        const val = inputEl.value;

        if (item.previewIds) {
            // 여러 곳을 업데이트해야 하는 경우 (예: 이름)
            item.previewIds.forEach(pId => {
                const pEl = document.getElementById(pId) || document.querySelector(`.${pId.replace('-0','').replace('-1','').replace('-2','')}`);
                if (pEl) {
                    // class 기반 선택 (동적으로 생성된 요소들)
                    const classEls = document.querySelectorAll(`.${pId.replace('-0','').replace('-1','').replace('-2','')}`);
                    classEls.forEach(el => el.innerText = val);
                }
            });
        } else if (item.previewId) {
            const pEl = document.getElementById(item.id.replace('input-', 'preview-'));
            const targetEl = document.getElementById(item.previewId);
            if (!targetEl) return;

            if (item.attr === 'src') {
                targetEl.src = val;
            } else if (item.nl2br) {
                targetEl.innerHTML = val.replace(/\n/g, '<br>');
            } else {
                targetEl.innerText = val;
            }
        }
    });

    calculateDday();
}

// D-Day 계산기 (에디터용)
function calculateDday() {
    const dateVal = document.getElementById('input-datetime').value;
    if (!dateVal) return;

    const targetDate = new Date(dateVal);
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

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    // 모든 입력창에 input 이벤트 리스너 추가
    inputs.forEach(item => {
        const inputEl = document.getElementById(item.id);
        if (inputEl) {
            inputEl.addEventListener('input', updatePreview);
        }
    });

    document.getElementById('input-datetime').addEventListener('input', updatePreview);
    
    // 초기 실행
    updatePreview();

    // Export 버튼
    document.getElementById('export-btn').addEventListener('click', exportInvitation);
});

// 완성된 HTML 코드 생성 및 모달 표시
function exportInvitation() {
    const previewContent = document.getElementById('preview-content').innerHTML;
    
    // 외부에 필요한 스타일과 스크립트를 포함한 전체 HTML 템플릿
    const fullHTML = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document.getElementById('input-groom-name').value} & ${document.getElementById('input-bride-name').value} 결혼식에 초대합니다</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&family=Noto+Sans+KR:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        /* 기본 스타일 (style.css의 핵심 내용 추출) */
        :root { --bg-color: #FDF5E6; --text-color: #333; --primary-color: #DAA520; --secondary-color: #8B7355; }
        body { font-family: 'Noto Sans KR', 'Nanum Myeongjo', serif; background-color: var(--bg-color); color: var(--text-color); margin: 0; line-height: 1.6; text-align: center; }
        .mobile-container { max-width: 500px; margin: 0 auto; background-color: var(--bg-color); }
        h1, h2, .hero-names, .section-title { font-family: 'Nanum Myeongjo', serif; font-weight: 700; }
        section { padding: 60px 20px; border-bottom: 1px solid #e0d8c8; }
        .section-title { font-size: 1.4em; color: var(--primary-color); margin-bottom: 30px; letter-spacing: 0.1em; }
        .hero-image img { width: 100%; height: auto; }
        .hero-names { font-size: 2.2em; margin: 15px 0; }
        .heart { color: #e25555; }
        .highlight { color: var(--primary-color); font-weight: bold; }
        footer { padding: 40px 20px; font-size: 0.9em; color: var(--secondary-color); }
    </style>
</head>
<body>
    <div class="mobile-container">
        ${previewContent}
    </div>
</body>
</html>`;

    document.getElementById('export-code').value = fullHTML;
    document.getElementById('export-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('export-modal').style.display = 'none';
}

function copyExportCode() {
    const textArea = document.getElementById('export-code');
    textArea.select();
    document.execCommand('copy');
    alert('코드가 클립보드에 복사되었습니다!');
}
