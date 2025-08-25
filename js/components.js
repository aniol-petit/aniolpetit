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
            
            console.log('All components loaded successfully');
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting component loading...');
    ComponentLoader.loadAllComponents();
});
