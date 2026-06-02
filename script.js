document.addEventListener('DOMContentLoaded', () => {
    /* --- Elements --- */
    const preloader = document.querySelector('.preloader');
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-links a');
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const searchInput = document.getElementById('image-search');
    const themeToggle = document.getElementById('theme-toggle');
    const backToTopBtn = document.getElementById('back-to-top');
    
    /* --- Lightbox Elements --- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentImgIndex = 0;
    let filteredImages = [...galleryItems];

    /* --- 1. Preloader --- */
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 500);
    });

    /* --- 2. Sticky Header & Active Links --- */
    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to Top Button
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        // Active Link on Scroll
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    /* --- 3. Mobile Menu Toggle --- */
    hamburger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        hamburger.querySelector('i').classList.toggle('fa-bars');
        hamburger.querySelector('i').classList.toggle('fa-times');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            hamburger.querySelector('i').classList.add('fa-bars');
            hamburger.querySelector('i').classList.remove('fa-times');
        });
    });

    /* --- 4. Filtering Logic --- */
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            
            filterGallery(filterValue, searchInput.value);
        });
    });

    /* --- 5. Search Functionality --- */
    searchInput.addEventListener('input', (e) => {
        const searchValue = e.target.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        
        filterGallery(activeFilter, searchValue);
    });

    function filterGallery(category, search) {
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            const itemTitle = item.querySelector('h3').textContent.toLowerCase();
            
            const matchesCategory = category === 'all' || itemCategory === category;
            const matchesSearch = itemTitle.includes(search.toLowerCase()) || itemCategory.includes(search.toLowerCase());

            if (matchesCategory && matchesSearch) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                item.style.display = 'none';
            }
        });

        // Update filteredImages for lightbox navigation
        filteredImages = [...galleryItems].filter(item => item.style.display !== 'none');
    }

    /* --- 6. Lightbox Functionality --- */
    galleryItems.forEach((item, index) => {
        const viewBtn = item.querySelector('.view-btn');
        const img = item.querySelector('img');
        
        // Open lightbox on card click or view button click
        [item, viewBtn].forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target === viewBtn || e.target.closest('.view-btn') || e.currentTarget === item) {
                    e.stopPropagation();
                    openLightbox(item);
                }
            });
        });
    });

    function openLightbox(item) {
        currentImgIndex = filteredImages.indexOf(item);
        const img = item.querySelector('img');
        const title = item.querySelector('h3').textContent;
        const category = item.querySelector('.category-tag').textContent;

        lightboxImg.src = img.src;
        lightboxTitle.textContent = title;
        lightboxCategory.textContent = category;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    function closeLightboxModal() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    closeLightbox.addEventListener('click', closeLightboxModal);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightboxModal();
    });

    function showPrevImg() {
        currentImgIndex--;
        if (currentImgIndex < 0) currentImgIndex = filteredImages.length - 1;
        updateLightboxContent();
    }

    function showNextImg() {
        currentImgIndex++;
        if (currentImgIndex >= filteredImages.length) currentImgIndex = 0;
        updateLightboxContent();
    }

    function updateLightboxContent() {
        const item = filteredImages[currentImgIndex];
        const img = item.querySelector('img');
        const title = item.querySelector('h3').textContent;
        const category = item.querySelector('.category-tag').textContent;

        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = img.src;
            lightboxTitle.textContent = title;
            lightboxCategory.textContent = category;
            lightboxImg.style.opacity = '1';
        }, 200);
    }

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImg();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImg();
    });

    /* --- 7. Keyboard Navigation --- */
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightboxModal();
        if (e.key === 'ArrowLeft') showPrevImg();
        if (e.key === 'ArrowRight') showNextImg();
    });

    /* --- 8. Dark/Light Mode Toggle --- */
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        let theme = 'dark';
        if (document.body.classList.contains('light-mode')) {
            theme = 'light';
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        } else {
            themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        }
        localStorage.setItem('theme', theme);
    });

    /* --- 9. Scroll Reveal Animation --- */
    const revealElements = document.querySelectorAll('.reveal, .gallery-item');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('reveal')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        if (el.classList.contains('reveal')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s ease-out';
        }
        revealObserver.observe(el);
    });

    /* --- 10. Back to Top --- */
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
