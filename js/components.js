// Component loader utility
class ComponentLoader {
    static async loadComponent(elementId, componentPath) {
        try {
            console.log(`Loading component: ${elementId} from ${componentPath}`);
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            console.log(`Loaded HTML for ${elementId}:`, html.substring(0, 100) + '...');
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
                console.log(`Successfully loaded component: ${elementId}`);
            } else {
                console.error(`Element with id '${elementId}' not found`);
            }
        } catch (error) {
            console.error(`Error loading component from ${componentPath}:`, error);
            // Fallback: show error message in the container
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = `<div style="color: red; padding: 1rem;">Error loading component: ${componentPath}</div>`;
            }
        }
    }

    static async loadAllComponents() {
        try {
            console.log('Loading components...');
            
            // Header is already loaded in HTML, skip loading it
            console.log('Header already loaded in HTML');
            
            // Load profile section
            await this.loadComponent('profile-container', 'components/profile.html');
            console.log('Profile loaded');
            
            // Load projects section
            await this.loadComponent('projects-container', 'components/projects.html');
            console.log('Projects loaded');
            
            // Load blog section
            await this.loadComponent('blog-container', 'components/blog.html');
            console.log('Blog loaded');
            
            // Initialize blog scroll arrows after blog is loaded
            BlogScroll.init();
            
            // Load footer
            await this.loadComponent('footer-container', 'components/footer.html');
            console.log('Footer loaded');
            
            // Debug: Check if footer content is actually loaded
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                console.log('Footer container found, content:', footerContainer.innerHTML.substring(0, 200));
            } else {
                console.error('Footer container not found!');
            }
            
            console.log('All components loaded successfully');
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }
}

// Blog scroll navigation
class BlogScroll {
    static init() {
        const scrollContainer = document.getElementById('blog-posts-scroll');
        const viewport = document.querySelector('.blog-posts-viewport');
        const leftArrow = document.getElementById('blog-scroll-left');
        const rightArrow = document.getElementById('blog-scroll-right');
        
        if (!scrollContainer || !viewport || !leftArrow || !rightArrow) {
            console.log('Blog scroll elements not found, skipping initialization');
            return;
        }
        
        const cards = Array.from(scrollContainer.querySelectorAll('.blog-post-card'));
        if (!cards.length) {
            return;
        }

        const state = {
            currentIndex: 0
        };

        const clampIndex = (index) => {
            return Math.max(0, Math.min(index, cards.length - 1));
        };

        const updateArrows = () => {
            leftArrow.disabled = state.currentIndex === 0;
            rightArrow.disabled = state.currentIndex === cards.length - 1;
        };

        const updateCardStates = () => {
            cards.forEach((card, index) => {
                const delta = index - state.currentIndex;
                card.classList.toggle('is-active', delta === 0);
                card.classList.toggle('is-secondary', Math.abs(delta) === 1);
                card.classList.toggle('is-hidden', Math.abs(delta) > 1);
            });
        };

        const updateTrackPosition = () => {
            const firstCard = cards[0];
            const styles = window.getComputedStyle(scrollContainer);
            const gapValue = parseFloat(styles.columnGap || styles.gap || 32);
            const cardWidth = firstCard.offsetWidth;
            const viewportWidth = viewport.offsetWidth;
            const offset = (viewportWidth - cardWidth) / 2;
            const translateX = -(state.currentIndex * (cardWidth + gapValue) - offset);
            scrollContainer.style.transform = `translateX(${translateX}px)`;
        };

        const goToIndex = (index) => {
            state.currentIndex = clampIndex(index);
            updateCardStates();
            updateTrackPosition();
            updateArrows();
        };

        leftArrow.addEventListener('click', () => {
            goToIndex(state.currentIndex - 1);
        });

        rightArrow.addEventListener('click', () => {
            goToIndex(state.currentIndex + 1);
        });

        window.addEventListener('resize', () => {
            updateTrackPosition();
        });

        const initialIndex = cards.length >= 3 ? 1 : 0;
        goToIndex(initialIndex);
    }
}

// Theme management
class ThemeManager {
    static init() {
        // Check for saved theme preference or default to 'light'
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        // Add event listener to theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
            });
        }
    }
    
    static setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update button state
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const sunIcon = themeToggle.querySelector('.sun-icon');
            const moonIcon = themeToggle.querySelector('.moon-icon');
            
            if (theme === 'dark') {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        }
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting component loading...');
    ComponentLoader.loadAllComponents();
    
    // Initialize theme manager
    ThemeManager.init();
});
