let currentPapers = [];
let currentIndex = 0;
let searchQuery = '';
let viewedPapers = new Set(JSON.parse(localStorage.getItem('viewedPapers') || '[]'));
let likedPapers = JSON.parse(localStorage.getItem('likedPapers') || '[]');

let isDragging = false;
let startX = 0;
let currentX = 0;

let totalFetched = 0;
let hasMorePapers = true;

document.addEventListener('DOMContentLoaded', () => {
    updateLikedPapersList();
    
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    document.getElementById('like-btn').addEventListener('click', () => handleAction('like'));
    document.getElementById('dislike-btn').addEventListener('click', () => handleAction('dislike'));
    
    document.getElementById('reset-btn').addEventListener('click', resetData);
    
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('paper-modal').style.display = 'none';
    });
});

async function handleSearch() {
    const input = document.getElementById('search-input');
    searchQuery = input.value.trim();
    
    if (searchQuery) {
        currentIndex = 0;
        totalFetched = 0;
        hasMorePapers = true;
        currentPapers = [];
        await fetchPapers();
    }
}

async function fetchPapers() {
    try {
        if (!hasMorePapers) {
            document.getElementById('paper-cards').innerHTML = 
                '<div class="paper-card">No more papers found. Try a different search term.</div>';
            return;
        }

        const response = await fetch(`/api/papers/${encodeURIComponent(searchQuery)}?start=${totalFetched}`);
        const data = await response.json();
        
        if (data && data.papers) {
            hasMorePapers = data.has_more;
            const newPapers = data.papers.filter(paper => !viewedPapers.has(paper.id));
            
            if (newPapers.length > 0) {
                currentPapers = [...currentPapers, ...newPapers];
                totalFetched += data.papers.length;
                displayCurrentPaper();
            } else if (hasMorePapers) {
                totalFetched += data.papers.length;
                fetchPapers();
            } else {
                document.getElementById('paper-cards').innerHTML = 
                    '<div class="paper-card">No more papers found. Try a different search term.</div>';
            }
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error fetching papers:', error);
        document.getElementById('paper-cards').innerHTML = 
            '<div class="paper-card">Error fetching papers. Please try again.</div>';
    }
}

function displayCurrentPaper() {
    if (currentIndex >= currentPapers.length) {
        if (hasMorePapers) {
            fetchPapers();
        } else {
            document.getElementById('paper-cards').innerHTML = 
                '<div class="paper-card">No more papers found. Try a different search term.</div>';
        }
        return;
    }
    
    const paper = currentPapers[currentIndex];
    const cardHtml = `
        <div class="paper-card" draggable="false">
            <div class="swipe-indicator like"><i class="fas fa-heart"></i></div>
            <div class="swipe-indicator dislike"><i class="fas fa-times"></i></div>
            <span class="paper-category">${paper.primary_category}</span>
            <h2>${paper.title}</h2>
            <p><strong>Authors:</strong> ${paper.authors.join(', ')}</p>
            <p><strong>Published:</strong> ${paper.published}</p>
            <p>${paper.summary}</p>
        </div>
    `;
    
    const dummyCards = `
        <div class="paper-card" style="pointer-events: none;">
            <h2>Next paper...</h2>
        </div>
        <div class="paper-card" style="pointer-events: none;">
            <h2>Loading...</h2>
        </div>
    `;
    
    document.getElementById('paper-cards').innerHTML = cardHtml + dummyCards;
    
    const card = document.querySelector('.paper-card');
    addSwipeEvents(card);
}

function addSwipeEvents(element) {
    element.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
    
    element.addEventListener('touchstart', startDragging);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', stopDragging);
}

function startDragging(e) {
    isDragging = true;
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    currentX = startX;
    
    const card = document.querySelector('.paper-card');
    card.classList.add('dragging');
}

function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const deltaX = currentX - startX;
    const card = document.querySelector('.paper-card');
    
    const rotation = deltaX * 0.1;
    const scale = Math.min(Math.abs(deltaX) * 0.0005 + 1, 1.1);
    
    card.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg) scale(${scale})`;
    
    if (deltaX > 50) {
        card.classList.add('dragging-right');
        card.classList.remove('dragging-left');
    } else if (deltaX < -50) {
        card.classList.add('dragging-left');
        card.classList.remove('dragging-right');
    } else {
        card.classList.remove('dragging-left', 'dragging-right');
    }
}

function stopDragging() {
    if (!isDragging) return;
    
    isDragging = false;
    const deltaX = currentX - startX;
    const card = document.querySelector('.paper-card');
    card.classList.remove('dragging');
    
    if (Math.abs(deltaX) > 100) {
        if (deltaX > 0) {
            card.classList.add('swiped-right');
            handleAction('like');
        } else {
            card.classList.add('swiped-left');
            handleAction('dislike');
        }
    } else {
        card.style.transform = '';
        card.classList.remove('dragging-left', 'dragging-right');
    }
}

function handleAction(action) {
    if (currentPapers.length === 0) return;
    
    const paper = currentPapers[currentIndex];
    const card = document.querySelector('.paper-card');
    
    if (action === 'like') {
        card.classList.add('swiped-right');
    } else {
        card.classList.add('swiped-left');
    }
    
    viewedPapers.add(paper.id);
    localStorage.setItem('viewedPapers', JSON.stringify([...viewedPapers]));
    
    if (action === 'like') {
        likedPapers.push(paper);
        localStorage.setItem('likedPapers', JSON.stringify(likedPapers));
        updateLikedPapersList();
    }
    
    if (currentIndex >= currentPapers.length - 3 && hasMorePapers) {
        fetchPapers();
    }
    
    setTimeout(() => {
        currentIndex++;
        displayCurrentPaper();
    }, 400);
}

function updateLikedPapersList() {
    const likedPapersHtml = likedPapers.map(paper => `
        <div class="liked-paper" onclick="showPaperDetails('${paper.id}')">
            <h3>${paper.title}</h3>
            <p>${paper.authors[0]} et al.</p>
        </div>
    `).join('');
    
    document.getElementById('liked-papers').innerHTML = likedPapersHtml;
}

function showPaperDetails(paperId) {
    const paper = likedPapers.find(p => p.id === paperId);
    if (!paper) return;
    
    const modalContent = `
        <h2>${paper.title}</h2>
        <p><strong>Authors:</strong> ${paper.authors.join(', ')}</p>
        <p><strong>Published:</strong> ${paper.published}</p>
        <p><strong>Category:</strong> ${paper.primary_category}</p>
        <p>${paper.summary}</p>
        <a href="${paper.pdf_url}" target="_blank" class="pdf-link">View PDF</a>
    `;
    
    document.getElementById('modal-body').innerHTML = modalContent;
    document.getElementById('paper-modal').style.display = 'block';
}

function resetData() {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        localStorage.clear();
        viewedPapers = new Set();
        likedPapers = [];
        updateLikedPapersList();
        currentPapers = [];
        currentIndex = 0;
        document.getElementById('paper-cards').innerHTML = '<div class="paper-card">Search for papers to begin</div>';
    }
} 