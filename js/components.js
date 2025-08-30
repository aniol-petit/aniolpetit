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
